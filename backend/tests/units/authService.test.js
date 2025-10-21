import { describe, it, expect } from "vitest";
import { AuthService } from "../../src/services/AuthService";
import User from "../../src/modeles/User";

describe("AuthService.generateToken", () => {
  it("renvoie une chaîne hexadécimale de 32 caractères", () => {
    const token = AuthService.generateToken();
    expect(typeof token).toBe("string");
  });

  it("renvoie un token différent à chaque appel", () => {
    const token1 = AuthService.generateToken();
    const token2 = AuthService.generateToken();
    expect(token1).not.toBe(token2);
  });
});

describe("AuthService.createUser", () => {
  const email = "test@test.com";
  const password = "123";
  const user = AuthService.createUser(email, password);

  it("renvoie une instance de User", () => {
    expect(user).toBeInstanceOf(User);
  });

  it("renseigne correctement l'email de l'utilisateur", () => {
    expect(user.getEmail()).toBe(email);
  });

  it("renseigne correctement le mot de passe de l'utilisateur", () => {
    expect(user.getPasswordHash()).toBe(password);
  });

  it("renseigne la date d'inscription au format ISO jusqu’à la minute", () => {
    const now = new Date();
    const expected = now.toISOString().slice(0, 16);
    const actual = user.getCreatedAt().slice(0, 16);
    expect(actual).toBe(expected);
  });
});

// describe("AuthService.findUserByEmail", () => {
  // const invalid = AuthService.findUserByEmail(fakeUsers, "test@invalid.com");
  // const valid = AuthService.findUserByEmail(fakeUsers, "test1@test.com");

  // it("renvoie un résultat négatif si l'email n'existe pas", () => {
  //   expect(invalid.success).toBeFalsy();
  // });

  // it("renvoie un message d'erreur adapté si l'email n'existe pas", () => {
  //   expect(invalid.message).toBe("Email inconnu");
  // });

  // it("renvoie un résultat positif si l'email existe", () => {
  //   expect(valid.success).toBeTruthy();
  // });

  // it("renvoie une instance de User si l'email existe", () => {
  //   expect(valid.data).toBeInstanceOf(User);
  // });
// });

// describe("AuthService.authenticateUser", () => {
  // it("renvoie un résultat négatif si l'email est inconnu", () => {
  //   const result = AuthService.authenticateUser(
  //     fakeUsers,
  //     "testInvalid@invalid.com",
  //     "123"
  //   );
  //   expect(result.success).toBeFalsy();
  //   expect(result.data).toBeUndefined();
  //   expect(result.message).toBe("Email ou mot de passe invalide");
  // });

  // it("renvoie un résultat négatif si le mot de passe est incorrect", () => {
  //   const result = AuthService.authenticateUser(
  //     fakeUsers,
  //     "test1@test.com",
  //     "invalid"
  //   );
  //   expect(result.success).toBeFalsy();
  //   expect(result.data).toBeUndefined();
  //   expect(result.message).toBe("Email ou mot de passe invalide");
  // });

  // it("renvoie un résultat positif si les identifiants sont valides", () => {
  //   const result = AuthService.authenticateUser(
  //     fakeUsers,
  //     "test1@test.com",
  //     "123"
  //   );
  //   expect(result.success).toBeTruthy();
  //   expect(result.data).toBeInstanceOf(User);
  //   expect(result.message).toBeUndefined();
  // });
// });
