export type GameStatus =
  | "Backlog"
  | "Playing"
  | "Completed";

export type Game = {
  id: string;

  title: string;

  platform: string;

  status: GameStatus;

  cover_url: string | null;

  publisher: string | null;

  release_date: string | null;

  genres: string[] | null;

  rating: number | null;

  user_rating: number | null;
};