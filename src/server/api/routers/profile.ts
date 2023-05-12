import { ZodEnum, z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          email: true,
          image: true,
          scoringWeeks: true,
          scoringUnit: true,
          accounts: {
            select: {
              provider: true
            }
          },
          createdAt: true
        },
      });

      return {
        name: data.name,
        email: data.email,
        image: data.image,
        scoringWeeks: data.scoringWeeks,
        scoringUnit: data.scoringUnit,
        providers: data.accounts.map(it => it.provider),
        createdAt: data.createdAt
      }

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
  .input(z.object({ scoringUnit:  z.enum(['Percentage', 'Normalized'])}))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: { scoringUnit: input.scoringUnit },
    });
  }),

});