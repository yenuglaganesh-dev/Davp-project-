import React from 'react';

export const PLATFORM_LOGOS = [
  {
    name: 'FreeComputerBooks',
    category: 'Computer Science & Tech Books',
    href: 'https://freecomputerbooks.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 15h10M9 9l3 3-3 3" />
      </svg>
    )
  },
  {
    name: 'OpenStax',
    category: 'Peer-Reviewed Textbooks',
    href: 'https://openstax.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5"/>
        <path d="M8 7h8M8 11h8M8 15h5"/>
      </svg>
    )
  },
  {
    name: 'Project Gutenberg',
    category: '70,000+ Free eBooks',
    href: 'https://www.gutenberg.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    name: 'DOAB',
    category: 'Open Access Monographs',
    href: 'https://www.doabooks.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  {
    name: 'Open Library',
    category: 'Universal Book Catalog',
    href: 'https://openlibrary.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  {
    name: 'Internet Archive',
    category: 'Digital Public Library',
    href: 'https://archive.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M3 10l9-7 9 7"/>
      </svg>
    )
  },
  {
    name: 'Google Books',
    category: 'Academic Search',
    href: 'https://books.google.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  },
  {
    name: 'NDLI',
    category: 'National Digital Library',
    href: 'https://ndl.iitkgp.ac.in',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  },
  {
    name: 'Python',
    category: 'Data Analysis Core',
    href: 'https://www.python.org',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/>
      </svg>
    )
  },
  {
    name: 'Plotly',
    category: 'Interactive Visualizations',
    href: 'https://plotly.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  },
  {
    name: 'React',
    category: 'Interactive Web UI',
    href: 'https://react.dev',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  }
];

export const REPOSITORY_CARDS = [
  {
    id: 'repo-fcb',
    name: 'FreeComputerBooks.com',
    type: 'Computer Science, Math & Tech Books',
    url: 'https://freecomputerbooks.com',
    badge: 'Primary Catalog Data Source',
    description: 'Extensive academic repository providing free, open-access textbooks, lecture notes, and technical references covering Computer Science, Data Science, Math, and Engineering.',
    stats: '1,000+ Real Books Scraped • Direct Reading Links',
    color: '#7BCB91'
  },
  {
    id: 'repo-openstax',
    name: 'OpenStax (Rice University)',
    type: 'College Textbooks',
    url: 'https://openstax.org',
    badge: '100% Free & Open Access',
    description: 'Peer-reviewed, openly licensed college textbooks designed for introductory undergraduate curriculum in Math, Science, and Social Sciences.',
    stats: '70+ Core College Textbooks • 6M+ Students Saved',
    color: '#7BCB91'
  },
  {
    id: 'repo-gutenberg',
    name: 'Project Gutenberg',
    type: 'Historical & Literature',
    url: 'https://www.gutenberg.org',
    badge: 'Public Domain',
    description: 'The world’s oldest digital library archive offering free e-text versions of public domain books, classics, and historical academic treatises.',
    stats: '70,000+ Free Titles • No Registration Required',
    color: '#7BCB91'
  },
  {
    id: 'repo-openlibrary',
    name: 'Open Library',
    type: 'Global Catalog & Lending',
    url: 'https://openlibrary.org',
    badge: 'Internet Archive Initiative',
    description: 'An open, editable library catalog building a web page for every book ever published, with digital lending and public scans.',
    stats: '30M+ Records • Millions of Accessible Scans',
    color: '#7BCB91'
  },
  {
    id: 'repo-doab',
    name: 'Directory of Open Access Books (DOAB)',
    type: 'Academic Monographs',
    url: 'https://www.doabooks.org',
    badge: 'Peer-Reviewed Monographs',
    description: 'A community-driven discovery service indexing open access, peer-reviewed monographs and academic volumes from scholarly publishers.',
    stats: '85,000+ Academic Volumes • 700+ Publishers',
    color: '#7BCB91'
  },
  {
    id: 'repo-archive',
    name: 'Internet Archive',
    type: 'Universal Digital Library',
    url: 'https://archive.org',
    badge: 'Non-profit Library',
    description: 'A non-profit library of millions of free books, historical texts, research papers, movies, software, and audio recordings.',
    stats: '44M+ Books & Texts • Controlled Digital Lending',
    color: '#7BCB91'
  },
  {
    id: 'repo-ndli',
    name: 'National Digital Library of India (NDLI)',
    type: 'National Educational Repository',
    url: 'https://ndl.iitkgp.ac.in',
    badge: 'MHRD / IIT Kharagpur',
    description: 'Sponsored by the Ministry of Education, NDLI integrates educational resources from school to postgraduate across all disciplines.',
    stats: '90M+ Digital Learning Materials • Multi-Lingual',
    color: '#7BCB91'
  }
];

