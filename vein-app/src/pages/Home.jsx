import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { searchSongs } from '../utils/api';
import { Loader, ArrowLeft } from 'lucide-react';

export default function Home() {
  const { allSongs, playSong } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  // Live trending sections from JioSaavn
  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);

  // Cover images for mood/category cards (fetched from API)
  const [cardCovers, setCardCovers] = useState({});

  useEffect(() => {
    const savedName = localStorage.getItem('vein_username');
    if (savedName) setUserName(savedName);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch live trending data from JioSaavn API
    Promise.all([
      searchSongs('Trending Hits 2025', 12),
      searchSongs('Bollywood Hits', 12)
    ]).then(([trendingData, bollywoodData]) => {
      setTrending(trendingData);
      setBollywood(bollywoodData);
      setLiveLoading(false);
    }).catch(() => setLiveLoading(false));

    // Fetch cover images for cards
    const coverQueries = {
      chill: 'Lofi Chill',
      sad: 'Arijit Singh sad',
      party: 'Badshah party',
      focus: 'Study music',
      rap: 'Eminem',
      pop: 'Ed Sheeran',
      indie: 'Prateek Kuhad',
      bengali: 'Arijit Singh Bengali',
      phonk: 'Phonk drift',
      classical: 'Ravi Shankar sitar',
      bollywood: 'Kesariya'
    };

    Object.entries(coverQueries).forEach(([id, q]) => {
      searchSongs(q, 1).then(results => {
        if (results.length > 0) {
          setCardCovers(prev => ({ ...prev, [id]: results[0].cover }));
        }
      });
    });
  }, []);

  // --- Curated mood search queries with specific well-known songs ---
  const moods = [
    {
      id: 'chill',
      label: 'Chill',
      subtitle: 'Lofi & Laid-back Vibes',
      query: 'lofi chill relaxing',
      localKeywords: ['Chill'],
      gradient: 'linear-gradient(135deg, #667eea55, #764ba255)'
    },
    {
      id: 'sad',
      label: 'Sad',
      subtitle: 'Heartbreak & Emotions',
      query: 'sad heartbreak emotional songs',
      localKeywords: ['Sad'],
      gradient: 'linear-gradient(135deg, #3a7bd555, #00d2ff55)'
    },
    {
      id: 'party',
      label: 'Party',
      subtitle: 'Dance Floor Bangers',
      query: 'party dance club hits',
      localKeywords: ['Party'],
      gradient: 'linear-gradient(135deg, #f093fb55, #f5576c55)'
    },
    {
      id: 'focus',
      label: 'Focus',
      subtitle: 'Deep Work & Study',
      query: 'instrumental focus study concentration',
      localKeywords: ['Focus'],
      gradient: 'linear-gradient(135deg, #4facfe55, #00f2fe55)'
    }
  ];

  const categories = [
    { id: 'rap', label: 'Rap / Hip-Hop', subtitle: 'Bars & Beats', query: 'Hip Hop Rap latest', localKeywords: ['Hip-Hop', 'Trap', 'Character Rap'] },
    { id: 'pop', label: 'Pop', subtitle: 'Chart Toppers', query: 'Pop Hits English', localKeywords: ['Pop'] },
    { id: 'indie', label: 'Indie', subtitle: 'Hidden Gems', query: 'Indie music Hindi English', localKeywords: ['Indie'] },
    { id: 'bengali', label: 'Bengali', subtitle: 'Bangla Beats', query: 'Bengali songs popular', localKeywords: ['Bong', 'Rabindra Sangeet'] },
    { id: 'phonk', label: 'Phonk', subtitle: 'Bass & Drift', query: 'Phonk drift bass', localKeywords: ['Phonk'] },
    { id: 'classical', label: 'Classical', subtitle: 'Timeless Ragas', query: 'Indian Classical raag', localKeywords: ['Indian Classical', 'Western Classical'] },
    { id: 'bollywood', label: 'Bollywood', subtitle: 'Hindi Cinema', query: 'Bollywood songs latest 2025', localKeywords: ['Bollywood', 'Hindi'] }
  ];

  const handleCategoryClick = async (cat) => {
    setCategoryLoading(true);
    setSelectedCategory({ ...cat, songs: [] });

    // Fetch 20 from API
    const apiSongs = await searchSongs(cat.query, 20);

    // Filter local songs by genre/mood keywords
    const localKeywords = cat.localKeywords || [];
    const localFiltered = allSongs.filter(s => {
      const genreMatch = localKeywords.some(k => s.genre?.includes(k));
      const moodMatch = s.moods && s.moods.some(m => localKeywords.includes(m));
      return genreMatch || moodMatch;
    });

    // Merge: API songs first, then local songs (deduplicate by title+artist)
    const seen = new Set(apiSongs.map(s => `${s.title.toLowerCase()}-${s.artist.toLowerCase()}`));
    const uniqueLocal = localFiltered.filter(s => {
      const key = `${s.title.toLowerCase()}-${s.artist.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setSelectedCategory({ ...cat, songs: [...apiSongs, ...uniqueLocal] });
    setCategoryLoading(false);
  };

  if (selectedCategory) {
    return (
      <div className="container">
        <button onClick={() => setSelectedCategory(null)} style={{ marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2 style={{ marginBottom: '0.25rem' }}>{selectedCategory.label}</h2>
        {selectedCategory.subtitle && (
          <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>{selectedCategory.subtitle}</p>
        )}
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>
          {selectedCategory.songs.length} songs
        </p>
        {categoryLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#888', padding: '3rem 0' }}>
            <Loader size={18} className="spin" /> Loading {selectedCategory.label} songs...
          </div>
        ) : selectedCategory.songs.length > 0 ? (
          <SongList songs={selectedCategory.songs} listName={selectedCategory.label} />
        ) : (
          <div style={{ textAlign: 'center', color: '#888', padding: '3rem 0' }}>No songs found</div>
        )}
      </div>
    );
  }

  // Recommended: random slice from local library
  const recommendedSongs = allSongs.slice(0, 8);

  // --- Card style helper for Apple Music aesthetic ---
  const cardStyle = (id, gradient) => ({
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: cardCovers[id]
      ? `${gradient || 'linear-gradient(135deg, #00000088, #00000044)'}, url(${cardCovers[id]})`
      : gradient || 'linear-gradient(135deg, var(--card-bg), var(--card-hover))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    textAlign: 'left',
    padding: '1rem',
    border: 'none'
  });

  const cardTextStyle = {
    color: '#fff',
    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: '0'
  };

  const cardSubStyle = {
    color: 'rgba(255,255,255,0.8)',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    fontSize: '0.7rem',
    fontWeight: 400
  };

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>
        {greeting}{userName ? `, ${userName}` : ''}
      </h2>

      {/* Live Trending from JioSaavn */}
      {!liveLoading && trending.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3>🔥 Trending Now</h3>
          <div className="horizontal-scroll">
            {trending.map((song, index) => (
              <div key={song.id} className="card" onClick={() => playSong(song, trending, index)}>
                <img src={song.cover} alt={song.title} />
                <div className="card-title">{song.title}</div>
                <div className="card-subtitle">{song.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!liveLoading && bollywood.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3>🎬 Bollywood Hits</h3>
          <div className="horizontal-scroll">
            {bollywood.map((song, index) => (
              <div key={song.id} className="card" onClick={() => playSong(song, bollywood, index)}>
                <img src={song.cover} alt={song.title} />
                <div className="card-title">{song.title}</div>
                <div className="card-subtitle">{song.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {liveLoading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#888', padding: '1rem 0', marginBottom: '2rem' }}>
          <Loader size={16} className="spin" /> Loading live tracks...
        </div>
      )}

      {/* Moods — Apple Music style cards with album art backgrounds */}
      <section style={{ marginBottom: '3rem' }}>
        <h3>Moods</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {moods.map(mood => (
            <div
              key={mood.id}
              className="card"
              style={cardStyle(mood.id, mood.gradient)}
              onClick={() => handleCategoryClick(mood)}
            >
              <div style={cardTextStyle}>{mood.label}</div>
              <div style={cardSubStyle}>{mood.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended from local library */}
      {recommendedSongs.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3>From Your Library</h3>
          <div className="horizontal-scroll">
            {recommendedSongs.map((song, index) => (
              <div key={song.id || index} className="card" onClick={() => playSong(song, recommendedSongs, index)}>
                <img src={song.cover} alt={song.title} />
                <div className="card-title">{song.title}</div>
                <div className="card-subtitle">{song.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Browse Categories — Apple Music style cards with album art backgrounds */}
      <section style={{ marginBottom: '3rem' }}>
        <h3>Browse Categories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              className="card"
              style={cardStyle(cat.id, 'linear-gradient(135deg, #00000088, #00000044)')}
              onClick={() => handleCategoryClick(cat)}
            >
              <div style={cardTextStyle}>{cat.label}</div>
              <div style={cardSubStyle}>{cat.subtitle}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
