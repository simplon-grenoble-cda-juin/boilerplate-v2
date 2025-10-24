import { type Request, type Response, type NextFunction } from "express";
import { TokenService } from "@src/services/TokenService";
import { AuthRefreshTokenPayload } from "@src/types/App";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwt = req.cookies?.refreshToken;

  if (!jwt) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  let payload: AuthRefreshTokenPayload;

  try {
    payload = TokenService.verifyRefreshToken(jwt);
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: error.message ?? "Token non reconnu" });
  }

  req.userId = parseInt(payload.sub);

  next();
};
