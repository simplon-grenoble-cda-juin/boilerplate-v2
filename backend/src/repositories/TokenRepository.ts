import { Repository } from "../libs/Repository";
import Token from "../modeles/Token";
import { TokenDbRow } from "../types/Types";

export class TokenRepository extends Repository {
  find = async (token: string): Promise<Token | null> => {
    const query = {
      name: "find-token",
      text: "SELECT * FROM public.token WHERE token = $1",
      values: [token],
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

  create = async (token: Token): Promise<number | null> => {
    const query = {
      name: "create-token",
      text: `INSERT INTO public.token (user_id, token, created_at)
      VALUES ($1, $2, $3)
      RETURNING ID
      `,
      values: [token.getUserId(), token.getToken(), token.getCreatedAt()],
    };

    try {
      const resultCreateUser = await this.pool.query<{ id: number }>(query);

      return resultCreateUser.rows[0].id;
    } catch (error) {
      console.log(error);
    }

    return null;
  };
}
