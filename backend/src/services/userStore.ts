import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export type User = {
  id: string;
  email: string;
  name: string;
  provider: "google";
  providerId: string;
  createdAt: string;
};

const DATA_PATH = path.join(__dirname, "../../data/users.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
  }
}

function loadUsers(): User[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as User[];
  } catch (error) {
    console.error("[userStore] loadUsers failed:", error);
    return [];
  }
}

function saveUsers(users: User[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("[userStore] saveUsers failed:", error);
    throw error;
  }
}

export function findUserByProvider(providerId: string): User | null {
  const users = loadUsers();
  return users.find((u) => u.providerId === providerId) ?? null;
}

export function findUserById(userId: string): User | null {
  const users = loadUsers();
  return users.find((u) => u.id === userId) ?? null;
}

export function createUser(email: string, name: string, providerId: string): User {
  const users = loadUsers();

  const user: User = {
    id: randomUUID(),
    email,
    name,
    provider: "google",
    providerId,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  console.log("[userStore] user created:", user);

  return user;
}
