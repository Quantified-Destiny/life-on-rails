import type { ScoringFormat } from "@prisma/client";
import { useState } from "react";
import type { ExpandedHabit, ExpandedMetric } from "../../server/queries";
import { api } from "../../utils/api";
import { MetricRows, Row } from "./row";
import { MetricPanel } from "./panel";
import { Actions } from "./elements";

export function JournalTable({
  habits,
  date,
  metrics,
  scoringUnit,
}: {
  habits: ExpandedHabit[];
  date: Date;
  metrics: ExpandedMetric[];
  scoringUnit: ScoringFormat;
}) {
  return (
    <>
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="font-semisbold justify-between text-center text-xs">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Score</td>
            <td>Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <HabitRows
              habit={habit}
              date={date}
              key={habit.id}
              scoringUnit={scoringUnit}
            ></HabitRows>
          ))}
          {metrics.map((metric) => (
            <MetricRows
              metric={metric}
              date={date}
              key={metric.id}
              scoringUnit={scoringUnit}
            ></MetricRows>
          ))}
        </tbody>
      </table>
    </>
  );
}

export enum CompletionStatus {
  INCOMPLETE,
  PARTIAL,
  COMPLETED,
}

function HabitRows({
  habit,
  date,
  scoringUnit,
}: {
  habit: ExpandedHabit;
  date: Date;
  scoringUnit: ScoringFormat;
}) {
  const context = api.useContext();
  const createCompletion = api.journal.complete.useMutation({
    onSuccess() {
      void context.habits.getHabits.invalidate();
    },
  });

  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  habit.metrics;
  return (
    <>
      <Row
        type="Habit"
        description={habit.description}
        key={habit.id}
        tags={habit.tags}
        date={date}
        metrics={habit.metrics}
        score={habit.score}
        actions={<Actions id={habit.id} scoringUnit={scoringUnit}></Actions>}
        panel={{
          open: panelOpen,
          togglePanel: setPanelOpen,
        }}
        completion={{
          status:
            habit.completions >= habit.frequency
              ? CompletionStatus.COMPLETED
              : CompletionStatus.INCOMPLETE,
          schedule: {
            current: habit.completions,
            frequency: habit.frequency,
            frequencyHorizon: habit.frequencyHorizon,
          },
          action: () => {
            createCompletion.mutate({ date: date, habitId: habit.id });
            setPanelOpen(true);
          },
        }}
        scoringUnit={scoringUnit}
      ></Row>
      {panelOpen && <MetricPanel metrics={habit.metrics}></MetricPanel>}
    </>
  );
}
