import argon2 from "argon2";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import ClientManager from "../_setup/ClientManager";
import { UserFactory } from "../_factories/user.factory";

const fetcher = async (url, body) => {
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return { response, data };
};

// Il est nécessaire de générer des emails aléatoires pour tester l'inscription
// et s'assurer de ne pas utiliser un email déjà enregistré dans la base de données
const generateRandomEmail = () => {
  const local =
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6);
  return `${local}@test.com`;
};

describe("AuthController.signin", () => {
  beforeEach(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();

    await UserFactory.populate(seedManager.getClient(), {
      email: "test1@test.com",
      password: await argon2.hash("123"),
    });

    await UserFactory.populateRandom(seedManager.getClient(), 20)
  });

  afterAll(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();
    await seedManager.end()
  });

  const cases = [
    {
      name: "renvoie 400 et un message d’erreur si l’email est manquant",
      url: "http://localhost:3002/signin",
      body: { password: "123" },
      ok: false,
      code: 400,
      message: "Email et mot de passe requis",
    },
    {
      name: "renvoie 400 et un message d’erreur si le mot de passe est manquant",
      url: "http://localhost:3002/signin",
      body: { email: "test1@test.com" },
      ok: false,
      code: 400,
      message: "Email et mot de passe requis",
    },
    {
      name: "renvoie 401 et un message d’erreur si mot l'email est invalide",
      url: "http://localhost:3002/signin",
      body: { email: "invalid@invalid.com", password: "123" },
      ok: false,
      code: 401,
      message: "Email ou mot de passe invalide",
    },
    {
      name: "renvoie 401 et un message d’erreur si mot le mot de passe est invalide",
      url: "http://localhost:3002/signin",
      body: { email: "test1@test.com", password: "invalid" },
      ok: false,
      code: 401,
      message: "Email ou mot de passe invalide",
    },
    {
      name: "renvoie 200 et les données si l'authentification a réussit",
      url: "http://localhost:3002/signin",
      body: { email: "test1@test.com", password: "123" },
      ok: true,
      code: 200,
      message: "Connexion réussie",
    },
  ];

  it.each(cases)("$name", async ({ url, body, ok, code, message }) => {
    const { response, data } = await fetcher(url, body);

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(ok);
    expect(response.status).toBe(code);
    expect(data.message).toBe(message);
  });
});

describe("AuthController.signup", () => {
  const cases = [
    {
      name: "renvoie 400 et un message d’erreur si l’email est manquant",
      url: "http://localhost:3002/signup",
      body: { password: "123" },
      ok: false,
      code: 400,
      message: "Email et mot de passe requis",
    },
    {
      name: "renvoie 400 et un message d’erreur si le mot de passe est manquant",
      url: "http://localhost:3002/signup",
      body: { email: "test1@test.com" },
      ok: false,
      code: 400,
      message: "Email et mot de passe requis",
    },
    {
      name: "renvoie 409 et un message d’erreur si l'email est déjà utilisé",
      url: "http://localhost:3002/signup",
      body: { email: "test1@test.com", password: "123" },
      ok: false,
      code: 409,
      message: "Utilisateur déjà existant",
    },
    {
      name: "renvoie 201 et les données de l’utilisateur si l’inscription réussit",
      url: "http://localhost:3002/signup",
      body: { email: generateRandomEmail(), password: "demo" },
      ok: true,
      code: 201,
      message: "Inscription réussie",
    },
  ];

  it.each(cases)("$name", async ({ url, body, ok, code, message }) => {
    const { response, data } = await fetcher(url, body);

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(ok);
    expect(response.status).toBe(code);
    expect(data.message).toBe(message);
  });
});
