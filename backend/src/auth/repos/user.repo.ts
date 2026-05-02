export type UserRecord = {
  id: string;
  emailPrimary: string | null;
  emailNormalized: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

const users = new Map<string, UserRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const value = String(email || "").trim().toLowerCase();
  return value || null;
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  return users.get(userId) || null;
}

export async function findUserByEmail(email: string | null | undefined): Promise<UserRecord | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  for (const user of users.values()) {
    if (user.emailNormalized === normalized) {
      return user;
    }
  }

  return null;
}

export async function createUser(input: {
  emailPrimary?: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  avatarUrl?: string | null;
}): Promise<UserRecord> {
  const now = new Date().toISOString();

  const user: UserRecord = {
    id: randomId("usr"),
    emailPrimary: input.emailPrimary || null,
    emailNormalized: normalizeEmail(input.emailPrimary),
    emailVerified: Boolean(input.emailVerified),
    displayName: input.displayName || null,
    avatarUrl: input.avatarUrl || null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
  };

  users.set(user.id, user);
  return user;
}

export async function updateUser(userId: string, patch: Partial<UserRecord>): Promise<UserRecord | null> {
  const current = users.get(userId);
  if (!current) return null;

  const next: UserRecord = {
    ...current,
    ...patch,
    emailNormalized:
      patch.emailPrimary !== undefined
        ? normalizeEmail(patch.emailPrimary)
        : current.emailNormalized,
    updatedAt: new Date().toISOString(),
  };

  users.set(userId, next);
  return next;
}

export async function touchUserLastLogin(userId: string): Promise<void> {
  const current = users.get(userId);
  if (!current) return;

  users.set(userId, {
    ...current,
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export function dumpUsers(): UserRecord[] {
  return Array.from(users.values());
}
