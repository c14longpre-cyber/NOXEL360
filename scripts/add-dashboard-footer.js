const fs = require('fs');
const p = 'frontend/src/app/pages/DashboardHome.tsx';
let c = fs.readFileSync(p, 'utf8');

const footerJsx = `
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
          </footer>
        </main>`;

const anchor = `          </section>
        </main>`;

if (c.includes(anchor)) {
  c = c.replace(anchor, `          </section>${footerJsx}`);
  fs.writeFileSync(p, c, 'utf8');
  console.log('Footer ajouté avec succès à DashboardHome.tsx');
} else {
  console.log('Ancre introuvable — vérifie manuellement la fin du fichier.');
}
