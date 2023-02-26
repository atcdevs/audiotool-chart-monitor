import { format } from "date-fns";
import FSDB from "file-system-db";
import { join } from "path";
import { getCharts, getGenreCharts, getGenres } from "./helpers/api";

// Runtime constants
const RUNTIME = new Date();
const WEEK_ID = format(RUNTIME, "yyyy-ww");

interface Store {
  cache: {
    successfulRuns: string[];
    test: string;
  };
  charts: {
    [uid: string]: {
      data: TrackList;
      runtime: number;
    };
  };
}

function useStore<K extends keyof Store>(key: K, genre?: string) {
  const path = `${key}/${genre ? `genre/${genre}` : "single"}.json`;
  return new FSDB<Store[K]>(join(__dirname, "data", path));
}

const checkCharts = (data: TrackList, genre?: string) => {
  const cache = useStore("cache", genre);
  const charts = useStore("charts", genre);
  const uid = data.tracks.map(({ key }) => key).join("-");

  if (charts.get(uid)) return;

  charts.set(uid, { data, runtime: RUNTIME.valueOf() });
  cache.push("successfulRuns", WEEK_ID);
};

// Single Charts
getCharts().then(({ data }) => checkCharts(data));

// Genre Charts (each)
getGenres().then(({ data: genres }) => {
  const values = genres.map(({ key }) => {
    const cache = useStore("cache", key);
    if (cache.get("successfulRuns")?.includes(WEEK_ID)) return;

    return getGenreCharts(key, WEEK_ID).then(({ data }) =>
      checkCharts(data, key)
    );
  });

  return Promise.all(values);
});
