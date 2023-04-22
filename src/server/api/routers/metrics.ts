import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const metricsRouter = createTRPCRouter({
  createLinkedMetric: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        habitId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let metric = await ctx.prisma.metric.create({
        data: { prompt: input.prompt, ownerId: ctx.session.user.id },
      });
      await ctx.prisma.linkedMetric.create({
        data: {
          metricId: metric.id,
          habitId: input.habitId,
        },
      });
    }),

  editMetric: protectedProcedure
    .input(z.object({ metricId: z.string(), prompt: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.metric.update({
        where: { id: input.metricId },
        data: { prompt: input.prompt },
      });
    }),
});
