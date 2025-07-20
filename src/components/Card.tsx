import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ id, image, isFlipped, isMatched, onClick }) => {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div
      className={cn(
        "relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 cursor-pointer perspective-1000",
        isMatched && "opacity-0 transition-opacity duration-500"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full bg-blue-500 rounded-lg shadow-lg flex items-center justify-center backface-hidden">
          <span className="text-white text-4xl font-bold">?</span>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center rotate-y-180 backface-hidden overflow-hidden">
          <img src={image} alt="animal" className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Card;