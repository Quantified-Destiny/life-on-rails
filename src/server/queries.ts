import {
  Goal,
  Habit,
  HabitMeasuresGoal,
  HabitTag,
  LinkedMetric,
  Metric,
  MetricMeasuresGoal,
  MetricTag,
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

interface ExpandedHabit extends Habit {
  metrics: LinkedMetric[];
  HabitTag: HabitTag[];
}

export async function getHabits(
  prisma: typeof prismaClient,
  userId: string
): Promise<
  [
    ExpandedHabit[],
    Map<string, Habit>,
    Map<string, number>,
    Map<string, number>
  ]
> {
  let habits: (Habit & { metrics: LinkedMetric[]; HabitTag: HabitTag[] })[] =
    await prisma.habit.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        metrics: true,
        HabitTag: { include: { habit: true } },
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
  return [habits, habitsMap, habitCompletionsCount, habitScores];
}

interface ExpandedMetric extends Metric {
  completionMetric: LinkedMetric[];
  MetricTag: MetricTag[];
}

export async function getMetrics(
  prisma: typeof prismaClient,
  userId: string
): Promise<[ExpandedMetric[], Map<string, Metric>, Map<string, number>]> {
  let metrics: ExpandedMetric[] = await prisma.metric.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      completionMetric: true,
      MetricTag: {
        include: { metric: true },
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
  let metricsMap = new Map<string, Metric>(metrics.map((m) => [m.id, m]));
  return [metrics, metricsMap, metricScores];
}
