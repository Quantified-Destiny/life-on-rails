/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import type { Metric } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const metricsRouter = createTRPCRouter({
  createMetric: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        habitId: z.string().optional(),
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
    }),

  editMetric: protectedProcedure
    .input(z.object({ metricId: z.string(), prompt: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.metric.update({
        where: { id: input.metricId },
        data: { prompt: input.prompt },
      });
    }),
});
