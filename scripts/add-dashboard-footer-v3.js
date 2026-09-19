const fs = require('fs');
const p = 'frontend/src/app/pages/DashboardHome.tsx';
let c = fs.readFileSync(p, 'utf8');

// D'abord, on retire le footer mal inséré par le script précédent (buggé),
// qui a supprimé le </main> par erreur.
const brokenFooterPattern = /\r?\n {10}<footer[\s\S]*?<\/footer>/;
if (brokenFooterPattern.test(c)) {
  c = c.replace(brokenFooterPattern, '');
  console.log('Footer buggé (v1) retiré.');
}

const footerBlock = `
          <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48, padding: "32px 0", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            <p style={{ maxWidth: 720, margin: "0 auto 16px", lineHeight: 1.6 }}>
              NOXEL360 connects NOXEL SEO, NOXEL Forge, and Nexus in one dashboard for search
              visibility, verified backlinks, and language intelligence.
            </p>
            <nav aria-label="Site links" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 14 }}>
              <a href="https://noxelseo.com" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL SEO</a>
              <a href="https://noxelforge.com" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL Forge</a>
              <Link to="/nexus" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL Nexus</Link>
              <a href="/learn" style={{ color: "#3ddc84", textDecoration: "none" }}>Learn</a>
              <Link to="/app/account" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Account</Link>
              <Link to="/privacy" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Privacy</Link>
              <Link to="/terms" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Terms</Link>
            </nav>
            <p style={{ margin: 0 }}>© 2026 NOXEL360. All rights reserved.</p>
          </footer>`;

const anchorPattern = /( {10}<\/section>)(\r?\n {8}<\/main>)/;

if (anchorPattern.test(c)) {
  c = c.replace(anchorPattern, (match, sectionClose, mainClosePart) => {
    return sectionClose + footerBlock + mainClosePart;
  });
  fs.writeFileSync(p, c, 'utf8');
  console.log('Footer ajouté correctement (v3) à DashboardHome.tsx — </main> préservé.');
} else {
  console.log('Ancre introuvable. Vérifie la fin du fichier manuellement.');
}
