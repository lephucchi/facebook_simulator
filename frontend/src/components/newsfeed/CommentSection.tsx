import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreHorizontal, Edit, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Comment } from '../../types';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments, 
  onAddComment, 
  onEditComment, 
  onDeleteComment 
}) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [dropdownCommentId, setDropdownCommentId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownCommentId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment.trim());
      setNewComment('');
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setDropdownCommentId(null);
  };

  const handleEditSave = (commentId: string) => {
    if (editContent.trim() && onEditComment) {
      onEditComment(commentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteClick = (commentId: string) => {
    if (onDeleteComment && window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      onDeleteComment(commentId);
    }
    setDropdownCommentId(null);
  };

  // Show first 2 comments by default, show all if clicked
  const commentsToShow = showAllComments ? comments : comments.slice(0, 2);
  const hasMoreComments = comments.length > 2;

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {commentsToShow.map((comment) => {
            const isCommentAuthor = currentUser?.id === comment.author.id;
            const isEditing = editingCommentId === comment.id;
            
            return (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs"
                        >
                          <X className="w-3 h-3" />
                          <span>Hủy</span>
                        </button>
                        <button
                          onClick={() => handleEditSave(comment.id)}
                          disabled={!editContent.trim()}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Lưu</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-100 rounded-2xl px-3 py-2 relative">
                        <div className="font-medium text-sm text-gray-900">
                          {comment.author.name}
                        </div>
                        <div className="text-sm text-gray-800">
                          {comment.content}
                        </div>
                        {isCommentAuthor && (
                          <div className="absolute -right-1 -top-1" ref={dropdownRef}>
                            <button
                              onClick={() => setDropdownCommentId(
                                dropdownCommentId === comment.id ? null : comment.id
                              )}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <MoreHorizontal className="w-3 h-3 text-gray-500" />
                            </button>
                            {dropdownCommentId === comment.id && (
                              <div className="absolute right-0 top-6 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleEditClick(comment)}
                                  className="flex items-center space-x-2 w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors text-sm"
                                >
                                  <Edit className="w-3 h-3 text-gray-500" />
                                  <span>Chỉnh sửa</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(comment.id)}
                                  className="flex items-center space-x-2 w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors text-red-600 text-sm"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 ml-3 text-xs text-gray-500">
                        <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                        <button className="hover:underline">Like</button>
                        <button className="hover:underline">Reply</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Show more comments button */}
          {hasMoreComments && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-gray-600 text-sm hover:underline ml-11"
            >
              View {comments.length - 2} more comment{comments.length - 2 !== 1 ? 's' : ''}
            </button>
          )}
          
          {/* Hide comments button */}
          {showAllComments && hasMoreComments && (
            <button
              onClick={() => setShowAllComments(false)}
              className="text-gray-600 text-sm hover:underline ml-11"
            >
              Hide comments
            </button>
          )}
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <img
          src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
