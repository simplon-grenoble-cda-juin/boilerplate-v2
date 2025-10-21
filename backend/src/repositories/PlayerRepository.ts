import { Repository } from "../libs/Repository";
import Player from "../modeles/Player";
import { PlayerDbRow } from "../types/Types";

export class PlayerRepository extends Repository {
  findByNickname = async (nickname: string): Promise<Player | null> => {
    const query = {
      name: "find-player",
      text: "SELECT * FROM public.player WHERE nickname = $1",
      values: [nickname],
    };

    try {
      const result = await this.pool.query<PlayerDbRow>(query);

      if (result.rowCount === 0) return null;

      const player = Player.fromRow(result.rows[0]);

      return player;
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  findAll = async (): Promise<Player[]> => {
    const query = {
      name: "find-all-player",
      text: "SELECT * FROM public.player",
    };

    try {
      const result = await this.pool.query<PlayerDbRow>(query);
      const players = result.rows.map((row) => Player.fromRow(row));

      return players;
    } catch (error) {
      console.log(error);
    }

    return [];
  };
}
