// backend/src/services/lighthouseRunner.ts
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

export async function runLighthouse(url: string, lighthouseConfig: any) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--metrics-recording-only",
      "--no-first-run",
    ],
  });

  try {
    const result = await lighthouse(
      url,
      { port: chrome.port, output: "json", logLevel: "silent" },
      lighthouseConfig
    );

    return result?.lhr ?? null;
  } catch {
    return null;
  } finally {
    await chrome.kill();
  }
}
