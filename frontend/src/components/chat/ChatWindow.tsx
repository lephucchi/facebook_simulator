import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Send, Phone, Video, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { wsClient, apiClient } from '../../utils/api';
import type { User } from '../../types';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: Date;
  is_read: boolean;
}

interface ChatWindowProps {
  recipient: User;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  recipient, 
  onClose, 
  onMinimize, 
  isMinimized 
}) => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    if (currentUser) {
      wsClient.connect();
      setIsConnected(true);

      // Listen for incoming messages
      wsClient.onMessage('message', (data) => {
        if (data.sender_id === recipient.id || data.receiver_id === recipient.id) {
          const message: Message = {
            id: data.id || Date.now().toString(),
            content: data.content,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            timestamp: new Date(data.timestamp || Date.now()),
            is_read: false
          };
          setMessages(prev => [...prev, message]);
        }
      });

      // Listen for typing indicators
      wsClient.onMessage('typing', (data) => {
        if (data.sender_id === recipient.id) {
          setIsTyping(data.is_typing);
          if (data.is_typing) {
            setTimeout(() => setIsTyping(false), 3000);
          }
        }
      });

      // Load message history
      loadMessageHistory();
    }

    return () => {
      if (isConnected) {
        wsClient.disconnect();
      }
    };
  }, [currentUser, recipient.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessageHistory = async () => {
    try {
      if (!currentUser) return;
      
      // Try to load from backend first
      try {
        const messagesData = await apiClient.getMessagesWithUser(parseInt(recipient.id));
        
        const transformedMessages: Message[] = (messagesData as any[]).map((msg: any) => ({
          id: msg.id.toString(),
          content: msg.content,
          sender_id: msg.sender_id.toString(),
          receiver_id: msg.receiver_id.toString(),
          timestamp: new Date(msg.created_at),
          is_read: msg.is_read
        }));
        
        setMessages(transformedMessages);
        
        // Mark messages as read
        await apiClient.markMessagesAsRead(parseInt(recipient.id));
        return;
      } catch (error) {
        console.warn('Failed to load messages from backend, using mock data:', error);
      }
      
      // Fallback to mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hey there! How are you doing?',
          sender_id: recipient.id,
          receiver_id: currentUser?.id || '',
          timestamp: new Date(Date.now() - 60000),
          is_read: true
        },
        {
          id: '2',
          content: 'I\'m doing great! Just working on some projects.',
          sender_id: currentUser?.id || '',
          receiver_id: recipient.id,
          timestamp: new Date(Date.now() - 30000),
          is_read: true
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load message history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: currentUser.id,
      receiver_id: recipient.id,
      timestamp: new Date(),
      is_read: false
    };

    // Update UI immediately
    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage('');

    try {
      // Send to backend first
      await apiClient.sendMessage(parseInt(recipient.id), messageToSend);
      
      // Also send via WebSocket for real-time updates
      wsClient.sendMessage(parseInt(recipient.id), messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could show error message to user or retry logic here
    }
  };

  const handleTyping = (typing: boolean) => {
    wsClient.sendTyping(parseInt(recipient.id), typing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-20 w-80 bg-white rounded-t-lg shadow-lg border border-gray-200 z-50">
        <div 
          className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg cursor-pointer"
          onClick={onMinimize}
        >
          <div className="flex items-center space-x-2">
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{recipient.name}</span>
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-20 w-80 h-96 bg-white rounded-t-lg shadow-lg border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <img
            src={recipient.avatar}
            alt={recipient.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <span className="font-medium block">{recipient.name}</span>
            <span className="text-xs opacity-75">
              {recipient.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="hover:bg-blue-700 p-1 rounded">
            <Phone className="w-4 h-4" />
          </button>
          <button className="hover:bg-blue-700 p-1 rounded">
            <Video className="w-4 h-4" />
          </button>
          <button className="hover:bg-blue-700 p-1 rounded">
            <Info className="w-4 h-4" />
          </button>
          <button onClick={onMinimize} className="hover:bg-blue-700 p-1 rounded">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender_id === currentUser?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
