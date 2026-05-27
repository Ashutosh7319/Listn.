import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { User } from 'lucide-react';

export default function Artists() {
  const { allSongs } = usePlayer();
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Extract unique artists
  const uniqueArtists = Array.from(new Set(allSongs.map(s => s.artist))).sort();

  if (selectedArtist) {
    const artistSongs = allSongs.filter(s => s.artist === selectedArtist);
    return (
      <div className="container">
        <button onClick={() => setSelectedArtist(null)} style={{ marginBottom: '1rem', fontWeight: 600 }}>
          ← Back
        </button>
        <h2>{selectedArtist}</h2>
        <p style={{marginBottom: '2rem'}}>{artistSongs.length} songs</p>
        <SongList songs={artistSongs} listName={`Artist: ${selectedArtist}`} />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Explore Artists</h2>
      <div className="grid" style={{ marginTop: '2rem' }}>
        {uniqueArtists.map(artist => {
          // Find an image for the artist (just pick their first song's cover)
          const artistImg = allSongs.find(s => s.artist === artist)?.cover;
          return (
            <div key={artist} className="card" onClick={() => setSelectedArtist(artist)}>
              <img src={artistImg} alt={artist} style={{ borderRadius: '50%', aspectRatio: '1', objectFit: 'cover' }} />
              <div className="card-title">{artist}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
