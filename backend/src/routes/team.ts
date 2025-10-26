import { Router } from "express";
import { TeamController } from "@src/controllers/TeamController";

export const teamRouter = Router();

// Browse teams endpoint
teamRouter.get("/", (req, res) => {
  const controller = new TeamController(req, res);
  controller.browse();
});
