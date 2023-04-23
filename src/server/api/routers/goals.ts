import type { Goal } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { getHabits, getMetrics } from "../../queries";

export const goalsRouter = createTRPCRouter({
  getGoal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const goal: Goal = await ctx.prisma.goal.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      const habits = await ctx.prisma.habitMeasuresGoal.findMany({
        where: {
          goalId: goal.id,
        },
        include: {
          habit: true,
        },
      });
      return {
        goal: goal,
        habits: habits,
      };
    }),

  getGoals: protectedProcedure.query(async ({ input, ctx }) => {
    const [metrics, metricsMap, metricScores] = await getMetrics(
      ctx.prisma,
      ctx.session.user.id
    );

    console.log("Fetched metrics");

    const [habits, habitsMap, habitCompletionsCount, habitScores] =
      await getHabits(ctx.prisma, metricsMap, ctx.session.user.id);

    console.log("Fetched habits");

    const goals = await ctx.prisma.goal.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      include: {
        habits: {
          include: {
            habit: {
              include: {
                metrics: true,
                goals: true,
                HabitTag: { include: { tag: true } },
              },
            },
          },
        },
        metrics: true,
        GoalTag: { include: { tag: true } },
      },
    });

    console.log("Fetched goals");

    const goalsData = goals.map((g) => {
      const m: number[] = g.metrics.map(
        (it) => metricScores.get(it.metricId) ?? 0
      );
      const h: number[] = g.habits.map(
        (it) => habitScores.get(it.habitId) ?? 0
      );

      let score = m.reduce((a, b) => a + b, 0) + h.reduce((a, b) => a + b, 0);
      score = score / (m.length + h.length);

      const linkedHabits = g.habits.map((h) => habitsMap.get(h.habitId)!);

      return {
        goal: { ...g, score, tags: g.GoalTag.map((it) => it.tag.name) },
        habits: linkedHabits,
        metrics: g.metrics.map((m) => ({
          ...metricsMap.get(m.metricId)!,
        })),
      };
    });

    return {
      goals: goalsData,
      habits: habits.filter((h) => h.goals.length == 0),
      metrics: metrics.filter((m) => m.linkedHabits.length == 0),
    };
  }),

  editGoal: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(
        `Editing goal ${input.goalId} in db with description ${input.name}`
      );
      return await ctx.prisma.goal.update({
        where: {
          id: input.goalId,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getGoalOnly: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.goal.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    const goalData = data.map(({ id, name }) => ({
      id,
      name,
    }));

    return {
      goalData: goalData,
    };
  }),

  createGoal: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const goal = await ctx.prisma.goal.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });
      return goal;
    }),
});
