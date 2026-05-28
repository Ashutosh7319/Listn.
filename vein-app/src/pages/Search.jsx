import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Search as SearchIcon, Loader } from 'lucide-react';
import SongList from '../components/SongList';
import { searchSongs } from '../utils/api';

export default function Search() {
  const { allSongs } = usePlayer();
  const [query, setQuery] = useState('');
  const [apiResults, setApiResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced API search
  useEffect(() => {
    if (!query.trim()) {
      setApiResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      const results = await searchSongs(query, 30);
      setApiResults(results);
      setIsSearching(false);
      setHasSearched(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  // Also filter local songs for combined results
  const localResults = query.trim()
    ? allSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>Search</h2>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <SearchIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={20} />
          <input
            type="text"
            className="input-field"
            placeholder="Search any song, artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: '3rem', marginBottom: 0 }}
          />
        </div>
      </div>

      {isSearching && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#888', padding: '2rem 0' }}>
          <Loader size={18} className="spin" /> Searching JioSaavn...
        </div>
      )}

      {!isSearching && hasSearched && apiResults.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>
            Results from JioSaavn
            <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 400, marginLeft: '0.5rem' }}>
              ({apiResults.length} songs)
            </span>
          </h3>
          <SongList songs={apiResults} listName={`JioSaavn: ${query}`} />
        </section>
      )}

      {!isSearching && localResults.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>From Your Library</h3>
          <SongList songs={localResults} listName={`Library: ${query}`} />
        </section>
      )}

      {!isSearching && hasSearched && apiResults.length === 0 && localResults.length === 0 && (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>No results found for "{query}"</div>
      )}

      {!query && (
        <section>
          <h3>Quick Search</h3>
          <div className="grid">
            {['Arijit Singh', 'Drake', 'Bollywood', 'Bengali', 'Phonk', 'Rap'].map(tag => (
              <div key={tag} className="card" onClick={() => setQuery(tag)}>
                <div className="card-title">{tag}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
