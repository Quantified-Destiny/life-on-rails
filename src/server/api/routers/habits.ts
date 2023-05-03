import { z } from "zod";

import type { LinkedMetric, Metric } from "@prisma/client";
import { FrequencyHorizon } from "@prisma/client";
import { subDays } from "date-fns";
import { getHabitsWithMetricsMap, getMetrics } from "../../queries";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const habitsRouter = createTRPCRouter({
  linkHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), goalId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existingLink = await ctx.prisma.habitMeasuresGoal.findFirst({
        where: {
          habitId: input.habitId,
          goalId: input.goalId,
        },
      });
      if (!existingLink) {
        console.log(
          `creating link for habit ${input.habitId} and goal ${input.goalId} in db`
        );
        return await ctx.prisma.habitMeasuresGoal.create({
          data: {
            habitId: input.habitId,
            goalId: input.goalId,
          },
        });
      } else {
        console.log(
          `link already exists for habit ${input.habitId} and goal ${input.goalId}`
        );
        return existingLink;
      }
    }),

  getGoals: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ input, ctx }) => {
      const goals = await ctx.prisma.goal.findMany({
        where: {
          ownerId: ctx.session.user.id,
          habits: {
            some: {
              habitId: input.habitId,
            },
          },
        },
        include: {
          habits: true,
        },
      });

      return goals;
    }),

  getCompletions: protectedProcedure
    .input(z.object({ habitId: z.string(), timeHorizon: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const completions = await ctx.prisma.habitCompletion.findMany({
        where: {
          habitId: input.habitId,
          date: { gt: subDays(new Date(), input.timeHorizon) },
        },
      });
      return completions;
    }),

  getMetrics: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metrics: (Metric & { completionMetric: LinkedMetric[] })[] =
        await ctx.prisma.metric.findMany({
          where: {
            ownerId: ctx.session.user.id,
            completionMetric: {
              some: {
                habitId: input.habitId,
              },
            },
          },
          include: {
            completionMetric: true,
          },
        });

      return metrics;
    }),

  createHabit: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const habit = await ctx.prisma.habit.create({
        data: { description: input.description, ownerId: ctx.session.user.id },
      });
      return habit;
    }),

  editHabit: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(
        `Editing habit ${input.habitId} in db with description ${input.description}`
      );
      return await ctx.prisma.habit.update({
        where: {
          id: input.habitId,
        },
        data: {
          description: input.description,
        },
      });
    }),

  editCompletionWeight: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        completionWeight: z.number().gte(0).lte(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(
        `Editing habit ${input.habitId} in db with completion weight ${input.completionWeight}`
      );
      return await ctx.prisma.habit.update({
        where: {
          id: input.habitId,
        },
        data: {
          completionWeight: input.completionWeight,
        },
      });
    }),

  unlinkHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), goalId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habitMeasuresGoal.delete({
        where: {
          goalId_habitId: {
            habitId: input.habitId,
            goalId: input.goalId,
          },
        },
      });
    }),

  deleteHabit: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habit.deleteMany({
        where: {
          id: input.habitId,
        },
      });
    }),

  editFrequency: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        frequency: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habit.update({
        where: {
          id: input.habitId,
        },
        data: {
          frequency: input.frequency,
        },
      });
    }),

  getHabits: protectedProcedure.query(async ({ ctx }) => {
    const [_, metricsMap] = await getMetrics({
      prisma: ctx.prisma,
      userId: ctx.session.user.id,
    });

    const [habits, _habitsMap] = await getHabitsWithMetricsMap({
      prisma: ctx.prisma,
      metricsMap,
      userId: ctx.session.user.id,
    });
    return habits;
  }),

  getHabit: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ input, ctx }) => {
      //TODO fix this
      const [_, metricsMap] = await getMetrics({
        prisma: ctx.prisma,
        userId: ctx.session.user.id,
      });

      const [habits, _habitsMap] = await getHabitsWithMetricsMap({
        prisma: ctx.prisma,
        metricsMap,
        userId: ctx.session.user.id,
      });
      return habits.find((habit) => habit.id === input.habitId);
    }),

  editFrequencyHorizon: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        frequencyHorizon: z.enum([FrequencyHorizon.DAY, FrequencyHorizon.WEEK]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habit.update({
        where: {
          id: input.habitId,
        },
        data: {
          frequencyHorizon: input.frequencyHorizon,
        },
      });
    }),
});
