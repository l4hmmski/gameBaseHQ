export type GameStatus =
  | "Backlog"
  | "Playing"
  | "Completed";

export type Game = {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
};