import { addDays } from "date-fns";
import add from "date-fns/add";
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
      /*
      let startDate = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDay()
      );
      let endDate = addDays(startDate, 1);
      let data = await ctx.prisma.habit.findMany({
        select: {
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

      return data.map(({ description, completions }) => ({
        description,
        completed: completions.length >= 0,
      }));
      */
      return {
        habits: [
          {
            desciption: "Go to the gym",
            completed: false,
            editable: false
          },
          {
            desciption: "Check the task tracker",
            completed: false,
            editable: false
          },
          {
            desciption: "Clean the room",
            completed: true,
            editable: false
          },
        ],
        date: new Date(),
      };
    }),
});
