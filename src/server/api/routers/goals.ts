import type { Goal, Metric } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import {
  getGoals,
  getHabits,
  getHabitsWithMetricsMap,
  getMetrics,
  getScoringWeeks,
} from "../../queries";

export const goalsRouter = createTRPCRouter({
  deleteGoal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(`Deleting goal ${input.id} from db`);
      return await ctx.prisma.goal.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getTags: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.tag.findMany({
        where: {
          GoalTag: {
            some: {
              goalId: input.goalId,
            },
          },
        },
      });
    }),

  getMetrics: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metrics: Metric[] = await ctx.prisma.metric.findMany({
        where: {
          ownerId: ctx.session.user.id,
          goals: { some: { goalId: input.id } },
        },
      });
      return metrics;
    }),

  getGoal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const scoringWeeks = await getScoringWeeks(
        ctx.prisma,
        ctx.session.user.id
      );


      const goal: Goal = await ctx.prisma.goal.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      const habits = await getHabits({
        prisma: ctx.prisma,
        userId: ctx.session.user.id,
        scoringWeeks: scoringWeeks,
        goalIds: [input.id],
      });

      const [metrics, _map] = await getMetrics({
        prisma: ctx.prisma,
        userId: ctx.session.user.id,
        scoringWeeks: scoringWeeks,
        goalIds: [goal.id],
      });

      return {
        ...goal,
        habits,
        metrics,
      };
    }),

  getAllGoals: protectedProcedure.query(async ({ ctx }) => {
    const scoringWeeks = (
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { scoringWeeks: true },
      })
    ).scoringWeeks;
    const [metrics, metricsMap] = await getMetrics({
      prisma: ctx.prisma,
      userId: ctx.session.user.id,
      scoringWeeks,
    });

    const [habits, habitsMap] = await getHabitsWithMetricsMap({
      prisma: ctx.prisma,
      metricsMap,
      userId: ctx.session.user.id,
      scoringWeeks,
    });

    const goalsData = await getGoals(
      ctx.prisma,
      ctx.session.user.id,
      metricsMap,
      habitsMap
    );

    return {
      goals: goalsData,
      habits: habits.filter((h) => h.goals.length == 0),
      metrics: metrics.filter(
        (m) => m.linkedHabits.length == 0 && m.goals.length == 0
      ),
    };
  }),

  getAllMetrics: protectedProcedure.query(async ({ ctx }) => {
    const scoringWeeks = await getScoringWeeks(ctx.prisma, ctx.session.user.id);

    const [metrics, metricsMap] = await getMetrics({
      prisma: ctx.prisma,
      userId: ctx.session.user.id,
      scoringWeeks,
    });

    return {
      metrics: metrics,
      metricsMap: metricsMap,
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

  getWeights: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .query(async ({ input, ctx }) => {
      const goal = await ctx.prisma.goal.findUnique({
        where: {
          id: input.goalId,
        },
        select: {
          habits: true,
          metrics: true,
        },
      });
      return goal;
    }),

  getMetricGoalWeight: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .query(async ({ input, ctx }) => {
      const goals: { metricId: string; weight: number }[] =
        await ctx.prisma.metricMeasuresGoal.findMany({
          where: {
            goalId: input.goalId,
          },
          select: {
            metricId: true,
            weight: true,
          },
        });

      const MetricGoalWeightMap = new Map();
      goals.map((g) => {
        MetricGoalWeightMap.set(g.metricId, g.weight);
      });

      return {
        MetricGoalWeightMap: MetricGoalWeightMap,
      };
    }),

  updateHabitWeight: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        habitId: z.string(),
        weight: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habitMeasuresGoal.update({
        where: {
          goalId_habitId: {
            goalId: input.goalId,
            habitId: input.habitId,
          },
        },
        data: {
          weight: input.weight,
        },
      });
    }),

  updateMetricWeight: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        metricId: z.string(),
        weight: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.metricMeasuresGoal.update({
        where: {
          goalId_metricId: {
            goalId: input.goalId,
            metricId: input.metricId,
          },
        },
        data: {
          weight: input.weight,
        },
      });
    }),
});
