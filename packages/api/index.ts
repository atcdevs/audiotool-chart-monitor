import ky from "ky";
import { GenreList, TrackList, TrackListQueryParameters } from "./types";

const api = ky.create({
  prefixUrl: "https://api.audiotool.com",
  hooks: {
    beforeError: [
      async (error) => {
        console.error("[fail]", error.response.status, error.request.url);
        return error;
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        console.info("[success]", response.status, request.url);
        return response;
      },
    ],
  },
});

const getTrackList = async (url: string, params?: TrackListQueryParameters) => {
  const searchParams = await TrackListQueryParameters.parseAsync(params);
  return TrackList.parseAsync(await api.get(url, { searchParams }).json());
};

export const getCharts = (params?: TrackListQueryParameters) =>
  getTrackList("tracks/charts.json", params);

export const getGenreCharts = async (
  key: string,
  weekId: string,
  params?: TrackListQueryParameters
) => getTrackList(`genre/${key}/charts/${weekId}.json`, params);

export const getGenres = async () =>
  GenreList.parseAsync(await api.get("genres.json").json());
