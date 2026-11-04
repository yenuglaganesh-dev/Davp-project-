import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, AlertCircle, PlusCircle } from 'lucide-react';
import { generateBookCoverSvg } from '../utils/bookSvgGenerator';

const SUBJECTS_LIST = [
  'Data Science', 'Machine Learning', 'Algorithms and Data Structures',
  'Artificial Intelligence', 'Data Analysis and Data Mining',
  'Python Programming', 'C and C++', 'JavaScript',
  'Statistics', 'Mathematics', 'Linux and Unix'
];

export default function BookManagementModal({ isOpen, onClose, onSave, initialBook = null }) {
  const isEditing = Boolean(initialBook && initialBook.id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    subject: 'Computer Science',
    publisher: 'MIT Press',
    year: 2024,
    isbn: '',
    price: 450,
    totalCopies: 10,
    availableCopies: 8,
    shelf: 'A-01',
    edition: '1st Edition',
    repository: 'Open Library',
    openUrl: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialBook) {
      setFormData({
        title: initialBook.title || '',
        author: initialBook.author || '',
        subject: initialBook.subject || 'Computer Science',
        publisher: initialBook.publisher || 'Open Academic Press',
        year: initialBook.year || 2024,
        isbn: initialBook.isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        price: initialBook.price || 450,
        totalCopies: initialBook.totalCopies || 10,
        availableCopies: initialBook.availableCopies || 8,
        shelf: initialBook.shelf || 'A-01',
        edition: initialBook.edition || '1st Edition',
        repository: initialBook.repository || 'Open Library',
        openUrl: initialBook.openUrl || '',
        description: initialBook.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        subject: 'Computer Science',
        publisher: 'MIT Press',
        year: 2024,
        isbn: `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        price: 450,
        totalCopies: 10,
        availableCopies: 8,
        shelf: 'A-01',
        edition: '1st Edition',
        repository: 'Open Library',
        openUrl: '',
        description: ''
      });
    }
    setErrors({});
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.author.trim()) errs.author = 'Author is required';
    if (!formData.subject) errs.subject = 'Subject is required';
    if (formData.totalCopies < 0) errs.totalCopies = 'Total copies must be >= 0';
    if (formData.availableCopies < 0 || formData.availableCopies > formData.totalCopies) {
      errs.availableCopies = 'Available copies must be between 0 and total copies';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fallbackSvg = generateBookCoverSvg({
      title: formData.title,
      author: formData.author,
      subject: formData.subject,
      publisher: formData.publisher,
      edition: formData.edition,
      year: formData.year,
      isbn: formData.isbn
    });

    const bookToSave = {
      ...(initialBook || {}),
      id: initialBook?.id || `BK${Date.now().toString().slice(-4)}`,
      ...formData,
      borrowedCopies: formData.totalCopies - formData.availableCopies,
      fallbackSvg,
      coverUrl: initialBook?.coverUrl || fallbackSvg,
      rating: initialBook?.rating || '4.8'
    };

    onSave(bookToSave);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog book-form-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <div className="form-header-title">
            {isEditing ? <BookOpen size={20} /> : <PlusCircle size={20} />}
            <h3>{isEditing ? 'Edit Textbook Record' : 'Add New Academic Textbook'}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-management-form">
          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-col">
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Algorithms"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Author */}
            <div className="form-group">
              <label className="form-label">Author(s) *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Thomas H. Cormen"
                className={`form-input ${errors.author ? 'has-error' : ''}`}
              />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>

            {/* Subject */}
            <div className="form-group">
              <label className="form-label">Academic Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Publisher */}
            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="e.g. MIT Press, OpenStax, Pearson"
                className="form-input"
              />
            </div>

            {/* Publication Year */}
            <div className="form-group">
              <label className="form-label">Publication Year</label>
              <input
                type="number"
                name="year"
                min="1990"
                max="2030"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* ISBN */}
            <div className="form-group">
              <label className="form-label">ISBN-13</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g. 978-0262046305"
                className="form-input"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Total Copies */}
            <div className="form-group">
              <label className="form-label">Total Stock Copies</label>
              <input
                type="number"
                name="totalCopies"
                min="1"
                value={formData.totalCopies}
                onChange={handleChange}
                className={`form-input ${errors.totalCopies ? 'has-error' : ''}`}
              />
              {errors.totalCopies && <span className="field-error">{errors.totalCopies}</span>}
            </div>

            {/* Available Copies */}
            <div className="form-group">
              <label className="form-label">Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                min="0"
                max={formData.totalCopies}
                value={formData.availableCopies}
                onChange={handleChange}
                className={`form-input ${errors.availableCopies ? 'has-error' : ''}`}
              />
              {errors.availableCopies && <span className="field-error">{errors.availableCopies}</span>}
            </div>

            {/* Shelf Location */}
            <div className="form-group">
              <label className="form-label">Shelf Location</label>
              <input
                type="text"
                name="shelf"
                value={formData.shelf}
                onChange={handleChange}
                placeholder="e.g. B-14, D-08"
                className="form-input"
              />
            </div>

            {/* Repository */}
            <div className="form-group">
              <label className="form-label">Digital Repository</label>
              <input
                type="text"
                name="repository"
                value={formData.repository}
                onChange={handleChange}
                placeholder="e.g. Open Library, OpenStax, DOAB"
                className="form-input"
              />
            </div>

            {/* Open Access Link */}
            <div className="form-group full-col">
              <label className="form-label">Repository URL / Digital Reading Link</label>
              <input
                type="url"
                name="openUrl"
                value={formData.openUrl}
                onChange={handleChange}
                placeholder="https://openlibrary.org/..."
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit-save">
              <Save size={16} />
              <span>{isEditing ? 'Save Changes' : 'Create Textbook Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

