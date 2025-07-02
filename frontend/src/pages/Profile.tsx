import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Edit3, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Grid3X3,
  Heart,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/api';
import Navbar from '../components/layout/Navbar';
import PostCard from '../components/newsfeed/PostCard';
import type { User, Post } from '../types';

interface ProfilePageProps {
  userId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'photos' | 'friends'>('posts');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no userId provided, show current user's profile
    if (!userId && currentUser) {
      setProfileUser(currentUser);
      setIsOwnProfile(true);
      loadUserPosts(currentUser.id);
    } else if (userId) {
      // Load user profile data
      loadUserProfile(userId);
    }
  }, [userId, currentUser]);

  const loadUserProfile = async (id: string) => {
    try {
      setLoading(true);
      // Try to get user from backend
      try {
        const users = await apiClient.getAllUsers();
        const user = (users as any[]).find((u: any) => u.id.toString() === id);
        
        if (user) {
          const transformedUser: User = {
            id: user.id.toString(),
            name: user.full_name || user.username,
            avatar: user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            isOnline: user.is_online || false
          };
          setProfileUser(transformedUser);
          setIsOwnProfile(currentUser?.id === id);
          loadUserPosts(id);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Fallback to mock data
        const mockProfile: User = {
          id: id,
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isOnline: true
        };
        setProfileUser(mockProfile);
        setIsOwnProfile(currentUser?.id === id);
        loadMockPosts(mockProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (userId: string) => {
    try {
      // Try to get user's posts from backend
      const posts = await apiClient.getPosts();
      const userPosts = (posts as any[]).filter((post: any) => 
        post.author.id.toString() === userId
      );
      
      if (userPosts.length > 0) {
        const transformedPosts = userPosts.map((post: any) => ({
          id: post.id.toString(),
          author: {
            id: post.author.id.toString(),
            name: post.author.full_name || post.author.username,
            avatar: post.author.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            isOnline: true
          },
          content: post.content,
          image: post.image_url,
          timestamp: new Date(post.created_at),
          likes: post.likes_count || 0,
          shares: post.shares_count || 0,
          isLiked: post.is_liked || false,
          reaction: post.current_user_reaction,
          comments: (post.comments || []).map((comment: any) => ({
            id: comment.id.toString(),
            author: {
              id: comment.author.id.toString(),
              name: comment.author.full_name || comment.author.username,
              avatar: comment.author.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
              isOnline: true
            },
            content: comment.content,
            timestamp: new Date(comment.created_at),
            createdAt: comment.created_at,
            likes: 0,
            isLiked: false
          }))
        }));
        setUserPosts(transformedPosts);
      } else {
        loadMockPosts(profileUser!);
      }
    } catch (error) {
      console.error('Failed to load user posts:', error);
      loadMockPosts(profileUser!);
    }
  };

  const loadMockPosts = (user: User) => {
    const mockPosts: Post[] = [
      {
        id: '1',
        author: user,
        content: 'Just finished a great workout! 💪 Feeling energized and ready to take on the day.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        timestamp: new Date(Date.now() - 3600000),
        likes: 24,
        comments: [],
        shares: 3,
        isLiked: false,
        reaction: 'like'
      },
      {
        id: '2',
        author: user,
        content: 'Beautiful sunset from my hiking trip yesterday. Nature never fails to amaze me! 🌅',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        timestamp: new Date(Date.now() - 86400000),
        likes: 56,
        comments: [],
        shares: 12,
        isLiked: true,
        reaction: 'love'
      }
    ];
    setUserPosts(mockPosts);
  };

  if (!profileUser || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar user={currentUser || undefined} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={currentUser || undefined} />
      
      <div className="max-w-4xl mx-auto pt-16">
        {/* Cover Photo */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-80 rounded-b-lg">
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-b-lg"></div>
          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Edit Cover Photo</span>
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-b-lg shadow-sm -mt-32 relative z-10 pb-4">
          <div className="px-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-40 h-40 rounded-full border-4 border-white object-cover bg-white"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                    <p className="text-gray-600 text-lg">Software Developer</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>1,234 friends</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined March 2020</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    {isOwnProfile ? (
                      <>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                          <UserPlus className="w-4 h-4" />
                          <span>Add Friend</span>
                        </button>
                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                      </>
                    )}
                    <button className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200 mt-6">
            <div className="px-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'posts', label: 'Posts', icon: Grid3X3 },
                  { key: 'photos', label: 'Photos', icon: Camera },
                  { key: 'friends', label: 'Friends', icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
          {/* Left Column - About */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Lives in San Francisco, CA</p>
                    <p className="text-gray-500 text-sm">Since 2020</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Joined March 2020</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Friends */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Friends</h3>
                <span className="text-gray-500 text-sm">1,234</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-square">
                    <img
                      src={`https://images.unsplash.com/photo-${1472099645785 + i}?w=100&h=100&fit=crop&crop=face`}
                      alt={`Friend ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">No posts yet.</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onReaction={() => {}} // Profile view is read-only for now
                      onComment={() => {}} // Profile view is read-only for now
                      onShare={() => {}} // Profile view is read-only for now
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-square">
                      <img
                        src={`https://images.unsplash.com/photo-${1506905925346 + i}?w=300&h=300&fit=crop`}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg hover:opacity-90 cursor-pointer transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img
                        src={`https://images.unsplash.com/photo-${1472099645785 + i}?w=60&h=60&fit=crop&crop=face`}
                        alt={`Friend ${i + 1}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Friend Name {i + 1}</h4>
                        <p className="text-sm text-gray-500">12 mutual friends</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
