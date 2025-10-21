import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    pool: "threads",
    poolOptions: { threads: { singleThread: true } }, // 1 seul worker
  },
});
