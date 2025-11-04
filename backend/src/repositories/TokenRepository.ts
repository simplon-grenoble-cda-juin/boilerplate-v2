import { Repository } from "@src/libs/Repository";

export class TokenRepository extends Repository {
  create = async (
    user_id: number,
    token_hash: string,
    expires_at: string,
    created_at: string
  ) => {
    const query = {
      name: "create-token",
      text: `
            INSERT into public.token (
                user_id,
                token_hash,
                expires_at,
                created_at
            ) 
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `,
      values: [user_id, token_hash, expires_at, created_at],
    };

    try {
      const result = await this.pool.query<{ id: number }>(query);

      if (result.rowCount === 0) return null;

      return result.rows[0].id;
    } catch (error) {
      console.log(error);
    }
  };
}
