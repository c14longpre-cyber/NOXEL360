import { useI18n } from "@/useI18n";

export default function PrivacyPage() {
  const { t } = useI18n();

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
            {t("legal.backToNoxel")}
          </a>
        </div>

        <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>
          {t("privacy.title")}
        </h1>

        <p style={{ opacity: 0.82, lineHeight: 1.7 }}>
          {t("legal.effectiveDateLabel")}: {t("legal.effectiveDateValue")}
        </p>

        <section style={{ marginTop: 28, lineHeight: 1.8 }}>
          <p>{t("privacy.intro")}</p>

          <h2 style={{ marginTop: 28 }}>{t("privacy.section1.title")}</h2>
          <p>{t("privacy.section1.lead")}</p>
          <ul>
            <li>{t("privacy.section1.item1")}</li>
            <li>{t("privacy.section1.item2")}</li>
            <li>{t("privacy.section1.item3")}</li>
            <li>{t("privacy.section1.item4")}</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>{t("privacy.section2.title")}</h2>
          <p>{t("privacy.section2.lead")}</p>
          <ul>
            <li>{t("privacy.section2.item1")}</li>
            <li>{t("privacy.section2.item2")}</li>
            <li>{t("privacy.section2.item3")}</li>
            <li>{t("privacy.section2.item4")}</li>
            <li>{t("privacy.section2.item5")}</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>{t("privacy.section3.title")}</h2>
          <p>{t("privacy.section3.body")}</p>

          <h2 style={{ marginTop: 28 }}>{t("privacy.section4.title")}</h2>
          <p>{t("privacy.section4.body")}</p>

          <h2 style={{ marginTop: 28 }}>{t("privacy.section5.title")}</h2>
          <p>
            {t("privacy.section5.body")}
            <br />
            <strong>c.14longpre@gmail.com</strong>
          </p>
        </section>
      </div>
    </main>
  );
}

