import { Goal } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { getHabits, getMetrics } from "../../queries";

export const goalsRouter = createTRPCRouter({
  getGoal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      let goal: Goal = await ctx.prisma.goal.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      let habits = await ctx.prisma.habitMeasuresGoal.findMany({
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

  getGoals: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      let [metrics, metricsMap, metricScores] = await getMetrics(
        ctx.prisma,
        ctx.session.user.id
      );

      console.log("Fetched metrics");

      let [habits, habitsMap, habitCompletionsCount, habitScores] =
        await getHabits(ctx.prisma, metricsMap, ctx.session.user.id);

      console.log("Fetched habits");

      let goals = await ctx.prisma.goal.findMany({
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

      let goalsData = goals.map((g) => {
        let m: number[] = g.metrics.map(
          (it) => metricScores.get(it.metricId) ?? 0
        );
        let h: number[] = g.habits.map(
          (it) => habitScores.get(it.habitId) ?? 0
        );

        let score = m.reduce((a, b) => a + b, 0) + h.reduce((a, b) => a + b, 0);
        score = score / (m.length + h.length);

        let linkedHabits = g.habits.map((h) => {
          let linkedMetrics = h.habit.metrics.map(
            (m) => metricsMap.get(m.metricId)!
          );
          // console.log(`Wanted metrics: ${h.habit.metrics.map((m) => m.metricId)}`);
          // console.log(metricsMap);
          let linkedMetricScores = linkedMetrics
            .map((m) => metricScores.get(m.id)!)
            .reduce((a, b) => a + b, 0);

          let score: number =
            linkedMetrics.length == 0
              ? habitScores.get(h.id) ?? 0
              : h.habit.completionWeight * (habitScores.get(h.id) ?? 0) +
                (1 - h.habit.completionWeight) *
                  (linkedMetricScores / linkedMetrics.length);
          // console.log(`Computed linked metrics for ${h.habitId}`);

          return {
            ...h.habit,
            completions: habitCompletionsCount.get(h.id) ?? 0,
            score,
            goals: h.habit.goals.map((g) => g.goalId),
            metrics: linkedMetrics,
            tags: h.habit.HabitTag.map((t) => t.tag.name),
          };
        });
        return {
          goal: { ...g, score, tags: g.GoalTag.map((it) => it.tag.name) },
          habits: linkedHabits,
          metrics: g.metrics.map((m) => ({
            ...metricsMap.get(m.metricId)!,
          })),
        };
      });

      let habitsData = habits.filter((h) => h.goals.length == 0);

      let metricsData = metrics.filter((m) => m.linkedHabits.length == 0);

      return {
        goals: goalsData,
        habits: habitsData,
        metrics: metricsData,
      };
    }),

  getGoalOnly: protectedProcedure.query(async ({ ctx }) => {
    let data = await ctx.prisma.goal.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    let goalData = data.map(({ id, name }) => ({
      id,
      name,
    }));

    return {
      goalData: goalData,
    };
  }),
});
