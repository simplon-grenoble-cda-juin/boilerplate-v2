// APP

export interface ResultFail<E = unknown> {
  success: false;
  message: string;
  data?: E;
}

export interface ResultSuccess<S> {
  success: true;
  data: S;
  message?: string;
}

export type Result<S, E = unknown> = ResultSuccess<S> | ResultFail<E>;

// DATABASE

export interface UserDbRow {
  id?: number;
  email: string;
  password: string;
  created_at: string;
}

export interface TokenDbRow {
  id?: number;
  user_id: number;
  token: string;
  created_at: string;
}

export interface PlayerDbRow {
  id?: number;
  nickname: string;
  full_name: string;
  birthdate: string;
  country: string;
  team_id: number;
}

export interface TeamDbRow {
  id?: number;
  name: string;
  org_city: string;
  founded_year: number;
}

export interface GameDbRow {
  id?: number;
  name: string;
  genre: string;
}
