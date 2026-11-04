import React from 'react';
import { REPOSITORY_CARDS } from '../data/repositoriesData';
import { ExternalLink, Database, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RepositoriesSection() {
  return (
    <section id="repositories" className="repositories-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-badge">
            <Database size={14} />
            <span>Open Educational Repositories</span>
          </div>
          <h2 className="section-title">Verified Digital Learning Repositories</h2>
          <p className="section-subtitle">
            Directly access millions of peer-reviewed textbooks, monographs, public domain volumes, and research resources from international academic archives.
          </p>
        </div>

        {/* Repositories Cards Grid */}
        <div className="repositories-grid">
          {REPOSITORY_CARDS.map((repo) => (
            <div key={repo.id} className="repository-card">
              <div className="repo-card-top">
                <span className="repo-badge-pill" style={{ color: repo.color, borderColor: `${repo.color}40`, backgroundColor: `${repo.color}15` }}>
                  <ShieldCheck size={12} />
                  <span>{repo.badge}</span>
                </span>
                <span className="repo-type-tag">{repo.type}</span>
              </div>

              <h3 className="repo-name">{repo.name}</h3>

              <p className="repo-description">
                {repo.description}
              </p>

              <div className="repo-stats-box">
                <CheckCircle2 size={13} className="stats-check-icon" />
                <span>{repo.stats}</span>
              </div>

              <div className="repo-card-footer">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-visit-link"
                  title={`Open official portal for ${repo.name}`}
                >
                  <Globe size={15} />
                  <span>Visit Repository Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

