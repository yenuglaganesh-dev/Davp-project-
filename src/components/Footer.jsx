import React from 'react';
import { BookOpen, ExternalLink, Heart, Shield, Globe, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      <div className="section-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="brand-logo-icon">
                <BookOpen size={20} />
              </div>
              <span className="brand-title">DAVP<span className="brand-highlight">Library</span></span>
            </div>
            <p className="footer-about-text">
              An institutional digital library management system and exploratory inventory analytics dashboard. Dedicated to making academic textbooks and open educational resources universally accessible.
            </p>
            <div className="footer-license-note">
              <Shield size={14} className="text-blue" />
              <span>Open Access & Creative Commons Licensed Textbooks</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#explore">Explore Textbooks</a></li>
              <li><a href="#categories">Academic Disciplines</a></li>
              <li><a href="#repositories">Digital Repositories</a></li>
              <li><a href="#analytics">Inventory Analytics</a></li>
              <li><a href="#ai-recommend">AI Recommendations</a></li>
              <li><a href="#about">About Project</a></li>
            </ul>
          </div>

          {/* Open Educational Resources */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Open Educational Platforms</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://openstax.org" target="_blank" rel="noopener noreferrer">
                  OpenStax Textbooks <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer">
                  Project Gutenberg <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">
                  Open Library Archive <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.doabooks.org" target="_blank" rel="noopener noreferrer">
                  DOAB Monographs <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://archive.org" target="_blank" rel="noopener noreferrer">
                  Internet Archive <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://ndl.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">
                  NDLI National Portal <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Disciplines */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Curricula</h4>
            <ul className="footer-links-list">
              <li><a href="#categories">Computer Science & AI</a></li>
              <li><a href="#categories">Mathematics & Statistics</a></li>
              <li><a href="#categories">Physics & Chemistry</a></li>
              <li><a href="#categories">Engineering & GIS</a></li>
              <li><a href="#categories">Business & Economics</a></li>
              <li><a href="#categories">Environmental Science</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} DAVP Academic Library & Inventory Analytics. Open Educational Resources project.
          </p>

          <button type="button" className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}

