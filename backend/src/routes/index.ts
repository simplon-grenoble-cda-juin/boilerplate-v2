import { Router } from "express";
import { authRouter } from "./auth";
import { teamRouter } from "./team";

const router = Router();

router.use("/auth", authRouter);
router.use("/teams", teamRouter);

export default router;
