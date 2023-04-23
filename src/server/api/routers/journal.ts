import type { HabitCompletion, Metric } from "@prisma/client";
import { LinkedMetric } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const onDay = (date: Date) => {
  const startDate = startOfDay(date);
  const endDate = endOfDay(startDate);
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

  addSubjective: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.metric.create({
        data: {
          prompt: input.prompt,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  setCompletion: protectedProcedure
    .input(
      z.object({ date: z.date(), habitId: z.string(), completed: z.boolean() })
    )
    .mutation(async ({ input, ctx }) => {
      const existingCompletion = await ctx.prisma.habitCompletion.findFirst({
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
      return await ctx.prisma.$transaction([
        ctx.prisma.habitMeasuresGoal.deleteMany({
          where: {
            habitId: input.habitId,
          },
        }),
        ctx.prisma.habitCompletion.deleteMany({
          where: {
            habitId: input.habitId,
          },
        }),
        ctx.prisma.habit.delete({
          where: {
            id: input.habitId,
          },
        }),
      ]);
    }),
  editHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), description: z.string() }))
    .mutation(
      async ({ input, ctx }) =>
        await ctx.prisma.habit.update({
          where: {
            id: input.habitId,
          },
          data: {
            description: input.description,
          },
        })
    ),

  setSubjectiveScore: protectedProcedure
    .input(
      z.object({
        metricId: z.string(),
        score: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.prisma.metricAnswer.findFirst({
        where: {
          metricId: input.metricId,
          createdAt: onDay(input.date),
        },
      });
      if (existing === null) {
        await ctx.prisma.metricAnswer.create({
          data: {
            metricId: input.metricId,
            value: input.score,
          },
        });
      } else {
        await ctx.prisma.metricAnswer.update({
          where: {
            id: existing.id,
          },
          data: {
            value: input.score,
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
      const data: {
        id: string;
        metrics: {
          metric: Metric;
        }[];
        completions: HabitCompletion[];
        description: string;
      }[] = await ctx.prisma.habit.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          description: true,
          metrics: {
            select: {
              metric: true,
            },
          },
          completions: {
            where: {
              date: onDay(input.date),
            },
          },
        },
      });
      const habitsData = data.map(
        ({ id, description, metrics, completions }) => ({
          id,
          description,
          metrics: metrics.map((m) => m.metric),
          completed: completions[0]?.isCompleted == true,
        })
      );

      return {
        habits: habitsData,
        date: input.date,
      };
    }),

  getMetrics: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.metric.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        select: {
          id: true,
          prompt: true,
          metricAnswers: {
            where: {
              createdAt: onDay(input.date),
            },
          },
        },
      });

      const metrics = data.map(({ id, prompt, metricAnswers }) => ({
        id,
        prompt,
        score: metricAnswers[0]?.value,
      }));

      return {
        metrics: metrics,
        date: input.date,
      };
    }),
});
