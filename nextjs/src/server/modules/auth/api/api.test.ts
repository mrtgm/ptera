import app from "@/server/core/server";
import { describe, expect, it } from "vitest";

describe("Testing My App", () => {
  it("Should return 200 response", () => {
    const res = app.fetch();
    expect(res.status).toBe(200);
  });
});
