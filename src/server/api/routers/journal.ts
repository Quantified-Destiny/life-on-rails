import { addDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const journalRouter = createTRPCRouter({
  getHabits: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      let startDate = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDay()
      );
      let endDate = addDays(startDate, 1);
      let data = await ctx.prisma.habit.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          description: true,
          completions: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      let habits = data.map(({ id, description, completions }) => ({
        id,
        description,
        completed: completions.length > 0,
      }));

      return {
        habits,
        date: input.date,
      };
    }),
});
