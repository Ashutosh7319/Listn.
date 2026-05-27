import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show loading screen for 2 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => onComplete(), 500); // 500ms fade out transition
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: isFading ? 'none' : 'auto'
      }}
    >
      <img 
        src="/Listn.png" 
        alt="Listn. Logo" 
        style={{ width: '150px', height: '150px', marginBottom: '2rem', borderRadius: '20%' }} 
      />
      
      <div className="spinner"></div>

      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
