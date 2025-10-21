import { TokenDbRow } from "../types/Types";
import crypto from "node:crypto";

export default class Token {
  protected id?: number;
  protected userId: number;
  protected token: string;
  protected created_at: string;

  constructor(
    userId: number,
    token?: string,
    created_at?: string,
    id?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.token = token ?? crypto.randomBytes(16).toString("hex");
    this.created_at = created_at ?? new Date().toISOString();
  }

  static fromRow = (row: TokenDbRow): Token => {
    return new Token(row.user_id, row.token, row.created_at, row.id);
  };

  serialize = (): Record<string, number | string | undefined> => {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      created_at: this.created_at,
    };
  };

  getId = (): number | undefined => {
    return this.id;
  };

  getUserId = (): number => {
    return this.userId;
  };

  getToken = (): string => {
    return this.token;
  };

  getCreatedAt = (): string => {
    return this.created_at;
  };
}
