import React, { useState, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { Heart, Music, ListMusic, Trash2, Upload } from 'lucide-react';
import { saveAudio } from '../utils/db';

export default function Library() {
  const { allSongs, likedSongs, playlists, deletePlaylist, addToPlaylist } = usePlayer();
  const [view, setView] = useState('home'); // 'home', 'liked', 'playlist'
  const [activePlaylist, setActivePlaylist] = useState(null);
  const fileInputRef = useRef(null);
  // Find updated active playlist if songs were added
  const currentActivePlaylist = activePlaylist ? playlists.find(p => p.id === activePlaylist.id) : null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && currentActivePlaylist) {
      const localId = 'local_' + Date.now();
      try {
        await saveAudio(localId, file);
        const newSong = {
          id: localId,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Local Audio',
          cover: '/Listn.png',
          src: localId,
          isLocal: true
        };
        addToPlaylist(newSong, currentActivePlaylist.id);
      } catch (err) {
        alert("Failed to save local audio to database.");
      }
    }
  };

  if (view === 'liked') {
    return (
      <div className="container">
        <button onClick={() => setView('home')} style={{ marginBottom: '1rem', fontWeight: 600 }}>← Back</button>
        <h2>Liked Songs</h2>
        <SongList songs={likedSongs} listName="Liked Songs" />
      </div>
    );
  }

  if (view === 'playlist' && currentActivePlaylist) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={() => { setView('home'); setActivePlaylist(null); }} style={{ fontWeight: 600 }}>← Back</button>
          <button 
            className="action-btn" 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this playlist?")) {
                deletePlaylist(currentActivePlaylist.id);
                setView('home');
                setActivePlaylist(null);
              }
            }}
            style={{ color: '#ff4081', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <Trash2 size={16} /> Delete Playlist
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {currentActivePlaylist.image ? (
            <img src={currentActivePlaylist.image} alt={currentActivePlaylist.name} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <ListMusic size={32} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2>{currentActivePlaylist.name}</h2>
            <p style={{ marginBottom: '0.5rem' }}>{currentActivePlaylist.description}</p>
            <button 
              className="btn-primary" 
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <Upload size={14} /> Add Local Song
            </button>
            <input 
              type="file" 
              accept="audio/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        <SongList songs={currentActivePlaylist.songs || []} listName={`Playlist: ${currentActivePlaylist.name}`} playlistId={currentActivePlaylist.id} />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Library</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        
        <div className="list-item" onClick={() => setView('liked')} style={{ padding: '1.5rem', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginRight: '1.5rem' }}>
            <Heart size={24} fill="currentColor" />
          </div>
          <div className="list-info">
            <div className="list-title" style={{ fontSize: '1.2rem' }}>Liked Songs</div>
            <div className="list-artist">{likedSongs.length} songs</div>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem' }}>Playlists</h3>
        {playlists.length === 0 ? (
          <p>No playlists yet.</p>
        ) : (
          playlists.map(pl => (
            <div key={pl.id} className="list-item" onClick={() => { setActivePlaylist(pl); setView('playlist'); }}>
              {pl.image ? (
                <img src={pl.image} alt={pl.name} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', marginRight: '1.5rem' }} />
              ) : (
                <div style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-color)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginRight: '1.5rem' }}>
                  <ListMusic size={24} />
                </div>
              )}
              <div className="list-info">
                <div className="list-title">{pl.name}</div>
                <div className="list-artist">{pl.songs?.length || 0} songs</div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
