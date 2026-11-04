import React, { useState } from 'react';
import GridMotion from './GridMotion';
import { textbookCovers } from '../data/textbookCovers';
import { Search, BookOpen, Layers, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HeroSection({ searchQuery, setSearchQuery, onSearchSubmit, totalBooks = 700 }) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(localSearch);
    }
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    }
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const popularTopics = [
    'Data Science',
    'Machine Learning',
    'Algorithms and Data Structures',
    'Python Programming',
    'Artificial Intelligence',
    'Linux and Unix'
  ];

  const handleTopicClick = (topic) => {
    setLocalSearch(topic);
    if (setSearchQuery) {
      setSearchQuery(topic);
    }
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* 1. GridMotion Animated Background */}
      <GridMotion
        items={textbookCovers}
        rows={4}
        aspectRatio={0.75}
        gap={14}
        radius={12}
        angle={-8}
        tilt={0}
        speed={18}
        direction="alternate"
        parallax={0.3}
        spotlight={0.35}
        dim={theme === 'light' ? 0.25 : 0.55}
        fade={0.65}
        grayscale={false}
        theme={theme}
      />

      {/* 2. Dark Navy Gradient Overlay for Text Readability & Professional Contrast */}
      <div className="hero-navy-overlay" />

      {/* 3. Hero Foreground Content (Positioned in front with z-index) */}
      <div className="hero-content-wrapper">
        <div className="hero-badge-pill">
          <Sparkles size={14} className="badge-sparkle-icon" />
          <span>Next-Generation Academic Digital Library & Inventory Analytics</span>
        </div>

        {/* Main Heading as requested */}
        <h1 className="hero-heading">
          Discover Knowledge. <br className="hero-br" />
          <span className="hero-heading-gradient">Explore Books.</span> <br className="hero-br" />
          Learn Without Limits.
        </h1>

        {/* Description as requested */}
        <p className="hero-description">
          Explore thousands of academic textbooks, open educational resources, and digital learning materials in one place.
        </p>

        {/* Functional Search Bar */}
        <form onSubmit={handleSubmit} className="hero-search-form" role="search">
          <div className="search-input-wrapper">
            <Search size={22} className="search-icon-svg" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search textbooks, subjects, authors, or topics..."
              className="hero-search-input"
              aria-label="Search textbooks, subjects, authors, or topics"
            />
            {localSearch && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setLocalSearch('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
            <button type="submit" className="hero-search-submit-btn">
              <span>Search Library</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </form>

        {/* Popular Quick Topics */}
        <div className="hero-topics-row">
          <span className="topics-label">Trending Curricula:</span>
          <div className="topics-pills-list">
            {popularTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="topic-pill-btn"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Working Navigation Buttons as requested */}
        <div className="hero-buttons-row">
          <a href="#explore" className="btn-hero-primary">
            <BookOpen size={18} />
            <span>Explore Books</span>
          </a>
          <a href="#categories" className="btn-hero-secondary">
            <Layers size={18} />
            <span>Browse Categories</span>
          </a>
        </div>

        {/* Key Features Highlights */}
        <div className="hero-features-strip">
          <div className="feature-item">
            <CheckCircle2 size={16} className="feature-check" />
            <span>17 Academic Subject Disciplines</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={16} className="feature-check" />
            <span>Verified Open Access Repositories</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={16} className="feature-check" />
            <span>Python & Plotly Inventory Analytics</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={16} className="feature-check" />
            <span>Real-Time Copy Availability & Shelf Location</span>
          </div>
        </div>
      </div>
    </section>
  );
}

