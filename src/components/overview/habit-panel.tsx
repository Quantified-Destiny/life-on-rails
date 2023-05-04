import { subMonths, subYears } from "date-fns";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";
import { api } from "../../utils/api";
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
  HabitHeaderLine,
  LinkHabit,
  CreateMetricLinkedToHabit,
} from "./habits";

function GoalsSection({ habitId }: { habitId: string }) {
  const context = api.useContext();
  const unlinkGoalMutation = api.habits.unlinkHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const goalQuery = api.habits.getGoals.useQuery({ habitId: habitId });

  if (goalQuery.isError) {
    return <p>ERROR</p>;
  }
  if (goalQuery.isLoading) {
    return <p>LOADING</p>;
  }

  return (
    <>
      <div className="mb-2 grid w-full grid-cols-3 items-baseline justify-between gap-2">
        {goalQuery.data.length == 0 && <div>No goals linked</div>}
        {goalQuery.data.map((goal) => {
          const scoreWeight =
            goal.habits.find((h) => h.id == habitId)?.weight ?? 1;
          return (
            <>
              <div>
                <p className="text-lg">{goal.name}</p>
                <p className="text-sm text-gray-300">
                  Created: {goal.createdAt.toUTCString()}
                </p>
              </div>
              <div>
                Weight: <span className="ml-2">{scoreWeight}</span>
              </div>
              <div className="space-x-2 text-right">
                <Button
                  onClick={() =>
                    unlinkGoalMutation.mutate({
                      goalId: goal.id,
                      habitId: habitId,
                    })
                  }
                >
                  Unlink
                </Button>
                <Button>Manage</Button>
              </div>
            </>
          );
        })}
      </div>
      <LinkHabit id={habitId}></LinkHabit>
    </>
  );
}

function MetricsSection({ habitId }: { habitId: string }) {
  const context = api.useContext();
  const deleteMetric = api.metrics.deleteMetric.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const metricsQuery = api.habits.getMetrics.useQuery({ habitId: habitId });

  if (metricsQuery.isError) {
    return <p>ERROR</p>;
  }
  if (metricsQuery.isLoading) {
    return <p>LOADING</p>;
  }

  return (
    <>
      <div className="mb-2 grid w-full grid-cols-2 items-baseline justify-between gap-2">
        {metricsQuery.data.length == 0 && <div>No linked metrics</div>}
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
      <CreateMetricLinkedToHabit habitId={habitId}></CreateMetricLinkedToHabit>
    </>
  );
}

const HeatMap = dynamic(() => import("@uiw/react-heat-map"), { ssr: false });

function HistorySection({ habitId }: { habitId: string }) {
  const completionsQuery = api.habits.getCompletions.useQuery({
    habitId: habitId,
    timeHorizon: 30 * 6,
  });
  if (
    completionsQuery.isLoading ||
    completionsQuery.error ||
    !completionsQuery.data
  ) {
    return <p>LOADING</p>;
  }
  const completions = completionsQuery.data;
  const data = completions.map((c) => ({
    date: c.date.toDateString(),
    count: 10,
    content: "",
  }));
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <HeatMap
        rectSize={12}
        value={data}
        startDate={subMonths(new Date(), 6)}
        width={450}
        legendCellSize={0}
      />
    </div>
  );
}

import type { Metric } from "@prisma/client";
import { Slider } from "../ui/slider";
import { TagList } from "./tags";

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

function HabitPanel({ habitId }: { habitId: string }) {
  const context = api.useContext();
  const deleteHabit = api.habits.deleteHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const linkHabit = api.tags.linkHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });
  const unlinkHabit = api.tags.unlinkHabit.useMutation({
    onSuccess() {
      void context.invalidate();
    },
  });

  const habitQuery = api.habits.getHabit.useQuery({ habitId: habitId });

  const data = habitQuery.data;
  if (!habitId || habitQuery.isError || habitQuery.isLoading || !data) {
    return <p>ERROR</p>;
  }

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col gap-2">
        <SheetHeader>
          <SheetTitle>
            <HabitHeaderLine {...data} weight={0.1}></HabitHeaderLine>
            <TagList
              tags={data.tags}
              link={(tag) => linkHabit.mutate({ habitId, tagName: tag })}
              unlink={(tag) => unlinkHabit.mutate({ habitId, tagName: tag })}
            ></TagList>
          </SheetTitle>
        </SheetHeader>
        <Accordion
          className="flex-grow overflow-scroll scrollbar-none"
          type="multiple"
        >
          <AccordionItem value="scoring">
            <AccordionTrigger>Scoring and metrics</AccordionTrigger>
            <AccordionContent>
              <ScoringSection
                habitId={habitId}
                completionWeight={data.completionWeight}
                metrics={data.metrics}
              ></ScoringSection>
              <h2 className="text-md py-4 uppercase text-slate-600">Metrics</h2>
              <MetricsSection habitId={habitId}></MetricsSection>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="history">
            <AccordionTrigger>History</AccordionTrigger>
            <AccordionContent>
              <HistorySection habitId={habitId}></HistorySection>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="goals">
            <AccordionTrigger>Goals</AccordionTrigger>
            <AccordionContent>
              <GoalsSection habitId={habitId} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="w-full space-x-2 bg-gray-100 px-4 py-2 text-right">
          <Button variant="default">
            <Label>Archive</Label>
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteHabit.mutate({ habitId })}
          >
            <Label>Delete</Label>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HabitSheet({
  habitId,
  children,
}: {
  habitId: string;
  children: ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent position="right" size="lg" className="overflow-scroll">
        <HabitPanel habitId={habitId}></HabitPanel>
      </SheetContent>
    </Sheet>
  );
}
