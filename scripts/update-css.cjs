const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Navigation updates
css = css.replace(/\.navbar-header\s*\{[\s\S]*?z-index:\s*50;[\s\S]*?\}/, `.navbar-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  padding: 16px 24px;
  background: transparent;
}`);

css = css.replace(/\.navbar-header\.is-scrolled\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.navbar-header.is-scrolled {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid #F0E5DC;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}`);

css = css.replace(/\.navbar-container\s*\{[\s\S]*?justify-content:\s*space-between;\s*\}/, `.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 9999px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(244, 119, 33, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`);

// Brand title in navbar
css = css.replace(/\.brand-title\s*\{[\s\S]*?color:\s*#[a-zA-Z0-9]+;[\s\S]*?\}/, `.brand-title {
  font-size: 19px;
  font-weight: 800;
  color: #242424;
  letter-spacing: -0.5px;
}`);

css = css.replace(/\.brand-subtitle\s*\{[\s\S]*?letter-spacing:[^}]*?\}/, `.brand-subtitle {
  font-size: 11px;
  color: #777777;
  font-weight: 600;
  letter-spacing: 0.3px;
}`);

// Nav link colors
css = css.replace(/\.nav-link\s*\{[\s\S]*?transition:\s*all 0\.2s ease;\s*\}/, `.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #555555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.nav-link:hover\s*\{[\s\S]*?\}/, `.nav-link:hover {
  color: #F47721;
  background: #FFF4EB;
}`);

// Action buttons in navbar
css = css.replace(/\.search-trigger-btn\s*\{[\s\S]*?color:\s*#94a3b8;\s*\}/, `.search-trigger-btn {
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  border-radius: 9999px;
}`);

css = css.replace(/\.search-trigger-btn:hover\s*\{[\s\S]*?\}/, `.search-trigger-btn:hover {
  border-color: #F47721;
  background: #F47721;
  color: #FFFFFF;
}`);

css = css.replace(/\.primary-add-btn\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.primary-add-btn {
  background: #F47721;
  color: #FFFFFF;
  font-weight: 700;
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(244, 119, 33, 0.28);
}`);

css = css.replace(/\.primary-add-btn:hover\s*\{[\s\S]*?\}/, `.primary-add-btn:hover {
  background: #D96210;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(244, 119, 33, 0.35);
}`);

// Hero section updates
css = css.replace(/\.hero-section\s*\{[\s\S]*?padding:\s*120px 24px 70px 24px;\s*\}/, `.hero-section {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 130px 24px 60px 24px;
  background: radial-gradient(circle at 50% 20%, #FFF9F5 0%, #FFFFFF 80%);
}`);

css = css.replace(/\.hero-navy-overlay\s*\{[\s\S]*?100%\s*\);\s*\}/, `.hero-navy-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 45%,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.88) 60%,
    rgba(255, 255, 255, 0.98) 100%
  );
}`);

css = css.replace(/\.hero-badge-pill\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.hero-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  border-radius: 9999px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(244, 119, 33, 0.08);
}`);

css = css.replace(/\.hero-heading\s*\{[\s\S]*?text-shadow:[^}]*?\}/, `.hero-heading {
  font-size: 56px;
  font-weight: 800;
  color: #242424;
  line-height: 1.18;
  letter-spacing: -1.2px;
  margin-bottom: 20px;
  text-shadow: none;
}`);

css = css.replace(/\.hero-heading-gradient\s*\{[\s\S]*?-webkit-text-fill-color:\s*transparent;\s*\}/, `.hero-heading-gradient {
  color: #F47721;
  background: linear-gradient(135deg, #F47721 0%, #FF8A3D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`);

css = css.replace(/\.hero-description\s*\{[\s\S]*?text-shadow:[^}]*?\}/, `.hero-description {
  font-size: 18px;
  color: #777777;
  max-width: 680px;
  line-height: 1.65;
  margin-bottom: 32px;
  text-shadow: none;
}`);

// Hero search form & input wrapper
css = css.replace(/\.search-input-wrapper\s*\{[\s\S]*?transition:\s*all 0\.25s ease;\s*\}/, `.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: 2px solid #F0E5DC;
  border-radius: 9999px;
  padding: 6px 8px 6px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(244, 119, 33, 0.04);
  transition: all 0.25s ease;
}`);

css = css.replace(/\.search-input-wrapper:focus-within\s*\{[\s\S]*?\}/, `.search-input-wrapper:focus-within {
  border-color: #F47721;
  box-shadow: 0 12px 35px rgba(244, 119, 33, 0.15);
}`);

css = css.replace(/\.hero-search-input\s*\{[\s\S]*?font-family:\s*inherit;\s*\}/, `.hero-search-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #242424;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
}`);

css = css.replace(/\.hero-search-submit-btn\s*\{[\s\S]*?flex-shrink:\s*0;\s*\}/, `.hero-search-submit-btn {
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

css = css.replace(/\.hero-search-submit-btn:hover\s*\{[\s\S]*?\}/, `.hero-search-submit-btn:hover {
  background: #D96210;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(244, 119, 33, 0.4);
}`);

// Hero action buttons
css = css.replace(/\.btn-hero-primary\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #F47721;
  color: #FFFFFF;
  padding: 14px 28px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(244, 119, 33, 0.3);
  transition: all 0.2s ease;
}`);

css = css.replace(/\.btn-hero-primary:hover\s*\{[\s\S]*?\}/, `.btn-hero-primary:hover {
  background: #D96210;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(244, 119, 33, 0.4);
  color: #FFFFFF;
}`);

css = css.replace(/\.btn-hero-secondary\s*\{[\s\S]*?transition:\s*all 0\.2s ease;\s*\}/, `.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #FFFFFF;
  border: 1.5px solid #F0E5DC;
  color: #242424;
  padding: 14px 28px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}`);

css = css.replace(/\.btn-hero-secondary:hover\s*\{[\s\S]*?\}/, `.btn-hero-secondary:hover {
  border-color: #F47721;
  background: #FFF4EB;
  color: #F47721;
  transform: translateY(-2px);
}`);

// Topic pills
css = css.replace(/\.topic-pill-btn\s*\{[\s\S]*?transition:\s*all 0\.2s ease;\s*\}/, `.topic-pill-btn {
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #555555;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.topic-pill-btn:hover\s*\{[\s\S]*?\}/, `.topic-pill-btn:hover {
  background: #F47721;
  border-color: #F47721;
  color: #FFFFFF;
  transform: translateY(-1px);
}`);

// Features strip
css = css.replace(/\.hero-features-strip\s*\{[\s\S]*?justify-content:\s*center;\s*\}/, `.hero-features-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 36px;
  padding: 16px 24px;
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}`);

css = css.replace(/\.feature-item\s*\{[\s\S]*?color:\s*#[a-zA-Z0-9]+;\s*\}/, `.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #555555;
}`);

css = css.replace(/\.feature-check\s*\{[\s\S]*?\}/, `.feature-check {
  color: #F47721;
  flex-shrink: 0;
}`);

// Section headers and cards
css = css.replace(/\.section-title\s*\{[\s\S]*?color:\s*#[a-zA-Z0-9]+;[\s\S]*?\}/, `.section-title {
  font-size: 34px;
  font-weight: 800;
  color: #242424;
  letter-spacing: -0.6px;
  line-height: 1.25;
  margin-bottom: 12px;
}`);

css = css.replace(/\.section-badge\s*\{[\s\S]*?text-transform:\s*uppercase;\s*margin-bottom:\s*14px;\s*\}/, `.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  border-radius: 9999px;
  background: #FFF4EB;
  border: 1px solid #F0E5DC;
  color: #F47721;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
}`);

// Book Card styling
css = css.replace(/\.book-card\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.book-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  position: relative;
}`);

css = css.replace(/\.book-card:hover\s*\{[\s\S]*?\}/, `.book-card:hover {
  transform: translateY(-4px);
  border-color: #F47721;
  box-shadow: 0 12px 30px rgba(244, 119, 33, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
}`);

css = css.replace(/\.book-card-title\s*\{[\s\S]*?line-height:\s*1\.35;\s*\}/, `.book-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #242424;
  line-height: 1.35;
}`);

// Category card styling
css = css.replace(/\.category-card\s*\{[\s\S]*?box-shadow:[^}]*?\}/, `.category-card {
  background: #FFFFFF;
  border: 1px solid #F0E5DC;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}`);

css = css.replace(/\.category-card:hover\s*\{[\s\S]*?\}/, `.category-card:hover {
  transform: translateY(-4px);
  border-color: #F47721;
  box-shadow: 0 12px 30px rgba(244, 119, 33, 0.12);
  background: #FFFFFF;
}`);

css = css.replace(/\.category-card-title\s*\{[\s\S]*?line-height:\s*1\.3;\s*\}/, `.category-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #242424;
  line-height: 1.3;
}`);

// Footer styling
css = css.replace(/\.footer-root\s*\{[\s\S]*?background:[^}]*?\}/, `.footer-root {
  background: #FFFFFF;
  border-top: 1px solid #F0E5DC;
  color: #555555;
  padding: 70px 0 30px 0;
  margin-top: auto;
}`);

css = css.replace(/\.footer-col-heading\s*\{[\s\S]*?color:\s*#[a-zA-Z0-9]+;[\s\S]*?\}/, `.footer-col-heading {
  font-size: 15px;
  font-weight: 700;
  color: #242424;
  margin-bottom: 20px;
  letter-spacing: -0.2px;
}`);

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Successfully written index.css redesign rules');
