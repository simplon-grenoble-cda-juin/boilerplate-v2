import { Client } from "pg";
import { UserFactory } from "../_factories/user.factory";
import { TeamFactory } from "../_factories/team.factory";
import { PlayerFactory } from "../_factories/player.factory";

export default async function seed(client: Client) {
   await UserFactory.populate(client, {
    email: "admin@admin.fr",
    password: "123",
  });

  await UserFactory.populateRandom(client, 10);

  const adminTeam = await TeamFactory.populate(client, {
    name: "Wagle-sport",
    org_city: "Grenoble",
    founded_year: 2007,
  });

  const randomTeams = await TeamFactory.populateRandom(client, 5);

  await PlayerFactory.populate(client, {
    nickname: "Arthuro",
    full_name: "Arthur Wolff",
    birthdate: new Date(),
    country: "France",
    team_id: adminTeam.getId() as number,
  });

  await PlayerFactory.populateRandom(client, 30, randomTeams);
}
