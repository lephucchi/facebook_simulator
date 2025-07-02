import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Comment } from '../../types';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const { user: currentUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment.trim());
      setNewComment('');
    }
  };

  // Show first 2 comments by default, show all if clicked
  const commentsToShow = showAllComments ? comments : comments.slice(0, 2);
  const hasMoreComments = comments.length > 2;

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {commentsToShow.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <div className="font-medium text-sm text-gray-900">
                    {comment.author.name}
                  </div>
                  <div className="text-sm text-gray-800">
                    {comment.content}
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-1 ml-3 text-xs text-gray-500">
                  <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                  <button className="hover:underline">Like</button>
                  <button className="hover:underline">Reply</button>
                </div>
              </div>
            </div>
          ))}
          
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
