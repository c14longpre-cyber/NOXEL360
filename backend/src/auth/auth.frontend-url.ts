export function getFrontendUrl(): string {
  const value = process.env.FRONTEND_URL;

  if (value && value.trim()) {
    return value.trim();
  }

  return "http://localhost:5173";
}