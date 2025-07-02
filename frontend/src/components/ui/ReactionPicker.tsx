import React, { useState, useRef } from 'react';
import { Heart } from 'lucide-react';

interface ReactionPickerProps {
  onReaction: (type: string) => void;
  currentReaction?: string;
}

const reactions = [
  { type: 'like', emoji: '👍', color: 'text-blue-600' },
  { type: 'love', emoji: '❤️', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', color: 'text-orange-500' },
  { type: 'angry', emoji: '😠', color: 'text-red-600' },
];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onReaction, currentReaction }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [hideTimeout, setHideTimeout] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
    
    const timeout = setTimeout(() => {
      setShowPicker(true);
    }, 500); // Tăng thời gian từ 300ms lên 500ms
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    // Tăng thời gian delay để có thể di chuyển chuột đến picker
    const timeout = setTimeout(() => {
      setShowPicker(false);
    }, 500); // Tăng từ 200ms lên 500ms
    setHideTimeout(timeout);
  };

  const handlePickerMouseEnter = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    if (hoverTimeout) clearTimeout(hoverTimeout);
  };

  const handlePickerMouseLeave = () => {
    // Tăng thời gian delay khi rời khỏi picker
    const timeout = setTimeout(() => {
      setShowPicker(false);
    }, 300); // Tăng thời gian delay
    setHideTimeout(timeout);
  };

  const handleReaction = (reactionType: string) => {
    // If user clicks the same reaction, remove it
    // If user clicks a different reaction, change to that reaction
    if (currentReaction === reactionType) {
      onReaction(''); // Remove reaction
    } else {
      onReaction(reactionType); // Add/change reaction
    }
    setShowPicker(false);
  };

  const currentReactionData = reactions.find(r => r.type === currentReaction);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Like Button */}
      <button
        onClick={() => {
          // If user has reacted, clicking removes the reaction
          // If user hasn't reacted, clicking adds a like
          if (currentReaction) {
            handleReaction(currentReaction); // This will remove the reaction
          } else {
            handleReaction('like'); // This will add a like
          }
        }}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${
          currentReaction 
            ? currentReactionData?.color || 'text-blue-600' 
            : 'text-gray-600'
        }`}
      >
        {currentReaction ? (
          <>
            <span className="text-lg">{currentReactionData?.emoji}</span>
            <span className="text-sm font-medium capitalize">{currentReaction}</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Like</span>
          </>
        )}
      </button>

      {/* Reaction Picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 flex items-center space-x-1 z-10"
          style={{ minWidth: '280px' }}
          onMouseEnter={handlePickerMouseEnter}
          onMouseLeave={handlePickerMouseLeave}
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handleReaction(reaction.type)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all transform hover:scale-125"
              title={reaction.type}
            >
              <span className="text-2xl">{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;
