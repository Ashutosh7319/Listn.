import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ChevronDown, MessageSquare } from 'lucide-react';
import { fetchLyrics } from '../utils/api';

export default function FullPlayer({ isOpen, onClose }) {
  const { 
    currentSong, isPlaying, togglePlay, nextSong, prevSong, 
    progress, duration, seek, isShuffle, toggleShuffle 
  } = usePlayer();

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  useEffect(() => {
    // Reset lyrics state when song changes
    setShowLyrics(false);
    setLyrics(null);
  }, [currentSong]);

  useEffect(() => {
    if (showLyrics && !lyrics && currentSong?.id) {
      setLyricsLoading(true);
      fetchLyrics(currentSong.id).then(res => {
        setLyrics(res);
        setLyricsLoading(false);
      });
    }
  }, [showLyrics, currentSong]);

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`full-player ${isOpen ? 'open' : ''}`}>
      <div className="drag-indicator"></div>
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

      {showLyrics && (
        <div className="lyrics-container glass" style={{
          position: 'absolute', top: '15%', left: '5%', right: '5%', bottom: '25%', 
          borderRadius: '20px', padding: '1.5rem', overflowY: 'auto', zIndex: 10,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(30px)'
        }}>
          {lyricsLoading ? (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#ccc'}}>
              Loading lyrics...
            </div>
          ) : lyrics ? (
            <div style={{ whiteSpace: 'pre-line', fontSize: '1.3rem', lineHeight: '2rem', fontWeight: 600, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {lyrics}
            </div>
          ) : (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#ccc'}}>
              Lyrics not available for this track.
            </div>
          )}
        </div>
      )}

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
        <button 
          className="control-btn" 
          onClick={() => setShowLyrics(!showLyrics)}
          style={{ color: showLyrics ? 'var(--accent-color)' : '#888' }}
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
}
