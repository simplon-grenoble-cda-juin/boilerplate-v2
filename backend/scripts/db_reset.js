import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import readline from "node:readline";

const ask = (question) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim() || "dev");
    });
  });
};

const run = async () => {
  const user = await ask("Nom de l'utilisateur PG : ");
  const pswd = await ask("Mot de passe de l'utilisateur PG : ");
  const host = await ask("Host du serveur de base de données PG : ");
  const name = await ask("Nom de la base de données : ");

  const client = new Client({
    user: user,
    password: pswd,
    host: host,
    database: name,
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

    console.log(`Schéma chargé pour la base de données ${name}`);
  } finally {
    await client.end();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
