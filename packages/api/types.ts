import { z } from "zod";

export type Genre = z.infer<typeof Genre>;
export const Genre = z.object({ key: z.string(), name: z.string() });

export type GenreList = z.infer<typeof GenreList>;
export const GenreList = z.array(Genre);

export type UserSnippet = z.infer<typeof UserSnippet>;
export const UserSnippet = z.object({
  key: z.string(),
  name: z.string(),
  avatar: z.string(),
});

export type Track = z.infer<typeof Track>;
export const Track = z.object({
  key: z.string(),
  id: z.number(),
  name: z.string(),
  created: z.number(),
  modified: z.number(),
  user: UserSnippet,
  template: z.boolean(),
  published: z.boolean(),
  snapshotUrl: z.string(),
  pksUrl: z.string(),
  coverUrl: z.string().optional(),
  collaborators: z.array(UserSnippet),
  bpm: z.number(),
  genreKey: z.string(),
  genreName: z.string(),
  duration: z.number(),
  isNextTrack: z.boolean(),
  joinPolicy: z.number(),
  license: z.number(),
});

export type TrackList = z.infer<typeof TrackList>;
export const TrackList = z.object({
  name: z.string(),
  tracks: z.array(Track),
  next: z.string().optional(),
});

export type TrackListQueryParameters = z.infer<typeof TrackListQueryParameters>;
export const TrackListQueryParameters = z
  .object({
    limit: z.number().default(10), // `0 <= n <= 50`
    offset: z.number(), // `0 <= n`
    head: z.string(),
    orderBy: z.enum(["created", "favs"]),
    dir: z.enum(["asc", "desc"]),
    cover: z.number(), // 16 | 32 | 64 | 128 | 256 | 512
    snapshot: z.number(), // 160 | 320 | 640
  })
  .partial()
  .default({ limit: 10 });
