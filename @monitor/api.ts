import axios from "axios";

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

export const getCharts = (params?: Partial<TrackListQueryParameters>) => {
  params = { limit: 10, ...params };
  return api.get<TrackList>("/tracks/charts.json", { params });
};

export const getGenreCharts = (
  key: GenreKey,
  weekId: string,
  params?: Partial<TrackListQueryParameters>
) => {
  params = { limit: 10, ...params };
  return api.get<TrackList>(`/genre/${key}/charts/${weekId}.json`, { params });
};

export const getGenres = () => api.get<GenreList>("/genres.json");
