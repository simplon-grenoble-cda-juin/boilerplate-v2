import { type Request, type Response, type NextFunction } from "express";
import { TokenService } from "@src/services/TokenService";
import { AuthRefreshTokenPayload } from "@src/types/App";
import { TokenRepository } from "@src/repositories/TokenRepository";
import Token from "@src/modeles/Token";

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
    const userId = parseInt(payload.sub);

    const tokenRepository = new TokenRepository();
    const storedToken = await tokenRepository.findByUserId(userId);

    if (!storedToken) {
      return res.status(401).json({ message: "Token non reconnu" });
    }

    const matches = storedToken.getTokenHash() === Token.hashJwt(jwt);

    if (!matches) {
      return res.status(401).json({ message: "Token non reconnu" });
    }

    if (storedToken.isExpired()) {
      return res.status(401).json({ message: "Token expiré" });
    }

    req.userId = userId;
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: error?.message ?? "Token non reconnu" });
  }

  req.userId = parseInt(payload.sub);

  next();
};
