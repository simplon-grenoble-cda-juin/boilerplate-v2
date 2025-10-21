export type Player = {
  id: number;
  nickname: string;
  full_name: string;
  birthdate: string;
  country: string;
  team_id: number;
};

export type PlayersResponse = {
  players: string;
};
