import { Request } from "express";
import crypto from "node:crypto";
import { Result } from "../types/Types";
import User from "../modeles/User";

export class AuthService {
  // Test N°1
  static generateToken(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  // Test N°2
  static createUser(email: string, password: string): User {
    const signupAt = new Date().toISOString();
    return new User(email, password, signupAt);
  }

  // Test N°3
  static findUserByEmail(users: User[], email: string): Result<User, null> {
    const exists = users.find((user) => user.getEmail() === email);

    if (!exists) {
      return { success: false, message: "Email inconnu" };
    }

    return { success: true, data: exists };
  }

  // Test N°4
  static authenticateUser(
    users: User[],
    email: string,
    password: string
  ): Result<User, null> {
    const found = this.findUserByEmail(users, email);

    if (!found.success || found.data.getPasswordHash() !== password) {
      return {
        success: false,
        message: "Email ou mot de passe invalide",
      };
    }

    return { success: true, data: found.data };
  }

  // Test N°5
  static validateAuthRequest(
    request: Request
  ): Result<{ email: string; password: string }, null> {
    const { email, password } = request.body ?? {};

    if (!request.body || !email || !password) {
      return {
        success: false,
        message: "Email et mot de passe requis",
      };
    }

    return {
      success: true,
      data: { email, password },
    };
  }

  // Test N°6
  static validateAuthToken(request: Request): Result<{ token: string }, null> {
    // On récupères les cookies de la requête entrante
    const authCookies = request.cookies;

    // On retourne une erreur si les cookies sont vides
    // ou s'il n'y a pas de cookie nommé "userToken"
    if (!authCookies?.userToken) {
      return {
        success: false,
        message: "Token manquant ou invalide",
      };
    }

    // On récupère la valeur du cookie
    const userToken: string = authCookies.userToken;

    // On retourne un objet avec le token dans les data
    return { success: true, data: { token: userToken } };
  }
}