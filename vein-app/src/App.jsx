import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullPlayer from './components/FullPlayer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import CreatePlaylist from './pages/CreatePlaylist';
import Artists from './pages/Artists';
import { Moon, Sun, User, Download } from 'lucide-react';

function App() {
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('vein_username');
    const savedPic = localStorage.getItem('vein_profile_pic');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowWelcomeModal(true);
    }
    if (savedPic) {
      setProfilePic(savedPic);
    }

    // PWA Install Prompt Listeners
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      localStorage.setItem('vein_username', tempName);
      setShowWelcomeModal(false);
    }
  };

  const handleProfilePicChange = (e) => {
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
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setProfilePic(compressedDataUrl);
          try {
            localStorage.setItem('vein_profile_pic', compressedDataUrl);
          } catch (err) {
            alert("Image is too large to save even after compression. Please use a smaller image.");
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePic = () => {
    setProfilePic(null);
    localStorage.removeItem('vein_profile_pic');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {showInstallPrompt && (
        <div className="install-banner" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--card-bg)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 900,
          border: '1px solid var(--border-color)',
          width: '90%',
          maxWidth: '350px'
        }}>
          <img src="/Listn.png" alt="Icon" style={{width: '28px', height: '28px', borderRadius: '6px'}} />
          <div style={{ flex: 1, lineHeight: '1.2' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Install Listn.</div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>For a better experience</div>
          </div>
          <button className="btn-primary" onClick={handleInstallClick} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Download size={14} /> Install
          </button>
          <button onClick={() => setShowInstallPrompt(false)} style={{ color: '#888', background: 'none', border: 'none', padding: '0 0.2rem' }}>✕</button>
        </div>
      )}

      <header className="app-header" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="/Listn.png" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
          <h1 className="app-title" style={{ margin: 0 }}>Listn.</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="theme-toggle" 
            onClick={() => { setTempName(userName); setShowWelcomeModal(true); }}
            aria-label="Profile"
            style={{ 
              padding: profilePic ? '0' : '0.5rem', 
              overflow: 'hidden',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={24} />
            )}
          </button>
          <button 
            className="theme-toggle" 
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>Welcome to Listn.</h2>
            <p style={{marginBottom: '1rem'}}>Profile Details</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--border-color)', marginBottom: '1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profilePic ? <img src={profilePic} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <User size={40} />}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  Upload
                  <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />
                </label>
                {profilePic && (
                  <button className="action-btn" onClick={handleRemovePic} style={{ color: '#ff4081', fontSize: '0.9rem' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>

            <input 
              type="text" 
              className="input-field" 
              placeholder="Your name" 
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
            />
            <button className="btn-primary" onClick={handleSaveName}>
              Save Profile
            </button>
          </div>
        </div>
      )}

      <main style={{ paddingBottom: '100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/create" element={<CreatePlaylist />} />
        </Routes>
      </main>

      <MiniPlayer onOpenFull={() => setIsFullPlayerOpen(true)} />
      <FullPlayer isOpen={isFullPlayerOpen} onClose={() => setIsFullPlayerOpen(false)} />
      
      <BottomNav />
    </>
  );
}

export default App;
