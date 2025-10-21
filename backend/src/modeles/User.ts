import { UserDbRow } from "../types/Types";

export default class User {
  protected id?: number;
  protected email: string;
  protected password: string;
  protected created_at: string;

  constructor(
    email: string,
    password: string,
    created_at?: string,
    id?: number
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.created_at = created_at ?? new Date().toISOString();
  }

  static fromRow = (row: UserDbRow): User => {
    return new User(row.email, row.password, row.created_at, row.id);
  };

  serialize = (): Record<string, string | number | undefined> => {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at,
    };
  };

  getId = (): number | undefined => {
    return this.id;
  };

  setId = (id: number): void => {
    this.id = id;
  };

  getEmail = (): string => {
    return this.email;
  };

  getPasswordHash = (): string => {
    return this.password;
  };

  getCreatedAt = (): string => {
    return this.created_at;
  };
}
