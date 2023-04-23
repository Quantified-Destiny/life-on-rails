import { z } from "zod";

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

  unlinkHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), goalId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habitMeasuresGoal.deleteMany({
        where: {
          habitId: input.habitId,
          goalId: input.goalId,
        },
      });
    }),
});
