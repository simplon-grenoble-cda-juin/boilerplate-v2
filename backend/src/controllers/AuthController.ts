import argon2 from "argon2";
import { Controller } from "@src/libs/Controller";
import Token from "@src/modeles/Token";
import User from "@src/modeles/User";
import { TokenRepository } from "@src/repositories/TokenRepository";
import { UserRepository } from "@src/repositories/UserRepository";
import { TokenService } from "@src/services/TokenService";
import { CookieService } from "@src/services/CookieService";

/**
 * Contrôleur gérant l'authentification.
 */
export class AuthController extends Controller {
  /**
   * Inscription d'un nouvel utilisateur
   *
   * • Reçoit un corps déjà validé par le middleware
   * • Vérifie l'unicité de l'email
   * • Hash le mot de passe et crée l'utilisateur
   * • Signe un JWT de rafraîchissement et crée un enregistrement de token
   * • Dépose le JWT brut en cookie httpOnly
   *
   * Réponses envoyées par cette méthode : 409 500 201
   */
  signUp = async () => {
    // 0.0 REQUEST : Récupérer les données du corps de requête validées par le middleware
    const { email, password, pseudo } = this.request.body;

    // 1.1 USER : Vérifier s'il existe déjà un utilisateur avec cet email en base de données
    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return this.response
        .status(409)
        .json({ message: "Utilisateur déjà existant" });
    }

    // 1.2 USER : Hasher le mot de passe, instancier l’utilisateur et l’enregistrer
    const passwordHash = await argon2.hash(password);
    const user = new User(email, pseudo, passwordHash);
    const userId = await userRepository.create(user);

    if (!userId) {
      return this.response
        .status(400)
        .json({ message: "Création de l’utilisateur impossible" });
    }

    // 2.1 TOKEN : Signer le jwt et créer une instance du token
    const jwt = TokenService.signRefreshToken({
      sub: String(userId),
    });
    const token = Token.create(userId, jwt);

    // 2.2 TOKEN : Enregistrer le token
    const tokenRepository = new TokenRepository();
    const tokenId = await tokenRepository.create(token);

    if (!tokenId) {
      return this.response
        .status(400)
        .json({ message: "Création du token impossible" });
    }

    // 3 RESPONSE : Attacher le cookie contenant le jwt et répondre
    CookieService.setRefreshCookie(this.response, jwt);

    return this.response.status(201).json({
      message: "Inscription réussie",
      data: user.serialize(),
    });
  };

  /**
   * Connexion d’un utilisateur existant
   *
   * • Reçoit un corps déjà validé par le middleware
   * • Vérifie l'existence de l'utilisateur et le mot de passe
   * • Récupère un éventuel token existant
   * • Signe un nouveau JWT et remplace ou crée le token en base
   * • Dépose le JWT brut en cookie httpOnly
   *
   * Réponses envoyées par cette méthode : 401 500 200
   */
  signIn = async () => {
    // 0.0 REQUEST : Récupérer les données du corps de requête validées par le middleware
    const { email, password } = this.request.body;

    // 1.1 USER : Vérifier si un utilisateur avec cet email existe en base de données
    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByEmail(email);
    const existingUserId = existingUser?.getId();

    if (!existingUser || !existingUserId) {
      return this.response
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    // 1.2 USER : Vérifier la concordance entre le mot de passe soumis et le hash enregistré
    const validPassword = await argon2.verify(
      existingUser.getPasswordHash(),
      password
    );

    if (!validPassword) {
      return this.response
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    // 2.1 ROTATION TOKEN : Récupérer le token existant de l’utilisateur en base de données
    const tokenRepository = new TokenRepository();
    const existingToken = await tokenRepository.findByUserId(existingUserId);

    // 2.2 ROTATION TOKEN : Signer le nouveau jwt et créer une instance du token
    const jwt = TokenService.signRefreshToken({
      sub: String(existingUserId),
    });
    const freshToken = Token.create(existingUserId, jwt);

    // 2.3 ROTATION TOKEN : Si un token existe, on le remplace, sinon on ajoute un nouveau
    let replacingTokenId = null;

    if (existingToken) {
      replacingTokenId = await tokenRepository.replaceForUser(freshToken);
    } else {
      replacingTokenId = await tokenRepository.create(freshToken);
    }

    if (!replacingTokenId) {
      return this.response
        .status(400)
        .json({ message: "Impossible de créer ou remplacer le token" });
    }

    // 3 RESPONSE : Attacher le cookie contenant le jwt et répondre
    CookieService.setRefreshCookie(this.response, jwt);

    return this.response.status(200).json({
      message: "Connexion réussie",
      data: existingUser.serialize(),
    });
  };

  /**
   * Déconnexion d’un utilisateur
   *
   * • Utilise l'identifiant utilisateur fourni par le middleware d'authentification
   * • Supprime le token associé en base
   * • Nettoie les cookies côté client
   *
   * Réponses envoyées par cette méthode : 200
   */
  logOut = async () => {
    // 0.0 REQUEST : Récupérer l'id de l'utilisateur validé par le middleware
    const userId = this.request.userId as number;

    const tokenRepository = new TokenRepository();
    await tokenRepository.deleteByUserId(userId);

    // 3 RESPONSE : Nettoyer les cookies et répondre
    CookieService.clearAuthCookies(this.response);

    return this.response.status(200).json({
      message: "Déconnexion réussie",
    });
  };

  /**
   * Mise à jour du mot de passe utilisateur
   *
   * • Utilise l'identifiant utilisateur fourni par le middleware d'authentification
   * • Vérifie le mot de passe actuel
   * • Hash le nouveau mot de passe puis met à jour l'utilisateur en base
   * • Signe un nouveau JWT et remplace ou crée le token associé
   * • Dépose le nouveau JWT brut en cookie httpOnly
   *
   * Réponses envoyées par cette méthode : 401 404 500 200
   */
  passwordUpdate = async () => {
    // 0.0 REQUEST : Récupérer les données du corps de requête validées par le middleware
    const { currentPassword, newPassword } = this.request.body; 

    // 0.0 REQUEST : Récupérer l'id de l'utilisateur validé par le middleware
    const userId = this.request.userId as number;

    // 1.1 USER : Charger l’utilisateur
    const userRepository = new UserRepository();
    const user = await userRepository.find(userId);

    if (!user) {
      return this.response
        .status(404)
        .json({ message: "Utilisateur introuvable" });
    }

    // 1.2 USER : Vérifier la concordance entre le mot de passe soumis et le hash enregistré
    const validPassword = await argon2.verify(
      user.getPasswordHash(),
      currentPassword
    );

    if (!validPassword) {
      return this.response
        .status(401)
        .json({ message: "Mot de passe actuel invalide" });
    }

    // 1.3 USER : Hasher le mot de passe puis mettre à jour le mot de passe de l'utilisateur
    const newPasswordHash = await argon2.hash(newPassword);

    const updatedUserId = await userRepository.updatePassword(
      userId,
      newPasswordHash
    );

    if (!updatedUserId) {
      return this.response
        .status(400)
        .json({ message: "Impossible de mettre à jour le mot de passe" });
    }

    // 2.1 ROTATION TOKEN : Récupérer le token existant de l’utilisateur en base de données
    const tokenRepository = new TokenRepository();
    const existingToken = await tokenRepository.findByUserId(userId);

    // 2.2 ROTATION TOKEN : Signer le nouveau jwt et créer une instance du token
    const jwt = TokenService.signRefreshToken({
      sub: String(userId),
    });
    const freshToken = Token.create(userId, jwt);

    // 2.3 ROTATION TOKEN : Si un token existe, on le remplace, sinon on ajoute un nouveau
    let replacingTokenId = null;

    if (existingToken) {
      replacingTokenId = await tokenRepository.replaceForUser(freshToken);
    } else {
      replacingTokenId = await tokenRepository.create(freshToken);
    }

    if (!replacingTokenId) {
      return this.response
        .status(400)
        .json({ message: "Impossible de mettre à jour le mot de passe" });
    }

    // 3 RESPONSE : Attacher le cookie contenant le jwt et répondre
    CookieService.setRefreshCookie(this.response, jwt);

    return this.response.status(200).json({
      message: "Mot de passe mis à jour",
    });
  };

  /**
   * Récupération des informations de profil
   *
   * • Utilise l'identifiant utilisateur fourni par le middleware d'authentification
   * • Charge l'utilisateur et renvoie les données sérialisées
   *
   * Réponses envoyées par cette méthode : 404 200
   */
  profile = async () => {
    // 0.0 REQUEST : Récupérer l'id de l'utilisateur validé par le middleware
    const userId = this.request.userId as number;

    // 1.1 USER : Charger l’utilisateur
    const userRepository = new UserRepository();
    const user = await userRepository.find(userId);

    if (!user) {
      return this.response
        .status(404)
        .json({ message: "Utilisateur introuvable" });
    }

    // 3 RESPONSE : Répondre avec succès en renvoyant les données sérialisées
    this.response.json({
      message: "Token valide",
      data: user.serialize(),
    });
  };
}
