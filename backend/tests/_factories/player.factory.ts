import { Client } from "pg";
import { faker } from "@faker-js/faker";
import Player from "../../src/modeles/Player";
import Team from "../../src/modeles/Team";

export type PlayerProps = {
  team_id: number;
  nickname?: string;
  full_name?: string;
  birthdate?: Date | string;
  country?: string;
};

export class PlayerFactory {
  static build = async (props: PlayerProps): Promise<Player> => {
    const nickname = props.nickname ?? faker.internet.username();
    const full_name = props.full_name ?? faker.person.fullName();
    const birthdate = props.birthdate
      ? props.birthdate instanceof Date
        ? props.birthdate.toISOString()
        : props.birthdate
      : faker.date
          .birthdate({ min: 1970, max: 2010, mode: "year" })
          .toISOString();
    const country = props.country ?? faker.location.country();
    const team_id = props.team_id;

    return new Player(nickname, full_name, birthdate, country, team_id);
  };

  static populate = async (
    client: Client,
    props: PlayerProps
  ): Promise<Player> => {
    const player = await this.build(props);

    const res = await client.query<{ id: number }>(
      `INSERT INTO public.player (nickname, full_name, birthdate, country, team_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [
        player.getNickname(),
        player.getFullName(),
        player.getBirthdate(),
        player.getCountry(),
        player.getTeamId(),
      ]
    );

    player.setId(res.rows[0].id);

    return player;
  };

  static populateRandom = async (
    client: Client,
    number: number,
    teams: Team[]
  ): Promise<Player[]> => {
    const players: Player[] = [];

    for (let i = 0; i < number; i++) {
      const randomTeamId =
        teams[Math.floor(Math.random() * teams.length)].getId();

      const player = await this.populate(client, {
        team_id: randomTeamId as number,
      });
      players.push(player);
    }

    return players;
  };
}
