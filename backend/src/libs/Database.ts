import { Pool } from "pg";

export class Database {
  // Instance unique du pool de connexions
  private static pool: Pool;

  // Un constructeur privé = un singleton
  private constructor() {}

  /**
   * Retourne le pool de connexions PostgreSQL (singleton)
   */
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
