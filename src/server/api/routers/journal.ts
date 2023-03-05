import { addDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";


const extractDate = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDay()
  );
}

export const journalRouter = createTRPCRouter({
  setSubjectiveScore: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        score: z.number()
      })
    )
    .mutation((async ({ input, ctx }) => {
      let currentDate = extractDate(new Date());
      let existing = await ctx.prisma.subjectiveAnswer.findFirst({
        where: {
          subjectiveId: input.id,
          createdAt: { gte: currentDate, lte: addDays(currentDate, 1) }
        }
      });
      if (existing === null) {
        await ctx.prisma.subjectiveAnswer.create({
          data: {
            subjectiveId: input.id,
            score: input.score
          }
        })
      } else {
        await ctx.prisma.subjectiveAnswer.update({
          where: {
            id: existing.id
          },
          data: {
            score: input.score
          }
        })
      }
    })),

  getSubjectives: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      let startDate = extractDate(input.date);
      let endDate = addDays(startDate, 1);
      let data = await ctx.prisma.subjective.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          prompt: true,
          subjectiveAnswers: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      let subjectives = data.map(({ id, prompt, subjectiveAnswers }) => ({
        id,
        prompt,
        score: subjectiveAnswers[0]?.score
      }));

      return {
        subjectives: subjectives,
        date: input.date
      };
    }),
  getHabits: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      let startDate = extractDate(input.date);
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

      let habitsData = data.map(it => ({
        completed: it.completions.length > 0, 
        id: it.id,
        description: it.description
      }))
      return {
        habits: habitsData,
        date: input.date
      };
    }),
});
