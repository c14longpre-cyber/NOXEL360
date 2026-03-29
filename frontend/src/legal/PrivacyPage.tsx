export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05070d",
        color: "#eef2ff",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          background: "rgba(11,18,32,.88)",
          border: "1px solid rgba(14,171,142,.46)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 18px 60px rgba(0,0,0,.35)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <a
            href="/dashboard"
            style={{
              color: "#3CDE6A",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Back to Noxel360
          </a>
        </div>

        <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>Privacy Policy</h1>
        <p style={{ opacity: 0.82, lineHeight: 1.7 }}>
          Effective date: March 29, 2026
        </p>

        <section style={{ marginTop: 28, lineHeight: 1.8 }}>
          <p>
            Noxel360 respects your privacy. This Privacy Policy explains how we
            collect, use, store, and protect information when you use the
            Noxel360 platform, website, and connected sign-in providers.
          </p>

          <h2 style={{ marginTop: 28 }}>1. Information We Collect</h2>
          <p>We may collect the following categories of information:</p>
          <ul>
            <li>Account information such as your name, email address, and profile image.</li>
            <li>Authentication information from connected sign-in providers.</li>
            <li>Platform usage data such as pages visited, actions performed, and settings used.</li>
            <li>Technical data such as browser type, device data, IP address, and log information.</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>2. How We Use Information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Provide and improve Noxel360 services.</li>
            <li>Authenticate users and secure accounts.</li>
            <li>Support account linking and connected provider access.</li>
            <li>Maintain service reliability, analytics, and security monitoring.</li>
            <li>Communicate service-related notices and updates.</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>3. OAuth and Connected Accounts</h2>
          <p>
            If you sign in with a third-party provider such as Google, Microsoft,
            Facebook, LinkedIn, or TikTok, we may receive basic profile
            information authorized by you through that provider.
          </p>

          <h2 style={{ marginTop: 28 }}>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share limited data
            with service providers only when needed to operate and secure the platform.
          </p>

          <h2 style={{ marginTop: 28 }}>5. Contact</h2>
          <p>
            For privacy questions, contact:
            <br />
            <strong>c.14longpre@gmail.com</strong>
          </p>
        </section>
      </div>
    </main>
  );
}