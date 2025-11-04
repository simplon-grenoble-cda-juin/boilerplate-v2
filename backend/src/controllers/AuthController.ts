import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Controller } from "@src/libs/Controller";
import { UserRepository } from "@src/repositories/UserRepository";
import { TokenRepository } from "@src/repositories/TokenRepository";

export class AuthController extends Controller {
  signup = async () => {
    const body = this.request.body;

    // 0. Vérifier les données reçus + valider les données à faire
    if (
      !body.email ||
      !body.password ||
      !body.passwordConfirm ||
      !body.pseudo
    ) {
      return this.response.status(400).json({
        message: "Requête incomplète ou invalide",
      });
    }

    // 1. Vérifier que l'utilisateur n'est pas déjà enregistré
    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByEmail(body.email);

    if (existingUser) {
      return this.response.status(400).json({
        message: "Utilisateur déjà inscrit",
      });
    }

    // 2. Vérifier que les mots de passent sont égaux
    if (body.password !== body.passwordConfirm) {
      return this.response.status(400).json({
        message: "Les mots de passes ne sont pas égaux",
      });
    }

    const hashedPassword = await argon2.hash(body.password);

    // 3. Créer l'utilisateur en base de données
    const newUser = await userRepository.create(
      body.email,
      hashedPassword,
      body.pseudo,
      new Date().toISOString()
    );

    if (!newUser) {
      return this.response.status(400).json({
        message: "Inscription impossible",
      });
    }

    // 4. Signature et création du token (token + jwt)
    const jwtSecret = "286B9CC32BE1AA7C2FD5A6D958E62";
    const jwtTimeToLive = 43200;

    const jwtToken = jwt.sign({ sub: newUser.toString() }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: jwtTimeToLive,
    });

    const tokenRepository = new TokenRepository();

    const newToken = await tokenRepository.create(
      newUser,
      jwtToken,
      new Date(Date.now() + jwtTimeToLive * 1000).toISOString(),
      new Date().toISOString()
    );

    if (!newToken) {
      return this.response.status(400).json({
        message: "Inscription impossible",
      });
    }

    // 5. Joindre cookie + répondre positivement
    this.response.cookie("authToken", jwtToken, {
      httpOnly: true,
      expires: new Date(Date.now() + jwtTimeToLive * 1000),
    });

    return this.response.status(200).json({
      message: "Inscription validée",
    });
  };
}
