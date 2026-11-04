import { generateBookCoverSvg } from '../utils/bookSvgGenerator';
import freeComputerBooksData from './freeComputerBooks.json';

// Authentic academic and technology textbooks harvested from FreeComputerBooks.com
export const RAW_TEXTBOOKS = freeComputerBooksData.map((book) => {
  const filename = book.cover_image ? book.cover_image.split('/').pop() : null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    subject: book.category,
    category: book.category,
    publisher: book.publisher || null,
    year: book.year || null,
    isbn: book.isbn || null,
    edition: 'Online Academic Edition',
    repository: 'FreeComputerBooks.com',
    source_name: 'FreeComputerBooks.com',
    source_url: book.source_url,
    reading_url: book.reading_url,
    openUrl: book.reading_url || book.source_url,
    license: book.license || 'Free / Open Access',
    language: book.language || 'English',
    description: book.description,
    cover_image: book.cover_image,
    localCover: filename ? `/covers/${filename}` : null,
    shelf: book.shelf || 'DIGITAL-CS',
    rating: book.rating || '4.5',
    price: 0,
    totalCopies: 1,
    availableCopies: 1,
    borrowedCopies: 0
  };
});

// Generated textbook covers with local high-resolution cover image and deterministic SVG fallback for GridMotion
export const textbookCovers = RAW_TEXTBOOKS.map((book) => {
  const fallbackSvg = generateBookCoverSvg({
    title: book.title,
    author: book.author,
    subject: book.subject,
    publisher: book.publisher || 'FreeComputerBooks.com',
    edition: book.edition,
    year: book.year || 2024,
    isbn: book.isbn || 'Open Access'
  });

  return {
    ...book,
    // Real FreeComputerBooks cover served locally from public/covers, fallback to source URL then SVG
    coverUrl: book.localCover || book.cover_image || fallbackSvg,
    fallbackSvg
  };
});
