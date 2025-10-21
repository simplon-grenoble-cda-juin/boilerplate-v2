import { Controller } from "../libs/Controller";
import Token from "../modeles/Token";
import User from "../modeles/User";
import { TokenRepository } from "../repositories/TokenRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "../services/AuthService";
import argon2 from "argon2";

export class AuthController extends Controller {
  /**
   * Inscription d'un nouvel utilisateur
   *
   * Réponses possibles :
   * - 400 si la requête est invalide
   * - 409 si un utilisateur existe déjà avec cet email
   * - 500 si une erreur survient lors de la création de l’utilisateur ou du token
   * - 201 avec le token si tout est correct
   */
  signUp = async () => {
    // 1 Valider la requête d'inscription
    const validate = AuthService.validateAuthRequest(this.request);

    if (!validate.success) {
      return this.response.status(400).json({ message: validate.message });
    }

    const { email, password } = validate.data;

    const userRepository = new UserRepository();

    // 2 Vérifier s'il existe déjà un utilisateur avec cet email en base de données
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return this.response
        .status(409)
        .json({ message: "Utilisateur déjà existant" });
    }

    // 3 Hasher le mot de passe, instancier l’utilisateur et l’enregistrer
    const passwordHash = await argon2.hash(password);
    const user = new User(email, passwordHash);

    const userId = await userRepository.create(user);

    if (!userId) {
      return this.response
        .status(500)
        .json({ message: "Une erreur est survenue" });
    }

    // 4 Créer le token et l’enregistrer
    const tokenRepository = new TokenRepository();

    const token = new Token(userId);
    const tokenId = await tokenRepository.create(token);

    if (!tokenId) {
      return this.response
        .status(500)
        .json({ message: "Une erreur est survenue" });
    }

    // 5 Attacher le cookie httpOnly contenant le token à la réponse
    this.response.cookie("userToken", token.getToken(), {
      httpOnly: true,
    });

    // 6 Répondre avec succès
    return this.response.status(201).json({
      message: "Inscription réussie",
      token: token.getToken(),
    });
  };

  /**
   * Connexion d’un utilisateur existant
   *
   * Réponses possibles :
   * - 400 si la requête est invalide
   * - 401 si l’email ou le mot de passe est incorrect
   * - 500 si une erreur survient lors de la gestion du token
   * - 200 avec le token si tout est correct
   */
  signIn = async () => {
    // 1 Valider la requête de connexion
    const validate = AuthService.validateAuthRequest(this.request);

    if (!validate.success) {
      return this.response.status(400).json({ message: validate.message });
    }

    const { email, password } = validate.data;

    const userRepository = new UserRepository();

    // 2 Rechercher l’utilisateur par email
    const existingUser = await userRepository.findByEmail(email);
    const existingUserId = existingUser?.getId();

    if (!existingUser || !existingUserId) {
      return this.response
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    // 3 Vérifier la concordance entre le mot de passe soumis et le hash enregistré
    const validPassword = await argon2.verify(
      existingUser.getPasswordHash(),
      password
    );

    if (!validPassword) {
      return this.response
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    // 4 Récupérer le token existant de l’utilisateur en base de données
    const tokenRepository = new TokenRepository();
    let token = await tokenRepository.findByUserId(existingUserId);

    // 5 Créer et enregistrer un token si aucun n’est connu
    if (!token) {
      token = new Token(existingUserId);
      const tokenId = await tokenRepository.create(token);

      if (!tokenId) {
        return this.response
          .status(500)
          .json({ message: "Une erreur est survenue" });
      }
    }

    // 6 Attacher le cookie httpOnly contenant le token à la réponse
    this.response.cookie("userToken", token.getToken(), {
      httpOnly: true,
    });

    // 7 Répondre avec succès
    return this.response.status(200).json({
      message: "Connexion réussie",
      token: token.getToken(),
    });
  };

  /**
   * Récupération des informations du profil à partir d’un token
   *
   * Réponses possibles :
   * - 401 si le token n’est pas fourni ou invalide
   * - 403 si le token est inconnu en base
   * - 404 si l’utilisateur lié au token est introuvable
   * - 200 avec les données sérialisées de l’utilisateur si tout est correct
   */
  profil = async () => {
    // 1 Valider le token transmis dans la requête
    const validate = AuthService.validateAuthToken(this.request);

    if (!validate.success) {
      return this.response.status(401).json({ message: validate.message });
    }

    const tokenRepository = new TokenRepository();

    // 2 Vérifier la présence du token en base de données
    let token = await tokenRepository.find(validate.data.token);

    if (!token) {
      return this.response.status(403).json({ message: "Token non reconnu" });
    }

    // 3 Charger l’utilisateur associé au token
    const userRepository = new UserRepository();
    const user = await userRepository.find(token.getUserId());

    if (!user) {
      return this.response
        .status(404)
        .json({ message: "Utilisateur introuvable" });
    }

    // 4 Répondre avec succès en renvoyant les données sérialisées
    this.response.json({
      message: "Token valide",
      data: JSON.stringify(user.serialize()),
    });
  };
}
