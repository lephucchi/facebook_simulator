import React, { useState, useEffect } from 'react';
import type { Post, Story } from '../types';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import Stories from '../components/newsfeed/Stories';
import CreatePost from '../components/newsfeed/CreatePost';
import PostCard from '../components/newsfeed/PostCard';
import StoryViewer from '../components/newsfeed/StoryViewer';

const Newsfeed: React.FC = () => {
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Transform backend post data to frontend format
  const transformPost = (backendPost: any): Post => {
    return {
      id: backendPost.id.toString(),
      author: {
        id: backendPost.author.id.toString(),
        name: backendPost.author.full_name || backendPost.author.username,
        avatar: backendPost.author.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
        isOnline: true
      },
      content: backendPost.content,
      image: backendPost.image_url,
      timestamp: new Date(backendPost.created_at),
      likes: backendPost.likes_count || 0,
      shares: backendPost.shares_count || 0,
      isLiked: backendPost.is_liked || false,
      reaction: backendPost.current_user_reaction || undefined,
      comments: (backendPost.comments || []).map((comment: any) => ({
        id: comment.id.toString(),
        author: {
          id: comment.author.id.toString(),
          name: comment.author.full_name || comment.author.username,
          avatar: comment.author.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
          isOnline: true
        },
        content: comment.content,
        timestamp: new Date(comment.created_at),
        createdAt: comment.created_at,
        likes: 0,
        isLiked: false
      }))
    };
  };

  // Load stories from backend
  const loadStoriesFromBackend = async () => {
    try {
      const storiesData = await apiClient.getStories();
      const transformedStories: Story[] = (storiesData as any[]).map((story: any) => ({
        id: story.id.toString(),
        author: {
          id: story.author.id.toString(),
          name: story.author.name,
          avatar: story.author.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
        },
        image: story.images?.[0]?.url || story.images?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop',
        images: story.images?.map((img: any) => img.url || img) || [story.image],
        isViewed: story.is_viewed || false
      }));
      setStories(transformedStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
      generateStoriesFromUsers();
    }
  };

  // Generate stories from users (fallback)
  const generateStoriesFromUsers = async () => {
    try {
      const users = await apiClient.getAllUsers();
      const storyImages = [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=500&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300&h=500&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop',
        'https://images.unsplash.com/photo-1464822759844-d150baec3e92?w=300&h=500&fit=crop'
      ];

      const storyData: Story[] = (users as any[])
        .filter(user => user.id !== currentUser?.id)
        .slice(0, 5)
        .map((user, index) => ({
          id: user.id.toString(),
          author: {
            id: user.id.toString(),
            name: user.full_name || user.username,
            avatar: user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
          },
          image: storyImages[index % storyImages.length],
          isViewed: Math.random() > 0.5
        }));

      setStories(storyData);
    } catch (error) {
      console.error('Failed to load users for stories:', error);
    }
  };

  // Load posts from backend
  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      let postsData;
      
      if (isAuthenticated && currentUser) {
        // Try to get authenticated posts first
        try {
          postsData = await apiClient.getPosts();
        } catch (error) {
          console.warn('Failed to load authenticated posts, falling back to sample posts:', error);
          postsData = await apiClient.getSamplePosts();
        }
      } else {
        // Get sample posts for non-authenticated users
        postsData = await apiClient.getSamplePosts();
      }
      
      const transformedPosts = (postsData as any[]).map(transformPost);
      setPosts(transformedPosts);
      setError(null);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoadingPosts(false);
    }
  };

  // Load data on component mount and when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadPosts();
      loadStoriesFromBackend(); // Use backend stories first
    }
  }, [isAuthenticated, currentUser]);

  // Also load data when page is refreshed
  useEffect(() => {
    if (isAuthenticated && currentUser && posts.length === 0) {
      loadPosts();
    }
  }, [isAuthenticated, currentUser, posts.length]);

  const handleCreatePost = async (content: string) => {
    if (!currentUser) return;

    try {
      const newPostData = await apiClient.createPost({ content });
      const transformedPost = transformPost(newPostData);
      setPosts([transformedPost, ...posts]);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const postIdNum = parseInt(postId);
      const currentPost = posts.find(post => post.id === postId);
      
      // If reactionType is empty or same as current reaction, we want to remove the reaction
      const isRemoving = !reactionType || reactionType === '' || currentPost?.reaction === reactionType;
      
      // Send to backend first
      const backendReactionType = isRemoving ? '' : reactionType;
      const response = await apiClient.reactToPost(postIdNum, backendReactionType) as any;
      
      // Update UI based on backend response
      setPosts(posts.map(post => {
        if (post.id === postId) {
          if (response.data?.reaction) {
            // Reaction was added/updated
            return {
              ...post,
              isLiked: true,
              likes: post.reaction ? post.likes : post.likes + 1,
              reaction: response.data.reaction
            };
          } else {
            // Reaction was removed
            return {
              ...post,
              isLiked: false,
              likes: Math.max(0, post.likes - (post.reaction ? 1 : 0)),
              reaction: undefined
            };
          }
        }
        return post;
      }));
      
    } catch (error) {
      console.error('Failed to react to post:', error);
      // On error, we could revert the UI change or show an error message
      // For now, let's trust the current optimistic update
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (!currentUser) return;

    try {
      // Send comment to backend first
      const newComment = await apiClient.createComment(postId, commentText) as any;
      
      // Update UI with response from backend
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const transformedComment = {
            id: newComment.id?.toString() || Date.now().toString(),
            author: {
              id: newComment.author?.id?.toString() || currentUser.id,
              name: newComment.author?.full_name || newComment.author?.username || currentUser.name,
              avatar: newComment.author?.avatar_url || currentUser.avatar,
              isOnline: true
            },
            content: newComment.content || commentText,
            timestamp: new Date(newComment.created_at || Date.now()),
            createdAt: newComment.created_at || new Date().toISOString(),
            likes: 0,
            isLiked: false
          };
          return {
            ...post,
            comments: [...post.comments, transformedComment]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to create comment:', error);
      // Show error to user
      setError('Failed to create comment. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleShare = async (postId: string) => {
    // For now, just increment the counter locally
    // Later we can implement actual sharing functionality
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        };
      }
      return post;
    }));
  };

  const handleEditPost = async (postId: string, content: string) => {
    try {
      const postIdNum = parseInt(postId);
      const updatedPost = await apiClient.updatePost(postIdNum, { content }) as any;
      
      // Update the post in state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            content: updatedPost.content
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to update post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const postIdNum = parseInt(postId);
      await apiClient.deletePost(postIdNum);
      
      // Remove the post from state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleEditComment = async (postId: string, commentId: string, content: string) => {
    try {
      const updatedComment = await apiClient.updateComment(commentId, content) as any;
      
      // Update the comment in state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  content: updatedComment.content
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to update comment:', error);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await apiClient.deleteComment(commentId);
      
      // Remove the comment from state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleStoryClick = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setShowStoryViewer(true);
  };

  const handleStoryClose = () => {
    setShowStoryViewer(false);
  };

  const handleStoryNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setShowStoryViewer(false);
    }
  };

  const handleStoryPrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Facebook Simulator</h2>
          <p className="text-gray-600 mb-6">Please log in to continue</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={currentUser} />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block fixed left-0 top-14 h-full">
          <Sidebar user={currentUser} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80 lg:mr-80">
          <div className="max-w-2xl mx-auto py-6 px-4">
            {/* Stories */}
            <Stories stories={stories} onStoryClick={handleStoryClick} />
            
            {/* Create Post */}
            <CreatePost user={currentUser} onCreatePost={handleCreatePost} />
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-right text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Posts Feed */}
            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onReaction={handleReaction}
                    onComment={handleComment}
                    onShare={handleShare}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block fixed right-0 top-14 h-full">
          <RightSidebar />
        </div>
      </div>

      {/* Story Viewer Modal */}
      {showStoryViewer && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          onClose={handleStoryClose}
          onNext={handleStoryNext}
          onPrevious={handleStoryPrevious}
        />
      )}
    </div>
  );
};

export default Newsfeed;
