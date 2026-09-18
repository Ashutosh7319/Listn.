import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Search as SearchIcon, Loader } from 'lucide-react';
import SongList from '../components/SongList';
import { searchSongs } from '../utils/api';

export default function Search() {
  const navigate = useNavigate();
  const { allSongs } = usePlayer();
  const [query, setQuery] = useState('');
  const [apiResults, setApiResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const quickSearchTags = [
    'Bollywood', 'Desi Hip Hop', 'Arijit Singh', 'Shreya Ghoshal', 
    'Punjabi Hits', 'Classical', 'Lofi Chill', 'Workout',
    'Bengali', 'Krsna', 'Retro 90s', 'Indie Pop',
    'Sufi', 'Devotional', 'Romantic', 'Party Anthems'
  ];
  const [quickCovers, setQuickCovers] = useState({});

  useEffect(() => {
    quickSearchTags.forEach(async (tag) => {
      const res = await searchSongs(tag, 1);
      if (res && res[0]) {
        setQuickCovers(prev => ({ ...prev, [tag]: res[0].cover }));
      }
    });
  }, []);

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
          <h3>Browse Categories</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {quickSearchTags.map((tag, idx) => {
              // Generate some random but consistent solid colors for backgrounds
              const colors = ['#ff2d55', '#4facfe', '#34c759', '#ff9500', '#af52de', '#ffcc00'];
              const bgColor = colors[idx % colors.length];

              return (
                <div 
                  key={tag} 
                  className="card" 
                  onClick={() => navigate(`/category/${tag.toLowerCase()}`)}
                  style={{
                    backgroundColor: bgColor,
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)`,
                    minHeight: '100px',
                    padding: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start'
                  }}
                >
                  {quickCovers[tag] && (
                    <img 
                      src={quickCovers[tag]} 
                      alt={tag} 
                      style={{ 
                        position: 'absolute', 
                        right: '-20px', 
                        bottom: '-10px', 
                        width: '80px', 
                        height: '80px', 
                        transform: 'rotate(20deg)', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        borderRadius: '4px',
                        marginBottom: 0
                      }} 
                    />
                  )}
                  <div className="card-title" style={{ color: '#fff', fontSize: '1.1rem', zIndex: 1, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {tag}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
