import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const { allSongs } = usePlayer();
  const [query, setQuery] = useState('');

  const filteredSongs = query 
    ? allSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      <h2>Search</h2>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <SearchIcon style={{ position: 'absolute', top: '14px', left: '14px', color: '#888' }} size={20} />
        <input 
          type="text" 
          className="input-field" 
          placeholder="What do you want to listen to?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {query && (
        <section>
          <h3>Results</h3>
          <SongList songs={filteredSongs} listName={`Search: ${query}`} />
        </section>
      )}

      {!query && (
        <section>
          <h3>Browse All</h3>
          <div className="grid">
            {['Pop', 'Hip-Hop', 'Phonk', 'Indie', 'Classical', 'Rock'].map(genre => (
              <div key={genre} className="card" onClick={() => setQuery(genre)}>
                <div className="card-title" style={{ padding: '2rem 0', fontSize: '1.2rem' }}>{genre}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
