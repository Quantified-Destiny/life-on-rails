import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import type { Metric } from "@prisma/client";
import { EditableField } from "../../components/inlineEdit";
import { HabitCard } from "../../components/overview/habits";
import type {
  ExpandedGoal,
  ExpandedHabit,
  ExpandedMetric,
} from "../../server/queries";
import { api } from "../../utils/api";
import { GoalSheet } from "./goal-panel";
import { LinkedMetric } from "./metrics";
import { TbSquareRoundedLetterG, TbSquareRoundedLetterH } from "react-icons/tb";

export function GoalCard({
  id,
  name,
  score,
  habits,
  metrics,
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
  const editGoal = api.goals.editGoal.useMutation({
    onSettled: () => {
      void context.goals.getAllGoals.invalidate();
    },
  });
  return (
    <div className="contents" onClick={console.log}>
      <div className="col-span-1 w-auto flex flex-row items-center gap-2">
        <TbSquareRoundedLetterG className="text-2xl text-yellow-500"></TbSquareRoundedLetterG>
        <EditableField
          initialText={name}
          commit={(name) => editGoal.mutate({ goalId: id, name })}
          className="text-yellow-800"
        ></EditableField>
      </div>
      <div className="flex flex-row items-center space-x-2 justify-self-end whitespace-nowrap">
        <span className="h-fit w-fit rounded-lg bg-gray-100 p-2 text-xl text-yellow-500">
          {score.toFixed(2)}
        </span>
        <GoalSheet goalId={id}>
          <Cog6ToothIcon className="h-6 w-6 cursor-pointer opacity-40"></Cog6ToothIcon>
        </GoalSheet>
      </div>
      {habits.map((habit) => (
        <HabitCard
          {...habit}
          weight={0.4}
          linkedGoal={id}
          key={habit.id}
        ></HabitCard>
      ))}
      {metrics.map((m) => (
        <LinkedMetric {...m} weight={0.4} key={m.id} offset={0}></LinkedMetric>
      ))}
    </div>
  );
}
