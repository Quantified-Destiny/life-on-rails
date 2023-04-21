import {
  Goal,
  Habit,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricMeasuresGoal,
  MetricTag,
  Tag,
} from "@prisma/client";
import { subDays } from "date-fns";

import { prisma as prismaClient } from "./db";

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
): Promise<
  [
    ExpandedHabit[],
    Map<string, ExpandedHabit>,
    Map<string, number>,
    Map<string, number>
  ]
> {
  let habits: (Habit & {
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
  let habitsMap = new Map<string, Habit>(habits.map((h) => [h.id, h]));

  let habitCompletions = await prisma.habitCompletion.groupBy({
    by: ["habitId"],
    _count: {
      _all: true,
    },
    where: {
      Habit: { ownerId: userId },
      date: { gt: subDays(new Date(), 14) },
    },
  });
  let habitCompletionsCount = new Map<string, number>(
    habitCompletions.map((it) => {
      console.log(it.habitId);
      return [it.habitId, it._count._all];
    })
  );
  let habitScores = new Map<string, number>(
    habitCompletions.map((it) => {
      console.log(it.habitId);
      return [
        it.habitId,
        it._count._all / targetCount(habitsMap.get(it.habitId)!),
      ];
    })
  );
  let expandedHabits = habits.map((h) => ({
    ...h,
    score: habitScores.get(h.id) ?? 0,
    goals: h.goals.map((it) => it.goalId),
    tags: h.HabitTag.map((it) => it.tag.name),
    metrics: h.metrics.map((it) => metricsMap.get(it.metricId)!),
    completions: habitCompletionsCount.get(h.id) ?? 0,
  }));
  let expandedHabitsMap = new Map<string, ExpandedHabit>(
    expandedHabits.map((h) => [h.id, h])
  );

  return [
    expandedHabits,
    expandedHabitsMap,
    habitCompletionsCount,
    habitScores,
  ];
}

export interface ExpandedMetric extends Metric {
  linkedHabits: string[];
  tags: Tag[];
  score: number;
}

export async function getMetrics(
  prisma: typeof prismaClient,
  userId: string
): Promise<
  [ExpandedMetric[], Map<string, ExpandedMetric>, Map<string, number>]
> {
  let metrics: (Metric & {
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

  let metricAnswers = await prisma.metricAnswer.groupBy({
    by: ["metricId"],
    _avg: {
      value: true,
    },
    where: {
      createdAt: { gt: subDays(new Date(), 14) },
    },
  });

  let metricScores = new Map<string, number>(
    metricAnswers.map((a) => [a.metricId, a._avg.value ?? 0])
  );

  let expandedMetrics = metrics.map((m) => ({
    ...m,
    linkedHabits: m.completionMetric.map((it) => it.habitId),
    tags: m.MetricTag.map((mt) => mt.tag),
    score: metricScores.get(m.id) ?? 0,
  }));

  let metricsMap = new Map<string, ExpandedMetric>();
  expandedMetrics.forEach((m) => {
    console.log(`Tried to set metric ${m.id} to ${JSON.stringify(m)}`);
    metricsMap.set(m.id, m);
  });

  //console.log(metricsMap);

  return [expandedMetrics, metricsMap, metricScores];
}