export interface Game {
  id: string;
  title: string;
  instructions: string;
  custom: boolean;
}

export interface Wheel {
  id: string;
  name: string;
  games: Game[];
  custom: boolean;
}

export interface StoredState {
  customWheels: Wheel[];
  extraGamesByWheelId: Record<string, Game[]>;
  hiddenGameIdsByWheelId: Record<string, string[]>;
  activeWheelId: string;
}
