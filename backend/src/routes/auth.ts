import { Router } from "express";
import { requireAuth } from "@src/middlewares/requireAuth";
import { validateRequest } from "@src/middlewares/validateRequest";
import { AuthController } from "@src/controllers/AuthController";

export const authRouter = Router();

// Signup endpoint
authRouter.post("/signup", validateRequest, (req, res) => {
  const controller = new AuthController(req, res);
  controller.signUp();
});

// Signin endpoint
authRouter.post("/signin", validateRequest, (req, res) => {
  const controller = new AuthController(req, res);
  controller.signIn();
});

// Logout endpoint
authRouter.get("/logout", requireAuth, (req, res) => {
  const controller = new AuthController(req, res);
  controller.logOut();
});

// Profile endpoint
authRouter.get("/profile", requireAuth, (req, res) => {
  const controller = new AuthController(req, res);
  controller.profile();
});

// Password update endpoint
authRouter.patch(
  "/password-update",
  validateRequest,
  requireAuth,
  (req, res) => {
    const controller = new AuthController(req, res);
    controller.passwordUpdate();
  }
);
