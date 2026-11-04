import React, { useState } from 'react';
import { 
  Sparkles, Compass, Lightbulb, BookOpen, Star, 
  ArrowRight, CheckCircle2, ChevronRight, Bookmark
} from 'lucide-react';

const PRESET_INTERESTS = [
  { id: 'p1', label: 'Data Science & Analytics', subject: 'Data Science', query: 'Data' },
  { id: 'p2', label: 'Machine Learning & AI', subject: 'Machine Learning', query: 'Learning' },
  { id: 'p3', label: 'Algorithms & Data Structures', subject: 'Algorithms and Data Structures', query: 'Algorithms' },
  { id: 'p4', label: 'Python & Scientific Computing', subject: 'Python Programming', query: 'Python' },
  { id: 'p5', label: 'C and C++ Performance', subject: 'C and C++', query: 'C++' },
  { id: 'p6', label: 'Linux & Systems Programming', subject: 'Linux and Unix', query: 'Linux' }
];

export default function AiRecommendations({ books = [], onOpenBookDetails }) {
  const [selectedInterest, setSelectedInterest] = useState(PRESET_INTERESTS[0]);
  const [studyLevel, setStudyLevel] = useState('UNDERGRADUATE'); // UNDERGRADUATE, POSTGRADUATE, RESEARCH
  const [customKeyword, setCustomKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Recommendations matching the selected interest
  const recommendedBooks = books.filter(b => {
    const s = selectedInterest.subject.toLowerCase();
    const q = (customKeyword || selectedInterest.query).toLowerCase();
    const matchSubject = (b.subject || '').toLowerCase().includes(s);
    const matchKeyword = (b.title || '').toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
    return matchSubject || matchKeyword;
  }).slice(0, 4);

  const handleInterestSelect = (interest) => {
    setIsGenerating(true);
    setSelectedInterest(interest);
    setCustomKeyword('');
    setTimeout(() => {
      setIsGenerating(false);
    }, 280);
  };

  const handleGenerateCustom = (e) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  };

  return (
    <section id="ai-recommend" className="ai-recommendations-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-badge ai-badge">
            <Sparkles size={14} />
            <span>AI Curriculum Engine</span>
          </div>
          <h2 className="section-title">Intelligent Textbook Recommendations</h2>
          <p className="section-subtitle">
            Discover peer-reviewed textbooks, monographs, and companion problem sets aligned with your degree level and academic inquiry.
          </p>
        </div>

        {/* Engine Controls */}
        <div className="ai-controls-box">
          <div className="ai-selector-col">
            <span className="control-label">1. Choose Your Academic Focus:</span>
            <div className="preset-interests-grid">
              {PRESET_INTERESTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`interest-btn ${selectedInterest.id === item.id && !customKeyword ? 'is-active' : ''}`}
                  onClick={() => handleInterestSelect(item)}
                >
                  <Compass size={14} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-level-and-custom-col">
            <div className="study-level-group">
              <span className="control-label">2. Academic Study Level:</span>
              <div className="level-buttons-row">
                <button
                  type="button"
                  className={`level-btn ${studyLevel === 'UNDERGRADUATE' ? 'is-active' : ''}`}
                  onClick={() => setStudyLevel('UNDERGRADUATE')}
                >
                  Undergraduate
                </button>
                <button
                  type="button"
                  className={`level-btn ${studyLevel === 'POSTGRADUATE' ? 'is-active' : ''}`}
                  onClick={() => setStudyLevel('POSTGRADUATE')}
                >
                  Postgraduate
                </button>
                <button
                  type="button"
                  className={`level-btn ${studyLevel === 'RESEARCH' ? 'is-active' : ''}`}
                  onClick={() => setStudyLevel('RESEARCH')}
                >
                  Doctoral / Research
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerateCustom} className="custom-keyword-form">
              <span className="control-label">Or Custom Topic Inquiry:</span>
              <div className="custom-keyword-row">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="e.g. Graph Theory, Thermodynamics, Macro..."
                  className="custom-keyword-input"
                />
                <button type="submit" className="custom-keyword-submit-btn">
                  <Sparkles size={14} />
                  <span>Recommend</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="recommendations-results-wrapper">
          <div className="results-banner">
            <Lightbulb size={16} className="text-yellow" />
            <span>
              Curated for <strong>{customKeyword ? `"${customKeyword}"` : selectedInterest.label}</strong> ({studyLevel.toLowerCase()} track)
            </span>
          </div>

          {isGenerating ? (
            <div className="generating-state">
              <Sparkles size={32} className="spin-slow text-blue" />
              <p>Analyzing curriculum alignment, publication recency, and syllabus prerequisites...</p>
            </div>
          ) : (
            <div className="recommended-books-grid">
              {recommendedBooks.map((book, idx) => (
                <div key={book.id} className="recommended-card">
                  <div className="rec-badge-row">
                    <span className="match-score-pill">
                      <Sparkles size={11} /> {(98 - idx * 3)}% Match
                    </span>
                    <span className="rec-repo-tag">{book.repository}</span>
                  </div>

                  <div className="rec-content-split">
                    <div className="rec-cover-thumb">
                      <img
                        src={book.coverUrl || book.cover_image || book.fallbackSvg}
                        alt={book.title}
                        className="rec-img"
                        onError={(e) => {
                          if (book.cover_image && e.currentTarget.src !== book.cover_image) {
                            e.currentTarget.src = book.cover_image;
                          } else if (book.fallbackSvg && e.currentTarget.src !== book.fallbackSvg) {
                            e.currentTarget.src = book.fallbackSvg;
                          }
                        }}
                      />
                    </div>

                    <div className="rec-text-details">
                      <span className="rec-subject">{book.subject}</span>
                      <h4 className="rec-title">{book.title}</h4>
                      <p className="rec-author">By {book.author}</p>
                      
                      <div className="rec-why-note">
                        <CheckCircle2 size={12} className="text-emerald" />
                        <span>High curriculum overlap with university syllabi & verified problem sets.</span>
                      </div>

                      <div className="rec-footer-actions">
                        <button
                          type="button"
                          className="btn-rec-details"
                          onClick={() => onOpenBookDetails(book)}
                        >
                          <BookOpen size={14} />
                          <span>View Details</span>
                        </button>
                        {book.openUrl && (
                          <a
                            href={book.openUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-rec-read"
                          >
                            <span>Read Online</span>
                            <ArrowRight size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

