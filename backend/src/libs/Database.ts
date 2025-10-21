import { Pool } from "pg";
import dotenv from "dotenv";

export class Database {
  private static pool: Pool;

  static getPool(): Pool {
    if (!Database.pool) {
      const envFile = `.env.${process.env.NODE_ENV || "dev"}`;

      dotenv.config({ path: envFile });

      Database.pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
      });
    }

    return Database.pool;
  }
}
