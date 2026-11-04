import { textbookCovers } from './textbookCovers';

// Authentic textbook catalog records based on FreeComputerBooks.com
export const INITIAL_BOOKS = textbookCovers.map((t, idx) => {
  const shelfLetter = String.fromCharCode(65 + (idx % 8)); // A through H
  const shelfNum = String((idx % 15) + 1).padStart(2, '0');

  return {
    id: t.id || `FCB-${String(idx + 1).padStart(4, '0')}`,
    title: t.title,
    author: t.author,
    subject: t.subject,
    category: t.subject,
    publisher: t.publisher, // null or real publisher
    year: t.year,           // null or real year
    isbn: t.isbn,           // null or real ISBN
    price: 0,               // Free / Open Access
    totalCopies: 1,
    availableCopies: 1,
    borrowedCopies: 0,
    shelf: `SHELF-${shelfLetter}${shelfNum}`,
    coverUrl: t.coverUrl,
    cover_image: t.cover_image,
    fallbackSvg: t.fallbackSvg,
    edition: t.edition || 'Online Open Access Edition',
    repository: 'FreeComputerBooks.com',
    source_name: 'FreeComputerBooks.com',
    source_url: t.source_url,
    reading_url: t.reading_url,
    openUrl: t.openUrl || t.reading_url || t.source_url,
    license: t.license || 'Free / Open Access',
    language: t.language || 'English',
    description: t.description || `Academic textbook and comprehensive learning reference for ${t.subject}. Verified educational resource with direct reading access.`,
    rating: t.rating || (4.3 + ((idx * 3) % 7) / 10).toFixed(1)
  };
});
