export const createWeekId = (year: number, week: number) =>
`${year}-${week.toString().padStart(2, "0")}`;

const createTrackListUID = (trackList: TrackList) =>
  trackList.tracks.map(({ key }) => key).join("-");

export const getIsUnchanged = (a: TrackList, b: TrackList) =>
  createTrackListUID(a) === createTrackListUID(b)
