const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace hero search input
css = css.replace(/\.hero-search-input\s*\{[^}]+\}/g, `.hero-search-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #242424;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
}`);

// Replace submit button
css = css.replace(/\.hero-search-submit-btn\s*\{[^}]+\}/g, `.hero-search-submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F47721;
  color: #FFFFFF;
  border: none;
  border-radius: 9999px;
  padding: 12px 24px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(244, 119, 33, 0.3);
}`);

css = css.replace(/\.hero-search-submit-btn:hover\s*\{[^}]+\}/g, `.hero-search-submit-btn:hover {
  background: #D96210;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(244, 119, 33, 0.4);
}`);

// Topic pills
css = css.replace(/\.topic-pill-btn\s*\{[^}]+\}/g, `.topic-pill-btn {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  color: #242424;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}`);

css = css.replace(/\.topic-pill-btn:hover\s*\{[^}]+\}/g, `.topic-pill-btn:hover {
  background: #FFF4EB;
  border-color: #F47721;
  color: #F47721;
  transform: translateY(-1px);
}`);

// Hero buttons
css = css.replace(/\.btn-hero-primary\s*\{[^}]+\}/g, `.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #F47721;
  color: #FFFFFF;
  padding: 13px 28px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 6px 20px rgba(244, 119, 33, 0.3);
}`);

css = css.replace(/\.btn-hero-primary:hover\s*\{[^}]+\}/g, `.btn-hero-primary:hover {
  background: #D96210;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 119, 33, 0.4);
}`);

css = css.replace(/\.btn-hero-secondary\s*\{[^}]+\}/g, `.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  padding: 13px 28px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.25s ease;
}`);

css = css.replace(/\.btn-hero-secondary:hover\s*\{[^}]+\}/g, `.btn-hero-secondary:hover {
  background: #F47721;
  color: #FFFFFF;
  border-color: #F47721;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 119, 33, 0.25);
}`);

css = css.replace(/\.hero-features-strip\s*\{[^}]+\}/g, `.hero-features-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid #F0E5DC;
}`);

css = css.replace(/\.feature-item\s*\{[^}]+\}/g, `.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #777777;
  font-size: 13px;
  font-weight: 600;
}`);

css = css.replace(/\.feature-check\s*\{[^}]+\}/g, `.feature-check {
  color: #F47721;
  flex-shrink: 0;
}`);

// Topics label
css = css.replace(/\.topics-label\s*\{[^}]+\}/g, `.topics-label {
  font-size: 12.5px;
  color: #777777;
  font-weight: 600;
}`);

// Outline button in light theme
css = css.replace(/\.outline-btn\s*\{[^}]+\}/g, `.outline-btn {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  color: #242424;
  border-radius: 9999px;
}`);

css = css.replace(/\.outline-btn:hover\s*\{[^}]+\}/g, `.outline-btn:hover {
  background: #FFF4EB;
  border-color: #F47721;
  color: #F47721;
}`);

// User profile badge
css = css.replace(/\.user-profile-badge\s*\{[^}]+\}/g, `.user-profile-badge {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 14px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.user-profile-badge:hover\s*\{[^}]+\}/g, `.user-profile-badge:hover {
  background: #FFE8D6;
  border-color: #F47721;
}`);

css = css.replace(/\.profile-name\s*\{[^}]+\}/g, `.profile-name {
  font-size: 12px;
  font-weight: 700;
  color: #242424;
}`);

// Category card styling
css = css.replace(/\.category-card\s*\{[^}]+\}/g, `.category-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}`);

css = css.replace(/\.category-card:hover\s*\{[^}]+\}/g, `.category-card:hover {
  transform: translateY(-4px);
  border-color: #F47721;
  box-shadow: 0 12px 28px rgba(244, 119, 33, 0.12);
}`);

css = css.replace(/\.category-card-title\s*\{[^}]+\}/g, `.category-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #242424;
  margin: 14px 0 10px 0;
}`);

// Book Card styling
css = css.replace(/\.book-card\s*\{[^}]+\}/g, `.book-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}`);

css = css.replace(/\.book-card:hover\s*\{[^}]+\}/g, `.book-card:hover {
  transform: translateY(-4px);
  border-color: #F47721;
  box-shadow: 0 14px 32px rgba(244, 119, 33, 0.14);
}`);

css = css.replace(/\.book-card-title\s*\{[^}]+\}/g, `.book-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #242424;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`);

css = css.replace(/\.book-card-author\s*\{[^}]+\}/g, `.book-card-author {
  font-size: 13px;
  color: #777777;
  margin-bottom: 12px;
}`);

// Section Titles and Subtitles
css = css.replace(/\.section-title\s*\{[^}]+\}/g, `.section-title {
  font-size: 34px;
  font-weight: 800;
  color: #242424;
  letter-spacing: -0.8px;
  margin-bottom: 12px;
}`);

css = css.replace(/\.section-subtitle\s*\{[^}]+\}/g, `.section-subtitle {
  font-size: 16px;
  color: #777777;
  max-width: 680px;
  line-height: 1.6;
}`);

css = css.replace(/\.section-badge\s*\{[^}]+\}/g, `.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 14px;
}`);

// DriftWall showcase section & frame
css = css.replace(/\.driftwall-frame\s*\{[^}]+\}/g, `.driftwall-frame {
  height: 520px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at 50% 50%, #FFF9F5 0%, #FFFFFF 100%);
  border: 1px solid #F0E5DC;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}`);

css = css.replace(/\.driftwall-heading\s*\{[^}]+\}/g, `.driftwall-heading {
  font-size: 34px;
  font-weight: 800;
  color: #242424;
  letter-spacing: -0.8px;
  margin-bottom: 12px;
}`);

css = css.replace(/\.driftwall-subtitle\s*\{[^}]+\}/g, `.driftwall-subtitle {
  font-size: 16px;
  color: #777777;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}`);

css = css.replace(/\.driftwall-guide-pill\s*\{[^}]+\}/g, `.driftwall-guide-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 9999px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  font-size: 12.5px;
  font-weight: 600;
  margin-top: 18px;
  box-shadow: 0 2px 8px rgba(244, 119, 33, 0.06);
}`);

// Repository cards
css = css.replace(/\.repository-card\s*\{[^}]+\}/g, `.repository-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}`);

css = css.replace(/\.repository-card:hover\s*\{[^}]+\}/g, `.repository-card:hover {
  transform: translateY(-4px);
  border-color: #F47721;
  box-shadow: 0 14px 30px rgba(244, 119, 33, 0.12);
}`);

css = css.replace(/\.repo-name\s*\{[^}]+\}/g, `.repo-name {
  font-size: 18px;
  font-weight: 700;
  color: #242424;
  margin-bottom: 8px;
}`);

css = css.replace(/\.repo-description\s*\{[^}]+\}/g, `.repo-description {
  font-size: 13.5px;
  color: #777777;
  line-height: 1.6;
  margin-bottom: 16px;
  flex-grow: 1;
}`);

css = css.replace(/\.repo-visit-link\s*\{[^}]+\}/g, `.repo-visit-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #F47721;
  font-weight: 700;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.repo-visit-link:hover\s*\{[^}]+\}/g, `.repo-visit-link:hover {
  color: #D96210;
  transform: translateX(3px);
}`);

// Analytics Stat Cards & Chart Cards
css = css.replace(/\.analytics-stat-card\s*\{[^}]+\}/g, `.analytics-stat-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}`);

css = css.replace(/\.analytics-stat-card:hover\s*\{[^}]+\}/g, `.analytics-stat-card:hover {
  border-color: #F47721;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 119, 33, 0.1);
}`);

css = css.replace(/\.stat-value\s*\{[^}]+\}/g, `.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: #242424;
  letter-spacing: -0.5px;
}`);

css = css.replace(/\.stat-label\s*\{[^}]+\}/g, `.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}`);

css = css.replace(/\.chart-card\s*\{[^}]+\}/g, `.chart-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}`);

css = css.replace(/\.chart-title\s*\{[^}]+\}/g, `.chart-title {
  font-size: 17px;
  font-weight: 700;
  color: #242424;
  margin-bottom: 6px;
}`);

css = css.replace(/\.chart-subtitle\s*\{[^}]+\}/g, `.chart-subtitle {
  font-size: 13px;
  color: #777777;
  margin-bottom: 18px;
}`);

// Footer Root & Styling
css = css.replace(/\.footer-root\s*\{[^}]+\}/g, `.footer-root {
  background: #FFF4EB;
  border-top: 1px solid #F0E5DC;
  color: #242424;
  padding: 60px 0 30px 0;
  position: relative;
}`);

css = css.replace(/\.footer-about-text\s*\{[^}]+\}/g, `.footer-about-text {
  font-size: 14px;
  color: #777777;
  line-height: 1.65;
  margin: 14px 0 20px 0;
  max-width: 380px;
}`);

css = css.replace(/\.footer-col-heading\s*\{[^}]+\}/g, `.footer-col-heading {
  font-size: 15px;
  font-weight: 700;
  color: #242424;
  margin-bottom: 18px;
}`);

css = css.replace(/\.footer-links-list a\s*\{[^}]+\}/g, `.footer-links-list a {
  color: #777777;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.footer-links-list a:hover\s*\{[^}]+\}/g, `.footer-links-list a:hover {
  color: #F47721;
  padding-left: 4px;
}`);

// Modals
css = css.replace(/\.modal-backdrop\s*\{[^}]+\}/g, `.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(36, 36, 36, 0.45);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}`);

css = css.replace(/\.modal-dialog\s*\{[^}]+\}/g, `.modal-dialog {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 0 20px rgba(244, 119, 33, 0.08);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}`);

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Successfully updated component styles in index.css');
