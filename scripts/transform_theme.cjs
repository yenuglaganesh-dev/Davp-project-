const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Replace the root theme block
const p1 = css.indexOf(':root,');
const p2 = css.indexOf('/* Base Reset */');

if (p1 >= 0 && p2 > p1) {
  const replacement = `:root,
[data-theme="light"],
body.light-mode,
[data-theme="dark"],
body.dark-mode {
  --bg-primary: #FFFFFF;
  --bg-secondary: #FFF4EB;
  --bg-card: #FFFFFF;
  --bg-card-hover: #FFF9F5;
  --border-subtle: #F0E5DC;
  --border-hover: #F47721;

  --color-primary: #F47721;
  --color-primary-hover: #d96211;
  --color-primary-soft: #FFF4EB;
  --color-royal-blue: #F47721;
  --color-royal-blue-hover: #d96211;
  --color-blue-light: #F47721;
  --color-blue-accent: #F47721;
  --color-navy: #242424;
  --color-white: #FFFFFF;
  --color-text-primary: #242424;
  --color-text-secondary: #777777;
  --color-text-muted: #888888;

  --color-emerald: #10b981;
  --color-amber: #F47721;
  --color-rose: #f43f5e;
  --color-cyan: #F47721;
  --color-purple: #a855f7;

  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 26px;

  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 6px 18px rgba(244, 119, 33, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 32px rgba(244, 119, 33, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-glow: 0 0 25px rgba(244, 119, 33, 0.25);
}

`;
  css = css.substring(0, p1) + replacement + css.substring(p2);
  console.log('Replaced root block');
}

// 2. Perform color substitutions
// #C9C17C -> #F47721
css = css.replace(/#C9C17C/gi, '#F47721');
// #b5ad6a -> #d96211
css = css.replace(/#b5ad6a/gi, '#d96211');
// #a69e5d -> #bf5309
css = css.replace(/#a69e5d/gi, '#bf5309');
// #d6ce8d -> #fb923c
css = css.replace(/#d6ce8d/gi, '#fb923c');

// Replace dark backgrounds in dark mode or deep navy references
// #100600 -> #FFFFFF
css = css.replace(/#100600/gi, '#FFFFFF');
// #180b02 -> #FFF4EB
css = css.replace(/#180b02/gi, '#FFF4EB');
// #050b18 -> #FFFFFF
css = css.replace(/#050b18/gi, '#FFFFFF');
// #070e1f -> #FFF4EB
css = css.replace(/#070e1f/gi, '#FFF4EB');
// #030712 -> #242424
css = css.replace(/#030712/gi, '#242424');
// #07152b -> #FFF4EB
css = css.replace(/#07152b/gi, '#FFF4EB');

// Fix dark navbar and body backgrounds
css = css.replace(/background:\s*rgba\(5,\s*11,\s*24,\s*0\.7\);/g, 'background: rgba(255, 255, 255, 0.9);');
css = css.replace(/background:\s*rgba\(5,\s*11,\s*24,\s*0\.94\);/g, 'background: rgba(255, 255, 255, 0.98);');
css = css.replace(/background:\s*rgba\(5,\s*11,\s*24,\s*0\.98\);/g, 'background: rgba(255, 255, 255, 0.98);');

// Body default background
css = css.replace(/background-color:\s*var\(--bg-primary\);/g, 'background-color: #FFFFFF;');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Successfully transformed index.css');
