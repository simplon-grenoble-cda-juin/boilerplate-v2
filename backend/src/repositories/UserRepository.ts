import { Repository } from "@src/libs/Repository";
import User from "@src/modeles/User";
import { UserDbRow } from "@src/types/Database";

/**
 * Repository pour les opérations CRUD liées aux utilisateurs.
 *
 * Toutes les méthodes retournent `null` en cas d'erreur ou si la ressource
 * n'existe pas; la logique applicative (controllers/services) gère les
 * réponses HTTP appropriées.
 */
export class UserRepository extends Repository {
  /**
   * Récupère un utilisateur par son identifiant.
   * @param id - Identifiant de l'utilisateur
   * @returns l'instance `User` ou `null` si non trouvée / en cas d'erreur
   */
  find = async (id: number): Promise<User | null> => {
    const query = {
      name: "find-user",
      text: "SELECT * FROM public.user WHERE id = $1",
      values: [id],
    };

    try {
      const result = await this.pool.query<UserDbRow>(query);

      if (result.rowCount === 0) return null;

      const user = User.fromRow(result.rows[0]);

      return user;
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  /**
   * Récupère un utilisateur par son email.
   * @param email - Email cherché
   * @returns l'instance `User` ou `null` si non trouvée / en cas d'erreur
   */
  findByEmail = async (email: string): Promise<User | null> => {
    const query = {
      name: "find-user-by-email",
      text: "SELECT * FROM public.user WHERE email = $1",
      values: [email],
    };

    try {
      const result = await this.pool.query<UserDbRow>(query);

      if (result.rowCount === 0) return null;

      const user = User.fromRow(result.rows[0]);

      return user;
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  /**
   * Crée un nouvel utilisateur en base.
   * @param user - Instance `User` contenant les valeurs à insérer
   * @returns l'ID inséré ou `null` en cas d'erreur
   */
  create = async (user: User): Promise<number | null> => {
    const query = {
      name: "create-user",
      text: `INSERT INTO public.user (email, pseudo, password_hash, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING ID
      `,
      values: [
        user.getEmail(),
        user.getPseudo(),
        user.getPasswordHash(),
        user.getCreatedAt(),
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
   * Met à jour le mot de passe d'un utilisateur en base.
   * @param id - Identifiant de l'utilisateur
   * @returns l'ID inséré ou `null` en cas d'erreur
   */
  updatePassword = async (
    id: number,
    passwordHash: string
  ): Promise<number | null> => {
    const query = {
      name: "update-user",
      text: `UPDATE public.user
      SET password_hash = $1
      WHERE id = $2
      RETURNING ID
      `,
      values: [passwordHash, id],
    };

    try {
      const result = await this.pool.query<{ id: number }>(query);

      return result.rows[0].id;
    } catch (error) {
      console.log(error);
    }

    return null;
  };
}
