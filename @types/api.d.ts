interface GenreMap {
  newbie: "Newbie";
  trap: "Trap";
  hip_hop: "Hip Hop";
  experimental: "Experimental";
  other: "Other";
  "lo-fi": "Lo-Fi";
  bass_music: "Bass Music";
  techno: "Techno";
  ambient: "Ambient";
  house: "House";
  drum_and_bass: "Drum & Bass";
  edm: "EDM";
  soundtrack: "Soundtrack";
  electro: "Electro";
  hardcore: "Hardcore";
  future_bass: "Future Bass";
  synthwave: "Synthwave";
  trance: "Trance";
  chiptune: "Chiptune";
  downtempo: "Downtempo";
  funk: "Funk";
  industrial: "Industrial";
  reggae: "Reggae";
  birdcore: "Birdcore";
  indie: "Indie";
  acoustic: "Acoustic";
  rock: "Rock";
  pop: "Pop";
}

type GenreKey = keyof GenreMap;

interface Genre<K extends GenreKey = GenreKey> {
  key: K;
  name: GenreMap[K];
}

type GenreList = Genre[];

interface UserSnippet {
  key: string;
  name: string;
  avatar: string;
}

interface Track<K extends GenreKey = GenreKey> {
  key: string;
  id: number;
  name: string;
  created: number;
  modified: number;
  user: UserSnippet;
  template: boolean;
  published: boolean;
  snapshotUrl: string;
  pksUrl: string;
  coverUrl: string;
  collaborators: UserSnippet[];
  bpm: number;
  genreKey: K;
  genreName: GenreMap[K];
  duration: number;
  isNextTrack: boolean;
  joinPolicy: number;
  license: number;
}

interface TrackList<N extends string = string> {
  name: N;
  tracks: Track[];
  next?: string;
}

interface TrackListQueryParameters {
  /** The length of the return result. `0 <= n <= 50` */
  limit: number;
  /** The number of items to offset the return result by. `0 <= n` */
  offset: number;
  /** Alternative to offset, a key to define as the start. */
  head: string;
  /** The order operation to perform on the return result. */
  orderBy: "created" | "favs";
  /** The direction in which to order the return result. */
  dir: "asc" | "desc";
  /** @unimplemented The image width to return for cover URIs. */
  cover: 16 | 32 | 64 | 128 | 256 | 512;
  /** @unimplemented The image width to return for cover URIs (keep in mind, snapshot images have a 4:3 aspect ratio) */
  snapshot: 160 | 320 | 640;
}
