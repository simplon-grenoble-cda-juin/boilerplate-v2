// CookieService.ts
import { Response } from "express";
import { TokenService } from "./TokenService";

/**
 * Service utilitaire dédié à la gestion des cookies d'authentification.
 *
 * Il centralise la configuration des cookies (sécurité, durée de vie, etc.)
 * et fournit des méthodes simples pour définir ou supprimer le cookie contenant le token JWT.
 */
export class CookieService {
  // Options par défaut appliquées à tous les cookies
  private static readonly httpOnly: boolean = true; // Empêche l’accès au cookie depuis le JavaScript côté client
  private static readonly sameSite: string = "lax"; // Réduit les risques de CSRF en limitant l’envoi du cookie aux requêtes du même site
  private static readonly secure: boolean = process.env.NODE_ENV === "production"; // HTTPS pour transmettre le cookie
  private static readonly domain: string | undefined; // Optionnel : permet de restreindre le domaine du cookie
  private static readonly path: string = "/"; // Définit le chemin de validité du cookie

  // Constructeur privé pour empêcher l’instanciation
  private constructor() {}

  /**
   * Retourne la configuration commune à tous les cookies.
   */
  private static getBaseCookie = () => {
    return {
      httpOnly: this.httpOnly,
      path: this.path,
    };
  };

  /**
   * Définit un cookie contenant le JWT de rafraîchissement.
   *
   * - Nom : `refreshToken`
   * - Valeur : le JWT brut
   * - Expiration : basée sur la durée de vie définie dans les variables d’environnement
   */
  static setRefreshCookie = (res: Response, jwt: string) => {
    return res.cookie("refreshToken", jwt, {
      ...this.getBaseCookie(),
      expires: new Date(Date.now() + TokenService.getRefreshTokenTTL() * 1000),
    });
  };

  /**
   * Supprime les cookies d’authentification côté client.
   *
   * - Remplace la valeur par une chaîne vide
   * - Définit une date d’expiration passée
   */
  static clearAuthCookies = (res: Response) => {
    res.cookie("refreshToken", "", {
      ...this.getBaseCookie(),
      expires: new Date(0),
    });
  };
}
