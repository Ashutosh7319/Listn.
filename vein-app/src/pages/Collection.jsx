import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumDetails, getPlaylistDetails } from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/SongList';
import { Play, ArrowLeft, Loader } from 'lucide-react';

export default function Collection() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let data = null;
      if (type === 'album') {
        data = await getAlbumDetails(id);
      } else if (type === 'playlist') {
        data = await getPlaylistDetails(id);
      }
      setCollection(data);
      setLoading(false);
    }
    loadData();
  }, [type, id]);

  const handlePlayAll = () => {
    if (collection?.songs?.length > 0) {
      playSong(collection.songs[0], collection.songs, 0);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader className="spin" size={32} color="var(--accent-color)" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container">
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} color="var(--accent-color)" /> Back
        </button>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
          Collection not found.
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page pb-safe" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '120px' }}>
      {/* Blurred Background */}
      <div className="collection-bg" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        backgroundImage: `url(${collection.cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(50px) brightness(0.6)',
        transform: 'scale(1.2)',
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
      }} />

      <div className="container" style={{ paddingTop: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          <ArrowLeft size={18} color="var(--accent-color)" /> Back
        </button>

        <div className="collection-header" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <img 
            src={collection.cover} 
            alt={collection.title} 
            style={{ 
              width: '240px', 
              height: '240px', 
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              marginBottom: '1.5rem'
            }} 
          />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {collection.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {collection.subtitle}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {collection.songs.length} songs
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%', maxWidth: '300px' }}>
            <button 
              onClick={handlePlayAll}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Play size={20} fill="currentColor" /> Play All
            </button>
          </div>
        </div>

        <SongList songs={collection.songs} listName={collection.title} />
      </div>
    </div>
  );
}
