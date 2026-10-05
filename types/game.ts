export type GameStatus =
  | "Backlog"
  | "Playing"
  | "Completed";

export type Game = {
  id: string;

  igdb_id: number | null;

  title: string;

  platform: string;

  status: GameStatus;

  cover_url: string | null;

  publisher: string | null;

  release_date: string | null;

  genres: string[] | null;

  rating: number | null;

  user_rating: number | null;

  notes: string | null;

  is_wishlist: boolean;

  /*
    Steam fields are optional so games
    manually added from IGDB do not need them.
  */

  steam_app_id?: number | null;

  steam_playtime_minutes?: number | null;

  steam_playtime_2weeks?: number | null;

  steam_last_played_at?: string | null;

  steam_synced_at?: string | null;
};