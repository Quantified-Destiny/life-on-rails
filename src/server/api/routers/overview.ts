import { goal, habit, metric } from "../../../schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { eq } from "drizzle-orm";

export const overviewRouter = createTRPCRouter({
  getArchivedItems: protectedProcedure.query(async ({ ctx }) => {
    const goals = ctx.db.select().from(goal).where(eq(goal.archived, 1));
    const habits = ctx.db.select().from(habit).where(eq(habit.archived, 1));
    const metrics = ctx.db.select().from(metric).where(eq(metric.archived, 1));

    return {
      goals: await goals,
      habits: await habits,
      metrics: await metrics,
    };
  }),
});
