from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func
from typing import List, Optional
from app.core.database import get_db
from app.models.database import Post, User, Comment, PostReaction
from app.models.schemas import (
    PostCreate, PostUpdate, PostResponse, APIResponse, PaginatedResponse,
    CommentCreate, CommentResponse, ReactionCreate, ReactionResponse
)
from app.api.auth import get_current_user_dependency, get_current_user_optional

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/sample", response_model=List[PostResponse])
async def get_sample_posts(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get sample posts with optional authentication"""
    
    # Get all posts with author information, ordered by creation date
    posts_query = db.query(Post).options(
        joinedload(Post.author),
        joinedload(Post.liked_by),
        joinedload(Post.comments).joinedload(Comment.author),
        joinedload(Post.reactions).joinedload(PostReaction.user)
    ).order_by(desc(Post.created_at))
    
    posts = posts_query.limit(10).all()
    
    # Format posts with additional information
    formatted_posts = []
    for post in posts:
        # Count likes and comments
        likes_count = len(post.liked_by)
        comments_count = len(post.comments)
        
        # Find current user's reaction if authenticated
        current_user_reaction = None
        if current_user:
            for reaction in post.reactions:
                if reaction.user_id == current_user.id:
                    current_user_reaction = reaction.reaction_type
                    break
        
        post_response = PostResponse(
            id=post.id,
            content=post.content,
            image_url=post.image_url,
            author_id=post.author_id,
            author=post.author,
            created_at=post.created_at,
            updated_at=post.updated_at,
            likes_count=likes_count,
            comments_count=comments_count,
            shares_count=0,
            is_liked=False,  # Legacy field
            current_user_reaction=current_user_reaction,
            reactions=[
                ReactionResponse(
                    id=reaction.id,
                    user_id=reaction.user_id,
                    post_id=reaction.post_id,
                    reaction_type=reaction.reaction_type,
                    user=reaction.user,
                    created_at=reaction.created_at
                ) for reaction in post.reactions
            ],
            comments=[
                CommentResponse(
                    id=comment.id,
                    content=comment.content,
                    post_id=comment.post_id,
                    author_id=comment.author_id,
                    author=comment.author,
                    created_at=comment.created_at,
                    updated_at=comment.updated_at or comment.created_at,
                    likes_count=0,
                    is_liked=False
                ) for comment in post.comments
            ]
        )
        
        formatted_posts.append(post_response)
    
    return formatted_posts

@router.get("/", response_model=List[PostResponse])
async def get_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get paginated posts for newsfeed"""
    
    offset = (page - 1) * per_page
    
    # Get posts with author information, ordered by creation date
    posts_query = db.query(Post).options(
        joinedload(Post.author),
        joinedload(Post.liked_by),
        joinedload(Post.comments).joinedload(Comment.author),
        joinedload(Post.reactions).joinedload(PostReaction.user)
    ).order_by(desc(Post.created_at))
    
    posts = posts_query.offset(offset).limit(per_page).all()
    
    # Format posts with additional information
    formatted_posts = []
    for post in posts:
        # Count likes and comments
        likes_count = len(post.liked_by)
        comments_count = len(post.comments)
        is_liked = current_user in post.liked_by
        
        # Get current user's reaction
        current_user_reaction = None
        for reaction in post.reactions:
            if reaction.user_id == current_user.id:
                current_user_reaction = reaction.reaction_type
                break
        
        post_response = PostResponse(
            id=post.id,
            content=post.content,
            image_url=post.image_url,
            author_id=post.author_id,
            author=post.author,
            created_at=post.created_at,
            updated_at=post.updated_at,
            likes_count=likes_count,
            comments_count=comments_count,
            shares_count=0,
            is_liked=is_liked,
            current_user_reaction=current_user_reaction,
            reactions=[
                ReactionResponse(
                    id=reaction.id,
                    user_id=reaction.user_id,
                    post_id=reaction.post_id,
                    reaction_type=reaction.reaction_type,
                    user=reaction.user,
                    created_at=reaction.created_at
                ) for reaction in post.reactions
            ],
            comments=[
                CommentResponse(
                    id=comment.id,
                    content=comment.content,
                    post_id=comment.post_id,
                    author_id=comment.author_id,
                    author=comment.author,
                    created_at=comment.created_at,
                    updated_at=comment.updated_at or comment.created_at,
                    likes_count=0,
                    is_liked=False
                ) for comment in post.comments
            ]
        )
        formatted_posts.append(post_response)
    
    return formatted_posts

@router.post("/", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Create a new post"""
    
    db_post = Post(
        content=post_data.content,
        image_url=post_data.image_url,
        author_id=current_user.id
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Load the post with author information
    post_with_author = db.query(Post).options(
        joinedload(Post.author),
        joinedload(Post.liked_by),
        joinedload(Post.comments)
    ).filter(Post.id == db_post.id).first()
    
    return PostResponse(
        id=post_with_author.id,
        content=post_with_author.content,
        image_url=post_with_author.image_url,
        author_id=post_with_author.author_id,
        author=post_with_author.author,
        created_at=post_with_author.created_at,
        updated_at=post_with_author.updated_at,
        likes_count=0,
        comments_count=0,
        is_liked=False
    )

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get a specific post by ID"""
    
    post = db.query(Post).options(
        joinedload(Post.author),
        joinedload(Post.liked_by),
        joinedload(Post.comments).joinedload(Comment.author)
    ).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    likes_count = len(post.liked_by)
    comments_count = len(post.comments)
    is_liked = current_user in post.liked_by
    
    return PostResponse(
        id=post.id,
        content=post.content,
        image_url=post.image_url,
        author_id=post.author_id,
        author=post.author,
        created_at=post.created_at,
        updated_at=post.updated_at,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=is_liked
    )

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Update a post (only by the author)"""
    
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    # Update post fields
    if post_data.content is not None:
        post.content = post_data.content
    if post_data.image_url is not None:
        post.image_url = post_data.image_url
    
    db.commit()
    db.refresh(post)
    
    # Load updated post with author information
    updated_post = db.query(Post).options(
        joinedload(Post.author),
        joinedload(Post.liked_by),
        joinedload(Post.comments)
    ).filter(Post.id == post_id).first()
    
    likes_count = len(updated_post.liked_by)
    comments_count = len(updated_post.comments)
    is_liked = current_user in updated_post.liked_by
    
    return PostResponse(
        id=updated_post.id,
        content=updated_post.content,
        image_url=updated_post.image_url,
        author_id=updated_post.author_id,
        author=updated_post.author,
        created_at=updated_post.created_at,
        updated_at=updated_post.updated_at,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=is_liked
    )

@router.delete("/{post_id}", response_model=APIResponse)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Delete a post (only by the author)"""
    
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    db.delete(post)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Post deleted successfully"
    )

@router.post("/{post_id}/like", response_model=APIResponse)
async def toggle_post_like(
    post_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Toggle like/unlike on a post"""
    
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user already liked the post
    if current_user in post.liked_by:
        # Unlike the post
        post.liked_by.remove(current_user)
        message = "Post unliked successfully"
        is_liked = False
    else:
        # Like the post
        post.liked_by.append(current_user)
        message = "Post liked successfully"
        is_liked = True
    
    db.commit()
    
    return APIResponse(
        success=True,
        message=message,
        data={"is_liked": is_liked, "likes_count": len(post.liked_by)}
    )

@router.post("/{post_id}/reactions", response_model=APIResponse)
async def react_to_post(
    post_id: int,
    reaction_data: ReactionCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Add/update/remove a reaction to a post"""
    
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user already has a reaction on this post
    existing_reaction = db.query(PostReaction).filter(
        PostReaction.user_id == current_user.id,
        PostReaction.post_id == post_id
    ).first()
    
    # If reaction_type is empty, remove any existing reaction
    if not reaction_data.reaction_type or reaction_data.reaction_type.strip() == '':
        if existing_reaction:
            db.delete(existing_reaction)
            db.commit()
            return APIResponse(
                success=True,
                message="Reaction removed successfully",
                data={"reaction": None}
            )
        else:
            return APIResponse(
                success=True,
                message="No reaction to remove",
                data={"reaction": None}
            )
    
    if existing_reaction:
        if existing_reaction.reaction_type == reaction_data.reaction_type:
            # Remove reaction if it's the same
            db.delete(existing_reaction)
            db.commit()
            return APIResponse(
                success=True,
                message="Reaction removed successfully",
                data={"reaction": None}
            )
        else:
            # Update reaction type
            existing_reaction.reaction_type = reaction_data.reaction_type
            db.commit()
            return APIResponse(
                success=True,
                message="Reaction updated successfully",
                data={"reaction": reaction_data.reaction_type}
            )
    else:
        # Create new reaction
        new_reaction = PostReaction(
            user_id=current_user.id,
            post_id=post_id,
            reaction_type=reaction_data.reaction_type
        )
        db.add(new_reaction)
        db.commit()
        
        return APIResponse(
            success=True,
            message="Reaction added successfully",
            data={"reaction": reaction_data.reaction_type}
        )

@router.post("/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Create a new comment on a post"""
    
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create new comment
    db_comment = Comment(
        content=comment_data.content,
        post_id=post_id,
        author_id=current_user.id
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    # Get comment with author information
    comment_with_author = db.query(Comment).options(
        joinedload(Comment.author)
    ).filter(Comment.id == db_comment.id).first()
    
    return CommentResponse(
        id=comment_with_author.id,
        content=comment_with_author.content,
        post_id=comment_with_author.post_id,
        author_id=comment_with_author.author_id,
        author=comment_with_author.author,
        created_at=comment_with_author.created_at,
        updated_at=comment_with_author.updated_at or comment_with_author.created_at,
        likes_count=0,
        is_liked=False
    )
