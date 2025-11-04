import { Repository } from "@src/libs/Repository";

export class UserRepository extends Repository {
  findByEmail = async (email: string) => {
    const query = {
      name: "find-user-by-email",
      text: "SELECT * FROM public.user WHERE email = $1",
      values: [email],
    };

    try {
      const result = await this.pool.query(query);

      if (result.rowCount === 0) return null;

      return result.rows[0];
    } catch (error) {
      console.log(error);
    }
  };

  create = async (
    email: string,
    password: string,
    pseudo: string,
    created: string
  ) => {
    const query = {
      name: "create-user",
      text: `
            INSERT into public.user (
                email, 
                password_hash, 
                pseudo, 
                created_at
            ) 
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `,
      values: [email, password, pseudo, created],
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
