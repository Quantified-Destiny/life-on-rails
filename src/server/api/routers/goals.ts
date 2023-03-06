import {
  Goal,
  Habit, Subjective
} from "@prisma/client";
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

function flatten(data: Ret) {
  return {
    goal: { name: data.name, description: "", score: 0.0 },
    habits: data.habits.map((it) => ({
      name: it.habit.description,
      description: it.habit.description,
      score: 0.0,
    })),
    subjectives: data.subjectives.map((it) => ({
      name: it.subjective.prompt,
      description: "kamslkd",
      score: 0.0,
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

      return data.map((g) => flatten(g));
    }),
});
