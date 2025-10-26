import { Repository } from "@src/libs/Repository";
import Token from "@src/modeles/Token";
import { TokenDbRow } from "@src/types/Database";

/**
 * Repository pour les opérations CRUD liées aux tokens.
 *
 * Toutes les méthodes retournent `null` en cas d'erreur ou si la ressource
 * n'existe pas; la logique applicative (controllers/services) gère les
 * réponses HTTP appropriées.
 */
export class TokenRepository extends Repository {
  /**
   * Recherche le token lié à un utilisateur.
   * @param userId - Identifiant de l'utilisateur
   * @returns `Token` ou `null` si non trouvé / en cas d'erreur
   */
  findByUserId = async (userId: number): Promise<Token | null> => {
    const query = {
      name: "find-token-by-user-id",
      text: "SELECT * FROM public.token WHERE user_id = $1",
      values: [userId],
    };

    try {
      const result = await this.pool.query<TokenDbRow>(query);

      if (result.rowCount === 0) return null;

      const token = Token.fromRow(result.rows[0]);

      return token;
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  /**
   * Crée un token en base.
   * @param token - Instance `Token` (hash et dates déjà calculés)
   * @returns l'ID inséré ou `null` en cas d'erreur
   */
  create = async (token: Token): Promise<number | null> => {
    const query = {
      name: "create-token",
      text: `INSERT INTO public.token (user_id, token_hash, expires_at, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING ID
      `,
      values: [
        token.getUserId(),
        token.getTokenHash(),
        token.getExpiresAt(),
        token.getCreatedAt(),
      ],
    };

    try {
      const result = await this.pool.query<{ id: number }>(query);

      return result.rows[0].id;
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  /**
   * Supprime les tokens d'un utilisateur.
   * @param userId - Identifiant de l'utilisateur
   * @returns nombre de lignes supprimées (0 si erreur)
   */
  deleteByUserId = async (userId: number): Promise<number> => {
    const query = {
      name: "delete-token-by-user-id",
      text: "DELETE FROM public.token WHERE user_id = $1",
      values: [userId],
    };
    try {
      const result = await this.pool.query(query);
      return result.rowCount ?? 0;
    } catch {
      return 0;
    }
  };

  /**
   * Remplace le token d'un utilisateur par un nouveau token.
   * Procède en supprimant les anciens tokens puis en insérant le nouveau.
   * @param token - Nouveau token à insérer
   * @returns l'ID du token inséré ou `null` en cas d'erreur
   */
  replaceForUser = async (token: Token): Promise<number | null> => {
    await this.deleteByUserId(token.getUserId());
    return this.create(token);
  };
}
