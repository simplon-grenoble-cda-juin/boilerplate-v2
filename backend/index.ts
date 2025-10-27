import Express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import router from "./src/routes";
import cookieParser from "cookie-parser";
import { createRequire } from "node:module";
import type { CorsOptions } from "cors";

/**
 * Point d’entrée principal du serveur Express.
 *
 * Ce fichier initialise :
 * - le chargement des variables d’environnement selon NODE_ENV
 * - la configuration CORS, les middlewares de parsing et les cookies
 * - la mise à disposition des routes principales
 * - le lancement du serveur sur le port défini
 */

const env = process.env.NODE_ENV;
let envName: string;

switch (env) {
  case "dev":
    envName = "développement 🔧";
    break;
  case "test":
    envName = "test 🪲";
    break;
  case "preprod":
    envName = "pré-production 🔍";
    break;
  case "prod":
    envName = "production 🚀";
    break;
  default:
    envName = "inconnu 🤯";
    break;
}

console.log(`Bienvenue sur l'environnement de  ${envName}`);

console.log(process.env);

// Initialisation d’Express
const app = Express();
const PORT = 3002;

// Détermination des chemins absolus
// __filename et __dirname ne sont pas disponibles en ESM, donc on les reconstruit
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import dynamique pour compatibilité ESM / CommonJS
const require = createRequire(import.meta.url);
const cors: typeof import("cors") = require("cors");

// Configuration CORS
// Autorise uniquement les origines définies (ici le frontend local)
// Active les cookies (credentials: true)
const CORS_OPTIONS: CorsOptions = {
  origin: [process.env.CORS_ALLOWED ?? ""],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

console.log(CORS_OPTIONS);

// Application du middleware CORS
app.use(cors(CORS_OPTIONS));

// Analyse les cookies entrants
app.use(cookieParser());

// Sert les fichiers statiques (ex. images, CSS, JS) depuis le dossier /public
app.use(Express.static(path.join(__dirname, "public")));

// Permet de décoder les corps de requêtes de type x-www-form-urlencoded
app.use(Express.urlencoded({ extended: true }));

// Permet de lire les corps de requêtes JSON
app.use(Express.json());

// Routes principales
app.use(router);

// Démarrage du serveur, écoute des connexions HTTP sur le port défini
app.listen(PORT, () => {
  console.log(`Le serveur a démarré sur le port ${PORT}`);
});

// Export pour usage dans les tests ou autres modules
export default app;
