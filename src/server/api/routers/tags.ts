import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taggingRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  linkHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), tagName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let existingTag = await ctx.prisma.tag.findFirst({
        where: { name: input.tagName },
        select: { id: true, name: true },
      });

      let tagId =
        existingTag?.id ??
        (
          await ctx.prisma.tag.create({
            data: { name: input.tagName, ownerId: ctx.session.user.id },
          })
        ).id;

      let existingLink = await ctx.prisma.habitTag.findFirst({
        where: {
          habitId: input.habitId,
          tagId: tagId,
        },
      });
      if (!existingLink) {
        return ctx.prisma.habitTag.create({
          data: {
            habitId: input.habitId,
            tagId: tagId,
          },
        });
      } else {
        return false;
      }
    }),

  unlinkHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), tagName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habitTag.deleteMany({
        where: {
          habitId: input.habitId,
          tag: { name: input.tagName },
        },
      });
    }),

  getTags: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
});
