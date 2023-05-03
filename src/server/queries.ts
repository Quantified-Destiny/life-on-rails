import type {
  Goal,
  Habit,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricAnswer,
  MetricTag,
  Tag,
} from "@prisma/client";
import { FrequencyHorizon } from "@prisma/client";
import { subDays, subWeeks } from "date-fns";

import type { prisma as prismaClient } from "./db";

function avg(arr: number[]) {
  return arr.length == 0 ? 0 : arr.reduce((a, b) => a + b) / arr.length;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export interface ExpandedHabit extends Habit {
  metrics: ExpandedMetric[];
  tags: string[];
  goals: string[];
  completions: number;
  score: number;
}

export async function getHabitsWithMetricsMap({
  prisma,
  metricsMap,
  userId,
  goalIds,
}: {
  prisma: typeof prismaClient;
  metricsMap: Map<string, ExpandedMetric>;
  userId: string;
  goalIds?: string[];
}): Promise<[ExpandedHabit[], Map<string, ExpandedHabit>]> {
  type HabitType = Habit & {
    metrics: LinkedMetric[];
    HabitTag: (HabitTag & { tag: Tag })[];
    goals: HabitMeasuresGoal[];
  };

  const whereConditions = {
    goals: goalIds ? { some: { goalId: { in: goalIds } } } : undefined,
  };

  const habits: HabitType[] = await prisma.habit.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      metrics: true,
      HabitTag: { include: { tag: true } },
      goals: true,
    },
  });
  const habitsMap = new Map<string, HabitType>(habits.map((h) => [h.id, h]));

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const habitCompletions = await prisma.habitCompletion.groupBy({
    by: ["habitId"],
    _count: {
      _all: true,
    },
    where: {
      Habit: { ownerId: userId },
      date: { gt: subDays(new Date(), user.scoringWeeks * 7) },
    },
  });
  const habitCompletionsCount = new Map<string, number>(
    habitCompletions.map((it) => {
      return [it.habitId, it._count._all];
    })
  );
  const habitScores = new Map<string, number>(
    habitCompletions.map((it) => {
      const habit = habitsMap.get(it.habitId)!;
      const normalizedFrequency =
        habit.frequencyHorizon == FrequencyHorizon.WEEK
          ? habit.frequency
          : habit.frequency * 7;
      const maxCompletionCount = normalizedFrequency * user.scoringWeeks;
      const completionScore = it._count._all / maxCompletionCount;

      const metricsScore = avg(
        habit.metrics.map((m) => metricsMap.get(m.metricId)!.score)
      );

      const score =
        habit.completionWeight * completionScore +
        (1 - habit.completionWeight) * metricsScore;

      return [it.habitId, score];
    })
  );
  const expandedHabits = habits.map((h) => ({
    ...h,
    score: habitScores.get(h.id) ?? 0,
    goals: h.goals.map((it) => it.goalId),
    tags: h.HabitTag.map((it) => it.tag.name),
    metrics: h.metrics.map((it) => metricsMap.get(it.metricId)!),
    completions: habitCompletionsCount.get(h.id) ?? 0,
  }));
  const expandedHabitsMap = new Map<string, ExpandedHabit>(
    expandedHabits.map((h) => [h.id, h])
  );

  return [expandedHabits, expandedHabitsMap];
}
export async function getHabits({
  prisma,
  userId,
  goalIds,
}: {
  prisma: typeof prismaClient;
  userId: string;
  goalIds?: string[];
}): Promise<ExpandedHabit[]> {
  type HabitType = (Habit & {
    HabitTag: (HabitTag & {
      tag: Tag;
    })[];
    metrics: (LinkedMetric & {
      metric: Metric & {
        metricAnswers: MetricAnswer[];
        MetricTag: { tag: Tag }[];
      };
    })[];
    goals: HabitMeasuresGoal[];
  })[];

  const whereConditions = {
    goals: goalIds ? { some: { goalId: { in: goalIds } } } : undefined,
  };

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const habits: HabitType = await prisma.habit.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      metrics: {
        include: {
          metric: {
            include: {
              MetricTag: { include: { tag: true } },
              metricAnswers: {
                where: {
                  createdAt: { gt: subWeeks(new Date(), user.scoringWeeks) },
                },
              },
            },
          },
        },
      },
      HabitTag: { include: { tag: true } },
      goals: true,
    },
  });

  const habitCompletions = await prisma.habitCompletion.groupBy({
    by: ["habitId"],
    _count: {
      _all: true,
    },
    where: {
      Habit: { ownerId: userId },
      date: { gt: subDays(new Date(), user.scoringWeeks * 7) },
    },
  });

  const habitCompletionsCount = new Map<string, number>(
    habitCompletions.map((it) => {
      return [it.habitId, it._count._all];
    })
  );

  const expandedHabits = habits.map((habit) => {
    const expandedMetrics = habit.metrics.map((m) => {
      const score = avg(m.metric.metricAnswers.map((it) => it.value));
      const tags = m.metric.MetricTag.map((it) => it.tag);

      return { ...m.metric, score, tags, linkedHabits: [] };
    });

    const normalizedFrequency =
      habit.frequencyHorizon == FrequencyHorizon.WEEK
        ? habit.frequency
        : habit.frequency * 7;
    const maxCompletionCount = normalizedFrequency * user.scoringWeeks;
    const completionScore =
      habitCompletionsCount.get(habit.id)! / maxCompletionCount;

    const metricsScore = avg(
      habit.metrics.map((m) =>
        avg(m.metric.metricAnswers.map((it) => it.value))
      )
    );

    const score =
      habit.completionWeight * completionScore +
      (1 - habit.completionWeight) * metricsScore;

    return {
      ...habit,
      score,
      metrics: expandedMetrics,
      goals: habit.goals.map((it) => it.goalId),
      tags: habit.HabitTag.map((it) => it.tag.name),
      completions: habitCompletionsCount.get(habit.id) ?? 0,
    };
  });

  return expandedHabits;
}

export interface ExpandedMetric extends Metric {
  linkedHabits: string[];
  tags: Tag[];
  score: number;
}

export async function getMetrics({
  prisma,
  userId,
  goalIds,
  habitIds,
}: {
  prisma: typeof prismaClient;
  userId: string;
  goalIds?: string[];
  habitIds?: string[];
}): Promise<[ExpandedMetric[], Map<string, ExpandedMetric>]> {
  const whereConditions = {
    goals: goalIds ? { some: { goalId: { in: goalIds } } } : undefined,
    completionMetric: habitIds
      ? { some: { habitId: { in: habitIds } } }
      : undefined,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const metrics: (Metric & {
    completionMetric: LinkedMetric[];
    MetricTag: (MetricTag & { tag: Tag })[];
  })[] = await prisma.metric.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      completionMetric: true,
      MetricTag: {
        include: { tag: true },
      },
    },
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const metricIds = metrics.map((m) => m.id);

  const metricAnswers = await prisma.metricAnswer.groupBy({
    by: ["metricId"],
    _sum: {
      value: true,
    },
    where: {
      metricId: { in: metricIds },
      createdAt: { gt: subDays(new Date(), 7 * user.scoringWeeks) },
    },
  });

  const metricScores = new Map<string, number>(
    metricAnswers.map((a) => [
      a.metricId,
      (a._sum.value ?? 0) / 5 / (7 * user.scoringWeeks),
    ])
  );

  const expandedMetrics = metrics.map((m) => ({
    ...m,
    linkedHabits: m.completionMetric.map((it) => it.habitId),
    tags: m.MetricTag.map((mt) => mt.tag),
    score: metricScores.get(m.id) ?? 0,
  }));

  const metricsMap = new Map<string, ExpandedMetric>();
  expandedMetrics.forEach((m) => {
    metricsMap.set(m.id, m);
  });

  return [expandedMetrics, metricsMap];
}

export interface ExpandedGoal extends Goal {
  tags: string[];
  score: number;
}

export interface GoalsReturnType {
  goal: ExpandedGoal;
  metrics: ExpandedMetric[];
  habits: ExpandedHabit[];
}

export async function getGoals(
  prisma: typeof prismaClient,
  userId: string,
  metricsMap: Map<string, ExpandedMetric>,
  habitsMap: Map<string, ExpandedHabit>
): Promise<GoalsReturnType[]> {
  const goals = await prisma.goal.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      habits: {
        include: {
          habit: {
            include: {
              metrics: true,
              goals: true,
              HabitTag: { include: { tag: true } },
            },
          },
        },
      },
      metrics: true,
      GoalTag: { include: { tag: true } },
    },
  });

  const goalsData = goals.map((g) => {
    const m: number[] = g.metrics.map(
      (it) => metricsMap.get(it.metricId)?.score ?? 0
    );
    const mWeight: number[] = g.metrics.map((it) => it.weight);
    const h: number[] = g.habits.map(
      (it) => habitsMap.get(it.habitId)?.score ?? 0
    );
    const hWeight: number[] = g.habits.map((it) => it.weight);
    const weightedMetricScores = m.map((score, i) => score * (mWeight[i] ?? 1));
    const weightedHabitScores = h.map((score, i) => score * (hWeight[i] ?? 1));

    const score =
      (sum(weightedMetricScores) + sum(weightedHabitScores)) /
      (sum(mWeight) + sum(hWeight));

    const linkedHabits = g.habits.map((h) => habitsMap.get(h.habitId)!);

    return {
      goal: { ...g, score, tags: g.GoalTag.map((it) => it.tag.name) },
      habits: linkedHabits,
      metrics: g.metrics.map((m) => ({
        ...metricsMap.get(m.metricId)!,
      })),
    };
  });
  return goalsData;
}
