import { sql } from "drizzle-orm";
import {
  integer,
  text,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
});

export const charts = sqliteTable(
  "charts",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`
    ).notNull(),
    key: text("key")
      .references(() => categories.key)
      .default("single"),
    week: text("week").notNull(),
    sequenceId: text("sequence_id").notNull(),
    json: text("json", { mode: "json" }).notNull(),
  },
  (table) => ({
    chartIdx: uniqueIndex("chart_idx").on(
      table.key,
      table.week,
      table.sequenceId
    ),
  })
);
