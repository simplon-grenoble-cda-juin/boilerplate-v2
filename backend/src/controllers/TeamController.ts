import { Controller } from "@src/libs/Controller";

/**
 * Contrôleur gérant les équipes.
 */
export class TeamController extends Controller {
  browse = () => {
    return this.response.status(200).json({ test: "hello" });
  };
}
