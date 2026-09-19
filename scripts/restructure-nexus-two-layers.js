const fs = require('fs');
const p = 'frontend/src/pages/NexusPage.tsx';
const raw = fs.readFileSync(p, 'utf8');
const usesCRLF = raw.includes('\r\n');
const eol = usesCRLF ? '\r\n' : '\n';
const lines = raw.split(/\r?\n/);

function findLineIndex(predicate, fromIndex = 0) {
  for (let i = fromIndex; i < lines.length; i++) {
    if (predicate(lines[i])) return i;
  }
  return -1;
}

// 1. Trouve la ligne d'ouverture de la div externe : `      style={{`
//    juste après `    <div` (ligne ~172) — on cherche `minHeight: "100vh",`
const minHeightIdx = findLineIndex((l) => l.includes('minHeight: "100vh",'));
if (minHeightIdx === -1) {
  console.log('❌ Ligne "minHeight: 100vh" introuvable — abandon.');
  process.exit(1);
}

// Remplace le bloc de style de la div externe (minHeight, padding) pour
// en faire un conteneur flex plein écran qui NE défile PAS lui-même.
lines[minHeightIdx] = lines[minHeightIdx].replace(
  'minHeight: "100vh",',
  'height: "100vh",\n        display: "flex",\n        flexDirection: "column",\n        overflow: "hidden",'
);

// Retire la ligne `padding: 24,` de ce même bloc (elle sera déplacée)
const paddingIdx = findLineIndex((l) => l.trim() === 'padding: 24,', minHeightIdx);
if (paddingIdx !== -1) {
  lines.splice(paddingIdx, 1);
}

// 2. Trouve `<header` et lui donne son propre padding + flexShrink:0
const headerOpenIdx = findLineIndex((l) => l.includes('<header'));
if (headerOpenIdx === -1) {
  console.log('❌ <header> introuvable — abandon.');
  process.exit(1);
}
// La ligne suivante est `style={{` — on insère flexShrink + padding juste après
const headerStyleIdx = headerOpenIdx + 1;
lines.splice(headerStyleIdx + 1, 0, '          flexShrink: 0,', '          padding: "24px 24px 0 24px",');

// 3. Trouve `</header>` et insère juste après l'ouverture du wrapper scrollable
const headerCloseIdx = findLineIndex((l) => l.includes('</header>'), headerOpenIdx);
if (headerCloseIdx === -1) {
  console.log('❌ </header> introuvable — abandon.');
  process.exit(1);
}
lines.splice(
  headerCloseIdx + 1,
  0,
  '',
  '      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>'
);

// 4. Trouve la toute dernière occurrence de `  );` suivie de `}` (fin du
//    composant principal) et insère la fermeture du wrapper juste avant
//    le dernier `</div>` qui la précède.
let lastReturnCloseIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === ');' && lines[i + 1] && lines[i + 1].trim() === '}') {
    lastReturnCloseIdx = i;
    break;
  }
}
if (lastReturnCloseIdx === -1) {
  console.log('❌ Fin du composant introuvable — abandon.');
  process.exit(1);
}
// La ligne juste avant `  );` est le `</div>` qui ferme la div externe.
const outerDivCloseIdx = lastReturnCloseIdx - 1;
lines.splice(outerDivCloseIdx, 0, '      </div>');

fs.writeFileSync(p, lines.join(eol), 'utf8');
console.log('✅ NexusPage.tsx restructuré en deux couches (header fixe + contenu scrollable).');
