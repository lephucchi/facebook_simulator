import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import type { Post, User } from '../../types';
import { formatTimeAgo, formatNumber } from '../../utils';
import ReactionPicker from '../ui/ReactionPicker';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  currentUser?: User;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
  onEdit?: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
  onEditComment?: (postId: string, commentId: string, content: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser,
  onLike, 
  onComment, 
  onShare, 
  onReaction,
  onEdit,
  onDelete,
  onEditComment,
  onDeleteComment 
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if current user is the author
  const isAuthor = currentUser?.id === post.author.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReaction = (reactionType: string) => {
    if (onReaction) {
      onReaction(post.id, reactionType);
    } else if (onLike) {
      // Fallback to like if onReaction not provided
      onLike(post.id);
    }
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleEditSave = () => {
    if (editContent.trim() && onEdit) {
      onEdit(post.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (onDelete && window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      onDelete(post.id);
    }
    setShowDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
              {post.author.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatTimeAgo(post.timestamp)}
            </p>
          </div>
        </div>
        {isAuthor && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleEditClick}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                  <span>Chỉnh sửa bài viết</span>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa bài viết</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Bạn đang nghĩ gì?"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditCancel}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleEditSave}
                disabled={!editContent.trim()}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Lưu</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-3 h-3 text-white" />
                </div>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <span className="ml-2">{formatNumber(post.likes)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{formatNumber(post.comments.length)} comments</span>
            <span>{formatNumber(post.shares)} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <ReactionPicker 
            onReaction={handleReaction}
            currentReaction={post.reaction}
          />
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Unified Comment Section - Always show if comments exist or comment input is open */}
      {(post.comments.length > 0 || showCommentInput) && (
        <div className="border-t border-gray-100">
          <CommentSection 
            postId={post.id}
            comments={post.comments || []}
            onAddComment={(postId, content) => {
              if (onComment) {
                onComment(postId, content);
              }
            }}
            onEditComment={onEditComment ? (commentId, content) => onEditComment(post.id, commentId, content) : undefined}
            onDeleteComment={onDeleteComment ? (commentId) => onDeleteComment(post.id, commentId) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
