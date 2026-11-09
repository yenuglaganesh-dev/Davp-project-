import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, BookOpen, 
  ExternalLink, Download, Upload, Plus, Eye, Edit3, Trash2, 
  CheckCircle, AlertTriangle, XCircle, Star, Sparkles, MapPin, Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DriftWall from './DriftWall';

export default function FeaturedTextbooks({
  books = [],
  searchQuery = '',
  setSearchQuery,
  selectedSubject = '',
  setSelectedSubject,
  onOpenBookDetails,
  onOpenEditBook,
  onOpenAddBook,
  onDeleteBook,
  onExportCsv,
  onImportCsv
}) {
  const { isAdmin, hasPermission, triggerAccessDenied } = useAuth();
  const { theme } = useTheme();
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // ALL, AVAILABLE, LOW_STOCK
  const [sortBy, setSortBy] = useState('FEATURED'); // FEATURED, YEAR_DESC, TITLE_ASC, PRICE_ASC, RATING_DESC
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // All unique subjects
  const allSubjects = useMemo(() => {
    const set = new Set(books.map(b => b.subject).filter(Boolean));
    return Array.from(set).sort();
  }, [books]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (b.title || '').toLowerCase().includes(q);
        const matchAuthor = (b.author || '').toLowerCase().includes(q);
        const matchSubject = (b.subject || '').toLowerCase().includes(q);
        const matchPublisher = (b.publisher || '').toLowerCase().includes(q);
        const matchIsbn = (b.isbn || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchSubject && !matchPublisher && !matchIsbn) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject && selectedSubject !== 'ALL') {
        if ((b.subject || '').toLowerCase() !== selectedSubject.toLowerCase()) {
          return false;
        }
      }

      // Availability filter
      if (availabilityFilter === 'AVAILABLE') {
        if ((b.availableCopies || 0) <= 0) return false;
      } else if (availabilityFilter === 'LOW_STOCK') {
        if ((b.availableCopies || 0) > 3 || (b.availableCopies || 0) === 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'YEAR_DESC') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'TITLE_ASC') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'PRICE_ASC') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'RATING_DESC') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      return 0; // FEATURED
    });
  }, [books, searchQuery, selectedSubject, availabilityFilter, sortBy]);

  const displayedBooks = filteredBooks.slice(0, itemsPerPage);

  // Device-based responsive configuration for 3D DriftWall
  const getDeviceDriftConfig = () => {
    if (typeof window === 'undefined') {
      return { columns: 5, width: 190, height: 250, tilt: 12, turn: -10, lift: 55, gap: 18, depth: 100 };
    }
    const w = window.innerWidth;
    if (w < 480) {
      // Mobile phones (iPhone, Galaxy, Pixel)
      return { columns: 2, width: 115, height: 155, tilt: 4, turn: -2, lift: 18, gap: 10, depth: 30 };
    }
    if (w < 768) {
      // Large phones / small tablets
      return { columns: 3, width: 135, height: 180, tilt: 7, turn: -4, lift: 28, gap: 14, depth: 55 };
    }
    if (w < 1024) {
      // Tablets / iPad / small laptops
      return { columns: 4, width: 165, height: 220, tilt: 10, turn: -8, lift: 42, gap: 16, depth: 80 };
    }
    // Desktop monitors
    return { columns: 5, width: 190, height: 250, tilt: 12, turn: -10, lift: 55, gap: 18, depth: 100 };
  };

  const [driftConfig, setDriftConfig] = useState(getDeviceDriftConfig);

  useEffect(() => {
    const handleResize = () => {
      setDriftConfig(getDeviceDriftConfig());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamically populated DriftWall items from genuine library books in database
  const driftWallItems = useMemo(() => {
    return books
      .filter((book) => book.coverUrl || book.cover_image || book.localCover)
      .map((book) => ({
        image: book.coverUrl || book.localCover || book.cover_image,
        title: book.title,
        author: book.author,
        subject: book.subject || book.category,
        href: book.reading_url || book.openUrl || book.source_url,
        fallback: book.fallbackSvg,
        book
      }));
  }, [books]);

  const handleClearFilters = () => {
    if (setSearchQuery) setSearchQuery('');
    if (setSelectedSubject) setSelectedSubject('');
    setAvailabilityFilter('ALL');
    setSortBy('FEATURED');
  };

  // Protected Admin Actions with Guard
  const handleProtectedAdd = () => {
    if (!isAdmin) {
      triggerAccessDenied('Administrative Catalog Curation (Add Textbook)', 'Only users with the administrator role can add new textbooks to the catalog.');
      return;
    }
    onOpenAddBook();
  };

  const handleProtectedEdit = (book) => {
    if (!isAdmin) {
      triggerAccessDenied('Administrative Catalog Curation (Edit Textbook)', 'Only users with the administrator role can modify textbook records.');
      return;
    }
    onOpenEditBook(book);
  };

  const handleProtectedDelete = (bookId) => {
    if (!isAdmin) {
      triggerAccessDenied('Administrative Catalog Curation (Delete Textbook)', 'Only users with the administrator role can delete records from the catalog.');
      return;
    }
    onDeleteBook(bookId);
  };

  const handleProtectedExport = () => {
    if (!isAdmin && !hasPermission('admin:export_analytics')) {
      triggerAccessDenied('Institutional Analytics & Catalog Export', 'Catalog data export is restricted to authorized administrators.');
      return;
    }
    onExportCsv();
  };

  const handleProtectedImport = (e) => {
    if (!isAdmin && !hasPermission('admin:import_dataset')) {
      e.target.value = '';
      triggerAccessDenied('Direct Dataset Ingestion (Import)', 'Direct dataset ingestion is restricted to authorized administrators.');
      return;
    }
    onImportCsv(e);
  };

  return (
    <section id="explore" className="explore-section">
      <div className="section-container">
        {/* 1. React Bits DriftWall Component: Main Visual Feature */}
        <div className="driftwall-showcase-section">
          <div className="driftwall-header-block">
            <div className="section-badge">
              <Sparkles size={14} />
              <span>Interactive 3D Textbook DriftWall</span>
            </div>
            <h2 className="driftwall-heading">Explore Our Digital Library</h2>
            <p className="driftwall-subtitle">
              Discover academic textbooks, programming resources, technical references and open educational materials.
            </p>
          </div>

          <div className="driftwall-frame">
            <DriftWall
              items={driftWallItems}
              columns={driftConfig.columns}
              tileWidth={driftConfig.width}
              tileHeight={driftConfig.height}
              gap={driftConfig.gap}
              radius={10}
              tilt={driftConfig.tilt}
              turn={driftConfig.turn}
              roll={0}
              perspective={1200}
              depth={driftConfig.depth}
              speed={28}
              direction="up"
              variance={0.35}
              parallax={0.35}
              pauseOnHover={false}
              lift={driftConfig.lift}
              fade={0.55}
              dim={0.7}
              grayscale={false}
              overlayColor={theme === 'dark' ? 'rgba(18, 18, 18, 0.85)' : '#F0FAF2'}
              onTileClick={(book) => onOpenBookDetails(book)}
            />
          </div>

          <div className="driftwall-guide-pill">
            <BookOpen size={14} style={{ color: 'var(--color-primary)' }} />
            <span>Click any moving textbook tile above to open verified book details, syllabus & direct reading access</span>
          </div>
        </div>

        {/* 2. Existing Searchable Book Catalogue Header */}
        <div className="explore-header-row">
          <div>
            <div className="section-badge">
              <BookOpen size={14} />
              <span>Catalog Explorer</span>
            </div>
            <h2 className="section-title">Explore Academic Textbooks</h2>
            <p className="section-subtitle">
              Browse, search, and explore our comprehensive inventory of peer-reviewed digital textbooks and open learning resources.
            </p>
          </div>

          {/* Admin-only catalog actions: HIDDEN FROM NON-ADMIN USERS */}
          {isAdmin && (
            <div className="explore-header-actions">
              <button
                type="button"
                className="action-btn outline-btn"
                onClick={handleProtectedExport}
                title="Export catalog to CSV (Admin Privileges)"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
              <label className="action-btn outline-btn cursor-pointer" title="Import CSV or JSON dataset (Admin Privileges)">
                <Upload size={16} />
                <span>Import Data</span>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleProtectedImport}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                type="button"
                className="action-btn primary-add-btn"
                onClick={handleProtectedAdd}
                title="Add a new textbook record (Admin Privileges)"
              >
                <Plus size={16} />
                <span>Add Textbook</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="filters-controls-panel">
          {/* Search Input */}
          <div className="filter-search-box">
            <Search size={18} className="search-box-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, subject, ISBN, publisher..."
              className="filter-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          {/* Subject Dropdown */}
          <div className="filter-dropdown-box">
            <Filter size={16} className="dropdown-icon" />
            <select
              value={selectedSubject || 'ALL'}
              onChange={(e) => setSelectedSubject(e.target.value === 'ALL' ? '' : e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Subjects ({allSubjects.length})</option>
              {allSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="filter-dropdown-box">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Stock: All Copies</option>
              <option value="AVAILABLE">Available on Shelf (&gt;0)</option>
              <option value="LOW_STOCK">Low Stock Alert (1-3)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="filter-dropdown-box">
            <ArrowUpDown size={16} className="dropdown-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="FEATURED">Sort: Featured</option>
              <option value="YEAR_DESC">Year: Newest to Oldest</option>
              <option value="TITLE_ASC">Title: A to Z</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="RATING_DESC">Rating: Highest</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Stats */}
        <div className="filter-status-bar">
          <span className="results-count">
            Showing <strong>{Math.min(displayedBooks.length, filteredBooks.length)}</strong> of <strong>{filteredBooks.length}</strong> textbooks
            {selectedSubject && <span className="active-filter-badge">Subject: {selectedSubject}</span>}
            {searchQuery && <span className="active-filter-badge">Keyword: "{searchQuery}"</span>}
          </span>

          {(selectedSubject || searchQuery || availabilityFilter !== 'ALL' || sortBy !== 'FEATURED') && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={handleClearFilters}
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Textbooks Cards Grid */}
        {filteredBooks.length === 0 ? (
          <div className="no-books-state">
            <BookOpen size={48} className="empty-icon" />
            <h3>No Textbooks Found</h3>
            <p>No textbooks matched your filter criteria. Try adjusting your search term or subject filter.</p>
            <button type="button" className="btn-hero-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="textbooks-cards-grid">
            {displayedBooks.map((book) => {
              const isAvailable = (book.availableCopies || 0) > 0;
              const isLowStock = (book.availableCopies || 0) > 0 && (book.availableCopies || 0) <= 3;

              return (
                <div key={book.id} className="book-card">
                  {/* Book Card Cover Container */}
                  <div className="book-card-cover-container">
                    <img
                      src={book.coverUrl || book.cover_image || book.fallbackSvg}
                      alt={book.title}
                      loading="lazy"
                      className="book-card-cover-img"
                      onError={(e) => {
                        if (book.cover_image && e.currentTarget.src !== book.cover_image) {
                          e.currentTarget.src = book.cover_image;
                        } else if (book.fallbackSvg && e.currentTarget.src !== book.fallbackSvg) {
                          e.currentTarget.src = book.fallbackSvg;
                        }
                      }}
                    />
                    <div className="book-cover-shadow-overlay" />
                    
                    {/* Subject Pill Badge */}
                    <span className="book-subject-tag">
                      {book.subject}
                    </span>

                    {/* Source Badge */}
                    <div className="book-source-badge" title="Source: FreeComputerBooks.com">
                      <Sparkles size={10} />
                      <span>FreeComputerBooks</span>
                    </div>

                    {/* Open Access Badge */}
                    <div className="stock-status-badge is-available">
                      <CheckCircle size={12} />
                      <span>Free / Open Access</span>
                    </div>
                  </div>

                  {/* Book Metadata Content */}
                  <div className="book-card-content">
                    <div className="book-card-meta-top">
                      <span className="book-publisher">{book.publisher || 'Publisher: Not available'}</span>
                      <span className="meta-dot">•</span>
                      <span className="book-year">{book.year ? `Year: ${book.year}` : 'Year: Not available'}</span>
                    </div>

                    <h3 className="book-card-title" title={book.title}>
                      {book.title}
                    </h3>

                    <p className="book-card-author">
                      By {book.author}
                    </p>

                    {/* Shelf location & Pricing / Rating */}
                    <div className="book-inventory-pills">
                      <span className="shelf-pill" title="Library Shelf Rack">
                        <MapPin size={11} />
                        <span>Shelf {book.shelf || 'DIGITAL'}</span>
                      </span>
                      <span className="rating-pill">
                        <Star size={11} className="star-icon" fill="currentColor" />
                        <span>{book.rating || '4.5'}</span>
                      </span>
                      <span className="price-pill" style={{ color: 'var(--color-primary)' }}>
                        Free eBook
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="book-card-actions">
                      <button
                        type="button"
                        className="btn-card-details"
                        onClick={() => onOpenBookDetails(book)}
                        title="View comprehensive textbook details"
                      >
                        <Eye size={15} />
                        <span>Details</span>
                      </button>

                      {book.reading_url || book.openUrl ? (
                        <a
                          href={book.reading_url || book.openUrl || book.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-card-open"
                          title="Open textbook online at FreeComputerBooks.com"
                        >
                          <BookOpen size={15} />
                          <span>Open</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="btn-card-open"
                          onClick={() => onOpenBookDetails(book)}
                        >
                          <BookOpen size={15} />
                          <span>Read</span>
                        </button>
                      )}

                      {/* Administrative Edit & Delete Buttons: ONLY VISIBLE TO ADMIN */}
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            className="btn-card-icon-action"
                            onClick={() => handleProtectedEdit(book)}
                            title="Edit book record (Admin Privileges)"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn-card-icon-action is-danger"
                            onClick={() => handleProtectedDelete(book.id)}
                            title="Delete book record (Admin Privileges)"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination Button */}
        {filteredBooks.length > itemsPerPage && (
          <div className="load-more-container">
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => setItemsPerPage(prev => prev + 12)}
            >
              <span>Load More Textbooks ({filteredBooks.length - itemsPerPage} remaining)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
