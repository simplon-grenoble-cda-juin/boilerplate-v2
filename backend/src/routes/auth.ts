import { Router } from "express";
import { requireAuth } from "@src/middlewares/requireAuth";
import { validateRequest } from "@src/middlewares/validateRequest";
import { AuthController } from "@src/controllers/AuthController";

export const authRouter = Router();

// Signup endpoint
authRouter.post("/signup", validateRequest, async (req, res) => {
  await new AuthController(req, res).signUp();
});

// Signin endpoint
authRouter.post("/signin", validateRequest, async (req, res) => {
  await new AuthController(req, res).signIn();
});

// Logout endpoint
authRouter.get("/logout", requireAuth, async (req, res) => {
  await new AuthController(req, res).logOut();
});

// Profile endpoint
authRouter.get("/profile", requireAuth, async (req, res) => {
  await new AuthController(req, res).profile();
});

// Password update endpoint
authRouter.patch(
  "/password-update",
  validateRequest,
  requireAuth,
  async (req, res) => {
    await new AuthController(req, res).passwordUpdate();
  }
);
