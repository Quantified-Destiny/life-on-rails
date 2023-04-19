import { Goal, Habit, Metric } from "@prisma/client";
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
      let habits = await ctx.prisma.habit.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
      });
      let habitsMap: Map<string, Habit> = new Map(habits.map((h) => [h.id, h]));
      console.log("Habits");
      console.log(habitsMap);
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
      let habitScores: Map<String, number> = new Map(
        habitCompletions.map((it) => {
          console.log(it.habitId);
          return [
            it.habitId,
            it._count._all / targetCount(habitsMap.get(it.habitId)!),
          ];
        })
      );
      console.log("Scores");
      console.log(habitScores);
      let habitsData = habits.map((h) => {
        return {
          ...h,
          score: habitScores.get(h.id) ?? 0,
        };
      });

      let metrics: Metric[] = await ctx.prisma.metric.findMany({
        where: {
          ownerId: ctx.session.user.id,
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
      let metricScores: Map<string, number> = new Map(
        metricAnswers.map((a) => [a.metricId, a._avg.value ?? 0])
      );
      let metricsMap: Map<string, Metric> = new Map(
        metrics.map((m) => [m.id, m])
      );

      let metricsData = metrics.map((m) => {
        return { ...m, score: metricScores.get(m.id) };
      });

      let goals = await ctx.prisma.goal.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        include: {
          habits: true,
          metrics: true,
        },
      });

      let goalsData = goals.map((g) => {
        let m = g.metrics.map((it) => metricScores.get(it.metricId) ?? 0);
        let h = g.habits.map((it) => habitScores.get(it.habitId) ?? 0);

        let score = m.reduce((a, b) => a + b, 0) + h.reduce((a, b) => a + b, 0);
        score = score / (m.length + h.length);

        return {
          goal: { ...g, score },
          habits: g.habits.map((h) => ({
            score: habitScores.get(h.habitId) ?? -1,
            ...habitsMap.get(h.habitId)!,
          })),
          metrics: g.metrics.map((m) => ({
            score: metricScores.get(m.metricId) ?? -1,
            ...metricsMap.get(m.metricId)!,
          })),
        };
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
