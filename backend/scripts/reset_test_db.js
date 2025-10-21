import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const run = async () => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
    database: process.env.PGDATABASE,
  });

  const schemaSQL = fs.readFileSync(
    path.resolve("scripts/database_schema.sql"),
    "utf8"
  );

  await client.connect();

  try {
    await client.query("DROP SCHEMA public CASCADE");
    await client.query("CREATE SCHEMA public");
    await client.query(schemaSQL);

    console.log("Schéma chargé pour la base de tests");
  } finally {
    await client.end();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
