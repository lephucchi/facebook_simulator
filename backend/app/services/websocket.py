from typing import Dict, List, Optional
from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.models.database import User, Message
from app.models.schemas import WebSocketMessage, MessageResponse
from app.core.database import get_db
import json
from datetime import datetime

class WebSocketManager:
    def __init__(self):
        # Store active connections: {user_id: websocket}
        self.active_connections: Dict[int, WebSocket] = {}
        # Store user sessions: {websocket: user_id}
        self.user_sessions: Dict[WebSocket, int] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept websocket connection and register user"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_sessions[websocket] = user_id
        
        # Update user online status
        db = next(get_db())
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_online = True
                user.last_seen = datetime.utcnow()
                db.commit()
                
            # Notify other users about online status
            await self.broadcast_user_status(user_id, True)
        finally:
            db.close()

    async def disconnect(self, websocket: WebSocket):
        """Remove websocket connection and update user status"""
        user_id = self.user_sessions.get(websocket)
        if user_id:
            # Remove from active connections
            if user_id in self.active_connections:
                del self.active_connections[user_id]
            del self.user_sessions[websocket]
            
            # Update user offline status
            db = next(get_db())
            try:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    user.is_online = False
                    user.last_seen = datetime.utcnow()
                    db.commit()
                    
                # Notify other users about offline status
                await self.broadcast_user_status(user_id, False)
            finally:
                db.close()

    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_text(json.dumps(message))
                return True
            except:
                # Connection might be broken, remove it
                await self.disconnect(websocket)
        return False

    async def send_chat_message(self, sender_id: int, receiver_id: int, content: str):
        """Send chat message between users and save to database"""
        db = next(get_db())
        try:
            # Save message to database
            db_message = Message(
                content=content,
                sender_id=sender_id,
                receiver_id=receiver_id
            )
            db.add(db_message)
            db.commit()
            db.refresh(db_message)
            
            # Get sender and receiver info
            sender = db.query(User).filter(User.id == sender_id).first()
            receiver = db.query(User).filter(User.id == receiver_id).first()
            
            if not sender or not receiver:
                return False
            
            # Create message response
            message_data = {
                "type": "message",
                "id": db_message.id,
                "content": content,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "sender": {
                    "id": sender.id,
                    "username": sender.username,
                    "full_name": sender.full_name,
                    "avatar_url": sender.avatar_url
                },
                "timestamp": db_message.created_at.isoformat(),
                "is_read": False
            }
            
            # Send to both sender and receiver
            await self.send_personal_message(message_data, sender_id)
            await self.send_personal_message(message_data, receiver_id)
            
            return True
            
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
        finally:
            db.close()

    async def broadcast_user_status(self, user_id: int, is_online: bool):
        """Broadcast user online/offline status to their friends"""
        db = next(get_db())
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return
                
            # Get user's friends
            friends = user.friends
            
            status_message = {
                "type": "user_status",
                "user_id": user_id,
                "username": user.username,
                "is_online": is_online,
                "last_seen": user.last_seen.isoformat() if user.last_seen else None
            }
            
            # Send status update to all online friends
            for friend in friends:
                if friend.id in self.active_connections:
                    await self.send_personal_message(status_message, friend.id)
                    
        finally:
            db.close()

    async def broadcast_typing_indicator(self, sender_id: int, receiver_id: int, is_typing: bool):
        """Send typing indicator between users"""
        typing_message = {
            "type": "typing",
            "sender_id": sender_id,
            "is_typing": is_typing
        }
        
        await self.send_personal_message(typing_message, receiver_id)

    async def get_online_users(self) -> List[int]:
        """Get list of currently online user IDs"""
        return list(self.active_connections.keys())

    async def mark_messages_as_read(self, user_id: int, other_user_id: int):
        """Mark messages as read between two users"""
        db = next(get_db())
        try:
            # Mark messages from other_user to user as read
            db.query(Message).filter(
                Message.sender_id == other_user_id,
                Message.receiver_id == user_id,
                Message.is_read == False
            ).update({"is_read": True})
            db.commit()
            
            # Notify sender about read status
            read_notification = {
                "type": "message_read",
                "reader_id": user_id,
                "sender_id": other_user_id
            }
            await self.send_personal_message(read_notification, other_user_id)
            
        finally:
            db.close()

# Global WebSocket manager instance
websocket_manager = WebSocketManager()
