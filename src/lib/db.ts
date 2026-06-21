import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Lazy import at runtime so it doesn't break build when DB isn't configured
  if (typeof window !== "undefined") {
    throw new Error("Prisma cannot be used in the browser");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@libsql/client") as AnyClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql") as AnyClient;
  const path = require("node:path") as typeof import("node:path");

  const libsql = createClient({
    url: `file:${path.join(process.cwd(), "prisma/dev.db")}`,
  });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter });
}

export const db: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
