import React, { useEffect, useRef, useState, useMemo } from 'react';
import './GridMotion.css';

/**
 * GridMotion - React Bits Animated Background Component
 * JavaScript + CSS Version
 *
 * Renders multiple rows of drifting textbook cover items with:
 * - Continuous horizontal row animation in alternating directions
 * - Pointer-based parallax interaction
 * - Spotlight glow effect tracking the pointer
 * - Reduced motion support & viewport intersection pausing
 * - Full customizable dimming, edge fading, angle, radius, and grayscale
 */
export default function GridMotion({
  items = [],
  rows = 4,
  aspectRatio = 0.75, // Width / Height (0.75 = Portrait 3:4 book cover)
  gap = 14,
  radius = 12,
  angle = -8,
  tilt = 0,
  speed = 18, // Lower number = faster, higher = smoother drift
  direction = 'alternate',
  parallax = 0.3,
  spotlight = 0.35,
  dim = 0.55,
  fade = 0.65,
  grayscale = false,
  theme = 'dark'
}) {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);
  const animFrameRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rowOffsetsRef = useRef([]);
  const [isInViewport, setIsInViewport] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50, active: false });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection observer to pause animation when scrolled away
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Prepare items for each row: repeat so each row has enough books for seamless loop
  const rowItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const minItemsPerRow = 14; // Plenty of items to span wide displays
    const repeated = [];
    while (repeated.length < minItemsPerRow * rows) {
      repeated.push(...items);
    }

    const distributed = [];
    const chunkSize = Math.ceil(repeated.length / rows);
    for (let r = 0; r < rows; r++) {
      // Stagger items by offset so adjacent rows don't show identical books vertically
      const offset = (r * 5) % repeated.length;
      const slice = [...repeated.slice(offset), ...repeated.slice(0, offset)].slice(0, minItemsPerRow * 2);
      distributed.push(slice);
    }
    return distributed;
  }, [items, rows]);

  // Initialize row offset refs
  useEffect(() => {
    rowOffsetsRef.current = Array.from({ length: rows }, () => 0);
  }, [rows]);

  // Pointer interaction
  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-1 to 1)
    const normX = ((x / rect.width) * 2 - 1) * parallax * 120;
    const normY = ((y / rect.height) * 2 - 1) * parallax * 60;

    mousePosRef.current.targetX = normX;
    mousePosRef.current.targetY = normY;

    // Percent for spotlight
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setSpotlightPos({ x: pctX, y: pctY, active: true });
  };

  const handlePointerLeave = () => {
    mousePosRef.current.targetX = 0;
    mousePosRef.current.targetY = 0;
    setSpotlightPos((prev) => ({ ...prev, active: false }));
  };

  // Continuous animation loop
  useEffect(() => {
    if (prefersReducedMotion || !isInViewport) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    // Base speed factor: speed prop defines seconds or px drift
    const baseSpeed = (60 / Math.max(speed, 5)) * 0.45;

    const animate = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth pointer parallax lerp
      const mouse = mousePosRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Update each row
      rowsRef.current.forEach((rowEl, rIdx) => {
        if (!rowEl) return;
        const dir = direction === 'alternate' ? (rIdx % 2 === 0 ? -1 : 1) : 1;
        const drift = dir * baseSpeed * 60 * dt;

        rowOffsetsRef.current[rIdx] = (rowOffsetsRef.current[rIdx] || 0) + drift;

        // Reset threshold when row moves far enough to loop seamlessly
        const maxScroll = 1800;
        if (Math.abs(rowOffsetsRef.current[rIdx]) > maxScroll) {
          rowOffsetsRef.current[rIdx] = rowOffsetsRef.current[rIdx] % maxScroll;
        }

        const currentOffset = rowOffsetsRef.current[rIdx];
        const parallaxOffset = mouse.x * (rIdx % 2 === 0 ? 1 : -0.8);
        const totalX = currentOffset + parallaxOffset;
        const totalY = mouse.y * 0.3;

        rowEl.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)`;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isInViewport, prefersReducedMotion, rows, speed, direction, parallax]);

  // Tile dimensions (Height dynamically adapts to row count and viewport)
  const itemHeight = Math.max(160, Math.min(230, Math.floor(750 / (rows * 0.95))));
  const itemWidth = Math.round(itemHeight * aspectRatio);

  return (
    <div
      ref={containerRef}
      className={`grid-motion-container theme-${theme} ${grayscale ? 'is-grayscale' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--grid-angle': `${angle}deg`,
        '--grid-tilt': `${tilt}deg`,
        '--grid-gap': `${gap}px`,
        '--grid-radius': `${radius}px`,
        '--item-width': `${itemWidth}px`,
        '--item-height': `${itemHeight}px`,
        '--dim-opacity': dim,
        '--fade-opacity': fade
      }}
      aria-hidden="true"
    >
      {/* Tilted Grid Stage */}
      <div className="grid-motion-stage">
        {rowItems.map((row, rIdx) => (
          <div
            key={rIdx}
            className={`grid-motion-row row-${rIdx}`}
            ref={(el) => (rowsRef.current[rIdx] = el)}
          >
            {row.map((item, iIdx) => {
              const coverSrc = typeof item === 'string' ? item : item.coverUrl || item.fallbackSvg;
              const title = typeof item === 'string' ? `Textbook ${iIdx + 1}` : item.title || 'Academic Textbook';
              const subject = typeof item === 'object' ? item.subject : '';

              return (
                <div key={`${rIdx}-${iIdx}`} className="grid-motion-card">
                  <div className="card-inner">
                    <img
                      src={coverSrc}
                      alt={title}
                      loading="lazy"
                      className="card-cover-img"
                      onError={(e) => {
                        if (typeof item === 'object' && item.fallbackSvg && e.currentTarget.src !== item.fallbackSvg) {
                          e.currentTarget.src = item.fallbackSvg;
                        }
                      }}
                    />
                    <div className="card-shine" />
                    {subject && (
                      <span className="card-subject-pill">{subject}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Spotlight illumination layer */}
      {spotlight > 0 && (
        <div
          className={`grid-motion-spotlight ${spotlightPos.active ? 'active' : ''}`}
          style={{
            background: `radial-gradient(circle 380px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(123, 203, 145, ${spotlight * 0.35}) 0%, rgba(102, 187, 122, ${spotlight * 0.15}) 40%, transparent 75%)`
          }}
        />
      )}

      {/* Background Dimming Layer for Hero Text Legibility */}
      <div className="grid-motion-dimmer" />

      {/* Edge Fading / Vignette Mask */}
      <div className="grid-motion-fade-mask" />
    </div>
  );
}

