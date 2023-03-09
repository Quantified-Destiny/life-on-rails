import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getPersonalInfo: protectedProcedure
    .query(async ({ ctx }) => {
      let data = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          email: true,
          image: true,
        },
      });
      let profileData = data.map(({ name, email, image }) => ({
        name,
        email,
        image,
      }));

      return {
        profileData: profileData,
      };
    }),

  getProviderInfo: protectedProcedure
    .query(async ({ ctx }) => {
      let data = await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          provider: true
        },
      });
      let providerData = data.map(({ provider }) => ({
        provider,
      }));

      return {
        providerData: providerData,
      };
    }),
});