import type { Metric, Goal, Habit } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

let rawdata = {
  fitness: {
    goal: "Get in shape",
    habits: [
      {
        description: "go jogging for 1 hour",
        linkedmetrics: [{ name: "how was your jog?" }],
      },
    ],
    metrics: [
      {
        prompt: "how fit do you feel?",
      },
    ],
  },
};

let data = new Map(Object.entries(rawdata));

export const templateRouter = createTRPCRouter({
  createFromTemplate: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let createMeta = data.get(input.key)!;

      const goal = await ctx.prisma.goal.create({
        data: {
          name: createMeta.goal,
          ownerId: ctx.session.user.id,
        },
      });

      createMeta.habits.forEach(async (habit) => {
        const h = await ctx.prisma.habit.create({
          data: {
            description: habit.description,
            ownerId: ctx.session.user.id,
          },
        });
        await ctx.prisma.habitMeasuresGoal.create({
          data: {
            goalId: goal.id,
            habitId: h.id,
          },
        });

        habit.linkedmetrics.forEach(async (linkedmetric) => {
            const format = await ctx.prisma.answerFormat.create({
                data: { format: "FIVE_POINT" },
              });

            const m: Metric = await ctx.prisma.metric.create({
            data: {
                prompt: linkedmetric.name,
                ownerId: ctx.session.user.id,
                formatId: format.id,
            }
            });  
            await ctx.prisma.linkedMetric.create({
                data: {
                  metricId: m.id,
                  habitId: h.id,
                },
            });
        });
      }); // end habits

      createMeta.metrics.forEach(async (metric) => {
        const format = await ctx.prisma.answerFormat.create({
          data: { format: "FIVE_POINT" },
        });
        const m = await ctx.prisma.metric.create({
          data: {
            prompt: metric.prompt,
            ownerId: ctx.session.user.id,
            formatId: format.id,
          }
        });  

        await ctx.prisma.metricMeasuresGoal.create({
            data: {
              metricId: m.id,
              goalId: goal.id,
            },
          });
      })
      
    }),
});
