import type {
  Habit,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricTag,
  Tag,
} from "@prisma/client";
import { Goal, MetricMeasuresGoal } from "@prisma/client";
import { subDays } from "date-fns";

import type { prisma as prismaClient } from "./db";

function targetCount(h: Habit) {
  if (h.frequencyHorizon == "DAY") {
    return h.frequency * 14;
  } else if (h.frequencyHorizon == "WEEK") {
    return h.frequency * 2;
  } else return h.frequency / 2;
}

export interface ExpandedHabit extends Habit {
  metrics: ExpandedMetric[];
  tags: string[];
  goals: string[];
  completions: number;
  score: number;
}

export async function getHabits(
  prisma: typeof prismaClient,
  metricsMap: Map<string, ExpandedMetric>,
  userId: string
): Promise<[ExpandedHabit[], Map<string, ExpandedHabit>]> {
  const habits: (Habit & {
    metrics: LinkedMetric[];
    HabitTag: (HabitTag & { tag: Tag })[];
    goals: HabitMeasuresGoal[];
  })[] = await prisma.habit.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      metrics: true,
      HabitTag: { include: { tag: true } },
      goals: true,
    },
  });
  const habitsMap = new Map<string, Habit>(habits.map((h) => [h.id, h]));

  const habitCompletions = await prisma.habitCompletion.groupBy({
    by: ["habitId"],
    _count: {
      _all: true,
    },
    where: {
      Habit: { ownerId: userId },
      date: { gt: subDays(new Date(), 14) },
    },
  });
  const habitCompletionsCount = new Map<string, number>(
    habitCompletions.map((it) => {
      console.log(it.habitId);
      return [it.habitId, it._count._all];
    })
  );
  const habitScores = new Map<string, number>(
    habitCompletions.map((it) => {
      console.log(it.habitId);
      return [
        it.habitId,
        it._count._all / targetCount(habitsMap.get(it.habitId)!),
      ];
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

export interface ExpandedMetric extends Metric {
  linkedHabits: string[];
  tags: Tag[];
  score: number;
}

export async function getMetrics(
  prisma: typeof prismaClient,
  userId: string
): Promise<[ExpandedMetric[], Map<string, ExpandedMetric>]> {
  const metrics: (Metric & {
    completionMetric: LinkedMetric[];
    MetricTag: (MetricTag & { tag: Tag })[];
  })[] = await prisma.metric.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      completionMetric: true,
      MetricTag: {
        include: { tag: true },
      },
    },
  });

  const metricAnswers = await prisma.metricAnswer.groupBy({
    by: ["metricId"],
    _avg: {
      value: true,
    },
    where: {
      createdAt: { gt: subDays(new Date(), 14) },
    },
  });

  const metricScores = new Map<string, number>(
    metricAnswers.map((a) => [a.metricId, a._avg.value ?? 0])
  );

  const expandedMetrics = metrics.map((m) => ({
    ...m,
    linkedHabits: m.completionMetric.map((it) => it.habitId),
    tags: m.MetricTag.map((mt) => mt.tag),
    score: metricScores.get(m.id) ?? 0,
  }));

  const metricsMap = new Map<string, ExpandedMetric>();
  expandedMetrics.forEach((m) => {
    console.log(`Tried to set metric ${m.id} to ${JSON.stringify(m)}`);
    metricsMap.set(m.id, m);
  });

  //console.log(metricsMap);

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

  console.log("Fetched goals");

  const goalsData = goals.map((g) => {
    const m: number[] = g.metrics.map(
      (it) => metricsMap.get(it.metricId)?.score ?? 0
    );
    const h: number[] = g.habits.map(
      (it) => habitsMap.get(it.habitId)?.score ?? 0
    );

    let score = m.reduce((a, b) => a + b, 0) + h.reduce((a, b) => a + b, 0);
    score = score / (m.length + h.length);

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
