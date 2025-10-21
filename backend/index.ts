import Express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import router from "./src/routes";
import cookieParser from "cookie-parser";
import { createRequire } from "node:module";
import type { CorsOptions } from "cors";

const require = createRequire(import.meta.url);
const cors: typeof import("cors") = require("cors");

const app = Express();
const PORT = 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORS_OPTIONS: CorsOptions = {
  origin: ["http://localhost:5143"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(CORS_OPTIONS));

app.use(cookieParser());
app.use(Express.static(path.join(__dirname, "public")));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Le serveur a démarré sur le port ${PORT}`);
});

export default app;
