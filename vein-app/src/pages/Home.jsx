import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { Music, Mic2, Disc3, Radio, Coffee, Wind, Flame, Brain, Users } from 'lucide-react';

export default function Home() {
  const { allSongs, playSong } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('vein_username');
    if (savedName) setUserName(savedName);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const categories = [
    { id: 'rap', label: 'Rap / Hip-Hop', icon: <Mic2 />, keywords: ['Hip-Hop', 'Trap', 'Character Rap'] },
    { id: 'pop', label: 'Pop', icon: <Flame />, keywords: ['Pop'] },
    { id: 'indie', label: 'Indie', icon: <Disc3 />, keywords: ['Indie'] },
    { id: 'bengali', label: 'Bengali', icon: <Users />, keywords: ['Bong', 'Rabindra Sangeet'] },
    { id: 'phonk', label: 'Phonk', icon: <Radio />, keywords: ['Phonk'] },
    { id: 'classical', label: 'Classical', icon: <Music />, keywords: ['Indian Classical', 'Western Classical'] },
    { id: 'qawwali', label: 'Qawwali', icon: <Wind />, keywords: ['Qawwali'] }
  ];

  const moods = [
    { id: 'chill', label: 'Chill', icon: <Coffee />, keywords: ['Chill'] },
    { id: 'sad', label: 'Sad', icon: <Wind />, keywords: ['Sad'] },
    { id: 'party', label: 'Party', icon: <Flame />, keywords: ['Party'] },
    { id: 'focus', label: 'Focus', icon: <Brain />, keywords: ['Focus'] }
  ];

  const handleCategoryClick = (cat, type) => {
    let filtered = [];
    if (type === 'mood') {
      filtered = allSongs.filter(s => s.moods && s.moods.some(m => cat.keywords.includes(m)));
    } else {
      filtered = allSongs.filter(s => cat.keywords.includes(s.genre));
    }
    setSelectedCategory({ ...cat, songs: filtered });
  };

  if (selectedCategory) {
    return (
      <div className="container">
        <button onClick={() => setSelectedCategory(null)} style={{ marginBottom: '1rem', fontWeight: 600 }}>
          ← Back
        </button>
        <h2>{selectedCategory.label}</h2>
        <SongList songs={selectedCategory.songs} listName={selectedCategory.label} />
      </div>
    );
  }

  // Recommended: just a random slice or first 8 for demo
  const recommendedSongs = allSongs.slice(0, 8);

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>
        {greeting}{userName ? `, ${userName}` : ''}
      </h2>

      <section style={{ marginBottom: '3rem' }}>
        <h3>Moods</h3>
        <div className="horizontal-scroll">
          {moods.map(mood => (
            <div key={mood.id} className="card" onClick={() => handleCategoryClick(mood, 'mood')}>
              <div style={{ padding: '1.5rem', marginBottom: '0.5rem', backgroundColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-color)' }}>
                {mood.icon}
              </div>
              <div className="card-title">{mood.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3>Recommended for You</h3>
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

      <section style={{ marginBottom: '3rem' }}>
        <h3>Browse Categories</h3>
        <div className="grid">
          {categories.map(cat => (
            <div key={cat.id} className="card" onClick={() => handleCategoryClick(cat, 'genre')}>
              <div style={{ padding: '2rem', marginBottom: '1rem', backgroundColor: 'var(--border-color)', borderRadius: '50%', color: 'var(--text-color)' }}>
                {cat.icon}
              </div>
              <div className="card-title">{cat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
