import { PlayerDbRow, TokenDbRow } from "../types/Types";
import crypto from "node:crypto";

export default class Player {
  protected id?: number;
  protected nickname: string;
  protected full_name: string;
  protected birthdate: string;
  protected country: string;
  protected team_id: number;

  constructor(
    nickname: string,
    full_name: string,
    birthdate: string,
    country: string,
    team_id: number,
    id?: number
  ) {
    this.nickname = nickname;
    this.full_name = full_name;
    this.birthdate = birthdate;
    this.country = country;
    this.team_id = team_id;
    this.id = id;
  }

  static fromRow = (row: PlayerDbRow): Player => {
    return new Player(
      row.nickname,
      row.full_name,
      row.birthdate,
      row.country,
      row.team_id,
      row.id
    );
  };

  serialize = (): Record<string, number | string | undefined> => {
    return {
      id: this.id,
      nickname: this.nickname,
      full_name: this.full_name,
      birthdate: this.birthdate,
      country: this.country,
      team_id: this.team_id,
    };
  };

  getId = (): number | undefined => {
    return this.id;
  };

  setId = (id: number): void => {
    this.id = id;
  };

  getNickname = (): string => {
    return this.nickname;
  };

  getFullName = (): string => {
    return this.full_name;
  };

  getBirthdate = (): string => {
    return this.birthdate;
  };

  getCountry = (): string => {
    return this.country;
  };

  getTeamId = (): number => {
    return this.team_id;
  };
}
