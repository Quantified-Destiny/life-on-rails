import type {
  Goal,
  Habit,
  HabitMeasuresGoal,
  LinkedMetric,
  Metric,
  MetricMeasuresGoal,
} from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

enum EventType {
  GOAL_ADDED,
  GOAL_ARCHIVED,
  HABIT_ADDED,
  HABIT_ARCHIVED,
}

interface Event {
  eventType: EventType;
  date: Date;
}

interface GoalAddedEvent extends Event {
  eventType: EventType.GOAL_ADDED;
  goal: {
    id: string;
    name: string;
  };
  habits: {
    id: string;
    description: string;
  }[];
  metrics: {
    id: string;
    prompt: string;
  }[];
}

interface GoalArchivedEvent extends Event {
  eventType: EventType.GOAL_ARCHIVED;
  goal: {
    id: string;
    name: string;
  };
  habits: {
    id: string;
    description: string;
  }[];
  metrics: {
    id: string;
    prompt: string;
  }[];
}

interface HabitAddedEvent extends Event {
  eventType: EventType.HABIT_ADDED;
  habit: {
    id: string;
    description: string;
  };
  goals: {
    id: string;
    name: string;
  }[];
  metrics: {
    id: string;
    prompt: string;
  }[];
}

interface HabitArchivedEvent extends Event {
  eventType: EventType.HABIT_ARCHIVED;
  habit: {
    id: string;
    description: string;
  };
  goals: {
    id: string;
    name: string;
  }[];
  metrics: {
    id: string;
    prompt: string;
  }[];
}

type TimelineEvent =
  | GoalAddedEvent
  | GoalArchivedEvent
  | HabitAddedEvent
  | HabitArchivedEvent;

export const timelineRouter = createTRPCRouter({
  getTimeline: protectedProcedure.query(async ({ ctx }) => {
    type QueryType = (Goal & {
      habits: (HabitMeasuresGoal & {
        habit: Habit;
      })[];
      metrics: (MetricMeasuresGoal & {
        metric: Metric;
      })[];
    })[];

    const goals: QueryType = await ctx.prisma.goal.findMany({
      include: {
        metrics: {
          include: {
            metric: true,
          },
        },
        habits: {
          include: {
            habit: true,
          },
        },
      },
    });

    type QueryType2 = (Habit & {
      goals: (HabitMeasuresGoal & {
        goal: Goal;
      })[];
      metrics: (LinkedMetric & {
        metric: Metric;
      })[];
    })[];
    const habits: QueryType2 = await ctx.prisma.habit.findMany({
      include: {
        metrics: {
          include: {
            metric: true,
          },
        },
        goals: {
          include: {
            goal: true,
          },
        },
      },
    });

    const events: TimelineEvent[] = [];

    goals.forEach((goal) => {
      events.push({
        eventType: EventType.GOAL_ADDED,
        goal: goal,
        habits: goal.habits.map((habit) => habit.habit),
        metrics: goal.metrics.map((metric) => metric.metric),
        date: goal.createdAt,
      });
      if (goal.archived) {
        events.push({
          eventType: EventType.GOAL_ARCHIVED,
          goal: goal,
          habits: goal.habits.map((habit) => habit.habit),
          metrics: goal.metrics.map((metric) => metric.metric),
          date: goal.archivedAt,
        });
      }
    });
    habits.forEach((habit) => {
      events.push({
        eventType: EventType.HABIT_ADDED,
        goals: habit.goals.map((goal) => goal.goal),
        habit: habit,
        metrics: habit.metrics.map((metric) => metric.metric),
        date: habit.createdAt,
      });
      if (habit.archived) {
        events.push({
          eventType: EventType.HABIT_ARCHIVED,
          goals: habit.goals.map((goal) => goal.goal),
          habit: habit,
          metrics: habit.metrics.map((metric) => metric.metric),
          date: habit.archivedAt,
        });
      }
    });
    return events.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();
  }),
});
