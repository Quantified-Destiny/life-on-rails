import classNames from "classnames";
import { api } from "../../utils/api";
import { DropdownMenu } from "../createMenu";
import { EllipsisIcon } from "../icons";
import { EditableField } from "../inlineEdit";
import { textcolor } from "./lib";

export function LinkedMetric({
  id,
  weight,
  prompt,
  score,
}: {
  id: string;
  weight: number;
  prompt: string;
  score: number;
}) {
  const context = api.useContext();
  const mutation = api.metrics.editMetric.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });
  const deleteMetric = api.metrics.deleteMetric.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <div className="m-2 flex min-h-[100px] flex-row justify-between rounded-lg bg-gray-100 p-4">
      <div className="flex flex-col">
        <div className="mb-2">
          <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
            Linked Metric
          </span>
          {/* <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
            Weight: {weight.toFixed(2)}
          </span> */}
        </div>
        <div className="ml-2 font-semibold">
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
          ></EditableField>
        </div>
      </div>

      <div className="flex h-full w-fit flex-row space-x-3">
        <div className=" h-fit bg-white px-2">
          <span
            className={classNames("h-fit text-lg font-bold", textcolor(score))}
          >
            {score}
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
    </div>
  );
}
