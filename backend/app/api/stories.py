"""
Stories API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.database import Story, StoryImage, User
from app.core.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.get("/stories", response_model=List[dict])
async def get_stories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all active stories with their images."""
    try:
        # Get all stories that haven't expired yet
        stories = db.query(Story).filter(Story.expires_at > datetime.now()).all()
        
        result = []
        for story in stories:
            # Get all images for this story, ordered by order_index
            images = db.query(StoryImage).filter(
                StoryImage.story_id == story.id
            ).order_by(StoryImage.order_index).all()
            
            story_data = {
                "id": story.id,
                "author": {
                    "id": story.author.id,
                    "name": story.author.full_name,
                    "username": story.author.username,
                    "avatar": story.author.avatar_url
                },
                "title": story.title,
                "images": [
                    {
                        "id": img.id,
                        "url": img.image_url,
                        "caption": img.caption,
                        "order": img.order_index
                    } for img in images
                ],
                "created_at": story.created_at.isoformat(),
                "expires_at": story.expires_at.isoformat(),
                "is_viewed": False  # TODO: Implement story viewing tracking
            }
            result.append(story_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stories: {str(e)}"
        )

@router.post("/stories/{story_id}/view")
async def mark_story_viewed(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a story as viewed by the current user."""
    try:
        # Get the story
        story = db.query(Story).filter(Story.id == story_id).first()
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Story not found"
            )
        
        # TODO: Implement story view tracking in a separate table
        # For now, just return success
        return {"message": "Story marked as viewed"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark story as viewed: {str(e)}"
        )
