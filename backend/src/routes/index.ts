import { Router } from "express";
import { authRouter } from "./auth";
import { globalsRouter } from "./globals";

const router = Router();

router.use(authRouter);
router.use(globalsRouter);

export default router;
