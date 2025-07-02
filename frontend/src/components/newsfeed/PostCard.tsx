import React, { useState } from 'react';
import { 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  ThumbsUp,
  Heart
} from 'lucide-react';
import type { Post } from '../../types';
import { formatTimeAgo, formatNumber } from '../../utils';
import ReactionPicker from '../ui/ReactionPicker';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare, onReaction }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleReaction = (reactionType: string) => {
    if (onReaction) {
      onReaction(post.id, reactionType);
    } else if (onLike) {
      // Fallback to like if onReaction not provided
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const handleShare = () => {
    onShare?.(post.id);
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
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
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
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
