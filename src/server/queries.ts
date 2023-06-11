import type {
  Goal,
  Habit,
  HabitCompletion,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricAnswer,
  MetricMeasuresGoal,
  MetricTag,
  Tag,
} from "@prisma/client";
import { FrequencyHorizon } from "@prisma/client";
import { endOfDay, isSameDay, startOfDay, subDays, subWeeks } from "date-fns";

import { eq } from "drizzle-orm";
import { preferences } from "../schema";
import { cache } from "./api/cache";
import { type DB, type prisma as prismaClient } from "./db";

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

// get habit completions from a user for x amount of days ago
export async function getHabitCompletionSubDays({
  prisma,
  userId,
  days,
}: {
  prisma: typeof prismaClient;
  userId: string;
  days: number;
}): Promise<number[]> {
  const currentDate = new Date();
  const completionCounts: number[] = [];

  for (let i = days; i >= 0; i--) {
    const targetDate = subDays(currentDate, i);

    const completions = await prisma.habitCompletion.count({
      where: {
        Habit: { ownerId: userId },
        date: { gt: startOfDay(targetDate), lt: endOfDay(targetDate) },
      },
    });

    completionCounts.push(completions);
  }

  return completionCounts;
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
  const whereConditions = {
    goals: goalIds ? { some: { goalId: { in: goalIds } } } : undefined,
  };

  const habits = await prisma.habit.findMany({
    where: {
      ownerId: userId,
      archived: false,
      ...whereConditions,
    },
    include: {
      metrics: true,
      tags: { include: { tag: true } },
      goals: { select: { goalId: true, goal: { select: { archived: true } } } },
      completions: { where: { date: { gt: subDays(date, 7) } } },
    },
  });
  const habitsMap = new Map<string, (typeof habits)[0]>(
    habits.map((h) => [h.id, h])
  );

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
  const habitScores = new Map<string, number>(
    habitCompletions
      .filter((it) => habitsMap.has(it.habitId))
      .map((it) => {
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
    goals: h.goals
      .filter((it) => it.goal && it.goal.archived == false)
      .map((it) => it.goalId),
    tags: h.tags.map((it) => it.tag.name),
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
    tags: (HabitTag & {
      tag: Tag;
    })[];
    completions: HabitCompletion[];
    metrics: (LinkedMetric & {
      metric: Metric & {
        metricAnswers: MetricAnswer[];
        tags: { tag: Tag }[];
        goals: { goal: Goal }[];
      };
    })[];
    goals: { goalId: string }[];
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
              tags: { include: { tag: true } },
            },
          },
        },
      },
      tags: { include: { tag: true } },
      goals: { select: { goalId: true }, where: { goal: { archived: false } } },
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
      const tags = m.metric.tags.map((it) => it.tag);
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
      tags: habit.tags.map((it) => it.tag.name),
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

  type MetricsType = (Metric & {
    completionMetric: LinkedMetric[];
    tags: (MetricTag & { tag: Tag })[];
    goals: (MetricMeasuresGoal & { goal: Goal })[];
    metricAnswers: MetricAnswer[];
  })[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const metrics: MetricsType = await prisma.metric.findMany({
    where: {
      ownerId: userId,
      ...whereConditions,
    },
    include: {
      completionMetric: true,
      metricAnswers: { where: { createdAt: { gt: startOfDay(date) } } },
      tags: {
        include: { tag: true },
      },
      goals: {
        include: { goal: true },
      },
    },
  });

  const metricIds = metrics.map((m) => m.id);
  console.log(date);
  console.log(scoringWeeks);

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
    tags: m.tags.map((mt) => mt.tag),
    goals: m.goals.map((g) => g.goal),
    score: metricScores.get(m.id) ?? 0,
    value: m.metricAnswers[0]?.value ?? 0,
  }));
  console.log("ahodnlaskndanoiadshofihefl");

  const metricsMap = new Map<string, ExpandedMetric>();
  expandedMetrics.forEach((m) => {
    metricsMap.set(m.id, m);
  });

  return [expandedMetrics, metricsMap];
}

export interface ExpandedGoal extends Goal {
  tags: Tag[];
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
): Promise<[GoalsReturnType[], Map<string, GoalsReturnType>]> {
  const goals = await prisma.goal.findMany({
    where: {
      ownerId: userId,
      archived: false,
    },
    include: {
      habits: {
        include: {
          habit: {
            include: {
              metrics: true,
              goals: true,
              tags: { include: { tag: true } },
            },
          },
        },
      },

      metrics: true,
      tags: { include: { tag: true } },
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
      goal: { ...g, score, tags: g.tags.map((it) => it.tag) },
      habits: linkedHabits.filter((it) => it && it.archived === false),
      metrics: g.metrics.map((m) => ({
        ...metricsMap.get(m.metricId)!,
      })),
    };
  });
  const goalsMap = new Map<string, GoalsReturnType>();
  goalsData.forEach((g) => {
    goalsMap.set(g.goal.id, g);
  });
  return [goalsData, goalsMap];
}

export async function getPreferences(
  db: DB,
  userId: string
): Promise<typeof preferences._.model.select> {
  //if (!cache.has(userId)) {
  await db.insert(preferences).ignore().values({ userId });

  const p = await db
    .select()
    .from(preferences)
    .where(eq(preferences.userId, userId));
  //   cache.set(userId, p);
  // }
  // return cache.get(userId)!;
  return p[0]!;
}
