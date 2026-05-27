import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getAudio } from '../utils/db';

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [allSongs, setAllSongs] = useState([]);

  const audioRef = useRef(new Audio());

  // Liked Songs & Playlists State
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('vein_liked')) || [];
    setLikedSongs(savedLikes);
    const savedPlaylists = JSON.parse(localStorage.getItem('vein_playlists')) || [];
    setPlaylists(savedPlaylists);

    // Fetch all songs on mount
    fetch('/songs.json')
      .then(res => res.json())
      .then(data => {
        setAllSongs(data);
      })
      .catch(err => console.error("Error loading songs:", err));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.8;

    const updateTime = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextSong();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [queue, queueIndex, isShuffle]); // Re-bind handleEnded so it has latest state

  const setAudioSource = async (song) => {
    if (song.isLocal) {
      try {
        const blob = await getAudio(song.src);
        if (blob) {
          audioRef.current.src = URL.createObjectURL(blob);
        } else {
          console.error("Local audio not found");
        }
      } catch (e) {
        console.error("Failed to load local audio", e);
      }
    } else {
      audioRef.current.src = song.src;
    }
    setIsPlaying(true);
    audioRef.current.play().catch(e => console.log('Playback blocked', e));
  };

  const playSong = (song, newQueue = null, index = 0) => {
    if (newQueue) {
      setQueue(newQueue);
      setOriginalQueue(newQueue);
      setQueueIndex(index);
    } else {
      const idx = queue.findIndex(s => s.src === song.src);
      if (idx !== -1) setQueueIndex(idx);
    }
    
    setCurrentSong(song);
    setAudioSource(song);
  };

  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'VEIN',
        artwork: [
          { src: currentSong.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevSong());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
    }
  }, [currentSong, queue, queueIndex, isShuffle]);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Playback blocked', e));
    }
  };

  const nextSong = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) nextIdx = 0;
    
    setQueueIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setAudioSource(queue[nextIdx]);
  };

  const prevSong = () => {
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    
    setQueueIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setAudioSource(queue[prevIdx]);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      if (currentSong) {
        setQueueIndex(shuffled.findIndex(s => s.src === currentSong.src));
      }
    } else {
      setQueue(originalQueue);
      if (currentSong) {
        setQueueIndex(originalQueue.findIndex(s => s.src === currentSong.src));
      }
    }
  };

  const toggleLike = (song) => {
    let newLikes;
    if (likedSongs.some(s => s.id === song.id || s.src === song.src)) {
      newLikes = likedSongs.filter(s => s.id !== song.id && s.src !== song.src);
    } else {
      newLikes = [...likedSongs, song];
    }
    setLikedSongs(newLikes);
    localStorage.setItem('vein_liked', JSON.stringify(newLikes));
  };

  const addToPlaylist = (song, playlistId) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.songs.some(s => s.src === song.src)) {
          return { ...pl, songs: [...pl.songs, song] };
        }
      }
      return pl;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem('vein_playlists', JSON.stringify(updatedPlaylists));
  };

  const removeFromPlaylist = (songId, playlistId) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, songs: pl.songs.filter(s => s.id !== songId) };
      }
      return pl;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem('vein_playlists', JSON.stringify(updatedPlaylists));
  };

  const createPlaylist = (newPlaylist) => {
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('vein_playlists', JSON.stringify(updated));
  };

  const deletePlaylist = (playlistId) => {
    const updated = playlists.filter(pl => pl.id !== playlistId);
    setPlaylists(updated);
    localStorage.setItem('vein_playlists', JSON.stringify(updated));
  };

  return (
    <PlayerContext.Provider
      value={{
        allSongs,
        currentSong,
        isPlaying,
        progress,
        duration,
        queue,
        queueIndex,
        isShuffle,
        likedSongs,
        playlists,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        toggleShuffle,
        toggleLike,
        addToPlaylist,
        removeFromPlaylist,
        createPlaylist,
        deletePlaylist
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
