import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export type SessionPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export function createSession(userId: string): string {
  const payload: SessionPayload = {
    userId,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded !== "object") {
      return null;
    }

    return {
      userId: decoded.userId,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.warn("[verifySession] invalid token");
    return null;
  }
}
