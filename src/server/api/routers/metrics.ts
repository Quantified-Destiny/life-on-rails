/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import type { Metric } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { startOfDay, endOfDay } from "date-fns";

export const metricsRouter = createTRPCRouter({
  createMetric: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        habitId: z.string().optional(),
        goalId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const metric: Metric = await ctx.prisma.metric.create({
        data: { prompt: input.prompt, ownerId: ctx.session.user.id },
      });
      if (input.habitId) {
        await ctx.prisma.linkedMetric.create({
          data: {
            metricId: metric.id,
            habitId: input.habitId,
          },
        });
      }
      if (input.goalId) {
        await ctx.prisma.metricMeasuresGoal.create({
          data: {
            metricId: metric.id,
            goalId: input.goalId,
          },
        });
      }
    }),

  setScore: protectedProcedure
    .input(
      z.object({
        metricId: z.string(),
        score: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.prisma.metricAnswer.findFirst({
        where: {
          metricId: input.metricId,
          createdAt: onDay(input.date),
        },
      });
      if (existing === null) {
        await ctx.prisma.metricAnswer.create({
          data: {
            metricId: input.metricId,
            value: input.score,
          },
        });
      } else {
        await ctx.prisma.metricAnswer.update({
          where: {
            id: existing.id,
          },
          data: {
            value: input.score,
          },
        });
      }
    }),

  editMetric: protectedProcedure
    .input(z.object({ metricId: z.string(), prompt: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.metric.update({
        where: { id: input.metricId },
        data: { prompt: input.prompt },
      });
    }),

  deleteMetric: protectedProcedure
    .input(z.object({ metricId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.metric.delete({ where: { id: input.metricId } });
    }),
});

const onDay = (date: Date) => {
  const startDate = startOfDay(date);
  const endDate = endOfDay(startDate);
  return {
    gte: startDate,
    lte: endDate,
  };
};
