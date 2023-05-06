import classNames from "classnames";
import { api } from "../../utils/api";
import { DropdownMenu } from "../createMenu";
import { EditableField } from "../inlineEdit";
import { textcolor } from "./lib";
import { CornerDownRight } from "lucide-react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export function LinkedMetric({
  id,
  weight,
  prompt,
  score,
  offset,
}: {
  id: string;
  weight: number;
  prompt: string;
  score: number;
  offset: 0 | 1 | 2;
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
        className={classNames("col-span-2 flex flex-row items-baseline gap-2", {
          "ml-4": offset == 1,
          "ml-8": offset == 2,
        })}
      >
        {(offset>0) && (
          <CornerDownRight className="ml-4 opacity-40"></CornerDownRight>
        )}
        <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
          Metric
        </span>
        <div className="">
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
            className="ml-2 font-semibold"
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
          {score.toFixed(2)}
        </span>
        <DropdownMenu
          options={[
            {
              name: "Delete",
              onClick: () => deleteMetric.mutate({ metricId: id }),
            },
          ]}
          trigger={
            <EllipsisVerticalIcon className="h-6 w-6 fill-black stroke-black opacity-40"></EllipsisVerticalIcon>
          }
        ></DropdownMenu>
      </div>
    </>
  );
}
