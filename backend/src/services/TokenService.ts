// TokenService.ts
import jwt from "jsonwebtoken";
import { AuthRefreshTokenPayload } from "@src/types/App";

/**
 * Service gérant la signature, la vérification et la configuration des tokens JWT.
 * 
 * Ce service est utilisé pour :
 * - Générer un JWT de rafraîchissement à partir d’un payload utilisateur
 * - Vérifier et décoder un JWT présent dans les cookies
 * - Fournir la durée de vie configurée pour les tokens
 */
export class TokenService {
  // Constructeur privé pour interdire l’instanciation
  private constructor() {}

  /**
   * Signe un JWT de rafraîchissement à partir du payload utilisateur.
   * 
   * - Le secret est récupéré depuis la variable d’environnement `JWT_SECRET`
   * - La durée de validité (`expiresIn`) dépend de `JWT_AT_TTL`
   * - L’algorithme utilisé est `HS256`
   */
  static signRefreshToken = (p: AuthRefreshTokenPayload): string => {
    const secret = process.env.JWT_SECRET as string;
    const accessTokenTTL = parseInt(process.env.JWT_AT_TTL || "900");

    return jwt.sign(p, secret, {
      algorithm: "HS256",
      expiresIn: accessTokenTTL,
    });
  };

  /**
   * Vérifie la validité et décode un JWT de rafraîchissement.
   * 
   * - Lève une erreur si le token est expiré ou invalide
   * - Retourne le payload décodé sous forme d’objet typé
   */
  static verifyRefreshToken = (token: string): AuthRefreshTokenPayload => {
    const secret = process.env.JWT_SECRET as string;

    return jwt.verify(token, secret) as AuthRefreshTokenPayload;
  };

  /**
   * Retourne la durée de vie (TTL) d’un token en secondes.
   * 
   * - Basée sur la variable d’environnement `JWT_AT_TTL`
   * - Valeur par défaut : 900 secondes (15 minutes)
   */
  static getRefreshTokenTTL = (): number => {
    return parseInt(process.env.JWT_AT_TTL || "900");
  };
}
