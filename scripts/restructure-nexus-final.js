const fs = require('fs');
const p = 'frontend/src/pages/NexusPage.tsx';
const raw = fs.readFileSync(p, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';

// Normalise en \n pour travailler, on ré-normalisera à l'écriture
let c = raw.replace(/\r\n/g, '\n');

function replaceOnce(content, search, replacement, label) {
  const count = content.split(search).length - 1;
  if (count !== 1) {
    console.log(`❌ [${label}] trouvé ${count} fois (attendu 1) — abandon, rien n'est modifié.`);
    process.exit(1);
  }
  return content.replace(search, replacement);
}

// ---------------------------------------------------------------------------
// A. Div externe : minHeight:100vh + padding:24 -> flex column plein écran,
//    sans padding (déplacé plus bas), qui ne défile pas elle-même.
// ---------------------------------------------------------------------------
const anchorA = `      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #060810 0%, #0A0D18 100%)",
        color: "white",
        padding: 24,
      }}
    >
      <TranslationStatusBanner />`;

const replacementA = `      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "linear-gradient(180deg, #060810 0%, #0A0D18 100%)",
        color: "white",
      }}
    >
      <TranslationStatusBanner />`;

c = replaceOnce(c, anchorA, replacementA, 'A - div externe');

// ---------------------------------------------------------------------------
// B. Header : ajoute flexShrink:0 + son propre padding (puisque la div
//    externe n'en a plus).
// ---------------------------------------------------------------------------
const anchorB = `      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >`;

const replacementB = `      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
          flexShrink: 0,
          padding: "24px 24px 0 24px",
        }}
      >`;

c = replaceOnce(c, anchorB, replacementB, 'B - header');

// ---------------------------------------------------------------------------
// C. Juste après </header>, ouvre le conteneur scrollable qui englobera
//    tout le reste (badge langue, recherche, grille pays/détail, carte).
// ---------------------------------------------------------------------------
const anchorC = `      </header>

      {/* Current language badge */}`;

const replacementC = `      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>

      {/* Current language badge */}`;

c = replaceOnce(c, anchorC, replacementC, 'C - ouverture wrapper scrollable');

// ---------------------------------------------------------------------------
// D. Juste après la fermeture de la carte (et avant la fermeture de la div
//    externe), ferme le conteneur scrollable ouvert en C.
// ---------------------------------------------------------------------------
const anchorD = `        <NexusLanguageMap
          currentLanguage={language}
          onSelectLanguage={handleMapSelectLanguage}
        />
      </div>
    </div>
  );
}

function InfoRow`;

const replacementD = `        <NexusLanguageMap
          currentLanguage={language}
          onSelectLanguage={handleMapSelectLanguage}
        />
      </div>
      </div>
    </div>
  );
}

function InfoRow`;

c = replaceOnce(c, anchorD, replacementD, 'D - fermeture wrapper scrollable');

// ---------------------------------------------------------------------------
fs.writeFileSync(p, c.replace(/\n/g, eol), 'utf8');
console.log('✅ Les 4 modifications ont été appliquées avec succès à NexusPage.tsx.');
