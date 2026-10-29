const fs = require('fs');
const files = ['tests/links.test.ts', 'tests/seo.test.ts', 'tests/technical.test.ts'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/headers:\s*\{([^}]*)\},([\s\n]*)title:/g, 'headers: {$1},$2mobileLayoutResults: [],$2title:');
    fs.writeFileSync(f, content);
  }
});
