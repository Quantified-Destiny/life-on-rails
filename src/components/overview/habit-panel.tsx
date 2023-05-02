import { useState } from "react";
import { api } from "../../utils/api";
import { State, useOverviewStore } from "../overviewState";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { CreateLinkedMetricInline, HabitCard, LinkHabit } from "./habits";

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
  const [creatingMetric, setCreatingMetric] = useState(false);
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
      <div className="mb-2 grid w-full grid-cols-3 items-baseline justify-between gap-2">
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
              <div className="space-x-2 text-right">
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
      {creatingMetric ? (
        <CreateLinkedMetricInline
          habitId={habitId}
          closeEdit={() => setCreatingMetric(false)}
        ></CreateLinkedMetricInline>
      ) : (
        <button
          className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm text-gray-600 hover:bg-gray-200"
          onClick={() => setCreatingMetric(true)}
        >
          + Create a new Linked Metric
        </button>
      )}
    </>
  );
}

export function HabitPanel() {
  const modal = useOverviewStore((store) => store.modal);
  const reset = useOverviewStore((store) => store.reset);
  const habitId = modal?.state == State.HabitPanel ? modal?.habitId : null;

  const habitQuery = api.habits.getHabit.useQuery(
    { habitId: habitId! },
    { enabled: habitId != null }
  );

  const data = habitQuery.data;
  if (!habitId || habitQuery.isError || habitQuery.isLoading || !data) {
    return <p>ERROR</p>;
  }

  return (
    <Sheet open={modal?.state === State.HabitPanel} onOpenChange={reset}>
      <SheetContent position="right" size="lg">
        <div className="relative h-full">
          <SheetHeader>
            <SheetTitle>{data.description}</SheetTitle>
            <SheetDescription>Configure habit information</SheetDescription>
          </SheetHeader>
          <div className="">
            <HabitCard {...data} weight={0.1}></HabitCard>

            <Accordion type="multiple" defaultValue={["stats"]}>
              <AccordionItem value="stats">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent>A bunch of stats</AccordionContent>
              </AccordionItem>
              <AccordionItem value="metrics">
                <AccordionTrigger>Metrics</AccordionTrigger>
                <AccordionContent>
                  <MetricsSection habitId={habitId}></MetricsSection>{" "}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="goals">
                <AccordionTrigger>Goals</AccordionTrigger>
                <AccordionContent>
                  <GoalsSection habitId={habitId} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter className="absolute bottom-0 right-0 w-full bg-gray-100 px-4 py-2">
            <Button variant="default">
              <Label>Archive</Label>
            </Button>
            <Button variant="destructive">
              <Label>Delete</Label>
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
