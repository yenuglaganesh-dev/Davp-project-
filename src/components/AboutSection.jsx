import React from 'react';
import { BookOpen, CheckCircle, Database, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <div className="about-grid">
          <div className="about-text-col">
            <div className="section-badge">
              <BookOpen size={14} />
              <span>Academic Digital Library Initiative</span>
            </div>
            <h2 className="section-title">Bridging Open Education & Data Intelligence</h2>
            <p className="about-lead">
              The <strong>DAVP Online Textbook Library Management and Data Analytics Dashboard</strong> integrates open educational resources with rigorous statistical inventory intelligence.
            </p>
            <p className="about-p">
              Born from our Python academic research project (<code>Textbooks_in_Library_Analysis_Using_Python.ipynb</code>), this platform demonstrates how institutional libraries can monitor curriculum freshness, track physical shelf copy circulation, detect inventory pricing anomalies via 1.5×IQR statistical analysis, and provide open-access educational texts to learners worldwide.
            </p>

            <div className="about-features-list">
              <div className="about-feature-item">
                <div className="about-icon-box"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="feature-h4">Peer-Reviewed Open Access</h4>
                  <p className="feature-p">Direct integration with FreeComputerBooks.com, OpenStax, Project Gutenberg, DOAB, and Open Library for verified educational materials.</p>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-icon-box"><Terminal size={20} /></div>
                <div>
                  <h4 className="feature-h4">Data-Driven Inventory Governance</h4>
                  <p className="feature-p">Automated tracking of stock availability rates, shelf coordinates (A-01 to H-30), and low-stock replenishment flags.</p>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-icon-box"><Award size={20} /></div>
                <div>
                  <h4 className="feature-h4">Accessible & Responsive Design</h4>
                  <p className="feature-p">Modern academic visual aesthetic powered by React Bits GridMotion background, smooth performance, and zero layout shift.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-tech-col">
            <div className="tech-stack-card">
              <h3 className="tech-stack-title">Architecture & Data Stack</h3>
              <div className="tech-stack-items">
                <div className="tech-item">
                  <span className="tech-name">React 18 & Vite</span>
                  <span className="tech-desc">Ultra-fast component rendering & state management</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">React Bits GridMotion</span>
                  <span className="tech-desc">Continuous horizontal textbook wall animation with pointer parallax</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Python, Pandas & NumPy</span>
                  <span className="tech-desc">Core data wrangling, missing-value imputation & IQR outlier math</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Plotly & Dash Design Standards</span>
                  <span className="tech-desc">Longitudinal publication trends & ranked subject distribution</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Lucide Modern Iconography</span>
                  <span className="tech-desc">Accessible, semantic academic digital interface symbols</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

