import { Repository } from "../libs/Repository";
import User from "../modeles/User";
import { UserDbRow } from "../types/Types";

export class UserRepository extends Repository {
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

  findAll = async (): Promise<User[]> => {
    const query = {
      name: "find-all-user",
      text: "SELECT * FROM public.user",
    };

    try {
      const result = await this.pool.query<UserDbRow>(query);
      const users = result.rows.map((row) => User.fromRow(row));

      return users;
    } catch (error) {
      console.log(error);
    }

    return [];
  };

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

  create = async (user: User): Promise<number | null> => {
    const query = {
      name: "create-user",
      text: `INSERT INTO public.user (email, password, created_at)
      VALUES ($1, $2, $3)
      RETURNING ID
      `,
      values: [user.getEmail(), user.getPasswordHash(), user.getCreatedAt()],
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
