import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LogoLoop from './components/LogoLoop';
import SubjectCategories from './components/SubjectCategories';
import FeaturedTextbooks from './components/FeaturedTextbooks';
import RepositoriesSection from './components/RepositoriesSection';
import AnalyticsSection from './components/AnalyticsSection';
import AiRecommendations from './components/AiRecommendations';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import BookModal from './components/BookModal';
import BookManagementModal from './components/BookManagementModal';
import ProfileModal from './components/ProfileModal';
import StudentManagementModal from './components/StudentManagementModal';
import LoginModal from './components/LoginModal';
import AccessDeniedModal from './components/AccessDeniedModal';
import { PLATFORM_LOGOS } from './data/repositoriesData';
import { INITIAL_BOOKS } from './data/initialBooksData';
import { generateBookCoverSvg } from './utils/bookSvgGenerator';
import { CheckCircle, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'davp_library_books_fcb_v3';

function MainApp() {
  const { user, isAdmin, isAuthenticated, triggerAccessDenied } = useAuth();

  // Books state persisted in localStorage
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial books data', e);
    }
    return INITIAL_BOOKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [books]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // For details modal
  const [editingBook, setEditingBook] = useState(null); // For edit modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStudentManagementOpen, setIsStudentManagementOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [borrowedCount, setBorrowedCount] = useState(3);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Direct URL navigation / console tamper inspection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    if (params.get('view') === 'profile' || hash === '#profile' || params.get('admin') === 'true') {
      if (!isAdmin) {
        triggerAccessDenied(
          'Institutional User Profile',
          'Direct navigation to Institutional User Profile is blocked. Authenticated Administrator role required.'
        );
        // Clean URL to prevent recurring trigger
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsProfileModalOpen(true);
      }
    }

    if (params.get('view') === 'students' || hash === '#students') {
      if (!isAdmin) {
        triggerAccessDenied(
          'Student Management & Excel Log',
          'Direct navigation to Student Management is blocked. Authenticated Administrator role required.'
        );
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsStudentManagementOpen(true);
      }
    }

    // Expose programmatic interface for testing RBAC via console
    window.openInstitutionalProfile = () => {
      if (!isAdmin) {
        triggerAccessDenied(
          'Institutional User Profile (Console Access)',
          'Unauthorized console invocation: Institutional User Profile is strictly restricted to authenticated Administrators.'
        );
      } else {
        setIsProfileModalOpen(true);
      }
    };

    window.openStudentManagement = () => {
      if (!isAdmin) {
        triggerAccessDenied(
          'Student Management (Console Access)',
          'Unauthorized console invocation: Student Management is strictly restricted to authenticated Administrators.'
        );
      } else {
        setIsStudentManagementOpen(true);
      }
    };
  }, [isAdmin, triggerAccessDenied]);

  // Keyboard shortcut Ctrl+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const exploreSection = document.getElementById('explore');
        if (exploreSection) {
          exploreSection.scrollIntoView({ behavior: 'smooth' });
          const searchInput = exploreSection.querySelector('input');
          if (searchInput) searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Protected Handler: Add or update book
  const handleSaveBook = (bookData) => {
    if (!isAdmin) {
      triggerAccessDenied('Administrative Catalog Modification', 'Only administrators can save changes to textbook inventory.');
      return;
    }

    const exists = books.some(b => b.id === bookData.id);
    if (exists) {
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData : b));
      showToast(`Updated "${bookData.title}" successfully.`);
    } else {
      setBooks(prev => [bookData, ...prev]);
      showToast(`Added "${bookData.title}" to catalog.`);
    }
    setEditingBook(null);
    setIsAddModalOpen(false);
  };

  // Protected Handler: Delete book
  const handleDeleteBook = (bookId) => {
    if (!isAdmin) {
      triggerAccessDenied('Administrative Catalog Deletion', 'Only administrators can delete textbook records.');
      return;
    }

    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;
    if (window.confirm(`Are you sure you want to remove "${bookToDelete.title}" from the catalog?`)) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
      showToast(`Deleted "${bookToDelete.title}".`, 'info');
    }
  };

  // Handler: Borrow a copy (Accessible to all authenticated/normal users)
  const handleBorrowBook = (bookId) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId && b.availableCopies > 0) {
        return {
          ...b,
          availableCopies: b.availableCopies - 1,
          borrowedCopies: (b.borrowedCopies || 0) + 1
        };
      }
      return b;
    }));
    setBorrowedCount(prev => prev + 1);
    showToast('Book checked out successfully! Available copy count updated.');
    setSelectedBook(null);
  };

  // Protected Handler: Export CSV
  const handleExportCsv = () => {
    if (!isAdmin) {
      triggerAccessDenied('Institutional Analytics & Inventory Export', 'Full catalog inventory export is restricted to institutional administrators.');
      return;
    }

    const headers = [
      'BookID', 'Title', 'Author', 'Subject', 'Publisher',
      'PublicationYear', 'ISBN', 'Price', 'TotalCopies',
      'AvailableCopies', 'BorrowedCopies', 'Shelf', 'Source_Name', 'Source_URL', 'Reading_URL', 'License'
    ];

    const rows = books.map(b => [
      `"${b.id || ''}"`,
      `"${(b.title || '').replace(/"/g, '""')}"`,
      `"${(b.author || '').replace(/"/g, '""')}"`,
      `"${(b.subject || '').replace(/"/g, '""')}"`,
      `"${(b.publisher || 'Not available').replace(/"/g, '""')}"`,
      b.year || 'Not available',
      `"${b.isbn || 'Not available'}"`,
      b.price || 0,
      b.totalCopies || 1,
      b.availableCopies || 1,
      b.borrowedCopies || 0,
      `"${b.shelf || 'DIGITAL'}"`,
      `"${(b.source_name || 'FreeComputerBooks.com').replace(/"/g, '""')}"`,
      `"${(b.source_url || '').replace(/"/g, '""')}"`,
      `"${(b.reading_url || b.openUrl || '').replace(/"/g, '""')}"`,
      `"${(b.license || 'Free / Open Access').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'library_textbooks_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog exported to library_textbooks_catalog.csv');
  };

  // Protected Handler: Import CSV or JSON dataset
  const handleImportCsv = (e) => {
    if (!isAdmin) {
      e.target.value = '';
      triggerAccessDenied('Direct Dataset Ingestion (Import)', 'Direct dataset ingestion is restricted to institutional administrators.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map((item, idx) => ({
              ...item,
              id: item.id || item.BookID || `IMP-${idx}`,
              title: item.title || item.Title || 'Imported Textbook',
              author: item.author || item.Author || 'Academic Author',
              subject: item.subject || item.Subject || 'General Academic Textbooks',
              fallbackSvg: generateBookCoverSvg({
                title: item.title || item.Title,
                author: item.author || item.Author,
                subject: item.subject || item.Subject
              })
            }));
            setBooks(mapped);
            showToast(`Successfully ingested ${mapped.length} records from JSON!`);
          }
        } else {
          // Parse CSV
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 1) {
            const headerCols = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const imported = [];

            for (let i = 1; i < lines.length; i++) {
              const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
              const item = {};
              headerCols.forEach((h, idx) => {
                item[h] = row[idx] || '';
              });

              const title = item.Title || item.title || `Imported Book ${i}`;
              const author = item.Author || item.author || 'Academic Author';
              const subject = item.Subject || item.subject || 'General Academic Textbooks';
              const year = Number(item.PublicationYear || item.year) || 2023;
              const price = Number(item.Price || item.price) || 450;
              const totalCopies = Number(item.TotalCopies || item.totalCopies) || 10;
              const availableCopies = Number(item.AvailableCopies || item.availableCopies) || totalCopies;

              imported.push({
                id: item.BookID || item.id || `BK${String(i).padStart(4, '0')}`,
                title,
                author,
                subject,
                publisher: item.Publisher || item.publisher || 'Academic Press',
                year,
                isbn: item.ISBN || item.isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
                price,
                totalCopies,
                availableCopies,
                borrowedCopies: totalCopies - availableCopies,
                shelf: item.Shelf || item.shelf || 'A-01',
                rating: '4.6',
                fallbackSvg: generateBookCoverSvg({ title, author, subject, year })
              });
            }

            if (imported.length > 0) {
              setBooks(imported);
              showToast(`Successfully ingested ${imported.length} textbooks from ${file.name}!`);
            }
          }
        }
      } catch (err) {
        console.error('Import error', err);
        showToast('Error importing dataset. Please verify file format.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenProfileModal = () => {
    if (!isAdmin) {
      triggerAccessDenied(
        'Institutional User Profile',
        'Access Denied: The Institutional User Profile is strictly restricted to authenticated Administrators.'
      );
      return;
    }
    setIsProfileModalOpen(true);
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      triggerAccessDenied(
        'Administrative Catalog Management (Add Book)',
        'Access Denied: Only authenticated administrators can add new textbooks.'
      );
      return;
    }
    setEditingBook(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="app-root">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* A. Navigation Bar */}
      <Navbar
        onOpenAddBook={handleOpenAddModal}
        onOpenSearch={() => {
          const explore = document.getElementById('explore');
          if (explore) explore.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfile={handleOpenProfileModal}
        onOpenStudentManagement={() => setIsStudentManagementOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        bookCount={books.length}
      />

      <main>
        {/* B. Hero Section with GridMotion Animated Background */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={(q) => setSearchQuery(q)}
          totalBooks={books.length}
        />

        {/* 7. LogoLoop Integration */}
        <section className="platforms-logoloop-section">
          <div className="section-container">
            <div className="logoloop-header-row">
              <span className="logoloop-badge">Trusted Platforms</span>
              <h3 className="logoloop-heading">Explore Trusted Digital Learning Platforms</h3>
              <p className="logoloop-subtitle">
                Access millions of verified academic resources across open-education repositories and research engines.
              </p>
            </div>

            <LogoLoop
              items={PLATFORM_LOGOS}
              speed={32}
              pauseOnHover={true}
              direction="left"
              fadeEdges={true}
            />
          </div>
        </section>

        {/* C. Subject Categories */}
        <SubjectCategories
          selectedSubject={selectedSubject}
          onSelectSubject={(subj) => setSelectedSubject(subj)}
        />

        {/* D. Featured Textbooks & Catalog Management (RBAC Restricted) */}
        <FeaturedTextbooks
          books={books}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          onOpenBookDetails={(book) => setSelectedBook(book)}
          onOpenEditBook={(book) => {
            if (!isAdmin) {
              triggerAccessDenied('Administrative Catalog Curation (Edit)', 'Only administrators can edit textbooks.');
              return;
            }
            setEditingBook(book);
            setIsAddModalOpen(true);
          }}
          onOpenAddBook={handleOpenAddModal}
          onDeleteBook={handleDeleteBook}
          onExportCsv={handleExportCsv}
          onImportCsv={handleImportCsv}
        />

        {/* E. Open Educational Repositories */}
        <RepositoriesSection />

        {/* F. Analytics Section */}
        <AnalyticsSection books={books} />

        {/* G. AI Recommendations */}
        <AiRecommendations
          books={books}
          onOpenBookDetails={(book) => setSelectedBook(book)}
        />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* H. Footer */}
      <Footer />

      {/* Book Details Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onBorrowBook={handleBorrowBook}
      />

      {/* Add / Edit Book Management Modal (Admin Only) */}
      <BookManagementModal
        isOpen={isAddModalOpen && isAdmin}
        onClose={() => { setIsAddModalOpen(false); setEditingBook(null); }}
        onSave={handleSaveBook}
        initialBook={editingBook}
      />

      {/* Institutional User Profile Modal (Strictly Admin Only) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        bookCount={books.length}
        borrowedCount={borrowedCount}
        onOpenStudentManagement={() => setIsStudentManagementOpen(true)}
      />

      {/* Student Management & Excel Login Activity Modal (Admin Only) */}
      <StudentManagementModal
        isOpen={isStudentManagementOpen}
        onClose={() => setIsStudentManagementOpen(false)}
      />

      {/* Institutional Authentication / Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* 403 Forbidden Access Denied Modal */}
      <AccessDeniedModal
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
