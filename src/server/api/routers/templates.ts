import type { Metric, Goal, Habit } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

let rawdata = {
  fitness: {
    goal: "Improve cardiovascular health and endurance",
    habits: [
      {
        description: "1 hour of cardio exercise (running, cycling, swimming)",
        linkedmetrics: [{ name: "Rate your perceived exertion level during each cardio session"}],
      },
    ],
    metrics: [
      {
        prompt: "Rate your overall energy level after each cardio workout",
      },
    ],
  },
  productivity: {
    goal: "Enhance focus and time management skills", 
    habits: [
        {description: "Time blocking for focused work periods.", 
        linkedmetrics: [{ name: "Rate your level of focus and productivity"}]}
    ],
    metrics:[
        {
            prompt: "Rate your ability to stick to the scheduled time blocks",
        },
    ]
  },
  peace: {
    goal: "Cultivate daily mindfulness and reduce stress.", 
    habits: [
        {description: "Mindful breathing exercises", 
        linkedmetrics: [{ name: "Rate your ability to maintain focus on your breath without distractions"}]}
    ],
    metrics:[
        {
            prompt: "Rate your level of relaxation and peace of mind after each mindfulness practice"
        },
    ]
  }
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
