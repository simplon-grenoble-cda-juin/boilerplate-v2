import { AuthController } from "@src/controllers/AuthController";
import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
  new AuthController(req, res).signup();
});

export default router;
