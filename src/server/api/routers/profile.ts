import { clerkClient } from "@clerk/nextjs";
import { ScoringFormat, type Metric } from "@prisma/client";
import { z } from "zod";
import type { prisma as prismaClient } from "../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await clerkClient.users.getUser(userId);

    // const d = await ctx.db.query.user.findFirst({
    //   where: eq(user.id, ctx.session.user.id),
    //   with: {
    //     accounts: true,
    //   },
    // });
    const data = user;

    return {
      name: `${data.firstName || ""} ${data.lastName || ""}`,
      email: data.emailAddresses[0],
      image: data.imageUrl,
      scoringWeeks: 4,
      scoringUnit: ScoringFormat.Percentage,
      providers: [],
      createdAt: new Date(data.createdAt),
    };
  }),

  updateScoringWeeks: protectedProcedure
    .input(z.object({ scoringWeeks: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: { scoringWeeks: input.scoringWeeks },
      });
    }),

  updateScoringUnit: protectedProcedure
    .input(z.object({ scoringUnit: z.enum(["Percentage", "Normalized"]) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: { scoringUnit: input.scoringUnit },
      });
    }),

  resetAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await Promise.all([
      deleteGoals(ctx.prisma, ctx.session.user.id),
      deleteHabits(ctx.prisma, ctx.session.user.id),
      deleteMetrics(ctx.prisma, ctx.session.user.id),
      deleteTags(ctx.prisma, ctx.session.user.id),
    ]);
  }),
});

async function deleteGoals(prisma: typeof prismaClient, userId: string) {
  const goals = await prisma.goal.findMany({
    where: {
      ownerId: userId,
    },
  });

  return Promise.all(
    goals.map((it) => prisma.goal.delete({ where: { id: it.id } }))
  );
}
async function deleteHabits(prisma: typeof prismaClient, userId: string) {
  const habits = await prisma.habit.findMany({
    where: {
      ownerId: userId,
    },
  });

  return Promise.all(
    habits.map((it) => prisma.habit.delete({ where: { id: it.id } }))
  );
}
async function deleteMetrics(prisma: typeof prismaClient, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const metrics: Metric[] = await prisma.metric.findMany({
    where: {
      ownerId: userId,
    },
  });

  return Promise.all(
    metrics.map((it) => prisma.metric.delete({ where: { id: it.id } }))
  );
}
async function deleteTags(prisma: typeof prismaClient, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const tag = await prisma.tag.findMany({
    where: {
      ownerId: userId,
    },
  });

  return Promise.all(
    tag.map((it) => prisma.tag.delete({ where: { id: it.id } }))
  );
}
