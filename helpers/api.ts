import axios from "axios";
import { createWeekId } from ".";

const api = axios.create({
  baseURL: "https://api.audiotool.com",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  (request) => {
    console.info(`[success] request ${request.url}`);
    return request;
  },
  (error) => {
    if (axios.isAxiosError(error))
      console.error(`[fail] request ${error.config?.url ?? "unknown"}`);

    return Promise.reject(error);
  }
);

export const getCharts = (params?: Partial<TrackListQueryParameters>) =>
  api.get<TrackList<"Single Charts">>("/tracks/charts.json", { params });

export const getGenreCharts = <
  K extends GenreKey,
  Y extends number,
  W extends number
>(
  key: string,
  year: Y,
  week: W,
  params?: Partial<TrackListQueryParameters>
) =>
  api.get<TrackList<`${GenreMap[K]} charts, week #${W} / ${Y}`>>(
    `/genre/${key}/charts/${createWeekId(year, week)}.json`,
    { params }
  );

export const getGenres = () => api.get<GenreList>("/genres.json");
