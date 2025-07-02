from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import verify_token
from app.models.database import User, Message
from app.services.websocket import websocket_manager
import json

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    """WebSocket endpoint for real-time chat"""
    
    # Verify token and get user
    token_data = verify_token(token)
    if not token_data:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    db = next(get_db())
    try:
        user = db.query(User).filter(User.username == token_data.username).first()
        if not user:
            await websocket.close(code=4002, reason="User not found")
            return
        
        # Connect user to WebSocket
        await websocket_manager.connect(websocket, user.id)
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                message_type = message_data.get("type")
                
                if message_type == "message":
                    # Handle chat message
                    content = message_data.get("content")
                    receiver_id = message_data.get("receiver_id")
                    
                    if content and receiver_id:
                        await websocket_manager.send_chat_message(
                            sender_id=user.id,
                            receiver_id=receiver_id,
                            content=content
                        )
                
                elif message_type == "typing":
                    # Handle typing indicator
                    receiver_id = message_data.get("receiver_id")
                    is_typing = message_data.get("is_typing", False)
                    
                    if receiver_id:
                        await websocket_manager.broadcast_typing_indicator(
                            sender_id=user.id,
                            receiver_id=receiver_id,
                            is_typing=is_typing
                        )
                
                elif message_type == "mark_read":
                    # Mark messages as read
                    other_user_id = message_data.get("other_user_id")
                    
                    if other_user_id:
                        await websocket_manager.mark_messages_as_read(
                            user_id=user.id,
                            other_user_id=other_user_id
                        )
                
        except WebSocketDisconnect:
            await websocket_manager.disconnect(websocket)
        except Exception as e:
            print(f"WebSocket error: {e}")
            await websocket_manager.disconnect(websocket)
            
    finally:
        db.close()

@router.get("/ws/online-users")
async def get_online_users():
    """Get list of currently online users"""
    online_user_ids = await websocket_manager.get_online_users()
    return {"online_users": online_user_ids}
