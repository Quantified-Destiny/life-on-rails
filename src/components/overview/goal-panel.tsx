import type { Habit, Metric } from "@prisma/client";
import { subYears } from "date-fns";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";
import { api } from "../../utils/api";
import { CreateLinkedMetricInline, EditableField } from "../inlineEdit";
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
import { Slider } from "../ui/slider";
import { GoalTagList } from "./tags";

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
                  variant="destructive"
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

function HabitsSection({ habits }: { habits: Habit[] }) {
  const context = api.useContext();
  const deleteMetric = api.metrics.deleteMetric.useMutation({
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
                    deleteMetric.mutate({
                      metricId: habit.id,
                    })
                  }
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </>
          );
        })}
      </div>
      {/* <CreateHabitLinkedToGoal goalId={goalId}></CreateHabitLinkedToGoal> */}
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
        startDate={new Date(subYears(new Date(), 1))}
        width={600}
        legendCellSize={0}
      />
      {JSON.stringify(completions)}
    </div>
  );
}

const DonutChart = dynamic(() => import("react-donut-chart"), { ssr: false });

function ScoringSection({
  habitId,
  completionWeight,
  metrics,
}: {
  habitId: string;
  completionWeight: number;
  metrics: Metric[];
}) {
  const context = api.useContext();
  const editCompletionWeight = api.habits.editCompletionWeight.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const [cw, setcw] = useState(completionWeight);

  const metricWeight = (1 - cw) / metrics.length;
  const data = metrics.map((it) => ({ label: it.prompt, value: metricWeight }));
  data.push({ label: "Completions", value: cw });

  return (
    <>
      <div className="space-y-4 p-2">
        <Label className="my-4">Completion weight</Label>
        <Slider
          value={[cw]}
          onValueChange={(v) => setcw(v[0]!)}
          min={0}
          max={1}
          step={0.01}
          onValueCommit={(val) =>
            editCompletionWeight.mutate({ habitId, completionWeight: val[0]! })
          }
        ></Slider>
      </div>
      <div className="my-8 flex flex-col items-center justify-center">
        <div className="">
          <DonutChart data={data} width={400} height={280} />
        </div>
      </div>
    </>
  );
}

export function GoalPanel({
  goalId,
  children,
}: {
  goalId: string;
  children: ReactNode;
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

  const data = goalQuery.data;
  if (goalQuery.isError) {
    return <p>Error</p>;
  }
  if (goalQuery.isLoading || !data) {
    return <p>LOADING</p>;
  }
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent position="right" size="lg" className="overflow-scroll">
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
                      commit={(name) =>
                        editGoal.mutate({ goalId: data.id, name })
                      }
                    ></EditableField>
                  </div>
                  <div className="flex flex-row items-center space-x-2 whitespace-nowrap">
                    <span className="h-fit w-fit rounded-lg bg-gray-100 p-2 text-xl text-yellow-500">
                      {0}
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
                <AccordionTrigger>Scoring and metrics</AccordionTrigger>
                <AccordionContent>
                  {/* <ScoringSection
                    habitId={habitId}
                    completionWeight={data.completionWeight}
                    metrics={data.metrics}
                  ></ScoringSection> */}
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
                  <HabitsSection habits={data.habits}></HabitsSection>
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
      </SheetContent>
    </Sheet>
  );
}
