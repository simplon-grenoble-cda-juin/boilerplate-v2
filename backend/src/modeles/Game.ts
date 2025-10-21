import { GameDbRow, PlayerDbRow, TokenDbRow } from "../types/Types";

export default class Game {
  protected id?: number;
  protected name: string;
  protected genre: string;

  constructor(name: string, genre: string, id?: number) {
    this.name = name;
    this.genre = genre;
  }

  static fromRow = (row: GameDbRow): Game => {
    return new Game(row.name, row.genre, row.id);
  };

  serialize = (): Record<string, number | string | undefined> => {
    return {
      id: this.id,
      nickname: this.name,
      team_id: this.genre,
    };
  };

  getId = (): number | undefined => {
    return this.id;
  };

  setId = (id: number): void => {
    this.id = id;
  };

  getName = (): string => {
    return this.name;
  };

  getGenre = (): string => {
    return this.genre;
  };
}
