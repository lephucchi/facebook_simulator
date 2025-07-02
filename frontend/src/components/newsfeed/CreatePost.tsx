import React, { useState } from 'react';
import { Image, Video, Smile } from 'lucide-react';
import { Button, Avatar } from '../ui';

interface CreatePostProps {
  user: {
    name: string;
    avatar: string;
  };
  onCreatePost?: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');

  const handleSubmit = () => {
    if (postContent.trim() && onCreatePost) {
      onCreatePost(postContent);
      setPostContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Post Input */}
      <div className="flex space-x-3 mb-4">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="md"
        />
        <div className="flex-1">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            className="w-full p-3 bg-gray-100 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
            rows={3}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-3"></div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-red-500" />
            <span className="text-gray-600 font-medium">Live video</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Image className="w-5 h-5 text-green-500" />
            <span className="text-gray-600 font-medium">Photo/video</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-600 font-medium">Feeling/activity</span>
          </button>
        </div>

        {postContent.trim() && (
          <Button
            onClick={handleSubmit}
            variant="primary"
          >
            Post
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
