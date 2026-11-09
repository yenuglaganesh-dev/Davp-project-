// Deterministic and rich academic textbook cover SVG generator
// Provides authentic-looking academic textbook covers with subject-tailored illustrations,
// realistic book spines, edition tags, and publisher branding.

const SUBJECT_THEMES = {
  'Computer Science': {
    primary: '#7BCB91',
    accent: '#38bdf8',
    gradient: ['#7BCB91', '#66BB7A', '#388E55'],
    pattern: 'binary',
    icon: `<path d="M4 6h16M4 10h16M4 14h10M4 18h8" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>`
  },
  'Programming and Python': {
    primary: '#1e3a8a',
    accent: '#facc15',
    gradient: ['#172554', '#1e3a8a', '#2563eb'],
    pattern: 'brackets',
    icon: `<path d="M7 8l-4 4 4 4M17 8l4 4-4 4M13 5l-2 14" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>`
  },
  'Artificial Intelligence': {
    primary: '#311042',
    accent: '#c084fc',
    gradient: ['#1e0a2a', '#3b0764', '#581c87'],
    pattern: 'neural',
    icon: `<circle cx="6" cy="8" r="2" fill="#c084fc"/><circle cx="18" cy="8" r="2" fill="#c084fc"/><circle cx="12" cy="16" r="2.5" fill="#f43f5e"/><line x1="6" y1="8" x2="12" y2="16" stroke="#c084fc" stroke-width="1.5"/><line x1="18" y1="8" x2="12" y2="16" stroke="#c084fc" stroke-width="1.5"/>`
  },
  'Machine Learning': {
    primary: '#092540',
    accent: '#34d399',
    gradient: ['#041527', '#083344', '#0d9488'],
    pattern: 'mesh',
    icon: `<path d="M3 17l6-6 4 4 8-8" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/><circle cx="21" cy="7" r="2" fill="#34d399"/>`
  },
  'Data Science': {
    primary: '#162032',
    accent: '#60a5fa',
    gradient: ['#7BCB91', '#66BB7A', '#388E55'],
    pattern: 'chart',
    icon: `<rect x="4" y="13" width="3" height="7" rx="1" fill="#60a5fa"/><rect x="10.5" y="8" width="3" height="12" rx="1" fill="#93c5fd"/><rect x="17" y="4" width="3" height="16" rx="1" fill="#38bdf8"/>`
  },
  'Machine Learning': {
    primary: '#092540',
    accent: '#34d399',
    gradient: ['#041527', '#083344', '#0d9488'],
    pattern: 'mesh',
    icon: `<path d="M3 17l6-6 4 4 8-8" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/><circle cx="21" cy="7" r="2" fill="#34d399"/>`
  },
  'Algorithms and Data Structures': {
    primary: '#0b192c',
    accent: '#38bdf8',
    gradient: ['#0a192f', '#1e3a8a', '#0284c7'],
    pattern: 'binary',
    icon: `<circle cx="6" cy="6" r="2.5" fill="#38bdf8"/><circle cx="18" cy="6" r="2.5" fill="#38bdf8"/><circle cx="12" cy="18" r="2.5" fill="#38bdf8"/><line x1="6" y1="6" x2="12" y2="18" stroke="#38bdf8" stroke-width="2"/><line x1="18" y1="6" x2="12" y2="18" stroke="#38bdf8" stroke-width="2"/>`
  },
  'Data Analysis and Data Mining': {
    primary: '#131e3a',
    accent: '#818cf8',
    gradient: ['#7BCB91', '#9BE0AB', '#66BB7A'],
    pattern: 'chart',
    icon: `<path d="M3 18h18M6 14v4M12 9v9M18 5v13" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'Python Programming': {
    primary: '#1e3a8a',
    accent: '#facc15',
    gradient: ['#172554', '#1e3a8a', '#2563eb'],
    pattern: 'brackets',
    icon: `<path d="M7 8l-4 4 4 4M17 8l4 4-4 4M13 5l-2 14" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>`
  },
  'C and C++': {
    primary: '#7BCB91',
    accent: '#06b6d4',
    gradient: ['#66BB7A', '#7BCB91', '#9BE0AB'],
    pattern: 'brackets',
    icon: `<path d="M12 4a8 8 0 1 0 8 8M16 12h4M18 10v4" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>`
  },
  'JavaScript': {
    primary: '#1c1917',
    accent: '#facc15',
    gradient: ['#1c1917', '#451a03', '#854d0e'],
    pattern: 'brackets',
    icon: `<rect x="4" y="4" width="16" height="16" rx="2" stroke="#facc15" stroke-width="2"/><text x="12" y="15" fill="#facc15" font-family="monospace" font-weight="bold" font-size="9" text-anchor="middle">JS</text>`
  },
  'Linux and Unix': {
    primary: '#0a1d2d',
    accent: '#f97316',
    gradient: ['#041019', '#0c2438', '#164e63'],
    pattern: 'terminal',
    icon: `<path d="M4 17l6-5-6-5M12 19h8" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'Mathematics': {
    primary: '#1c1917',
    accent: '#f97316',
    gradient: ['#1c1917', '#292524', '#7c2d12'],
    pattern: 'curves',
    icon: `<path d="M5 16c2-8 4-8 7-8s5 8 7 8" stroke="#f97316" stroke-width="2.5" fill="none" stroke-linecap="round"/><line x1="4" y1="12" x2="20" y2="12" stroke="#fdba74" stroke-width="1" stroke-dasharray="2 2"/>`
  },
  'Statistics': {
    primary: '#142838',
    accent: '#2dd4bf',
    gradient: ['#7BCB91', '#66BB7A', '#059669'],
    pattern: 'bell',
    icon: `<path d="M3 18c4 0 5-12 9-12s5 12 9 12" stroke="#2dd4bf" stroke-width="2.5" fill="none"/>`
  },
  'Physics': {
    primary: '#0c1222',
    accent: '#818cf8',
    gradient: ['#0c1222', '#1e1b4b', '#3730a3'],
    pattern: 'orbit',
    icon: `<ellipse cx="12" cy="12" rx="9" ry="4" stroke="#818cf8" stroke-width="1.5" fill="none" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" stroke="#a5b4fc" stroke-width="1.5" fill="none" transform="rotate(30 12 12)"/><circle cx="12" cy="12" r="2.5" fill="#f43f5e"/>`
  },
  'Chemistry': {
    primary: '#111827',
    accent: '#ec4899',
    gradient: ['#111827', '#4a044e', '#831843'],
    pattern: 'benzene',
    icon: `<polygon points="12,4 19,8 19,16 12,20 5,16 5,8" stroke="#ec4899" stroke-width="1.5" fill="none"/><polygon points="12,7 16.5,9.6 16.5,14.4 12,17 7.5,14.4 7.5,9.6" stroke="#f472b6" stroke-width="1" fill="none" stroke-dasharray="2 2"/>`
  },
  'Biology': {
    primary: '#062817',
    accent: '#4ade80',
    gradient: ['#052e16', '#064e3b', '#047857'],
    pattern: 'dna',
    icon: `<path d="M6 4c3 4 9 4 12 8s-9 4-12 8" stroke="#4ade80" stroke-width="2" fill="none"/><path d="M18 4c-3 4-9 4-12 8s9 4 12 8" stroke="#86efac" stroke-width="2" fill="none"/>`
  },
  'Environmental Science': {
    primary: '#042719',
    accent: '#22c55e',
    gradient: ['#022c22', '#14532d', '#15803d'],
    pattern: 'leaf',
    icon: `<path d="M12 2C8 6 6 12 6 17a6 6 0 0 0 12 0c0-5-2-11-6-15z" stroke="#22c55e" stroke-width="2" fill="none"/><path d="M12 2v18" stroke="#86efac" stroke-width="1.5"/>`
  },
  'Geography': {
    primary: '#172554',
    accent: '#38bdf8',
    gradient: ['#7BCB91', '#66BB7A', '#0284c7'],
    pattern: 'globe',
    icon: `<circle cx="12" cy="12" r="8" stroke="#38bdf8" stroke-width="1.5" fill="none"/><ellipse cx="12" cy="12" rx="4" ry="8" stroke="#7dd3fc" stroke-width="1" fill="none"/><line x1="4" y1="12" x2="20" y2="12" stroke="#7dd3fc" stroke-width="1"/>`
  },
  'GIS and Remote Sensing': {
    primary: '#0f2942',
    accent: '#06b6d4',
    gradient: ['#082f49', '#0e7490', '#155e75'],
    pattern: 'satellite',
    icon: `<circle cx="12" cy="12" r="3" fill="#06b6d4"/><path d="M12 3a9 9 0 0 1 9 9M12 6a6 6 0 0 1 6 6" stroke="#22d3ee" stroke-width="2" fill="none" stroke-linecap="round"/>`
  },
  'Engineering': {
    primary: '#18181b',
    accent: '#eab308',
    gradient: ['#18181b', '#27272a', '#451a03'],
    pattern: 'gears',
    icon: `<circle cx="12" cy="12" r="4" stroke="#eab308" stroke-width="2" fill="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8l2.2 2.2M5 19l2.2-2.2M16.8 7.2l2.2-2.2" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>`
  },
  'Economics': {
    primary: '#1c1917',
    accent: '#10b981',
    gradient: ['#1c1917', '#064e3b', '#065f46'],
    pattern: 'currency',
    icon: `<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'Business Management': {
    primary: '#172554',
    accent: '#f59e0b',
    gradient: ['#7BCB91', '#9BE0AB', '#388E55'],
    pattern: 'strategy',
    icon: `<rect x="3" y="7" width="18" height="13" rx="2" stroke="#f59e0b" stroke-width="2" fill="none"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#fbbf24" stroke-width="2"/>`
  },
  'General Academic Textbooks': {
    primary: '#7BCB91',
    accent: '#818cf8',
    gradient: ['#090d16', '#1e293b', '#334155'],
    pattern: 'academic',
    icon: `<path d="M12 3L2 8l10 5 10-5-10-5z" stroke="#818cf8" stroke-width="2" fill="none"/><path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" stroke="#a5b4fc" stroke-width="1.5" fill="none"/>`
  }
};

/**
 * Escapes text for XML/SVG safety
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an SVG Data URI for a portrait academic book cover (300 x 400, aspectRatio = 0.75)
 */
export function generateBookCoverSvg({
  title = 'Academic Textbook',
  author = 'Department Faculty',
  subject = 'Computer Science',
  publisher = 'Open Academic Press',
  edition = 'Open Access Edition',
  year = 2024,
  isbn = '978-0-123456-78-9'
}) {
  const theme = SUBJECT_THEMES[subject] || SUBJECT_THEMES['General Academic Textbooks'];
  const safeTitle = escapeXml(title);
  const safeAuthor = escapeXml(author);
  const safeSubject = escapeXml(subject.toUpperCase());
  const safePublisher = escapeXml(publisher);
  const safeEdition = escapeXml(edition);
  const safeIsbn = escapeXml(isbn);

  // Split title if long into 2 lines
  let titleLine1 = safeTitle;
  let titleLine2 = '';
  if (safeTitle.length > 22) {
    const words = safeTitle.split(' ');
    let mid = Math.ceil(words.length / 2);
    titleLine1 = words.slice(0, mid).join(' ');
    titleLine2 = words.slice(mid).join(' ');
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.gradient[0]}" />
      <stop offset="50%" stop-color="${theme.gradient[1]}" />
      <stop offset="100%" stop-color="${theme.gradient[2]}" />
    </linearGradient>
    <linearGradient id="spineShadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="50%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.4)" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Cover Background -->
  <rect x="0" y="0" width="300" height="400" rx="8" fill="url(#bgGrad)" />

  <!-- Subtle grid/pattern -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="0.8">
    <line x1="30" y1="0" x2="30" y2="400" />
    <line x1="80" y1="0" x2="80" y2="400" />
    <line x1="150" y1="0" x2="150" y2="400" />
    <line x1="220" y1="0" x2="220" y2="400" />
    <line x1="0" y1="60" x2="300" y2="60" />
    <line x1="0" y1="160" x2="300" y2="160" />
    <line x1="0" y1="280" x2="300" y2="280" />
    <circle cx="210" cy="190" r="70" fill="none" stroke="${theme.accent}" stroke-width="1.5" />
    <circle cx="210" cy="190" r="100" fill="none" stroke="${theme.accent}" stroke-width="0.7" stroke-dasharray="4 4" />
  </g>

  <!-- Spine Shadow (Book binding effect on left edge) -->
  <rect x="0" y="0" width="16" height="400" fill="url(#spineShadow)" />
  <line x1="16" y1="0" x2="16" y2="400" stroke="rgba(255,255,255,0.12)" stroke-width="1" />

  <!-- Top Subject Banner -->
  <g transform="translate(28, 28)">
    <rect x="0" y="0" width="14" height="4" rx="2" fill="${theme.accent}" />
    <text x="22" y="5" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="700" fill="${theme.accent}" letter-spacing="1.5">
      ${safeSubject}
    </text>
  </g>

  <!-- Central Scientific / Academic Symbol Watermark -->
  <g transform="translate(180, 140) scale(3.5)" opacity="0.25">
    ${theme.icon}
  </g>

  <!-- Decorative Academic Accent Stripe -->
  <rect x="28" y="70" width="50" height="3" rx="1.5" fill="${theme.accent}" />

  <!-- Book Title -->
  <text x="28" y="112" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="21" font-weight="800" fill="#ffffff" letter-spacing="-0.3">
    ${titleLine1}
  </text>
  ${titleLine2 ? `
  <text x="28" y="138" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="21" font-weight="800" fill="#ffffff" letter-spacing="-0.3">
    ${titleLine2}
  </text>` : ''}

  <!-- Edition / Badge Tag -->
  <g transform="translate(28, ${titleLine2 ? 160 : 138})">
    <rect x="0" y="0" width="115" height="22" rx="11" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <circle cx="12" cy="11" r="3.5" fill="${theme.accent}"/>
    <text x="22" y="14.5" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="600" fill="#e2e8f0" letter-spacing="0.5">
      ${safeEdition}
    </text>
  </g>

  <!-- Author Section -->
  <g transform="translate(28, 260)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">
      AUTHOR / EDITOR
    </text>
    <text x="0" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">
      ${safeAuthor}
    </text>
  </g>

  <!-- Bottom Divider -->
  <line x1="28" y1="316" x2="272" y2="316" stroke="rgba(255,255,255,0.12)" stroke-width="1" />

  <!-- Publisher and Metadata Footer -->
  <g transform="translate(28, 335)">
    <!-- Publisher text -->
    <text x="0" y="10" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="700" fill="#f1f5f9">
      ${safePublisher}
    </text>
    <text x="0" y="24" font-family="'JetBrains Mono', monospace" font-size="8" fill="#94a3b8">
      Pub: ${year} • ${safeIsbn}
    </text>

    <!-- Barcode simulation on right -->
    <g transform="translate(190, -4)" opacity="0.75">
      <rect x="0" y="0" width="2" height="26" fill="#ffffff"/>
      <rect x="4" y="0" width="3" height="26" fill="#ffffff"/>
      <rect x="9" y="0" width="1" height="26" fill="#ffffff"/>
      <rect x="12" y="0" width="2" height="26" fill="#ffffff"/>
      <rect x="16" y="0" width="4" height="26" fill="#ffffff"/>
      <rect x="22" y="0" width="1" height="26" fill="#ffffff"/>
      <rect x="25" y="0" width="3" height="26" fill="#ffffff"/>
      <rect x="30" y="0" width="2" height="26" fill="#ffffff"/>
      <rect x="34" y="0" width="3" height="26" fill="#ffffff"/>
      <rect x="39" y="0" width="1" height="26" fill="#ffffff"/>
      <rect x="42" y="0" width="2" height="26" fill="#ffffff"/>
      <rect x="46" y="0" width="4" height="26" fill="#ffffff"/>
    </g>
  </g>

  <!-- Top-right Academic Seal -->
  <g transform="translate(255, 38)" opacity="0.8">
    <circle cx="0" cy="0" r="14" fill="none" stroke="${theme.accent}" stroke-width="1.2" stroke-dasharray="3 2"/>
    <circle cx="0" cy="0" r="10" fill="none" stroke="${theme.accent}" stroke-width="0.8"/>
    <text x="0" y="3" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7" font-weight="800" fill="${theme.accent}" text-anchor="middle">
      EDU
    </text>
  </g>

  <!-- Subtle corner sheen highlight -->
  <polygon points="0,0 70,0 0,70" fill="rgba(255,255,255,0.03)" />
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

