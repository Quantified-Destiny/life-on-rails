import { Goal, Habit, Subjective } from "@prisma/client";
import { id } from "date-fns/locale";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type Ret = Goal & {
  habits: {
    habit: Habit;
  }[];
  subjectives: {
    subjective: Subjective;
  }[];
};

const score = () => Math.random();

function flatten(data: Ret) {
  return {
    goal: { name: data.name, score: score() },
    habits: data.habits.map((it) => ({
      name: it.habit.description,
      score: score(),
    })),
    subjectives: data.subjectives.map((it) => ({
      name: it.subjective.prompt,
      score: score(),
    })),
  };
}

export const goalsRouter = createTRPCRouter({
  getGoal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      let goal = await ctx.prisma.goal.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      let habits = await ctx.prisma.habitMeasuresGoal.findMany({
        where: {
          goalId: goal.id,
        },
        include: {
          habit: true,
        },
      });
      return {
        goal: goal,
        habits: habits,
      };
    }),

  getGoals: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      let data = await ctx.prisma.goal.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        include: {
          habits: {
            include: {
              habit: true,
            },
          },
          subjectives: {
            include: {
              subjective: true,
            },
          },
        },
      });
      let goalsData = data.map((g) => flatten(g));

      let unlinkedHabits = await ctx.prisma.habit.findMany({
        where: {
          ownerId: ctx.session.user.id,
          goals: {
            none: {},
          },
        },
      });

      let habitsData = unlinkedHabits.map((it) => ({
        id: it.id,
        name: it.description,
        score: score(),
      }));

      let unlinkedSubjectives = await ctx.prisma.subjective.findMany({
        where: {
          ownerId: ctx.session.user.id,
          goals: {
            none: {},
          },
        },
      });
      let subjectivesData = unlinkedSubjectives.map((it) => ({
        id: it.id,
        name: it.prompt,
        score: score(),
      }));

      return {
        goals: goalsData,
        habits: habitsData,
        subjectives: subjectivesData,
      };
    }),
  getGoalOnly: protectedProcedure.query(async ({ ctx }) => {
    let data = await ctx.prisma.goal.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    let goalData = data.map(({ id, name }) => ({
      id,
      name,
    }));

    return {
      goalData: goalData,
    };
  }),
});
