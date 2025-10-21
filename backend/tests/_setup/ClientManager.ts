import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { Client } from "pg";
import seed from "./seed";

dotenv.config({ path: ".env.test" });

export default class ClientManager {
  private readonly client: Client;
  private connected = false;

  constructor() {
    faker.seed(123);

    this.client = new Client({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
      database: process.env.PGDATABASE,
    });
  }

  // Ouvre une connexion si nécessaire
  private ensureConnected = async (): Promise<void> => {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  };

  // Met à disposition le client
  getClient = (): Client => {
    return this.client;
  };

  // Démarre une transaction et retourne le client
  begin = async (): Promise<Client> => {
    await this.ensureConnected();
    await this.client.query("BEGIN");
    return this.client;
  };

  // Valide la transaction (enregistre en db)
  commit = async (): Promise<void> => {
    await this.client.query("COMMIT");
  };

  // Ferme la connexion si ouverte
  end = async (): Promise<void> => {
    if (this.connected) {
      await this.client.end();
      this.connected = false;
    }
  };

  // Peuple la base de données avec le fichier seed
  populate = async (): Promise<void> => {
    await this.begin();
    await seed(this.client);
    await this.commit();
    await this.end();
  };

  // Vide toutes les tables et réinitialise les séquences
  clearTables = async (): Promise<void> => {
    await this.ensureConnected();
    await this.client.query(`
      TRUNCATE
        public.token,
        public.match,
        public.team_tournament,
        public.player,
        public.tournament,
        public.team,
        public.game,
        public."user"
      RESTART IDENTITY CASCADE
    `);
  };
}
