import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { MoreVertical, Heart, Trash2 } from 'lucide-react';

export default function SongList({ songs, listName = 'Playlist', playlistId = null }) {
  const { playSong, currentSong, likedSongs, toggleLike, playlists, addToPlaylist, removeFromPlaylist } = usePlayer();
  const [songToAdd, setSongToAdd] = useState(null);

  if (!songs || songs.length === 0) {
    return <div style={{textAlign: 'center', padding: '2rem', color: '#888'}}>No songs found.</div>;
  }

  return (
    <div className="song-list">
      {songs.map((song, index) => {
        const isPlaying = currentSong?.src === song.src;
        const isLiked = likedSongs.some(s => s.src === song.src);
        
        return (
          <div 
            key={song.id || index} 
            className="list-item"
            onClick={() => playSong(song, songs, index)}
            style={{ backgroundColor: isPlaying ? 'var(--card-hover)' : 'transparent' }}
          >
            <img src={song.cover} alt={song.title} className="list-cover" />
            <div className="list-info">
              <div className="list-title" style={{ color: isPlaying ? 'var(--text-color)' : 'inherit' }}>
                {song.title}
              </div>
              <div className="list-artist">{song.artist}</div>
            </div>
            <div className="list-actions">
              <button 
                className="action-btn" 
                onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                style={{ color: isLiked ? '#ff4081' : '#888' }}
              >
                <Heart size={20} fill={isLiked ? '#ff4081' : 'none'} />
              </button>
              
              {playlistId ? (
                <button 
                  className="action-btn" 
                  onClick={(e) => { e.stopPropagation(); removeFromPlaylist(song.id, playlistId); }}
                  style={{ color: '#ff4081' }}
                >
                  <Trash2 size={20} />
                </button>
              ) : (
                <button 
                  className="action-btn" 
                  onClick={(e) => { e.stopPropagation(); setSongToAdd(song); }}
                >
                  <MoreVertical size={20} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {songToAdd && (
        <div className="modal-overlay" onClick={() => setSongToAdd(null)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <h2>Add to Playlist</h2>
            <p style={{marginBottom: '1rem'}}>{songToAdd.title}</p>
            {playlists.length === 0 ? (
              <p>No playlists created yet. Go to Create to make one!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {playlists.map(pl => (
                  <button 
                    key={pl.id} 
                    className="list-item" 
                    onClick={() => {
                      addToPlaylist(songToAdd, pl.id);
                      setSongToAdd(null);
                    }}
                    style={{ textAlign: 'left', width: '100%', border: '1px solid var(--border-color)' }}
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
            <button className="btn-primary" onClick={() => setSongToAdd(null)} style={{marginTop: '1rem'}}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
