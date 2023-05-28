import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ExpandedMetric } from "../../server/queries";
import { Button } from "../ui/button";
import { MetricUI } from "./elements";
import { api } from "../../utils/api";

export function Memo() {
  const [active, setActive] = useState<boolean>(false);

  return !active ? (
    <span
      className="mt-5 flex cursor-pointer flex-row items-center gap-1 text-gray-400"
      onClick={() => setActive(true)}
    >
      <PlusIcon className="h-4 w-4"></PlusIcon> Add memo
    </span>
  ) : (
    <textarea
      placeholder="Memo"
      className="h-14 w-full resize-none rounded border border-gray-200 py-3 pl-3 focus:h-20 focus:overflow-auto focus:outline-none"
      defaultValue={""}
      onKeyDown={(key) => {
        if (key.key === "Escape") {
          setActive(false);
        }
        if (key.key === "Enter") {
          setActive(false);
        }
      }}
    />
  );
}
export function HabitPanel({
  id,
  metrics,
  reset,
  setLoading
}: {
  id: string,
  metrics: ExpandedMetric[];
  reset: () => void;
  setLoading: (loading: boolean) => void
}) {
  const context = api.useContext();
  const setScore = api.metrics.setScore.useMutation();
  const createCompletion = api.journal.complete.useMutation({
    onSuccess() {
      void context.habits.getHabits.invalidate();
    },
  });

  const initValue = [...Array(metrics.length).keys()].map((_) => undefined);
  const [metricScores, setMetricScores] =
    useState<(number | undefined)[]>(initValue);
  console.log(metricScores);
  return (
    <tr>
      <td colSpan={4} className="bg-gray-100/70"></td>
      <td colSpan={5} className="rounded border border-gray-100">
        <div className="px-4 pb-7 pt-3 md:px-10 md:pb-4">
          <div className="flex items-center">
            {metrics.map((metric, i) => (
              <MetricUI
                key={metric.id}
                id={metric.id}
                prompt={metric.prompt}
                score={metricScores[i]}
                setScore={(score) => {
                  metricScores[i] = score;
                  setMetricScores([...metricScores]);
                }}
              ></MetricUI>
            ))}
          </div>
          <div className="">
            <Memo></Memo>
          </div>
          {metrics.length > 0 && (
            <div className="items-right mt-2 flex justify-end gap-2">
              <Button variant="link" onClick={reset}>
                Cancel
              </Button>
              <Button
                variant="outline"
                disabled={metricScores.some((it) => it === undefined)}
                onClick={() => {
                  setLoading(true);
                  const now = new Date();
                  metrics.forEach((metric, i) => {
                    setScore.mutate({
                      metricId: metric.id,
                      date: now,
                      score: metricScores[i]!,
                    });
                  });
                  createCompletion.mutate({
                    habitId: id,
                    date: now
                  });
                  reset();
                  setLoading(false);
                }}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
