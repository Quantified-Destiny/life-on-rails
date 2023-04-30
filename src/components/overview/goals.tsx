/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Metric } from "@prisma/client";
import { EditableField } from "../../components/inlineEdit";
import { HabitCard } from "../../components/overview/habits";
import type {
  ExpandedGoal,
  ExpandedHabit,
  ExpandedMetric,
} from "../../server/queries";
import { api } from "../../utils/api";
import { TagList } from "./tags";

export function GoalCard({
  id,
  name,
  score,
  habits,
  metrics,
  tags,
}: ExpandedGoal & {
  score: number;
  habits: (ExpandedHabit & {
    completions: number;
    score: number;
    metrics: ExpandedMetric[];
  })[];
  metrics: (Metric & { score: number })[];
}) {
  const context = api.useContext();
  const mutation = api.goals.editGoal.useMutation({
    onSettled: () => {
      void context.goals.getGoals.invalidate();
    },
  });
  const linkGoal = api.tags.linkGoal.useMutation({
    onSettled: () => {
      void context.goals.getGoals.invalidate();
    },
  });
  const unlinkGoal = api.tags.linkGoal.useMutation({
    onSettled: () => {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-1 flex flex-row justify-between">
        <div className="mb-2 flex flex-col">
          <span className="mb-2 inline-block h-fit w-fit rounded-full bg-yellow-500 px-2 py-1 text-xs  text-white">
            Goal
          </span>
          <div className="mb-2 flex items-center justify-between text-xl ">
            <EditableField
              initialText={name}
              commit={(name) => mutation.mutate({ goalId: id, name })}
            ></EditableField>
          </div>
        </div>
        <div className="h-fit w-fit rounded-lg bg-gray-100 p-2 text-xl  text-yellow-500">
          {score.toFixed(2)}
        </div>
      </div>
      <div className=" gap-x-10 space-y-2">
        {habits.map((habit) => (
          <HabitCard
            {...habit}
            weight={0.4}
            linkedGoal={id}
            key={habit.id}
          ></HabitCard>
        ))}
      </div>
      <TagList
        tags={tags}
        link={() => {
          (tag: string) => linkGoal.mutate({ goalId: id, tagName: tag });
        }}
        unlink={() => {
          (tag: string) => unlinkGoal.mutate({ goalId: id, tagName: tag });
        }}
      ></TagList>
    </div>
  );
}
