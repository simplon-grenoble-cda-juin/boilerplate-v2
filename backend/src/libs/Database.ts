import { Pool } from "pg";

export class Database {
  private static pool: Pool;

  private constructor() {}

  static getPool(): Pool {
    if (!Database.pool) {
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
