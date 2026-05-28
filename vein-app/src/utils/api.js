const API_BASE = 'https://listn-api.onrender.com/api';

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
  const artist = primaryArtists.map(a => a.name).join(', ') || 'Unknown Artist';

  return {
    id: song.id,
    title: song.name,
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
