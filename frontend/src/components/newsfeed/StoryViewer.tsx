import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Story } from '../../types';

interface StoryViewerProps {
  stories: Story[];
  currentStoryIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentStoryIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentStoryIndex];
  
  // Mock multiple images for each story
  const storyImages = [
    currentStory?.image,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=800&fit=crop',
  ].filter(Boolean);

  const STORY_DURATION = 5000; // 5 seconds per image

  const nextImage = useCallback(() => {
    if (currentImageIndex < storyImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      onNext();
      setCurrentImageIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentImageIndex, storyImages.length, currentStoryIndex, stories.length, onNext, onClose]);

  const previousImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      onPrevious();
      setCurrentImageIndex(0);
      setProgress(0);
    }
  }, [currentImageIndex, currentStoryIndex, onPrevious]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setProgress(0);
  }, [currentStoryIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextImage();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, nextImage]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        previousImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        onClose();
        break;
      case ' ':
        e.preventDefault();
        setIsPaused(prev => !prev);
        break;
    }
  }, [previousImage, nextImage, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-md h-full max-h-screen bg-black">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1 z-20">
          {storyImages.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index === currentImageIndex 
                    ? `${progress}%` 
                    : index < currentImageIndex 
                      ? '100%' 
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20 mt-4">
          <div className="flex items-center space-x-2">
            <img
              src={currentStory.author.avatar}
              alt={currentStory.author.name}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="text-white font-medium text-sm">
              {currentStory.author.name}
            </span>
            <span className="text-gray-300 text-xs">2h</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white hover:bg-gray-700 p-1 rounded-full"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-gray-700 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Image */}
        <div className="relative w-full h-full">
          <img
            src={storyImages[currentImageIndex]}
            alt="Story"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop';
            }}
          />

          {/* Navigation Areas */}
          <button
            onClick={previousImage}
            className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-4 hover:bg-gradient-to-r hover:from-black hover:from-10% hover:to-transparent transition-all duration-200"
            disabled={currentImageIndex === 0 && currentStoryIndex === 0}
          >
            <ChevronLeft className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-4 hover:bg-gradient-to-l hover:from-black hover:from-10% hover:to-transparent transition-all duration-200"
          >
            <ChevronRight className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </button>

          {/* Tap areas for mobile/touch */}
          <div 
            className="absolute left-0 top-0 w-1/2 h-full z-5"
            onClick={previousImage}
          />
          <div 
            className="absolute right-0 top-0 w-1/2 h-full z-5"
            onClick={nextImage}
          />
        </div>

        {/* Story Info */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black bg-opacity-50 rounded-lg p-3">
            <p className="text-white text-sm">
              Story {currentImageIndex + 1} of {storyImages.length}
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Tap left or right to navigate • Press space to pause
            </p>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      {currentStoryIndex > 0 && (
        <button
          onClick={() => {
            onPrevious();
            setCurrentImageIndex(0);
            setProgress(0);
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-700 p-2 rounded-full z-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentStoryIndex < stories.length - 1 && (
        <button
          onClick={() => {
            onNext();
            setCurrentImageIndex(0);
            setProgress(0);
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-700 p-2 rounded-full z-30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
