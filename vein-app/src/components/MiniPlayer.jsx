import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause } from 'lucide-react';

export default function MiniPlayer({ onOpenFull }) {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="mini-player" onClick={onOpenFull}>
      <img src={currentSong.cover} alt="cover" className="mini-cover" />
      <div className="mini-info">
        <div className="mini-title">{currentSong.title}</div>
        <div className="mini-artist">{currentSong.artist}</div>
      </div>
      <div className="mini-controls">
        <button 
          className="mini-btn" 
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  );
}
