import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Users, PlusCircle } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home />
        <span>Home</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search />
        <span>Search</span>
      </NavLink>
      <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Library />
        <span>Library</span>
      </NavLink>
      <NavLink to="/artists" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users />
        <span>Artists</span>
      </NavLink>
      <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PlusCircle />
        <span>Create</span>
      </NavLink>
    </nav>
  );
}
