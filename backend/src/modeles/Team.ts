import { PlayerDbRow, TeamDbRow, TokenDbRow } from "../types/Types";

export default class Team {
  protected id?: number;
  protected name: string;
  protected org_city: string;
  protected founded_year: number;

  constructor(
    name: string,
    org_city: string,
    founded_year: number,
    id?: number
  ) {
    this.name = name;
    this.org_city = org_city;
    this.founded_year = founded_year;
    this.id = id;
  }

  static fromRow = (row: TeamDbRow): Team => {
    return new Team(row.name, row.org_city, row.founded_year, row.id);
  };

  serialize = (): Record<string, number | string | undefined> => {
    return {
      name: this.name,
      org_city: this.org_city,
      founded_year: this.founded_year,
      id: this.id,
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

  getOrgCity = (): string => {
    return this.org_city;
  };

  getFoundedYear = (): number => {
    return this.founded_year;
  };
}
