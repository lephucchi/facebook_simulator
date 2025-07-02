// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws';

// API client setup
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('access_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          // Don't redirect here - let the auth context handle it
          throw new Error('Unauthorized');
        }
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const response = await this.request<{access_token: string, token_type: string}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.setToken(response.access_token);
    return response;
  }

  async register(userData: {
    email: string;
    username: string;
    full_name: string;
    password: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async getAllUsers() {
    return this.request('/auth/users');
  }

  // Posts methods
  async getPosts(page = 1, per_page = 10) {
    return this.request(`/posts?page=${page}&per_page=${per_page}`);
  }

  async getSamplePosts() {
    // Get sample posts with authentication if available
    return this.request('/posts/sample');
  }

  async createPost(postData: { content: string; image_url?: string }) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: number) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async reactToPost(postId: number, reactionType: string) {
    return this.request(`/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ reaction_type: reactionType }),
    });
  }

  async deletePost(postId: number) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async createComment(postId: string, content: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Stories methods
  async getStories() {
    return this.request('/stories');
  }

  async markStoryViewed(storyId: number) {
    return this.request(`/stories/${storyId}/view`, {
      method: 'POST',
    });
  }

  // Messages methods
  async getChats() {
    return this.request('/messages/chats');
  }

  async getMessagesWithUser(userId: number) {
    return this.request(`/messages/${userId}`);
  }

  async sendMessage(receiverId: number, content: string) {
    return this.request(`/messages/${receiverId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markMessagesAsRead(userId: number) {
    return this.request(`/messages/${userId}/mark-read`, {
      method: 'POST',
    });
  }
}

// WebSocket client
class WebSocketClient {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  connect() {
    if (!this.token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    const wsUrl = `${WEBSOCKET_URL}?token=${this.token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handler = this.messageHandlers.get(data.type);
        if (handler) {
          handler(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 3000 * this.reconnectAttempts);
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  sendMessage(receiverId: number, content: string) {
    this.send({
      type: 'message',
      receiver_id: receiverId,
      content,
    });
  }

  sendTyping(receiverId: number, isTyping: boolean) {
    this.send({
      type: 'typing',
      receiver_id: receiverId,
      is_typing: isTyping,
    });
  }

  markMessagesAsRead(otherUserId: number) {
    this.send({
      type: 'mark_read',
      other_user_id: otherUserId,
    });
  }
}

// Create singleton instances
export const apiClient = new ApiClient(API_BASE_URL);
export const wsClient = new WebSocketClient();

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
