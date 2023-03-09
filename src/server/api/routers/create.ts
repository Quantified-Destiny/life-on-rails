import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const createRouter = createTRPCRouter({
    createGoal: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.goal.create({
                data: {
                    name: input.name,
                    ownerId: ctx.session.user.id,
                },
            });
        }),

    createHabit: protectedProcedure
        .input(z.object({ description: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.habit.create({
                data: {
                    description: input.description,
                    ownerId: ctx.session.user.id,
                },
            });
        }),

    createLinkedHabit: protectedProcedure
        .input(z.object({ description: z.string(), goalId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            let habit = await ctx.prisma.habit.create({
                data: {
                    description: input.description,
                    ownerId: ctx.session.user.id,
                },
            });
            await ctx.prisma.habitMeasuresGoal.create({
                data: {
                    goalId: input.goalId,
                    habitId: habit.id
                }
            })
        }),

    createSubjective: protectedProcedure
        .input(z.object({ prompt: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.subjective.create({
                data: {
                    prompt: input.prompt,
                    ownerId: ctx.session.user.id,
                },
            });
        }),
    createHabitMeasureGoal: protectedProcedure
        .input(z.object({ goalId: z.string(), habitId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.habitMeasuresGoal.create({
                data: {
                    goalId: input.goalId,
                    habitId: input.habitId,
                },
            });
        }),
    createSubjectiveMeasureGoal: protectedProcedure
        .input(z.object({ goalId: z.string(), subjectiveId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.subjectiveMeasuresGoal.create({
                data: {
                    goalId: input.goalId,
                    subjectiveId: input.subjectiveId,
                },
            });
        }),
});