const fs = require('fs');
const p = 'frontend/src/app/pages/DashboardHome.tsx';
let c = fs.readFileSync(p, 'utf8');

const pattern = /\r?\n  useEffect\(\(\) => \{\r?\n    document\.body\.style\.overflow = "auto";\r?\n    return \(\) => \{ document\.body\.style\.overflow = "hidden"; \};\r?\n  \}, \[\]\);\r?\n/;

if (pattern.test(c)) {
  c = c.replace(pattern, '\n');
  fs.writeFileSync(p, c, 'utf8');
  console.log('useEffect retiré de DashboardHome.tsx');
} else {
  console.log('Motif non trouvé — vérifie manuellement.');
}
