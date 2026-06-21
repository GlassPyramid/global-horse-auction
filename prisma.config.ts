import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = `file:${path.join(process.cwd(), "prisma/dev.db")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    async adapter() {
      const { createClient } = await import("@libsql/client");
      const client = createClient({ url: dbUrl });
      return new PrismaLibSql(client);
    },
  },
  datasource: {
    url: dbUrl,
  },
});
