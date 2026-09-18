const API_BASE = 'https://listn-api.onrender.com/api';

function decodeHtmlEntity(str) {
  if (!str) return '';
  return str.replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#039;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
}

/**
 * Maps a JioSaavn API song object into the Listn. player format.
 */
function mapSong(song) {
  // Pick highest quality image (last in the array = 500x500)
  const images = song.image || [];
  const cover = images.length > 0 ? images[images.length - 1].url : '/Listn.png';

  // Pick highest quality audio (last in the array = 320kbps)
  const downloads = song.downloadUrl || [];
  const src = downloads.length > 0 ? downloads[downloads.length - 1].url : '';

  // Combine primary artist names
  const primaryArtists = song.artists?.primary || [];
  const artist = primaryArtists.map(a => decodeHtmlEntity(a.name)).join(', ') || 'Unknown Artist';

  return {
    id: song.id,
    title: decodeHtmlEntity(song.name),
    artist,
    cover,
    src,
    duration: song.duration || 0,
    language: song.language || '',
    album: song.album?.name || '',
    isLocal: false
  };
}

/**
 * Search for songs on JioSaavn.
 * @param {string} query - Search term
 * @param {number} limit - Max results (default 20)
 * @returns {Promise<Array>} Array of Listn.-formatted song objects
 */
export async function searchSongs(query, limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await res.json();

    if (!data.success || !data.data?.results) return [];

    return data.data.results
      .filter(song => song.downloadUrl && song.downloadUrl.length > 0)
      .map(mapSong);
  } catch (err) {
    console.error('JioSaavn search error:', err);
    return [];
  }
}

export async function searchAlbums(query, limit = 10) {
  try {
    const res = await fetch(`${API_BASE}/search/albums?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await res.json();
    if (!data.success || !data.data?.results) return [];
    return data.data.results.map(album => {
      const images = album.image || [];
      return {
        id: album.id,
        title: decodeHtmlEntity(album.name || album.title),
        artist: decodeHtmlEntity(album.description || ''),
        cover: images.length > 0 ? images[images.length - 1].url : '/Listn.png',
        url: album.url,
        type: 'album'
      };
    });
  } catch (err) {
    console.error('JioSaavn album search error:', err);
    return [];
  }
}

export async function searchPlaylists(query, limit = 10) {
  try {
    const res = await fetch(`${API_BASE}/search/playlists?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await res.json();
    if (!data.success || !data.data?.results) return [];
    return data.data.results.map(playlist => {
      const images = playlist.image || [];
      return {
        id: playlist.id,
        title: decodeHtmlEntity(playlist.name || playlist.title),
        artist: playlist.language ? `${playlist.language} • ${playlist.songCount || 0} songs` : 'Playlist',
        cover: images.length > 0 ? images[images.length - 1].url : '/Listn.png',
        url: playlist.url,
        type: 'playlist'
      };
    });
  } catch (err) {
    console.error('JioSaavn playlist search error:', err);
    return [];
  }
}

export async function fetchLyrics(songId) {
  try {
    const res = await fetch(`${API_BASE}/songs/${songId}/lyrics`);
    const data = await res.json();
    if (data.success && data.data && data.data.lyrics) {
      return decodeHtmlEntity(data.data.lyrics);
    }
    return null;
  } catch (err) {
    console.error('JioSaavn lyrics fetch error:', err);
    return null;
  }
}

export async function getAlbumDetails(albumId) {
  try {
    const res = await fetch(`${API_BASE}/albums?id=${albumId}`);
    const data = await res.json();
    if (data.success && data.data) {
      const d = data.data;
      const images = d.image || [];
      const cover = images.length > 0 ? images[images.length - 1].url : '/Listn.png';
      
      return {
        id: d.id,
        title: decodeHtmlEntity(d.name || d.title),
        subtitle: decodeHtmlEntity(d.primaryArtists || d.description || d.language || ''),
        cover,
        songs: (d.songs || []).filter(song => song.downloadUrl && song.downloadUrl.length > 0).map(mapSong)
      };
    }
    return null;
  } catch (err) {
    console.error('JioSaavn album details error:', err);
    return null;
  }
}

export async function getPlaylistDetails(playlistId) {
  try {
    const res = await fetch(`${API_BASE}/playlists?id=${playlistId}`);
    const data = await res.json();
    if (data.success && data.data) {
      const d = data.data;
      const images = d.image || [];
      const cover = images.length > 0 ? images[images.length - 1].url : '/Listn.png';
      
      return {
        id: d.id,
        title: decodeHtmlEntity(d.name || d.title),
        subtitle: decodeHtmlEntity(d.description || d.subtitle || d.language || ''),
        cover,
        songs: (d.songs || []).filter(song => song.downloadUrl && song.downloadUrl.length > 0).map(mapSong)
      };
    }
    return null;
  } catch (err) {
    console.error('JioSaavn playlist details error:', err);
    return null;
  }
}
