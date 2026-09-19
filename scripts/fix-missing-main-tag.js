const fs = require('fs');
const p = 'frontend/src/app/pages/DashboardHome.tsx';
let c = fs.readFileSync(p, 'utf8');

if (c.includes('</main>')) {
  console.log('</main> est déjà présent — rien à faire.');
} else {
  const anchor = /( {10}<\/footer>)(\r?\n {6}<\/div>)/;
  if (anchor.test(c)) {
    c = c.replace(anchor, (match, footerClose, divClose) => {
      return footerClose + '\r\n        </main>' + divClose;
    });
    fs.writeFileSync(p, c, 'utf8');
    console.log('</main> réinséré avec succès après </footer>.');
  } else {
    console.log('Ancre introuvable. Affichage des 8 dernières lignes pour diagnostic :');
    console.log(c.split(/\r?\n/).slice(-8).join('\n'));
  }
}
