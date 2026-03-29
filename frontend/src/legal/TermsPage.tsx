export default function TermsPage() {
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

        <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>Terms of Service</h1>
        <p style={{ opacity: 0.82, lineHeight: 1.7 }}>
          Effective date: March 29, 2026
        </p>

        <section style={{ marginTop: 28, lineHeight: 1.8 }}>
          <p>
            These Terms of Service govern your access to and use of the Noxel360
            website, platform, and related services. By using Noxel360, you
            agree to these Terms.
          </p>

          <h2 style={{ marginTop: 28 }}>1. Use of the Service</h2>
          <p>
            You may use Noxel360 only in compliance with applicable laws and
            these Terms. You are responsible for your account activity and for
            keeping your credentials secure.
          </p>

          <h2 style={{ marginTop: 28 }}>2. Accounts</h2>
          <p>
            You may access Noxel360 using supported authentication providers.
            You agree to provide accurate information and keep your access
            methods secure.
          </p>

          <h2 style={{ marginTop: 28 }}>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for unlawful, harmful, or abusive activity.</li>
            <li>Attempt unauthorized access to any system or account.</li>
            <li>Interfere with the operation, security, or reliability of the platform.</li>
            <li>Reverse engineer, copy, or misuse protected parts of the service beyond permitted use.</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>4. Intellectual Property</h2>
          <p>
            Noxel360, its branding, software, content, and service components are
            owned by Noxel360 or its licensors and are protected by applicable
            intellectual property laws.
          </p>

          <h2 style={{ marginTop: 28 }}>5. Third-Party Services</h2>
          <p>
            Noxel360 may integrate with third-party providers, including social
            login and platform services. We are not responsible for third-party
            services or their independent terms and policies.
          </p>

          <h2 style={{ marginTop: 28 }}>6. Availability</h2>
          <p>
            We may update, modify, suspend, or discontinue parts of the service
            at any time. We do not guarantee uninterrupted availability.
          </p>

          <h2 style={{ marginTop: 28 }}>7. Disclaimers</h2>
          <p>
            The service is provided on an “as is” and “as available” basis,
            without warranties of any kind, to the fullest extent permitted by
            law.
          </p>

          <h2 style={{ marginTop: 28 }}>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Noxel360 will not be liable
            for indirect, incidental, special, consequential, or punitive
            damages, or for loss of data, profits, or business opportunities.
          </p>

          <h2 style={{ marginTop: 28 }}>9. Termination</h2>
          <p>
            We may suspend or terminate access to the service if these Terms are
            violated or if necessary to protect the platform, users, or legal
            compliance.
          </p>

          <h2 style={{ marginTop: 28 }}>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            service after changes means you accept the revised Terms.
          </p>

          <h2 style={{ marginTop: 28 }}>11. Contact</h2>
          <p>
            For questions about these Terms, contact:
            <br />
            <strong>c.14longpre@gmail.com</strong>
          </p>
        </section>
      </div>
    </main>
  );
}