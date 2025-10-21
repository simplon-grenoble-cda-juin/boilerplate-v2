import { Controller } from "../libs/Controller";
import { PlayerRepository } from "../repositories/PlayerRepository";

export class GlobalsController extends Controller {
  test = async () => {
    return this.response.json({
      demo: "Hello !!!!!!",
    });
  };

  browsePlayers = async () => {
    const playerRepository = new PlayerRepository();
    const players = await playerRepository.findAll();

    return this.response.json({
      players: JSON.stringify(players?.map((player) => player.serialize())),
    });
  };
}
