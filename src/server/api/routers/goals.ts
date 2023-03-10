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
    goal: { name: data.name, description: "", score: 0.0 },
    habits: data.habits.map((it) => ({
      name: it.habit.description,
      description: it.habit.description,
      score: score(),
    })),
    subjectives: data.subjectives.map((it) => ({
      name: it.subjective.prompt,
      description: "kamslkd",
      score: score(),
    })),
  };
}

export const goalsRouter = createTRPCRouter({
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
