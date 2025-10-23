import { Pool } from "pg";
import { Database } from "./Database";

export abstract class Repository {
  // Pool de connexions à la base de données
  protected pool: Pool;

  /**
   * Initialise le repository avec le pool de la base de données
   */
  constructor() {
    this.pool = Database.getPool();
  }
}
