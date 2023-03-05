import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const onDay = (date: Date) => {
  let startDate = startOfDay(date);
  let endDate = endOfDay(startDate);
  return {
    gte: startDate,
    lte: endDate,
  };
};

export const journalRouter = createTRPCRouter({
  addHabit: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.habit.create({
        data: {
          description: input,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  setCompletion: protectedProcedure
    .input(
      z.object({ date: z.date(), habitId: z.string(), completed: z.boolean() })
    )
    .mutation(async ({ input, ctx }) => {
      let existingCompletion = await ctx.prisma.habitCompletion.findFirst({
        where: {
          habitId: input.habitId,
          date: onDay(input.date),
        },
      });
      console.log(
        `Found completion: ${existingCompletion} for habit ${input.habitId}`
      );

      if (existingCompletion) {
        console.log(`Marking ${existingCompletion.id} as ${input.completed}`);
        return await ctx.prisma.habitCompletion.update({
          where: {
            id: existingCompletion.id,
          },
          data: {
            date: input.date,
            isCompleted: input.completed,
          },
        });
      } else {
        console.log(
          `Creating new completion for ${input.habitId} as ${input.completed}`
        );
        return await ctx.prisma.habitCompletion.create({
          data: {
            date: input.date,
            habitId: input.habitId,
            isCompleted: input.completed,
          },
        });
      }
    }),

  deleteHabit: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let habit = ctx.prisma.habit.delete({
        where: {
          id: input.habitId,
        },
      });
      let completions = ctx.prisma.habitCompletion.deleteMany({
        where: {
          habitId: input.habitId,
        },
      });

      let measures = ctx.prisma.habitMeasuresGoal.deleteMany({
        where: {
          habitId: input.habitId,
        },
      });
      return await ctx.prisma.$transaction([measures, completions, habit]);
    }),

  setSubjectiveScore: protectedProcedure
    .input(
      z.object({
        subjectiveId: z.string(),
        score: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let existing = await ctx.prisma.subjectiveAnswer.findFirst({
        where: {
          subjectiveId: input.subjectiveId,
          createdAt: onDay(input.date),
        },
      });
      if (existing === null) {
        await ctx.prisma.subjectiveAnswer.create({
          data: {
            subjectiveId: input.subjectiveId,
            score: input.score,
          },
        });
      } else {
        await ctx.prisma.subjectiveAnswer.update({
          where: {
            id: existing.id,
          },
          data: {
            score: input.score,
          },
        });
      }
    }),

  getHabits: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      let data = await ctx.prisma.habit.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          description: true,
          completions: {
            where: {
              date: onDay(input.date),
            },
          },
        },
      });
      let habitsData = data.map(({ id, description, completions }) => ({
        id,
        description,
        completed: completions[0]?.isCompleted == true,
      }));

      return {
        habits: habitsData,
        date: input.date,
      };
    }),

  getSubjectives: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      let data = await ctx.prisma.subjective.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          prompt: true,
          subjectiveAnswers: {
            where: {
              createdAt: onDay(input.date),
            },
          },
        },
      });

      let subjectives = data.map(({ id, prompt, subjectiveAnswers }) => ({
        id,
        prompt,
        score: subjectiveAnswers[0]?.score,
      }));

      return {
        subjectives: subjectives,
        date: input.date,
      };
    }),
});
