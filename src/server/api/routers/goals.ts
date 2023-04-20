import {
  Goal,
  Habit,
  HabitMeasuresGoal,
  LinkedMetric,
  Metric,
  MetricMeasuresGoal,
} from "@prisma/client";
import { id } from "date-fns/locale";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { subDays } from "date-fns";

function targetCount(h: Habit) {
  if (h.frequencyHorizon == "DAY") {
    return h.frequency * 14;
  } else if (h.frequencyHorizon == "WEEK") {
    return h.frequency * 2;
  } else return h.frequency / 2;
}

type Ret = Goal & {
  habits: {
    habit: Habit;
  }[];
  metrics: {
    metric: Metric;
  }[];
};

const score = () => Math.random();

function flatten(data: Ret) {
  return {
    goal: { name: data.name, score: score() },
    habits: data.habits.map((it) => ({
      name: it.habit.description,
      score: score(),
    })),
    subjectives: data.metrics.map((it) => ({
      name: it.metric.prompt,
      score: score(),
    })),
  };
}

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
      let metrics: (Metric & { completionMetric: LinkedMetric[] })[] =
        await ctx.prisma.metric.findMany({
          where: {
            ownerId: ctx.session.user.id,
          },
          include: {
            completionMetric: true,
          },
        });

      let metricAnswers = await ctx.prisma.metricAnswer.groupBy({
        by: ["metricId"],
        _avg: {
          value: true,
        },
        where: {
          createdAt: { gt: subDays(new Date(), 14) },
        },
      });

      let metricScores = new Map<string, number>(
        metricAnswers.map((a) => [a.metricId, a._avg.value ?? 0])
      );
      let metricsMap = new Map<string, Metric>(metrics.map((m) => [m.id, m]));

      let habits: (Habit & { metrics: LinkedMetric[] })[] =
        await ctx.prisma.habit.findMany({
          where: {
            ownerId: ctx.session.user.id,
          },
          include: {
            metrics: true,
          },
        });

      let habitsMap = new Map<string, Habit>(habits.map((h) => [h.id, h]));
      let habitCompletions = await ctx.prisma.habitCompletion.groupBy({
        by: ["habitId"],
        _count: {
          _all: true,
        },
        where: {
          Habit: { ownerId: ctx.session.user.id },
          date: { gt: subDays(new Date(), 14) },
        },
      });
      let habitCompletionsCount = new Map<String, number>(
        habitCompletions.map((it) => {
          console.log(it.habitId);
          return [it.habitId, it._count._all];
        })
      );
      let habitScores = new Map<String, number>(
        habitCompletions.map((it) => {
          console.log(it.habitId);
          return [
            it.habitId,
            it._count._all / targetCount(habitsMap.get(it.habitId)!),
          ];
        })
      );

      let goals: (Goal & {
        habits: (HabitMeasuresGoal & {
          habit: Habit & { metrics: LinkedMetric[] };
        })[];
        metrics: MetricMeasuresGoal[];
      })[] = await ctx.prisma.goal.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        include: {
          habits: {
            include: { habit: { include: { metrics: true } } },
          },
          metrics: true,
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

            return {
              ...h.habit,
              completions: habitCompletionsCount.get(h.id) ?? 0,
              score,
              metrics: linkedMetrics,
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
