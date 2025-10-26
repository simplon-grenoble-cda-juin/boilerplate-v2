import crypto from "node:crypto";
import { TokenDbRow } from "@src/types/Database";
import { TokenService } from "@src/services/TokenService";

/**
 * Représente un token d'authentification lié à un utilisateur.
 *
 * Le constructeur est privé : utilisez `Token.create(userId)` pour générer
 * un nouveau token (et sa valeur brute à mettre dans le cookie) ou
 * `Token.fromRow(row)` pour reconstruire l'objet depuis la base.
 */
export default class Token {
  /** Identifiant en base (optionnel) */
  protected id?: number;
  protected user_id: number;
  protected token_hash: string;
  protected expires_at: string;
  protected created_at: string;

  /**
   * Constructeur privé. Utilisé en interne uniquement.
   * @private
   */
  private constructor(
    user_id: number,
    token_hash: string,
    expires_at: string,
    created_at: string,
    id?: number
  ) {
    this.id = id;
    this.user_id = user_id;
    this.token_hash = token_hash;
    this.expires_at = expires_at;
    this.created_at = created_at;
  }

  /**
   * Génère un nouveau token pour un utilisateur.
   * Retourne l'instance `Token` (avec le hash prêt à être persisté).
   */
  static create = (userId: number, jwt: string): Token => {
    const hash = crypto.createHash("sha256").update(jwt).digest("hex");
    const created = new Date();
    const expires = new Date(
      created.getTime() + TokenService.getRefreshTokenTTL() * 1000
    );

    return new Token(
      userId,
      hash,
      expires.toISOString(),
      created.toISOString(),
      undefined
    );
  };

  /**
   * Construit un Token à partir d'une ligne retournée par la base de données.
   * @param row - Enregistrement contenant les colonnes attendues
   */
  static fromRow = (row: TokenDbRow): Token => {
    return new Token(
      row.user_id,
      row.token_hash,
      row.expires_at,
      row.created_at,
      row.id
    );
  };

  /** Re-hashe la valeur brute du jwt (utile pour comparer avec le hash en BDD)
   * @param jwt - Version brute du token
   */
  static hashJwt = (jwt: string): string => {
    return crypto.createHash("sha256").update(jwt).digest("hex");
  };

  setId = (id: number): void => {
    this.id = id;
  };

  getId = (): number | undefined => this.id;

  getUserId = (): number => this.user_id;

  getTokenHash = (): string => this.token_hash;

  getExpiresAt = (): string => this.expires_at;

  getCreatedAt = (): string => this.created_at;

  isExpired = (): boolean => Date.now() >= Date.parse(this.expires_at);
}
