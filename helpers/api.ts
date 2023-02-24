import axios from "axios";

const api = axios.create({
	baseURL: "https://api.audiotool.com",
	headers: { accept: "application/json" },
});

export const getCharts = (params?: Partial<TrackListQueryParameters>) =>
	api.request<TrackList<"Single Charts">>({
		params,
		url: "/tracks/charts.json",
	});

export const getGenreCharts = <
	K extends keyof GenreMap,
	Y extends number,
	W extends number
>(
	key: K,
	year: Y,
	week: W,
	params?: Partial<TrackListQueryParameters>
) =>
	api.request<TrackList<`${GenreMap[K]} charts, week #${W} / ${Y}`>>({
		params,
		url: `/genre/${key}/charts/${year}-${`${week}`.padStart(2, "0")}.json`,
	});

export const getGenres = () => api.request<Genre[]>({ url: "/genres.json" });

export const createTrackListUID = (trackList: TrackList) =>
	trackList.tracks.map(({ key }) => key).join("-");
