import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      let data = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          email: true,
          image: true,
          accounts: {
            select: {
              provider: true
            }
          }
        },
      });

      return {
        name: data.name,
        email: data.email,
        image: data.image,
        providers: data.accounts.map(it => it.provider)
      }

    }),
});