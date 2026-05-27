import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ChevronDown } from 'lucide-react';

export default function FullPlayer({ isOpen, onClose }) {
  const { 
    currentSong, isPlaying, togglePlay, nextSong, prevSong, 
    progress, duration, seek, isShuffle, toggleShuffle 
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`full-player ${isOpen ? 'open' : ''}`}>
      <div className="full-header">
        <button onClick={onClose} className="control-btn">
          <ChevronDown size={28} />
        </button>
        <span style={{fontWeight: 600}}>Now Playing</span>
        <div style={{width: 48}}></div> {/* Spacer */}
      </div>

      <div className="full-cover-container">
        <img src={currentSong.cover} alt="cover" className="full-cover" />
      </div>

      <div className="full-info">
        <div className="full-title">{currentSong.title}</div>
        <div className="full-artist">{currentSong.artist}</div>
      </div>

      <div className="progress-container" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
      }}>
        <div 
          className="progress-bar" 
          style={{ width: `${(progress / duration) * 100 || 0}%` }}
        />
      </div>
      
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: '#888'}}>
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="full-controls">
        <button 
          className="control-btn" 
          onClick={toggleShuffle} 
          style={{ color: isShuffle ? 'var(--text-color)' : '#888' }}
        >
          <Shuffle size={24} />
        </button>
        <button className="control-btn" onClick={prevSong}>
          <SkipBack size={28} fill="currentColor" />
        </button>
        <button className="control-btn play-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{marginLeft: 4}} />}
        </button>
        <button className="control-btn" onClick={nextSong}>
          <SkipForward size={28} fill="currentColor" />
        </button>
        <div style={{width: 48}}></div> {/* Spacer for balance */}
      </div>
    </div>
  );
}
