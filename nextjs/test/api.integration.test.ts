import type { CreateGameRequest } from "@ptera/schema";
import {
  describe,
  expect,
  it
} from "vitest";

const testUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const testGame: CreateGameRequest = {
  name: "Test Game",
  description: "A test game created by automated tests",
};

describe("API Client Integration Tests", () => {

  // TODO: 増やしてく
  describe("health", () => {
    it("health", async () => {
      const response = await fetch(
        `http://localhost:3000/api/health`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const json = await response.json();
      expect(json).toEqual({ status: "ok" });
    });
  })

});
