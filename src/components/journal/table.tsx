import type { ScoringFormat } from "@prisma/client";
import { useState } from "react";
import type { ExpandedHabit, ExpandedMetric } from "../../server/queries";
import { api } from "../../utils/api";
import { HabitRows, MetricRows, Row } from "./row";
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
