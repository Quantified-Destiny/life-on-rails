import classNames from "classnames";
import { api } from "../../utils/api";
import { DropdownMenu } from "../createMenu";
import { EditableField } from "../inlineEdit";
import { textcolor } from "./lib";
import { CornerDownRight } from "lucide-react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { TbSquareRoundedLetterM } from "react-icons/tb";

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
        className={classNames("col-span-1 flex flex-row items-baseline gap-2", {
          "ml-4": offset == 1,
          "ml-8": offset == 2,
        })}
      >
        {offset > 0 && (
          <CornerDownRight className="ml-4 opacity-40"></CornerDownRight>
        )}
        <div className="flex flex-row items-center gap-2">
          <TbSquareRoundedLetterM className="text-2xl stroke-purple-500"></TbSquareRoundedLetterM>
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
            className="font-semibold"
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
