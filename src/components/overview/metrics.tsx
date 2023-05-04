import classNames from "classnames";
import { api } from "../../utils/api";
import { DropdownMenu } from "../createMenu";
import { EllipsisIcon } from "../icons";
import { EditableField } from "../inlineEdit";
import { textcolor } from "./lib";
import { CornerDownRight } from "lucide-react";

export function LinkedMetric({
  id,
  weight,
  prompt,
  score,
  linked,
}: {
  id: string;
  weight: number;
  prompt: string;
  score: number;
  linked: boolean;
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
      <div className={classNames("col-span-2 flex flex-row items-center ml-10")}>
        {linked && <CornerDownRight className="opacity-40"></CornerDownRight>}
        <div className="mb-2">
          <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
            Linked Metric
          </span>
          {/* <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs ">
            Weight: {weight.toFixed(2)}
          </span> */}
        </div>
        <div className="ml-2">
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
            className="ml-2 font-semibold"
          ></EditableField>
        </div>
      </div>

      <div className="flex h-full w-fit flex-row space-x-3 justify-self-end">
        <div className=" h-fit bg-white px-2">
          <span className={classNames("h-fit text-lg ", textcolor(score))}>
            {score.toFixed(2)}
          </span>
        </div>
        <DropdownMenu
          options={[
            {
              name: "Delete",
              onClick: () => deleteMetric.mutate({ metricId: id }),
            },
          ]}
          trigger={
            <EllipsisIcon className="fill-current text-gray-400 hover:text-gray-700"></EllipsisIcon>
          }
        ></DropdownMenu>
      </div>
    </>
  );
}
