import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import ClientManager from "../_setup/ClientManager";
import User from "../../src/modeles/User";
import Player from "../../src/modeles/Player";
import { UserRepository } from "../../src/repositories/UserRepository";
import { PlayerRepository } from "../../src/repositories/PlayerRepository";

describe("User fixtures factory", () => {
  beforeEach(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();
    await seedManager.populate();
  });

  afterAll(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();
    await seedManager.end();
  });

  it("should have admin user", async () => {
    const repo = new UserRepository();
    const user = await repo.findByEmail("admin@admin.fr");

    expect(user).toBeInstanceOf(User);
    expect(user?.getEmail()).toBe("admin@admin.fr");
  });

  it("should have 10 random users", async () => {
    const repo = new UserRepository();
    const users = await repo.findAll();

    // 10 random + 1 admin
    expect(users.length).toEqual(11);
  });
});

describe("Player fixtures factory", async () => {
  beforeEach(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();
    await seedManager.populate();
  });

  afterAll(async () => {
    const seedManager = new ClientManager();
    await seedManager.clearTables();
    await seedManager.end();
  });

  it("should have admin player", async () => {
    const repo = new PlayerRepository();
    const player = await repo.findByNickname("Arthuro");

    expect(player).toBeInstanceOf(Player);
    expect(player?.getNickname()).toBe("Arthuro");
  });

  it("should have 30 random players", async () => {
    const repo = new PlayerRepository();
    const players = await repo.findAll();

    // 30 random + 1 admin
    expect(players.length).toEqual(31);
  });
});
