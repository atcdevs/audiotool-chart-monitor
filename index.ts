import {
  createTrackListUID,
  getCharts,
  getGenreCharts,
  getGenres,
} from "./helpers/api";
import { access, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { AxiosPromise } from "axios";

const RUNTIME = new Date();
const [DATE, HOUR] = RUNTIME.toISOString().split(/T|:/);
const YEAR = RUNTIME.getUTCFullYear();
const WEEK = (() => {
  const basis = new Date(YEAR, 0, 1);
  const delta = (RUNTIME.valueOf() - basis.valueOf()) / 86_400_000;
  return Math.ceil((delta + basis.getDay() + 1) / 7);
})();
const FILENAME = (() => {
  const [, month, day] = DATE.split("-");
  return `${YEAR}-${`${WEEK}`.padStart(2, "0")} (${month}-${day}@${HOUR}).json`;
})();

const monitorCharts = async <T extends AxiosPromise<TrackList>>(
  trackList: T,
  path: string
) => {
  const { data: query } = await trackList;
  const queryContent = JSON.stringify(query, null, 2);

  const rootDir = join(__dirname, "data", path);
  await mkdir(rootDir, { recursive: true });
  const filename = join(rootDir, FILENAME);
  const commitQuery = () => writeFile(filename, queryContent).then(() => true);

  const fileList = await readdir(rootDir);
  const mostRecent = fileList.sort().at(-1);
  if (!mostRecent) return await commitQuery();

  const mostRecentContent = await readFile(join(rootDir, mostRecent), "utf8");
  const mostRecentUID = createTrackListUID(JSON.parse(mostRecentContent));
  const queryUID = createTrackListUID(query);

  if (mostRecentUID !== queryUID) return await commitQuery();
  return false;
};

// Cache previous run data
// writeFile(join(__dirname, "data/prev_run.json"), JSON.stringify())
const CACHE = {
  timestamp: RUNTIME.valueOf(),
  date: DATE,
  hour: HOUR,
  year: YEAR,
  week: WEEK,
  genres: [] as string[],
};

// Monitor single charts
monitorCharts(getCharts({ limit: 10 }), "single_charts");

// Monitor all genre charts
getGenres().then(async ({ data: genreList }) => {
  const cacheFilePath = join(__dirname, "data/prev_run.json");

  return await access(cacheFilePath)
    .then<typeof CACHE>(async () => {
      const cacheContent = await readFile(cacheFilePath, "utf8");
      return JSON.parse(cacheContent);
    })
    .catch(() => null)
    .then((cache) =>
      Promise.all(
        genreList.map(({ key }) => {
          CACHE.genres.push(key);
          const path = `genre_charts/${key}`;

          const isCachedGenre = cache?.genres.includes(key) ?? false;
          const isCachedYear = cache?.year === YEAR;
          const isCachedWeek = cache?.week === WEEK;
          if (isCachedGenre && isCachedYear && isCachedWeek) return;

          return monitorCharts(getGenreCharts(key, YEAR, WEEK), path);
        })
      )
    )
    .then(() => writeFile(cacheFilePath, JSON.stringify(CACHE, null, 2)));
});
