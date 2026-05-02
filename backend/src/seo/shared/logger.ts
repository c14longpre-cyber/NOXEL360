export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, msg: string, meta?: unknown) {
  const ts = new Date().toISOString();
  if (meta !== undefined) console.log(`[${ts}] [${level}] ${msg}`, meta);
  else console.log(`[${ts}] [${level}] ${msg}`);
}

export const logger = {
  debug: (m: string, meta?: unknown) => log("debug", m, meta),
  info:  (m: string, meta?: unknown) => log("info", m, meta),
  warn:  (m: string, meta?: unknown) => log("warn", m, meta),
  error: (m: string, meta?: unknown) => log("error", m, meta),
};
