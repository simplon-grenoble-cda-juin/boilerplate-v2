import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export const authRouter = Router();

// Signup endpoint 
authRouter.post("/signup", (req, res) => {
  const controller = new AuthController(req, res);
  controller.signUp();
});

// Signin endpoint
authRouter.post("/signin", (req, res) => {
  const controller = new AuthController(req, res);
  controller.signIn();
});

// Profil endpoint
authRouter.get("/me", (req, res) => {
  const controller = new AuthController(req, res);
  controller.profil();
});
