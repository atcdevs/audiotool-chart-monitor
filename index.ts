import {
  createTrackListUID,
  getCharts,
  getGenreCharts,
  getGenres,
} from "./helpers/api";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { AxiosPromise } from "axios";

const RUNTIME = new Date();
const FILENAME = `${RUNTIME.toISOString()}.json`;
const YEAR = RUNTIME.getFullYear();
const WEEK = (() => {
  const basis = new Date(YEAR, 0, 1);
  const delta = (RUNTIME.valueOf() - basis.valueOf()) / 86_400_000;
  return Math.ceil((delta + basis.getDay() + 1) / 7);
})();

const checkCharts = async <T extends AxiosPromise<TrackList>>(
  trackList: T,
  path: string
) => {
  const { data: query } = await trackList;
  const rootDir = join(__dirname, "data", path);
  await mkdir(rootDir, { recursive: true })

  const fileList = await readdir(rootDir);
  const mostRecent = fileList.sort().at(-1);

  const filename = join(rootDir, FILENAME);
  if (!mostRecent) return await writeFile(filename, JSON.stringify(query));

  const mostRecentContent = await readFile(join(rootDir, mostRecent), "utf8");
  const mostRecentUID = createTrackListUID(JSON.parse(mostRecentContent));
  const queryUID = createTrackListUID(query);

  if (mostRecentUID !== queryUID)
    return await writeFile(filename, JSON.stringify(query));
};

checkCharts(getCharts({ limit: 10 }), "single_charts");

getGenres().then(({ data: genreList }) =>
  genreList.forEach(({ key }) => {
    checkCharts(getGenreCharts(key, YEAR, WEEK), `genre_charts/${key}`);
  })
);
