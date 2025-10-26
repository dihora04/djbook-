
import React from 'react';
import type { MapPlace } from '../types';
import { MapPinIcon, StarIcon } from './Icons';

interface DjCardProps {
  place: MapPlace;
}

const DjCard: React.FC<DjCardProps> = ({ place }) => {
  return (
    <div className="bg-gray-900/50 border border-pink-500/50 rounded-lg p-4 backdrop-blur-sm hover:border-pink-400 hover:bg-gray-900 transition-all duration-300 neon-border">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold text-pink-300 font-orbitron">{place.title}</h3>
        <a
          href={place.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 transition-colors"
        >
          <MapPinIcon className="w-5 h-5" />
          <span className="text-sm">View Map</span>
        </a>
      </div>
      {place.placeAnswerSources?.[0]?.reviewSnippets && place.placeAnswerSources[0].reviewSnippets.length > 0 && (
        <div className="mt-3 space-y-2">
           <h4 className="text-sm font-semibold text-gray-300">Reviews:</h4>
          {place.placeAnswerSources[0].reviewSnippets.slice(0, 2).map((review, index) => (
            <div key={index} className="border-l-2 border-cyan-500 pl-3">
              <p className="text-sm text-gray-400 italic">"{review.text}"</p>
              <p className="text-xs text-right text-gray-500 mt-1">- {review.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DjCard;
