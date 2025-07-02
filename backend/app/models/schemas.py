from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    is_online: Optional[bool] = False
    last_seen: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    friends_count: int = 0
    posts_count: int = 0

# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Post schemas
class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None

# Reaction schemas (defined before PostResponse to avoid forward reference issues)
class ReactionCreate(BaseModel):
    reaction_type: str  # like, love, haha, wow, angry

class ReactionResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    reaction_type: str
    user: UserResponse
    created_at: datetime
    
    class Config:
        from_attributes = True

# Comment schemas (defined before PostResponse to avoid forward reference issues)
class CommentBase(BaseModel):
    content: str
    parent_comment_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass  # post_id will come from URL parameter

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentResponse(CommentBase):
    id: int
    post_id: int
    author_id: int
    author: UserResponse
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    is_liked: bool = False
    replies_count: int = 0
    
    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: int
    author_id: int
    author: UserResponse
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    comments_count: int = 0
    shares_count: int = 0
    is_liked: bool = False
    current_user_reaction: Optional[str] = None
    reactions: List[ReactionResponse] = []
    comments: List[CommentResponse] = []
    
    class Config:
        from_attributes = True

# Message schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass  # receiver_id will come from URL parameter

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    receiver_id: int
    sender: UserResponse
    receiver: UserResponse
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat schemas
class ChatResponse(BaseModel):
    user: UserResponse
    last_message: Optional[MessageResponse] = None
    unread_count: int = 0

# WebSocket schemas
class WebSocketMessage(BaseModel):
    type: str  # "message", "typing", "online_status"
    content: Optional[str] = None
    sender_id: Optional[int] = None
    receiver_id: Optional[int] = None
    timestamp: Optional[datetime] = None

# Upload schemas
class UploadResponse(BaseModel):
    filename: str
    url: str
    size: int

# Response schemas
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    per_page: int
    pages: int
