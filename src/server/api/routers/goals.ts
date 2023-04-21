import {
  Goal,
  Habit,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricMeasuresGoal,
  MetricTag,
} from "@prisma/client";
import { id } from "date-fns/locale";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { subDays } from "date-fns";

import { prisma as prismaClient } from "../../db";
import { getMetrics, getHabits } from "../../queries";

const score = () => Math.random();

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

      let [habits, habitsMap, habitCompletionsCount, habitScores] =
        await getHabits(ctx.prisma, ctx.session.user.id);

      let goals = await ctx.prisma.goal.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        include: {
          habits: {
            include: { habit: { include: { metrics: true } } },
          },
          metrics: true,
          GoalTag: { include: { tag: true } },
        },
      });

      let goalsData = goals.map((g) => {
        let m: number[] = g.metrics.map(
          (it) => metricScores.get(it.metricId) ?? 0
        );
        let h: number[] = g.habits.map(
          (it) => habitScores.get(it.habitId) ?? 0
        );

        let score = m.reduce((a, b) => a + b, 0) + h.reduce((a, b) => a + b, 0);
        score = score / (m.length + h.length);

        return {
          goal: { ...g, score },
          habits: g.habits.map((h) => {
            let linkedMetrics = h.habit.metrics.map(
              (m) => metricsMap.get(m.id)!
            );
            let linkedMetricScores = linkedMetrics
              .map((m) => metricScores.get(m.id)!)
              .reduce((a, b) => a + b, 0);

            let score: number =
              linkedMetrics.length == 0
                ? habitScores.get(h.id) ?? 0
                : h.habit.completionWeight * (habitScores.get(h.id) ?? 0) +
                  (1 - h.habit.completionWeight) *
                    (linkedMetricScores / linkedMetrics.length);

            let tags = g.GoalTag.map((it) => it.tag.name);

            return {
              ...h.habit,
              completions: habitCompletionsCount.get(h.id) ?? 0,
              score,
              metrics: linkedMetrics,
              tags: tags,
            };
          }),
          metrics: g.metrics.map((m) => ({
            score: metricScores.get(m.metricId) ?? -1,
            ...metricsMap.get(m.metricId)!,
          })),
        };
      });

      let habitsData: (Habit & {
        completions: number;
        score: number;
        metrics: Metric[];
      })[] = habits.map((h) => {
        let linkedMetrics = h.metrics.map((m) => metricsMap.get(m.metricId)!);
        let linkedMetricScores = linkedMetrics
          .map((m) => metricScores.get(m.id) ?? 0)
          .reduce((a, b) => a + b, 0);
        let score: number =
          linkedMetrics.length == 0
            ? habitScores.get(h.id) ?? 0
            : h.completionWeight * (habitScores.get(h.id) ?? 0) +
              (1 - h.completionWeight) *
                (linkedMetricScores / linkedMetrics.length);

        return {
          ...h,
          completions: habitCompletionsCount.get(h.id) ?? 0,
          score,
          metrics: linkedMetrics,
        };
      });

      let metricsData = metrics
        .filter((m) => m.completionMetric.length == 0)
        .map((m) => {
          return { ...m, score: metricScores.get(m.id) };
        });

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
