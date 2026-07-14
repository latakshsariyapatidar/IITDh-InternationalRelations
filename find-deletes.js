const fs = require('fs');
const path = require('path');
const dir = 'frontend/src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  const content = fs.readFileSync(p, 'utf8');
  const matches = content.match(/delete\s+payload\.[a-zA-Z0-9_]+/g);
  if (matches) {
    console.log(`[${f}] ${matches.join(', ')}`);
  }
});
