import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: envFile });

const run = async () => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
  });

  const seedSQL = fs.readFileSync(
    path.resolve("scripts/database_seeds.sql"),
    "utf8"
  );

  await client.connect();

  try {
    await client.query(seedSQL);

    console.log(`Base de données de ${process.env.NODE_ENV || "dev"} peuplée`);
  } finally {
    await client.end();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
