import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Loader } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { searchSongs, searchAlbums, searchPlaylists, getAlbumDetails, getPlaylistDetails } from '../utils/api';
import SongList from '../components/SongList';

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    albums: [],
    playlists: [],
    songs: [],
    newReleases: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [albums, playlists, songs, newReleases] = await Promise.all([
          searchAlbums(id, 8),
          searchPlaylists(id, 10),
          searchSongs(id, 15),
          searchAlbums(`new ${id}`, 8)
        ]);
        
        setData({
          albums,
          playlists,
          songs,
          newReleases
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const decodedId = decodeURIComponent(id);
  const title = decodedId.charAt(0).toUpperCase() + decodedId.slice(1);

  const handlePlayCollection = (collectionId, type) => {
    navigate(`/collection/${type}/${collectionId}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader className="spin" size={32} color="var(--accent-color)" />
      </div>
    );
  }

  // Helper to chunk arrays for grids
  const chunkArray = (arr, size) => {
    const result = [];
    for(let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const playlistChunks = chunkArray(data.playlists, 2); // 2 rows of playlists
  const songChunks = chunkArray(data.songs, 3); // 3 rows of songs

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={18} color="var(--accent-color)" /> Back
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '-1px' }}>
        {title}
      </h1>

      {/* Top Albums - Large Horizontal Scroll */}
      {data.albums.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Essential Albums <ChevronRight size={20} color="#888" />
          </h2>
          <div className="horizontal-scroll hide-scrollbar">
            {data.albums.map(album => (
              <div key={album.id} className="card large-card" onClick={() => handlePlayCollection(album.id, 'album')} style={{ position: 'relative' }}>
                <img src={album.cover} alt={album.title} />
                <div className="card-title">{album.title}</div>
                <div className="card-subtitle">{album.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playlists - 2 Row Horizontal Grid */}
      {data.playlists.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Playlists <ChevronRight size={20} color="#888" />
          </h2>
          <div className="horizontal-grid-scroll hide-scrollbar">
            {playlistChunks.map((col, colIdx) => (
              <div key={colIdx} className="grid-col">
                {col.map(playlist => (
                  <div key={playlist.id} className="card list-card" onClick={() => handlePlayCollection(playlist.id, 'playlist')} style={{ position: 'relative' }}>
                    <img src={playlist.cover} alt={playlist.title} className="list-card-img" />
                    <div className="list-card-info">
                      <div className="card-title" style={{ fontSize: '0.9rem' }}>{playlist.title}</div>
                      <div className="card-subtitle" style={{ fontSize: '0.8rem' }}>{playlist.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best New Songs - 3 Row Horizontal Grid */}
      {data.songs.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Best New Songs <ChevronRight size={20} color="#888" />
          </h2>
          <div className="horizontal-grid-scroll hide-scrollbar">
            {songChunks.map((col, colIdx) => (
              <div key={colIdx} className="grid-col">
                {col.map((song, idx) => (
                  <div key={song.id} className="card list-card list-card-song" onClick={() => playSong(song, data.songs, colIdx * 3 + idx)}>
                    <img src={song.cover} alt={song.title} className="list-card-img" />
                    <div className="list-card-info">
                      <div className="card-title" style={{ fontSize: '0.9rem' }}>{song.title}</div>
                      <div className="card-subtitle" style={{ fontSize: '0.8rem' }}>{song.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {data.newReleases.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            New Releases <ChevronRight size={20} color="#888" />
          </h2>
          <div className="horizontal-scroll hide-scrollbar">
            {data.newReleases.map(album => (
              <div key={album.id} className="card" onClick={() => handlePlayCollection(album.id, 'album')} style={{ position: 'relative' }}>
                <img src={album.cover} alt={album.title} />
                <div className="card-title">{album.title}</div>
                <div className="card-subtitle">{album.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
