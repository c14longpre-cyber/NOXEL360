"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByProvider = findUserByProvider;
exports.findUserById = findUserById;
exports.createUser = createUser;
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_PATH = path_1.default.join(__dirname, "../../data/users.json");
function ensureDataFile() {
    const dir = path_1.default.dirname(DATA_PATH);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(DATA_PATH)) {
        fs_1.default.writeFileSync(DATA_PATH, "[]", "utf8");
    }
}
function loadUsers() {
    try {
        ensureDataFile();
        const raw = fs_1.default.readFileSync(DATA_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed;
    }
    catch (error) {
        console.error("[userStore] loadUsers failed:", error);
        return [];
    }
}
function saveUsers(users) {
    try {
        ensureDataFile();
        fs_1.default.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), "utf8");
    }
    catch (error) {
        console.error("[userStore] saveUsers failed:", error);
        throw error;
    }
}
function findUserByProvider(providerId) {
    const users = loadUsers();
    return users.find((u) => u.providerId === providerId) ?? null;
}
function findUserById(userId) {
    const users = loadUsers();
    return users.find((u) => u.id === userId) ?? null;
}
function createUser(email, name, providerId) {
    const users = loadUsers();
    const user = {
        id: (0, crypto_1.randomUUID)(),
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
