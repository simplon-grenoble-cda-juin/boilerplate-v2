import { Router } from "express";
import { GlobalsController } from "../controllers/GlobalsController";

export const globalsRouter = Router();

// Test endpoint 
globalsRouter.get("/test", (req, res) => {
  const controller = new GlobalsController(req, res);
  controller.test();
});

// Browse players endpoint 
globalsRouter.get("/players", (req, res) => {
  const controller = new GlobalsController(req, res);
  controller.browsePlayers();
});
