from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_, and_
from typing import List
from app.core.database import get_db
from app.models.database import Message, User
from app.models.schemas import MessageCreate, MessageResponse, ChatResponse, APIResponse
from app.api.auth import get_current_user_dependency

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/chats", response_model=List[ChatResponse])
async def get_chats(
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get user's chat list with last message and unread count"""
    
    # Get all users that have exchanged messages with current user
    chat_users_query = db.query(User).join(
        Message, 
        or_(
            and_(Message.sender_id == User.id, Message.receiver_id == current_user.id),
            and_(Message.receiver_id == User.id, Message.sender_id == current_user.id)
        )
    ).filter(User.id != current_user.id).distinct()
    
    chat_users = chat_users_query.all()
    
    chats = []
    for user in chat_users:
        # Get last message between current user and this user
        last_message = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.receiver_id == user.id),
                and_(Message.sender_id == user.id, Message.receiver_id == current_user.id)
            )
        ).order_by(desc(Message.created_at)).first()
        
        # Count unread messages from this user to current user
        unread_count = db.query(Message).filter(
            Message.sender_id == user.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).count()
        
        last_message_response = None
        if last_message:
            last_message_response = MessageResponse(
                id=last_message.id,
                content=last_message.content,
                sender_id=last_message.sender_id,
                receiver_id=last_message.receiver_id,
                sender=last_message.sender,
                receiver=last_message.receiver,
                is_read=last_message.is_read,
                created_at=last_message.created_at
            )
        
        chats.append(ChatResponse(
            user=user,
            last_message=last_message_response,
            unread_count=unread_count
        ))
    
    # Sort by last message time
    chats.sort(key=lambda x: x.last_message.created_at if x.last_message else x.user.created_at, reverse=True)
    
    return chats

@router.get("/{other_user_id}", response_model=List[MessageResponse])
async def get_messages_with_user(
    other_user_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get messages between current user and another user"""
    
    # Check if other user exists
    other_user = db.query(User).filter(User.id == other_user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get messages between the two users
    messages = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at).all()
    
    return [MessageResponse(
        id=message.id,
        content=message.content,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        sender=message.sender,
        receiver=message.receiver,
        is_read=message.is_read,
        created_at=message.created_at
    ) for message in messages]

@router.post("/{receiver_id}", response_model=MessageResponse)
async def send_message(
    receiver_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Send a message to another user"""
    
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    # Create new message
    db_message = Message(
        content=message_data.content,
        sender_id=current_user.id,
        receiver_id=receiver_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Get message with sender and receiver information
    message_with_users = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(Message.id == db_message.id).first()
    
    return MessageResponse(
        id=message_with_users.id,
        content=message_with_users.content,
        sender_id=message_with_users.sender_id,
        receiver_id=message_with_users.receiver_id,
        sender=message_with_users.sender,
        receiver=message_with_users.receiver,
        is_read=message_with_users.is_read,
        created_at=message_with_users.created_at
    )

@router.post("/{other_user_id}/mark-read", response_model=APIResponse)
async def mark_messages_as_read(
    other_user_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Mark all messages from another user as read"""
    
    # Check if other user exists
    other_user = db.query(User).filter(User.id == other_user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Mark all unread messages from other user as read
    unread_messages = db.query(Message).filter(
        Message.sender_id == other_user_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).all()
    
    for message in unread_messages:
        message.is_read = True
    
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Marked {len(unread_messages)} messages as read"
    )
