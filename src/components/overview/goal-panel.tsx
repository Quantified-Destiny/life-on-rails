import type { Habit } from "@prisma/client";
import { ScoringFormat } from "@prisma/client";
import { subYears } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";
import { TbSquareRoundedLetterH } from "react-icons/tb";
import type { ExpandedHabit, ExpandedMetric } from "../../server/queries";
import { api } from "../../utils/api";
import {
  CreateLinkedHabitInline,
  CreateLinkedMetricInline,
  EditableField,
} from "../inlineEdit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { GoalTagList } from "./tags";
import { TbSquareRoundedLetterM } from "react-icons/tb";

function min(a: number, b: number) {
  return a < b ? a : b;
}

export function CreateMetricLinkedToGoal({ goalId }: { goalId: string }) {
  const context = api.useContext();

  const createLinkedMetric = api.metrics.createMetric.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });

  const [active, setActive] = useState(false);

  return active ? (
    <CreateLinkedMetricInline
      createMetric={(prompt) => createLinkedMetric.mutate({ prompt, goalId })}
      closeEdit={() => setActive(false)}
    ></CreateLinkedMetricInline>
  ) : (
    <button
      className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm  text-gray-600 hover:bg-gray-200"
      onClick={() => setActive(true)}
    >
      + Create a new Linked Metric
    </button>
  );
}

function MetricsSection({ goalId }: { goalId: string }) {
  const context = api.useContext();
  const deleteMetric = api.metrics.deleteMetric.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const metricsQuery = api.goals.getMetrics.useQuery({ id: goalId });

  if (metricsQuery.isError) {
    return <p>ERROR</p>;
  }
  if (metricsQuery.isLoading) {
    return <p>LOADING</p>;
  }

  return (
    <>
      <div className="mb-4 grid w-full grid-cols-2 items-baseline justify-between gap-2">
        {metricsQuery.data.length == 0 && (
          <div className="col-span-full w-full bg-gray-100 px-4 py-2">
            No linked metrics
          </div>
        )}
        {metricsQuery.data.map((metric) => {
          return (
            <>
              <div>
                <p className="text-lg">{metric.prompt}</p>
                <p className="text-sm text-gray-300">
                  Created: {metric.createdAt.toUTCString()}
                </p>
              </div>
              <div className="flex-shrink space-x-2 text-right">
                <Button
                  onClick={() =>
                    deleteMetric.mutate({
                      metricId: metric.id,
                    })
                  }
                  variant="outline"
                >
                  Delete
                </Button>
              </div>
            </>
          );
        })}
      </div>
      <CreateMetricLinkedToGoal goalId={goalId}></CreateMetricLinkedToGoal>
    </>
  );
}

/* export const InlineEdit = ({
  placeholder,
  initialText,
  commit,
}: {
  placeholder: string;
  initialText: string;
  commit: (text: string) => void;
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialText);
  if (!isActive) {
    return (
      <div className="bg-slate-100">
        <span onClick={() => setActive(true)}>
          <PlusIcon className="h-4 w-4"></PlusIcon>
          {placeholder}
        </span>
      </div>
    );
  } else
    return (
      <div className="bg-slate-100">
        <input
          autoFocus
          type="text"
          value={text}
          onBlur={() => setActive(false)}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              console.log(text);
              commit(text);
              setActive(false);
            } else if (event.key == "Escape") {
              setText("");
              setActive(false);
            }
          }}
        ></input>
      </div>
    );
};

function InlineCreateHabit({ goalId }: { goalId: string }) {
  const context = api.useContext();
  const addHabit = api.create.createLinkedHabit.useMutation({
    onSuccess() {
      void context.invalidate();
      void context.journal.getHabits.invalidate();
    },
  });

  return (
    <InlineEdit
      placeholder="New habit"
      initialText=""
      commit={(text: string) =>
        addHabit.mutate({ description: text, goalId: goalId })
      }
    />
  );
} */

function CreateHabitLinkedToGoal({ goalId }: { goalId: string }) {
  const context = api.useContext();

  const createHabit = api.habits.createHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });

  const [active, setActive] = useState(false);

  return active ? (
    <CreateLinkedHabitInline
      createHabit={(description) =>
        createHabit.mutate({ description: description, goalId })
      }
      closeEdit={() => setActive(false)}
    ></CreateLinkedHabitInline>
  ) : (
    <button
      className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm  text-gray-600 hover:bg-gray-200"
      onClick={() => setActive(true)}
    >
      + Create a new Linked Habit
    </button>
  );
}

function HabitsSection({
  goalId,
  habits,
}: {
  goalId: string;
  habits: Habit[];
}) {
  const context = api.useContext();
  const deleteHabit = api.habits.deleteHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });

  return (
    <>
      <div className="mb-4 grid w-full grid-cols-2 items-baseline justify-between gap-2">
        {habits.length == 0 && (
          <div className="col-span-full w-full bg-gray-100 px-4 py-2">
            No linked habits
          </div>
        )}
        {habits.map((habit) => {
          return (
            <>
              <div>
                <p className="text-lg">{habit.description}</p>
                <p className="text-sm text-gray-300">
                  Created: {habit.createdAt.toUTCString()}
                </p>
              </div>
              <div className="flex-shrink space-x-2 text-right">
                <Button
                  onClick={() =>
                    deleteHabit.mutate({
                      habitId: habit.id,
                    })
                  }
                  variant="outline"
                >
                  Delete
                </Button>
              </div>
            </>
          );
        })}
      </div>
      <CreateHabitLinkedToGoal goalId={goalId}></CreateHabitLinkedToGoal>
    </>
  );
}

const HeatMap = dynamic(() => import("@uiw/react-heat-map"), { ssr: false });

const value = [
  { date: "2023/01/11", count: 2, content: "" },
  { date: "2023/01/12", count: 20, content: "" },
  { date: "2023/01/13", count: 10, content: "" },
  ...[...Array(17).keys()].map((_, idx) => ({
    date: `2023/02/${idx + 10}`,
    count: 10,
    content: "",
  })),
  { date: "2023/04/11", count: 10, content: "" },
  { date: "2023/05/01", count: 10, content: "" },
  { date: "2023/05/02", count: 10, content: "" },
  { date: "2023/05/04", count: 10, content: "" },
];

function HistorySection({ habitId }: { habitId: string }) {
  const completionsQuery = api.habits.getCompletions.useQuery({
    habitId: habitId,
    timeHorizon: 365,
  });
  if (
    completionsQuery.isLoading ||
    completionsQuery.error ||
    !completionsQuery.data
  ) {
    return <p>LOADING</p>;
  }
  const completions = completionsQuery.data;
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <HeatMap
        value={value}
        space={100}
        startDate={new Date(subYears(new Date(), 1))}
        width={600}
        legendCellSize={0}
      />
      {JSON.stringify(completions)}
    </div>
  );
}

function ScoringSection({
  goalId,
  habits,
  metrics,
}: {
  goalId: string;
  habits: (ExpandedHabit & { weight: number })[];
  metrics: (ExpandedMetric & { weight: number })[];
}) {
  const context = api.useContext();
  const updateHabitWeight = api.goals.updateHabitWeight.useMutation({
    onSuccess() {
      void context.goals.getWeights.invalidate();
    },
  });
  const updateMetricWeight = api.goals.updateMetricWeight.useMutation({
    onSuccess() {
      void context.goals.getWeights.invalidate();
    },
  });
  const totalWeight =
    habits.reduce((acc, cur) => acc + cur.weight, 0) +
    metrics.reduce((acc, cur) => acc + cur.weight, 0);

  if (totalWeight == 0) {
    return (
      <div className="h-10 w-full bg-gray-100">
        <p>
          No linked habits or metrics! Goals need linked items to calculate
          scores.
        </p>
      </div>
    );
  }
  return (
    <TooltipProvider>
      <div className="relative w-full">
        {habits.map((habit, i) => (
          <Tooltip key={habit.id} delayDuration={0}>
            <div
              key={habit.id}
              className="inline-flex h-full flex-col items-center gap-3 text-center"
              style={{
                width: `${(habit.weight / totalWeight) * 100}%`,
              }}
            >
              <span className="flex flex-row items-center justify-center gap-2">
                <TbSquareRoundedLetterH className="h-6 w-6"></TbSquareRoundedLetterH>
                {habit.description}
              </span>
              <TooltipTrigger asChild>
                <div
                  className="h-5 w-full animate-[scale] animate-in animate-out hover:scale-110 hover:scale-y-150"
                  style={{
                    backgroundColor: `hsl(0deg 0% ${40 + ((i * 15) % 60)}%)`,
                  }}
                ></div>
              </TooltipTrigger>
              <p> Weight: {habit.weight}</p>
              <span>
                <Button
                  variant="ghost"
                  disabled={habit.weight <= 1}
                  onClick={() =>
                    updateHabitWeight.mutate({
                      goalId: goalId,
                      habitId: habit.id,
                      weight: habit.weight - 1,
                    })
                  }
                >
                  <ArrowDownIcon></ArrowDownIcon>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    updateHabitWeight.mutate({
                      goalId: goalId,
                      habitId: habit.id,
                      weight: habit.weight + 1,
                    })
                  }
                >
                  <ArrowUpIcon></ArrowUpIcon>
                </Button>
              </span>
            </div>
            <TooltipContent>
              {((habit.weight / totalWeight) * 100).toFixed(2)}%
            </TooltipContent>
          </Tooltip>
        ))}
        {metrics.map((metric, i) => (
          <Tooltip key={metric.id} delayDuration={0}>
            <div
              key={metric.id}
              className="inline-flex h-full flex-col items-center gap-3 text-center"
              style={{
                width: `${(metric.weight / totalWeight) * 100}%`,
              }}
            >
              <span className="flex flex-row items-baseline justify-center gap-2">
                <TbSquareRoundedLetterM></TbSquareRoundedLetterM>
                {metric.prompt}
              </span>
              <TooltipTrigger asChild>
                <div
                  className="h-5 w-full animate-[scale] animate-in animate-out hover:scale-110 hover:scale-y-150"
                  style={{
                    backgroundColor: `hsl(0deg 0% ${40 + ((i * 15) % 60)}%)`,
                  }}
                ></div>
              </TooltipTrigger>
              <p> Weight: {metric.weight}</p>
              <span>
                <Button
                  variant="ghost"
                  disabled={metric.weight <= 1}
                  onClick={() =>
                    updateMetricWeight.mutate({
                      goalId: goalId,
                      metricId: metric.id,
                      weight: metric.weight - 1,
                    })
                  }
                >
                  <ArrowDownIcon></ArrowDownIcon>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    updateMetricWeight.mutate({
                      goalId: goalId,
                      metricId: metric.id,
                      weight: metric.weight + 1,
                    })
                  }
                >
                  <ArrowUpIcon></ArrowUpIcon>
                </Button>
              </span>
            </div>
            <TooltipContent>
              {((metric.weight / totalWeight) * 100).toFixed(2)}%
            </TooltipContent>
          </Tooltip>
        ))}
        {/* {metrics.map((metric, i) => (
          <Tooltip key={metric.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                key={metric.id}
                className="inline-block h-full bg-gray-200"
                style={{
                  width: `${(metric.weight / totalWeight) * 100}%`,
                  backgroundColor: `hsl(0deg 0% ${50 + ((i * 15) % 50)}%)`,
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent>
              {metric.prompt} -{" "}
              {((metric.weight / totalWeight) * 100).toFixed(2)}%
            </TooltipContent>
          </Tooltip>
        ))} */}
      </div>
    </TooltipProvider>
  );
}

function GoalPanel({
  goalId,
  score,
  scoringUnit,
}: {
  goalId: string;
  score: number;
  scoringUnit: ScoringFormat;
}) {
  const context = api.useContext();

  const deleteGoal = api.goals.deleteGoal.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const editGoal = api.goals.editGoal.useMutation({
    onSettled: () => {
      void context.goals.getAllGoals.invalidate();
    },
  });
  const goalQuery = api.goals.getGoal.useQuery({ id: goalId });
  const goalWeightsQuery = api.goals.getWeights.useQuery({ goalId: goalId });

  const data = goalQuery.data;
  if (goalQuery.isError || goalWeightsQuery.isError) {
    return <p>Error</p>;
  }
  if (
    goalQuery.isLoading ||
    !data ||
    !goalWeightsQuery.data ||
    goalWeightsQuery.isLoading
  ) {
    return <p>LOADING</p>;
  }
  const habitWeights = new Map(
    goalWeightsQuery.data.habits.map((habit) => [habit.habitId, habit.weight])
  );
  const metricWeights = new Map(
    goalWeightsQuery.data.metrics.map((metric) => [
      metric.metricId,
      metric.weight,
    ])
  );

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col gap-2">
        <SheetHeader>
          <SheetTitle>
            <div className="mb-1 flex flex-row justify-between">
              <div className="flex items-center justify-between text-xl">
                <span className="inline-block h-fit w-fit rounded-full bg-yellow-500 px-2 py-1 text-xs text-white">
                  Goal
                </span>
                <EditableField
                  initialText={data.name}
                  commit={(name) => editGoal.mutate({ goalId: data.id, name })}
                ></EditableField>
              </div>
              <div className="flex flex-row items-center space-x-2 whitespace-nowrap">
                <span className="h-fit w-fit rounded-lg bg-gray-100 p-2 text-xl text-yellow-500">
                  {scoringUnit == ScoringFormat.Normalized
                    ? min(1, score).toFixed(2)
                    : (min(1, score) * 100).toFixed(2) + "%"}
                </span>
              </div>
            </div>

            <GoalTagList goalId={goalId}></GoalTagList>
          </SheetTitle>
        </SheetHeader>
        <Accordion
          className="flex-grow overflow-scroll scrollbar-none"
          type="multiple"
        >
          <AccordionItem value="scoring">
            <AccordionTrigger>Scoring</AccordionTrigger>
            <AccordionContent>
              <ScoringSection
                goalId={goalId}
                habits={goalQuery.data.habits.map((it) => ({
                  ...it,
                  weight: habitWeights?.get(it.id) ?? -1,
                }))}
                metrics={goalQuery.data.metrics.map((it) => ({
                  ...it,
                  weight: metricWeights?.get(it.id) ?? -1,
                }))}
              ></ScoringSection>
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="history">
                <AccordionTrigger>History</AccordionTrigger>
                <AccordionContent>
                  <HistorySection habitId={habitId}></HistorySection>
                </AccordionContent>
              </AccordionItem> */}
          <AccordionItem value="habits">
            <AccordionTrigger>Habits</AccordionTrigger>
            <AccordionContent>
              <HabitsSection
                habits={data.habits}
                goalId={goalId}
              ></HabitsSection>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="metrics">
            <AccordionTrigger>Metrics</AccordionTrigger>
            <AccordionContent>
              <MetricsSection goalId={goalId}></MetricsSection>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="w-full space-x-2 bg-gray-100 px-4 py-2 text-right">
          <Button variant="default">
            <Label>Archive</Label>
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteGoal.mutate({ id: goalId })}
          >
            <Label>Delete</Label>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GoalSheet({
  goalId,
  children,
  score,
  scoringUnit,
}: {
  goalId: string;
  children: ReactNode;
  score: number;
  scoringUnit: ScoringFormat;
}) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        position="right"
        size="lg"
        className="overflow-scroll max-md:w-full"
      >
        <GoalPanel
          goalId={goalId}
          score={score}
          scoringUnit={scoringUnit}
        ></GoalPanel>
      </SheetContent>
    </Sheet>
  );
}
