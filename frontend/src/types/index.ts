export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked?: boolean;
  reaction?: string; // Current user's reaction type
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  author: User;
  image: string;
  isViewed?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  isActive?: boolean;
}
