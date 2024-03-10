import { type Config } from "drizzle-kit";

export default {
  driver: "turso",
  dbCredentials: {
    url: process.env["TURSO_DATABASE_URL"]!,
    authToken: process.env["TURSO_AUTH_TOKEN"],
  },
  out: "./migrations",
  schema: "./db/schema.ts",
  strict: true,
  verbose: true,
} satisfies Config;
