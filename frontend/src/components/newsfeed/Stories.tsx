import React from 'react';
import { Plus } from 'lucide-react';
import type { Story } from '../../types';

interface StoriesProps {
  stories: Story[];
  onCreateStory?: () => void;
  onStoryClick?: (storyIndex: number) => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, onCreateStory, onStoryClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Create Story Card */}
        <div 
          onClick={onCreateStory}
          className="flex-shrink-0 w-28 h-44 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden group"
        >
          <div className="h-32 bg-gradient-to-b from-gray-200 to-gray-300"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <span className="text-xs font-medium text-gray-800">Create Story</span>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story, index) => (
          <div 
            key={story.id}
            className="flex-shrink-0 w-28 h-44 rounded-lg cursor-pointer overflow-hidden relative group hover:scale-105 transition-transform"
            onClick={() => onStoryClick?.(index)}
          >
            <img
              src={story.image}
              alt={`${story.author.name}'s story`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
            
            {/* Author Avatar */}
            <div className="absolute top-3 left-3">
              <div className={`w-10 h-10 rounded-full p-0.5 ${story.isViewed ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>

            {/* Author Name */}
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-white text-xs font-medium drop-shadow-lg">
                {story.author.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
