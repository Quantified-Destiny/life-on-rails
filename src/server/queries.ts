import type {
  Goal,
  Habit,
  HabitCompletion,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricAnswer,
  MetricMeasuresGoal,
  MetricTag,
  Tag,
} from "@prisma/client";
import { FrequencyHorizon } from "@prisma/client";
import { isSameDay, startOfDay, subDays, subWeeks } from "date-fns";

import type { prisma as prismaClient } from "./db";
import { cache } from "./api/cache";

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
  scoringWeeks,
  goalIds,
  date = new Date(),
}: {
  prisma: typeof prismaClient;
  metricsMap: Map<string, ExpandedMetric>;
  userId: string;
  scoringWeeks: number;
  goalIds?: string[];
  date?: Date;
}): Promise<[ExpandedHabit[], Map<string, ExpandedHabit>]> {
  type HabitType = Habit & {
    metrics: LinkedMetric[];
    HabitTag: (HabitTag & { tag: Tag })[];
    goals: HabitMeasuresGoal[];
    completions: HabitCompletion[];
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
      completions: { where: { date: { gt: subDays(date, 7) } } },
    },
  });
  const habitsMap = new Map<string, HabitType>(habits.map((h) => [h.id, h]));

  const habitCompletions = await prisma.habitCompletion.groupBy({
    by: ["habitId"],
    _count: {
      _all: true,
    },
    where: {
      Habit: { ownerId: userId },
      date: { gt: subDays(new Date(), scoringWeeks * 7) },
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
      const maxCompletionCount = normalizedFrequency * scoringWeeks;
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
    completions:
      h.frequencyHorizon == FrequencyHorizon.WEEK
        ? h.completions.length
        : h.completions.filter((it) => isSameDay(it.date, date)).length, //habitCompletionsCount.get(h.id) ?? 0,
  }));
  const expandedHabitsMap = new Map<string, ExpandedHabit>(
    expandedHabits.map((h) => [h.id, h])
  );

  return [expandedHabits, expandedHabitsMap];
}
export async function getHabits({
  prisma,
  userId,
  scoringWeeks,
  goalIds,
  date = new Date(),
}: {
  prisma: typeof prismaClient;
  userId: string;
  scoringWeeks: number;
  goalIds?: string[];
  date?: Date;
}): Promise<ExpandedHabit[]> {
  type HabitType = (Habit & {
    HabitTag: (HabitTag & {
      tag: Tag;
    })[];
    completions: HabitCompletion[];
    metrics: (LinkedMetric & {
      metric: Metric & {
        metricAnswers: MetricAnswer[];
        MetricTag: { tag: Tag }[];
        goals: { goal: Goal }[];
      };
    })[];
    goals: HabitMeasuresGoal[];
  })[];

  const whereConditions = {
    goals: goalIds ? { some: { goalId: { in: goalIds } } } : undefined,
  };

  const habits: HabitType = await prisma.habit.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      completions: {
        where: {
          date: { gt: subWeeks(date, 1) },
        },
      },
      metrics: {
        include: {
          metric: {
            include: {
              metricAnswers: {
                where: { createdAt: { gt: startOfDay(date) } },
              },
              goals: { include: { goal: true } },
              MetricTag: { include: { tag: true } },
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
      date: { gt: subDays(new Date(), scoringWeeks * 7) },
    },
  });

  const habitCompletionsCount = new Map<string, number>(
    habitCompletions.map((it) => {
      return [it.habitId, it._count._all];
    })
  );

  const expandedHabits = habits.map((habit) => {
    const expandedMetrics = habit.metrics.map((m) => {
      const value = m.metric.metricAnswers[0]?.value ?? 0;
      const score = avg(m.metric.metricAnswers.map((it) => it.value));
      const tags = m.metric.MetricTag.map((it) => it.tag);
      const goals = m.metric.goals.map((it) => it.goal);
      return { ...m.metric, score, tags, linkedHabits: [], goals, value };
    });

    const normalizedFrequency =
      habit.frequencyHorizon == FrequencyHorizon.WEEK
        ? habit.frequency
        : habit.frequency * 7;
    const maxCompletionCount = normalizedFrequency * scoringWeeks;
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

    const completions = habit.completions;
    const completionsCount =
      habit.frequencyHorizon == FrequencyHorizon.DAY
        ? completions.filter((completion) => isSameDay(completion.date, date))
            .length
        : completions.length;
    return {
      ...habit,
      score,
      metrics: expandedMetrics,
      goals: habit.goals.map((it) => it.goalId),
      tags: habit.HabitTag.map((it) => it.tag.name),
      completions: completionsCount,
    };
  });

  return expandedHabits;
}

export interface ExpandedMetric extends Metric {
  linkedHabits: string[];
  tags: Tag[];
  score: number;
  goals: Goal[];
  value: number;
}

export async function getMetrics({
  prisma,
  userId,
  scoringWeeks,
  goalIds,
  habitIds,
  date = new Date(),
}: {
  prisma: typeof prismaClient;
  userId: string;
  scoringWeeks: number;
  goalIds?: string[];
  habitIds?: string[];
  date?: Date;
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
    goals: (MetricMeasuresGoal & { goal: Goal })[];
    metricAnswers: MetricAnswer[];
  })[] = await prisma.metric.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      completionMetric: true,
      metricAnswers: { where: { createdAt: { gt: startOfDay(date) } } },
      MetricTag: {
        include: { tag: true },
      },
      goals: {
        include: { goal: true },
      },
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
      createdAt: { gt: subDays(date, 7 * scoringWeeks) },
    },
  });

  const metricScores = new Map<string, number>(
    metricAnswers.map((a) => [
      a.metricId,
      (a._sum.value ?? 0) / 5 / (7 * scoringWeeks),
    ])
  );

  const expandedMetrics = metrics.map((m) => ({
    ...m,
    linkedHabits: m.completionMetric.map((it) => it.habitId),
    tags: m.MetricTag.map((mt) => mt.tag),
    goals: m.goals.map((g) => g.goal),
    score: metricScores.get(m.id) ?? 0,
    value: m.metricAnswers[0]?.value ?? 0,
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

export async function getScoringWeeks(
  prisma: typeof prismaClient,
  userId: string
): Promise<number> {
  if (!cache.has(userId)) {
    const weeks = (
      await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { scoringWeeks: true },
      })
    ).scoringWeeks;
    cache.set(userId, weeks);
  }

  return cache.get(userId)!;
}
