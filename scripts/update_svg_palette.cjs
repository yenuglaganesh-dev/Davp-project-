const fs = require('fs');
let code = fs.readFileSync('src/utils/bookSvgGenerator.js', 'utf8');

// Replace dark default palette with orange academic palette
code = code.replace(/primary:\s*'#0f172a'/g, "primary: '#F47721'");
code = code.replace(/\['#0f172a',\s*'#1e293b',\s*'#0369a1'\]/g, "['#F47721', '#ea580c', '#c2410c']");
code = code.replace(/\['#0f172a',\s*'#1e3a8a',\s*'#1d4ed8'\]/g, "['#F47721', '#ea580c', '#d97706']");
code = code.replace(/\['#0f172a',\s*'#312e81',\s*'#4338ca'\]/g, "['#F47721', '#fb923c', '#ea580c']");
code = code.replace(/\['#020617',\s*'#0f172a',\s*'#0369a1'\]/g, "['#ea580c', '#F47721', '#fb923c']");
code = code.replace(/\['#0f172a',\s*'#134e4a',\s*'#047857'\]/g, "['#F47721', '#ea580c', '#059669']");
code = code.replace(/\['#0f172a',\s*'#1e3a8a',\s*'#0284c7'\]/g, "['#F47721', '#ea580c', '#0284c7']");
code = code.replace(/\['#0f172a',\s*'#1e3a8a',\s*'#3b82f6'\]/g, "['#F47721', '#fb923c', '#d97706']");

fs.writeFileSync('src/utils/bookSvgGenerator.js', code, 'utf8');
console.log('Successfully updated bookSvgGenerator.js');
