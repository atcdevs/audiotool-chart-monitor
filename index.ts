import { access, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { getIsUnchanged, createWeekId } from "./helpers";
import { getCharts, getGenreCharts, getGenres } from "./helpers/api";
import type { AxiosPromise } from "axios";

// Runtime constants
const RUNTIME = new Date();
const YEAR = RUNTIME.getUTCFullYear();
const WEEK = (() => {
  const basis = new Date(YEAR, 0, 1);
  const delta = (RUNTIME.valueOf() - basis.valueOf()) / 86_400_000;
  return Math.ceil((delta + basis.getDay() + 1) / 7);
})();
const [DATE, HOUR] = RUNTIME.toISOString().split(/T|:/);
const FILENAME = `${createWeekId(YEAR, WEEK)} (${DATE.slice(5)}@${HOUR}).json`;

// Helpers
const commitDataThunk = (rootDir: string, path: string) => (trackList: TrackList) => {
  const data = JSON.stringify(trackList, null, 2);
  const filePath = join(rootDir, FILENAME);

  return writeFile(filePath, data)
    .then(() => {
      console.info("[success] write data", join(path, FILENAME));
      return true;
    })
    .catch((error) => {
      console.error("[fail] write data", join(path, FILENAME));
      throw error;
    });
};

const monitorCharts = (request: AxiosPromise<TrackList>, path: string) => {
  const rootDir = join(__dirname, "data", path);

  /** Naively creates a new file for the queried chart track list */
  const commitData = commitDataThunk(rootDir, path);

  // ensure directory structure
  mkdir(rootDir, { recursive: true })
    .then(() => {
      request.then(({ data: trackList }) => {
        readdir(rootDir)
          .then((fileList) => {
            const mostRecentFile = fileList.sort().at(-1);
            if (!mostRecentFile) return commitData(trackList);

            const mostRecentFilePath = join(rootDir, mostRecentFile);
            return readFile(mostRecentFilePath, "utf8")
              .then((mostRecentData) =>
                !getIsUnchanged(JSON.parse(mostRecentData), trackList)
                  ? commitData(trackList)
                  : false
              )
              .catch((error) => {
                console.error("[fail] readFile", mostRecentFilePath);
                throw error;
              });
          })
          .catch((error) => {
            console.error("[fail] readdir", rootDir);
            throw error;
          });
      });
    })
    .catch((error) => {
      console.error("[fail] mkdir (recursive)", rootDir);
      throw error;
    });
};

// Cache previous run data
// writeFile(join(__dirname, "data/prev_run.json"), JSON.stringify())
const CACHE = {
  genres: [] as string[],
  week: WEEK,
  year: YEAR,
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
