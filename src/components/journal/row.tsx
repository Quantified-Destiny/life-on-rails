import type { Metric , FrequencyHorizon} from "@prisma/client";
import { ScoringFormat } from "@prisma/client";
import classNames from "classnames";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import type { ExpandedMetric } from "../../server/queries";
import { textcolor } from "../overview/lib";
import {
  MetricButtonRow,
  MetricsTooltip,
  Schedule,
  Status,
  TagsTooltip,
  TypeIcon,
} from "./elements";
import { Memo } from "./panel";
import { CompletionStatus } from "./table";

export interface Completion {
  status: CompletionStatus;
  schedule?: {
    current: number;
    frequency: number;
    frequencyHorizon: FrequencyHorizon;
  };
  action?: () => void;
}

interface RowProps {
  key: string;
  description: string;
  date: Date;
  completion?: Completion;
  metrics?: Metric[];
  score: number;
  tags: string[];
  type: "Habit" | "Metric";
  actions?: React.ReactNode;
  panel?: {
    open: boolean;
    togglePanel: (open: boolean) => void;
  };
  scoringUnit: ScoringFormat;
}

export const Row = ({
  type,
  key,
  description,
  score,
  completion,
  metrics,
  tags,
  actions,
  panel,
  scoringUnit,
}: RowProps): JSX.Element => {
  return (
    <tr
      tabIndex={0}
      className="h-12 rounded border border-gray-100 focus:outline-none"
      key={key}
    >
      <td className="cursor-pointer text-center opacity-50">
        {panel && (
          <button>
            {panel.open ? (
              <AiFillCaretDown
                onClick={() => panel.togglePanel(false)}
              ></AiFillCaretDown>
            ) : (
              <AiFillCaretRight
                onClick={() => panel.togglePanel(true)}
              ></AiFillCaretRight>
            )}
          </button>
        )}
      </td>
      <TypeIcon type={type}></TypeIcon>
      <td>{completion && <Status completion={completion}></Status>}</td>
      <td>
        {completion?.schedule && (
          <Schedule
            currentCompletions={completion.schedule.current}
            target={completion.schedule.frequency}
            horizon={completion.schedule.frequencyHorizon}
          ></Schedule>
        )}
      </td>
      <td className="pl-2">
        <div
          className={classNames("w-full text-center text-sm", textcolor(score))}
        >
          {scoringUnit == ScoringFormat.Normalized
            ? min(1, score).toFixed(2)
            : (min(1, score) * 100).toFixed(2) + "%"}
        </div>
      </td>
      <td className="">
        <div className="flex items-center pl-2">
          <p
            className={classNames(
              "mr-2 text-base font-medium leading-none text-gray-700",
              {
                "line-through":
                  completion?.status === CompletionStatus.COMPLETED,
              }
            )}
          >
            {description}
          </p>
          {type === "Habit" && (
            <MetricsTooltip metrics={metrics}></MetricsTooltip>
          )}
        </div>
      </td>

      <td className="pl-2">
        <TagsTooltip tags={tags}></TagsTooltip>
      </td>
      <td>{actions}</td>
    </tr>
  );
};

function min(a: number, b: number) {
  return a < b ? a : b;
}

export function MetricRows({
  metric,
  date,
  scoringUnit,
}: {
  metric: ExpandedMetric;
  date: Date;
  scoringUnit: ScoringFormat;
}) {
  return (
    <>
      <Row
        type="Metric"
        description={metric.prompt}
        key={metric.id}
        tags={metric.tags.map((tag) => tag.name)}
        date={date}
        score={metric.score}
        scoringUnit={scoringUnit}
      ></Row>
      {
        <tr>
          <td
            colSpan={4}
            className="rounded border border-gray-100 bg-gray-100/70"
          ></td>
          <td colSpan={6} className="rounded border border-gray-100">
            <div className="px-4 pb-7 pt-3 md:px-10 md:pb-4">
              <div className="flex items-center">
                <MetricButtonRow
                  id={metric.id}
                  score={metric.value}
                ></MetricButtonRow>
              </div>
              <div className="">
                <Memo></Memo>
              </div>
            </div>
          </td>
        </tr>
      }
    </>
  );
}
