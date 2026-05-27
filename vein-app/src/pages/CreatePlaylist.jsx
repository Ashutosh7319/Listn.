import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

export default function CreatePlaylist() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const { createPlaylist } = usePlayer();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          setImage(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    const newPlaylist = {
      id: 'pl_' + Date.now(),
      name,
      description,
      image,
      songs: []
    };
    
    createPlaylist(newPlaylist);
    navigate('/library');
  };

  return (
    <div className="container">
      <h2>Create Playlist</h2>
      <p style={{ marginBottom: '2rem' }}>Build your vibe</p>
      
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Playlist name" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        
        <label style={{display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.9rem'}}>Playlist Cover Image (Optional)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          style={{marginBottom: '1rem', width: '100%'}}
        />
        {image && (
          <img src={image} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem'}} />
        )}

        <textarea 
          className="input-field" 
          placeholder="Description (optional)"
          rows="4"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ resize: 'none' }}
        ></textarea>
        
        <button className="btn-primary" onClick={handleCreate}>
          Create Playlist
        </button>
      </div>
    </div>
  );
}
