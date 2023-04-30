import { Database } from "@/index";

describe("Database - Recipes", () => {
  afterAll(async () => {
    await Database.pool.end();
  });

  it("passes dummy test", async () => {
    expect(true).toBe(true);
  });
});
