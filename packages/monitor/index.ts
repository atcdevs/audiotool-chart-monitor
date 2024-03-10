import { format } from "date-fns";

import { getCharts, getGenreCharts, getGenres } from "@atcdevs/atcm-api";
import { db } from "@atcdevs/atcm-data/db";
import { charts, categories } from "@atcdevs/atcm-data/db/schema";

const runtime = new Date();
const week = format(runtime, "yyyy-ww");

// Single Charts
const singleCharts = await getCharts();
await db
  .insert(charts)
  .values({
    json: singleCharts,
    sequenceId: singleCharts.tracks.map(({ key }) => key).join("-"),
    createdAt: runtime,
    week,
  })
  .onConflictDoNothing();

// Genre Charts (each)
for (const genre of await getGenres()) {
  const genreCharts = await getGenreCharts(genre.key, week);
  await db.transaction(async (tx) => {
    await tx.insert(categories).values(genre).onConflictDoNothing();
    await tx
      .insert(charts)
      .values({
        json: genreCharts,
        key: genre.key,
        sequenceId: genreCharts.tracks.map(({ key }) => key).join("-"),
        createdAt: runtime,
        week,
      })
      .onConflictDoNothing();
  });
}
