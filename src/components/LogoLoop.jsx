import React from 'react';
import './LogoLoop.css';

/**
 * React Bits LogoLoop Component
 * Seamless continuous horizontal marquee for partner & repository platforms.
 */
export default function LogoLoop({
  items = [],
  speed = 35, // Duration in seconds for full loop
  pauseOnHover = true,
  direction = 'left',
  fadeEdges = true,
  className = ''
}) {
  if (!items || items.length === 0) return null;

  // Duplicate items 3 times for a seamless infinite loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div
      className={`logoloop-container ${fadeEdges ? 'fade-edges' : ''} ${className}`}
      style={{
        '--loop-duration': `${speed}s`,
        '--loop-direction': direction === 'right' ? 'reverse' : 'normal'
      }}
    >
      <div className={`logoloop-track ${pauseOnHover ? 'pause-hover' : ''}`}>
        {displayItems.map((item, index) => {
          const content = (
            <div className="logoloop-card">
              {item.icon && <span className="logoloop-icon">{item.icon}</span>}
              <div className="logoloop-info">
                <span className="logoloop-name">{item.name}</span>
                {item.category && <span className="logoloop-category">{item.category}</span>}
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="logoloop-item-link"
              title={`Visit ${item.name}`}
            >
              {content}
            </a>
          ) : (
            <div key={index} className="logoloop-item">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

