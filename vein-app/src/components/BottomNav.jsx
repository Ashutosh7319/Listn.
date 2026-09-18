import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Search, Library, Users, PlusCircle } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const navItems = [
    { path: '/', icon: <Home />, label: 'Home' },
    { path: '/library', icon: <Library />, label: 'Library' },
    { path: '/artists', icon: <Users />, label: 'Artists' },
    { path: '/create', icon: <PlusCircle />, label: 'Create' },
  ];

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsShrunk(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e) => {
    if (isShrunk) {
      e.preventDefault();
      setIsShrunk(false);
      setIsSearchOpen(false);
    }
  };

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      setIsShrunk(true);
      setIsSearchOpen(true);
      navigate('/search');
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (location.pathname === '/search') {
      navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
    } else {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className="bottom-nav-container">
      <nav className={`bottom-nav ${isShrunk ? 'shrunk' : ''}`}>
        <div 
          className="nav-indicator" 
          style={{ 
            display: isShrunk ? 'none' : 'block',
            transform: `translateX(${activeIndex * 100}%)` 
          }} 
        />
        {navItems.map((item, index) => {
          // If shrunk, only show Home (index 0)
          if (isShrunk && index !== 0) return null;
          
          return (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
              onClick={index === 0 ? handleHomeClick : undefined}
            >
              {item.icon}
              {!isShrunk && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      <div className={`floating-search-container ${isSearchOpen ? 'expanded' : ''}`}>
        {isSearchOpen ? (
          <input 
            type="text" 
            placeholder="Search any song, artist..." 
            className="floating-search-input"
            value={queryParam}
            onChange={handleSearchChange}
            autoFocus
          />
        ) : (
          <button className="floating-search-btn" onClick={handleSearchToggle}>
            <Search size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
