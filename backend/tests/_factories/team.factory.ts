import { Client } from "pg";
import { faker } from "@faker-js/faker";
import Team from "../../src/modeles/Team";

export type TeamProps = {
  name?: string;
  org_city?: string;
  founded_year?: number;
};

export class TeamFactory {
  static build = async (props: TeamProps = {}): Promise<Team> => {
    const name = props.name ?? faker.company.name();
    const orgCity = props.org_city ?? faker.location.city();
    const foundedYear =
      props.founded_year ??
      faker.number.int({ min: 1990, max: new Date().getFullYear() });

    return new Team(name, orgCity, foundedYear);
  };

  static populate = async (
    client: Client,
    props: TeamProps = {}
  ): Promise<Team> => {
    const team = await this.build(props);

    const res = await client.query<{ id: number }>(
      `INSERT INTO public.team(name, org_city, founded_year)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [team.getName(), team.getOrgCity(), team.getFoundedYear()]
    );

    team.setId(res.rows[0].id);

    return team;
  };

  static populateRandom = async (
    client: Client,
    number: number
  ): Promise<Team[]> => {
    const teams: Team[] = [];

    for (let i = 0; i < number; i++) {
      const team = await this.populate(client, {});
      teams.push(team);
    }

    return teams;
  };
}
