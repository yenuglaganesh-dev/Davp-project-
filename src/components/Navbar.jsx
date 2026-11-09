import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, BarChart3, PlusCircle, User, Menu, X, 
  ShieldCheck, GraduationCap, LogIn, Users, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import cutmLogo from '../assets/cutm-logo.png';

export default function Navbar({ 
  onOpenAddBook, 
  onOpenSearch, 
  onOpenProfile, 
  onOpenLogin, 
  onOpenStudentManagement,
  bookCount = 0 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, isStudent, isAuthenticated, triggerAccessDenied } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: null },
    { name: 'Explore Books', href: '#explore', icon: null },
    { name: 'Categories', href: '#categories', icon: null },
    { name: 'Analytics', href: '#analytics', icon: <BarChart3 size={15} /> },
    { name: 'About', href: '#about', icon: null }
  ];

  const handleProfileClick = () => {
    if (!isAdmin) {
      triggerAccessDenied('Institutional User Profile', 'Institutional User Profile is strictly reserved for authenticated administrators.');
      return;
    }
    onOpenProfile();
  };

  return (
    <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#home" className="navbar-brand">
          <div className="brand-logo-icon">
            <img src={cutmLogo} alt="CUTM Logo" className="brand-logo-img" style={{height: '24px', width: 'auto'}} />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">Central <span className="brand-title-accent">Textbook Library</span></span>
            <span className="brand-subtitle">Academic Digital Repository & Analytics</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-only">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.icon && <span className="nav-link-icon">{link.icon}</span>}
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="navbar-actions desktop-only">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="action-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber" /> : <Moon size={16} className="text-blue" />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <button 
            type="button" 
            className="action-btn search-trigger-btn"
            onClick={onOpenSearch}
            title="Search catalog"
          >
            <Search size={16} />
            <span className="btn-text">Quick Search</span>
          </button>

          {/* 1. Add Book: ONLY VISIBLE TO AUTHENTICATED ADMINISTRATORS */}
          {isAdmin && (
            <button 
              type="button" 
              className="action-btn primary-add-btn"
              onClick={onOpenAddBook}
              title="Add new textbook to catalog (Admin Privileges)"
            >
              <PlusCircle size={16} />
              <span>Add Book</span>
            </button>
          )}

          {/* 2. Student Management: ONLY VISIBLE TO AUTHENTICATED ADMINISTRATORS */}
          {isAdmin && (
            <button
              type="button"
              className="action-btn outline-btn"
              onClick={onOpenStudentManagement}
              title="Student Management & Excel Login Records (Admin Only)"
            >
              <Users size={15} />
              <span>Students</span>
            </button>
          )}

          {/* 3. Institutional User Profile: VISIBLE ONLY TO ADMIN */}
          {isAdmin ? (
            <button 
              type="button" 
              className="user-profile-badge is-admin"
              onClick={handleProfileClick}
              title="Institutional User Profile (Admin Only)"
            >
              <div className="avatar-circle admin-avatar">
                <ShieldCheck size={14} />
              </div>
              <div className="profile-text">
                <span className="profile-name">{user?.name ? user.name.split(' ')[0] : 'Admin'}</span>
                <span className="profile-role text-emerald">
                  <ShieldCheck size={11} className="role-check" /> Admin Access
                </span>
              </div>
            </button>
          ) : isAuthenticated ? (
            // Authenticated Student Scholar:
            // Institutional User Profile is COMPLETELY HIDDEN.
            <button 
              type="button" 
              className="user-profile-badge non-admin"
              onClick={onOpenLogin}
              title={`Logged in as ${user.name} (Student Scholar)`}
            >
              <div className="avatar-circle student-avatar">
                <GraduationCap size={14} />
              </div>
              <div className="profile-text">
                <span className="profile-name">{user.name.split(' ')[0]}</span>
                <span className="profile-role text-blue">
                  STUDENT
                </span>
              </div>
            </button>
          ) : (
            // Guest / Unauthenticated:
            // Institutional User Profile is COMPLETELY HIDDEN.
            <button 
              type="button" 
              className="action-btn outline-btn"
              onClick={onOpenLogin}
              title="Sign in with University ID"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button 
          type="button" 
          className="mobile-hamburger-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer mobile-only">
          <nav className="mobile-links-list">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </nav>
          <div className="mobile-drawer-actions">
            <button
              type="button"
              className="action-btn outline-btn full-width"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            {isAdmin && (
              <button 
                type="button" 
                className="action-btn primary-add-btn full-width"
                onClick={() => { setMobileMenuOpen(false); onOpenAddBook(); }}
              >
                <PlusCircle size={16} />
                <span>Add Textbook (Admin)</span>
              </button>
            )}

            {isAdmin && (
              <button 
                type="button" 
                className="action-btn outline-btn full-width"
                onClick={() => { setMobileMenuOpen(false); onOpenStudentManagement && onOpenStudentManagement(); }}
              >
                <Users size={16} />
                <span>Student Management & Excel Log</span>
              </button>
            )}

            {isAdmin && (
              <button 
                type="button" 
                className="action-btn outline-btn full-width"
                onClick={() => { setMobileMenuOpen(false); handleProfileClick(); }}
              >
                <ShieldCheck size={16} />
                <span>Institutional User Profile</span>
              </button>
            )}

            <button 
              type="button" 
              className="action-btn outline-btn full-width"
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
            >
              <User size={16} />
              <span>{isAuthenticated ? `Switch Account (${user.role})` : 'Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
