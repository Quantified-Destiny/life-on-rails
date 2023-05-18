import type {
  Metric
} from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const overviewRouter = createTRPCRouter({
  getArchivedItems: protectedProcedure.query(async ({ ctx }) => {
    const goals = ctx.prisma.goal.findMany({
      where: { archived: true },
      include: { tags: true },
    });
    const habits = ctx.prisma.habit.findMany({
      where: { archived: true },
      include: { HabitTag: true },
    });
    const metrics = ctx.prisma.metric.findMany({
      where: { archived: true },
      include: { MetricTag: true },
    });

    return {
      goals: await goals,
      habits: await habits,
      metrics: (await metrics) as Metric[],
    };
  }),
});
