import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ScoringFormat } from "@prisma/client";
import classNames from "classnames";
import { CornerDownRight } from "lucide-react";
import { api } from "../../utils/api";
import { Dropdown } from "../createMenu";
import { EditableField } from "../inlineEdit";
import { MetricIcon } from "../ui/icons";
import { textcolor } from "./lib";
function min(a: number, b: number) {
  return a < b ? a : b;
}
export function LinkedMetric({
  id,
  weight,
  prompt,
  score,
  offset,
  scoringUnit,
}: {
  id: string;
  weight: number;
  prompt: string;
  score: number;
  offset: 0 | 1 | 2;
  scoringUnit: ScoringFormat;
}) {
  const context = api.useContext();
  const mutation = api.metrics.editMetric.useMutation({
    onSuccess: () => {
      void context.goals.getAllGoals.invalidate();
    },
  });
  const deleteMetric = api.metrics.deleteMetric.useMutation({
    onSuccess: () => {
      void context.goals.getAllGoals.invalidate();
    },
  });

  return (
    <>
      <div
        className={classNames("col-span-1 flex flex-row items-baseline gap-2", {
          "ml-0": offset == 1,
          "ml-8": offset == 2,
        })}
      >
        {offset > 0 && (
          <CornerDownRight className="ml-4 opacity-40"></CornerDownRight>
        )}
        <div className="flex flex-row items-center gap-2">
          <MetricIcon />
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
          ></EditableField>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-2 justify-self-end whitespace-nowrap">
        <span
          className={classNames(
            "rounded-lg bg-gray-100 p-2 text-xl",
            textcolor(score)
          )}
        >
          {scoringUnit == ScoringFormat.Normalized
            ? min(1, score).toFixed(2)
            : (min(1, score) * 100).toFixed(2) + "%"}
        </span>
        <Dropdown
          options={[
            {
              name: "Delete",
              onClick: () => deleteMetric.mutate({ metricId: id }),
            },
          ]}
          trigger={
            <EllipsisVerticalIcon className="h-6 w-6 fill-black stroke-black opacity-40"></EllipsisVerticalIcon>
          }
        ></Dropdown>
      </div>
    </>
  );
}
