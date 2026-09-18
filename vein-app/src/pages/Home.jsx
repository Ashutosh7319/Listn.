import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { searchSongs } from '../utils/api';
import { classicQueries, hindiQueries, bengaliQueries, classicalQueries, rapQueries, englishQueries, chillQueries, sadQueries, partyQueries, focusQueries } from '../utils/playlists';
import { Loader, ArrowLeft, TrendingUp, Film } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { allSongs, playSong } = usePlayer();
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
      searchSongs('Latest Bengali Songs 2025', 12),
      searchSongs('Latest Hindi Songs 2025', 12)
    ]).then(([trendingData, bollywoodData]) => {
      setTrending(trendingData);
      setBollywood(bollywoodData);
      setLiveLoading(false);
    }).catch(() => setLiveLoading(false));

    // Fetch cover images for cards using a random track from their curated playlists
    const getRandom = (arr) => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : '';
    
    const coverQueries = {
      chill: getRandom(chillQueries),
      sad: getRandom(sadQueries),
      party: getRandom(partyQueries),
      focus: getRandom(focusQueries),
      rap: getRandom(rapQueries),
      classics: getRandom(classicQueries),
      english: getRandom(englishQueries),
      bengali: getRandom(bengaliQueries),
      classical: getRandom(classicalQueries),
      hindi: getRandom(hindiQueries)
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
      queries: chillQueries,
      excludeLocal: true,
      gradient: 'linear-gradient(135deg, #667eea55, #764ba255)'
    },
    {
      id: 'sad',
      label: 'Sad',
      subtitle: 'Heartbreak & Emotions',
      queries: sadQueries,
      excludeLocal: true,
      gradient: 'linear-gradient(135deg, #3a7bd555, #00d2ff55)'
    },
    {
      id: 'party',
      label: 'Party',
      subtitle: 'Dance Floor Bangers',
      queries: partyQueries,
      excludeLocal: true,
      gradient: 'linear-gradient(135deg, #f093fb55, #f5576c55)'
    },
    {
      id: 'focus',
      label: 'Focus',
      subtitle: 'Deep Work & Study',
      queries: focusQueries,
      excludeLocal: true,
      gradient: 'linear-gradient(135deg, #4facfe55, #00f2fe55)'
    }
  ];

  const categories = [
    { id: 'rap', label: 'Desi Hip Hop', subtitle: 'Bars & Beats', queries: rapQueries, excludeLocal: true },
    { id: 'classics', label: 'Old Classics', subtitle: "80's & 90's Bollywood", queries: classicQueries, excludeLocal: true },
    { id: 'english', label: 'English Songs', subtitle: 'Global Hits', queries: englishQueries, language: 'English' },
    { id: 'bengali', label: 'Bengali', subtitle: 'Bangla Beats', queries: bengaliQueries, excludeLocal: true },
    { id: 'classical', label: 'Classical', subtitle: 'Timeless Ragas', queries: classicalQueries, excludeLocal: true },
    { id: 'hindi', label: 'Hindi Songs', subtitle: 'Latest & Classics', queries: hindiQueries, excludeLocal: true }
  ];

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat.id}`);
  };

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
          <h3><TrendingUp size={20} color="var(--accent-color)" style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Trending Bengali</h3>
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
          <h3><Film size={20} color="var(--accent-color)" style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Trending Hindi</h3>
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
          <h3>From the creators Playlist</h3>
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

      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#888', letterSpacing: '0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        Created by <a href="https://priyanshu-s3jh.onrender.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>Priyanshu Saha</a>
      </div>
    </div>
  );
}
