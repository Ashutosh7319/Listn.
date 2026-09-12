import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Library, Users, PlusCircle } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navItems = [
    { path: '/', icon: <Home />, label: 'Home' },
    { path: '/search', icon: <Search />, label: 'Search' },
    { path: '/library', icon: <Library />, label: 'Library' },
    { path: '/artists', icon: <Users />, label: 'Artists' },
    { path: '/create', icon: <PlusCircle />, label: 'Create' },
  ];

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  return (
    <nav className="bottom-nav glass">
      <div 
        className="nav-indicator" 
        style={{ transform: `translateX(${activeIndex * 100}%)` }} 
      />
      {navItems.map((item) => (
        <NavLink 
          key={item.path}
          to={item.path} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end={item.path === '/'}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
