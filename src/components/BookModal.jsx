import React from 'react';
import { 
  X, ExternalLink, BookOpen, Star, Calendar, Bookmark, 
  MapPin, CheckCircle, AlertCircle, Share2, Tag, Building2, 
  Layers, Check
} from 'lucide-react';

export default function BookModal({ book, onClose, onBorrowBook }) {
  if (!book) return null;

  const isAvailable = (book.availableCopies || 0) > 0;
  const isLowStock = (book.availableCopies || 0) > 0 && (book.availableCopies || 0) <= 3;
  const availabilityRate = book.totalCopies > 0 
    ? Math.round((book.availableCopies / book.totalCopies) * 100) 
    : 0;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog book-details-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div className="modal-book-layout">
          {/* Left Column: Cover & Quick Actions */}
          <div className="modal-book-cover-col">
            <div className="modal-cover-frame">
              <img
                src={book.coverUrl || book.cover_image || book.fallbackSvg}
                alt={book.title}
                className="modal-cover-img"
                onError={(e) => {
                  if (book.cover_image && e.currentTarget.src !== book.cover_image) {
                    e.currentTarget.src = book.cover_image;
                  } else if (book.fallbackSvg && e.currentTarget.src !== book.fallbackSvg) {
                    e.currentTarget.src = book.fallbackSvg;
                  }
                }}
              />
            </div>

            <div className="modal-cover-badges">
              <div className="modal-badge-item">
                <Tag size={13} />
                <span>{book.subject}</span>
              </div>
              <div className="modal-badge-item">
                <MapPin size={13} />
                <span>Shelf {book.shelf || 'DIGITAL'}</span>
              </div>
            </div>

            {(book.reading_url || book.openUrl) && (
              <a
                href={book.reading_url || book.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-open-external"
              >
                <BookOpen size={16} />
                <span>Read / Download Book</span>
                <ExternalLink size={14} />
              </a>
            )}

            {book.source_url && (
              <a
                href={book.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-open-external"
                style={{ marginTop: '8px', background: 'rgba(201, 193, 124, 0.15)', color: '#C9C17C', borderColor: 'rgba(201, 193, 124, 0.35)' }}
              >
                <ExternalLink size={14} />
                <span>FreeComputerBooks Page</span>
              </a>
            )}
          </div>

          {/* Right Column: Metadata & Syllabus */}
          <div className="modal-book-info-col">
            <div className="modal-header-meta">
              <span className="modal-repo-tag">{book.source_name || book.repository || 'FreeComputerBooks.com'}</span>
              <div className="modal-rating-badge">
                <Star size={13} className="star-icon" fill="currentColor" />
                <span>{book.rating || '4.8'} / 5.0</span>
              </div>
            </div>

            <h2 className="modal-book-title">{book.title}</h2>
            <p className="modal-book-author">By <strong>{book.author}</strong></p>

            {/* Inventory Status Grid */}
            <div className="modal-inventory-grid">
              <div className="inventory-stat-card">
                <span className="stat-label">Access Model</span>
                <span className="stat-val text-green">Open Access</span>
              </div>
              <div className="inventory-stat-card">
                <span className="stat-label">License</span>
                <span className="stat-val text-blue" style={{ fontSize: '13px' }}>{book.license || 'Creative Commons'}</span>
              </div>
              <div className="inventory-stat-card">
                <span className="stat-label">Language</span>
                <span className="stat-val text-cyan">{book.language || 'English'}</span>
              </div>
              <div className="inventory-stat-card">
                <span className="stat-label">Cost</span>
                <span className="stat-val text-emerald">Free eBook</span>
              </div>
            </div>

            {/* Publication Details */}
            <div className="modal-metadata-list">
              <div className="meta-row">
                <span className="meta-key"><Building2 size={13} /> Publisher:</span>
                <span className="meta-value">{book.publisher || 'Not available'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key"><Calendar size={13} /> Published Year:</span>
                <span className="meta-value">{book.year || 'Not available'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key"><Bookmark size={13} /> Edition / Format:</span>
                <span className="meta-value">{book.edition || 'Online Academic Edition'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key"><Layers size={13} /> ISBN:</span>
                <span className="meta-value font-mono">{book.isbn || 'Not available'}</span>
              </div>
            </div>

            {/* Syllabus & Abstract */}
            <div className="modal-description-box">
              <h4 className="desc-heading">Overview & Syllabus Coverage</h4>
              <p className="desc-body">
                {book.description || `Comprehensive textbook covering fundamental theories and advanced applications in ${book.subject}. Aligned with university curriculum requirements and peer-reviewed educational criteria.`}
              </p>
            </div>

            {/* Action Bar */}
            <div className="modal-footer-actions">
              {isAvailable ? (
                <button
                  type="button"
                  className="btn-modal-borrow"
                  onClick={() => onBorrowBook && onBorrowBook(book.id)}
                >
                  <Check size={16} />
                  <span>Borrow / Issue Copy</span>
                </button>
              ) : (
                <button type="button" className="btn-modal-borrow disabled" disabled>
                  <span>All Copies Currently Borrowed</span>
                </button>
              )}
              <button type="button" className="btn-modal-close" onClick={onClose}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

