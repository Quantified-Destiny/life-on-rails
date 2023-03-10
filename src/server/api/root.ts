import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { journalRouter } from "./routers/journal";
import { goalsRouter } from "./routers/goals";
import { createRouter } from "./routers/create";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  journal: journalRouter,
  goals: goalsRouter,
  create: createRouter,
  profile: profileRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
