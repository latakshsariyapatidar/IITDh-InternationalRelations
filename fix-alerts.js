const fs = require('fs');
const path = require('path');
const dir = 'frontend/src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/catch\s*\(\s*err\s*\)\s*\{\s*alert\('([^']+)'\);\s*\}/g, 'catch (err) { alert(\'$1: \' + (err.response?.data?.message || err.message)); }');
  fs.writeFileSync(p, content);
});
console.log('Done!');
