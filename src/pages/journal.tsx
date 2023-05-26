import { useState } from "react";
import TimePicker from "../components/time-picker";

import { RxGear } from "react-icons/rx";

import { FrequencyHorizon, Metric, ScoringFormat } from "@prisma/client";
import classNames from "classnames";

import { api } from "../utils/api";

// fixes zoomed in icons
import { PlusIcon } from "@heroicons/react/24/outline";
import { CheckCircle, CircleDot, CircleIcon } from "lucide-react";
import Link from "next/link";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import { RxExternalLink } from "react-icons/rx";
import { CreateMenu } from "../components/createMenu";
import { HabitSheet } from "../components/overview/habit-panel";
import { textcolor } from "../components/overview/lib";
import { Button } from "../components/ui/button";
import { MetricIcon, HabitIcon } from "../components/ui/icons";
import { Loader } from "../components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import type { ExpandedHabit, ExpandedMetric } from "../server/queries";

function min(a: number, b: number) {
  return a < b ? a : b;
}

function Status({
  completion: { status, action },
}: {
  completion: Completion;
}) {
  switch (status) {
    case CompletionStatus.COMPLETED:
      return <CheckCircle></CheckCircle>;
    case CompletionStatus.INCOMPLETE:
      return (
        <CircleIcon onClick={action} className="cursor-pointer"></CircleIcon>
      );
    case CompletionStatus.PARTIAL:
      return <CircleDot></CircleDot>;
  }
}

function TypeIcon({ type }: { type: "Habit" | "Metric" }) {
  return (
    <td className="">
      <div className="flex flex-row items-center justify-center">
        {type == "Habit" ? <HabitIcon /> : <MetricIcon />}
      </div>
    </td>
  );
}

function MetricsTooltip({ metrics }: { metrics?: Metric[] }) {
  if (metrics && metrics.length > 0)
    return (
      <>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.66669 9.33342C6.88394 9.55515 7.14325 9.73131 7.42944 9.85156C7.71562 9.97182 8.02293 10.0338 8.33335 10.0338C8.64378 10.0338 8.95108 9.97182 9.23727 9.85156C9.52345 9.73131 9.78277 9.55515 10 9.33342L12.6667 6.66676C13.1087 6.22473 13.357 5.62521 13.357 5.00009C13.357 4.37497 13.1087 3.77545 12.6667 3.33342C12.2247 2.89139 11.6251 2.64307 11 2.64307C10.3749 2.64307 9.77538 2.89139 9.33335 3.33342L9.00002 3.66676"
                  stroke="#3B82F6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.33336 6.66665C9.11611 6.44492 8.8568 6.26876 8.57061 6.14851C8.28442 6.02825 7.97712 5.96631 7.66669 5.96631C7.35627 5.96631 7.04897 6.02825 6.76278 6.14851C6.47659 6.26876 6.21728 6.44492 6.00003 6.66665L3.33336 9.33332C2.89133 9.77534 2.64301 10.3749 2.64301 11C2.64301 11.6251 2.89133 12.2246 3.33336 12.6666C3.77539 13.1087 4.37491 13.357 5.00003 13.357C5.62515 13.357 6.22467 13.1087 6.66669 12.6666L7.00003 12.3333"
                  stroke="#3B82F6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TooltipTrigger>
            <TooltipContent>
              {metrics.map((m) => m.prompt).join(", ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  else return <></>;
}

function TagsTooltip({ tags }: { tags: string[] }) {
  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <div className="flex items-center">
              {/* only show if there's tags */}
              {tags.length > 0 && (
                <div
                  className="item"
                  data-tooltip-id="tag-tooltip"
                  data-tooltip-content={tags.join(", ")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M9.16667 2.5L16.6667 10C17.0911 10.4745 17.0911 11.1922 16.6667 11.6667L11.6667 16.6667C11.1922 17.0911 10.4745 17.0911 10 16.6667L2.5 9.16667V5.83333C2.5 3.99238 3.99238 2.5 5.83333 2.5H9.16667"
                      stroke="#52525B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="7.50004"
                      cy="7.49967"
                      r="1.66667"
                      stroke="#52525B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>{tags.join(", ")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

function Actions({
  id,
  scoringUnit,
}: {
  id: string;
  scoringUnit: ScoringFormat;
}) {
  return (
    <div className="relative flex flex-row items-baseline gap-3 px-2 py-1">
      <HabitSheet habitId={id} scoringUnit={scoringUnit}>
        <RxGear className=" cursor-pointer rounded-lg text-xl text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-1"></RxGear>
      </HabitSheet>
      <Link href={`/habit/${id}`}>
        <button className="text-xl text-gray-500 hover:bg-gray-300">
          <RxExternalLink></RxExternalLink>
        </button>
      </Link>
    </div>
  );
}

function Schedule({
  currentCompletions,
  target,
  horizon,
}: {
  currentCompletions: number;
  target: number;
  horizon: FrequencyHorizon;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="ml-2 text-sm leading-none text-gray-600/40">
        {/* based off the frequency, if multiple times a day */}
        {currentCompletions}/{target}
      </p>
      <p className="ml-2 text-sm leading-none text-gray-400/40">
        {horizon == FrequencyHorizon.DAY ? "today" : "this week"}
      </p>
    </div>
  );
}

interface Completion {
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

const Row = ({
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
        {completion && completion.schedule && (
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

interface SubjectiveProps {
  id: string;
  prompt: string;
  score: number | undefined;
}

const Metric = ({ id, prompt, score: serverScore }: SubjectiveProps) => {
  return (
    <div className="mb-1 py-1">
      <span className="flex flex-row items-center justify-center gap-2">
        <MetricIcon />
        <p>{prompt}</p>
      </span>
      <MetricButtonRow id={id} score={serverScore}></MetricButtonRow>
    </div>
  );
};

function MetricButtonRow({
  id,
  score: serverScore,
}: {
  id: string;
  score: number | undefined;
}) {
  const setScoreMutation = api.metrics.setScore.useMutation();
  const [score, setScoreState] = useState<undefined | number>(
    (serverScore ?? 0) * 5
  );

  const setScore = (score: number) => {
    setScoreState(score);
    setScoreMutation.mutate({
      metricId: id,
      score: score / 5,
      date: new Date(),
    });
  };

  return (
    <div className="flex flex-row flex-nowrap gap-2 p-2">
      <Button
        onClick={() => setScore(1)}
        variant={score == 1 ? "default" : "outline"}
      >
        1
      </Button>
      <Button
        onClick={() => setScore(2)}
        variant={score == 2 ? "default" : "outline"}
      >
        2
      </Button>
      <Button
        onClick={() => setScore(3)}
        variant={score == 3 ? "default" : "outline"}
      >
        3
      </Button>
      <Button
        onClick={() => setScore(4)}
        variant={score == 4 ? "default" : "outline"}
      >
        4
      </Button>
      <Button
        onClick={() => setScore(5)}
        variant={score == 5 ? "default" : "outline"}
      >
        5
      </Button>
    </div>
  );
}

interface JournalProps {
  habits: ExpandedHabit[];
  date: Date;
  setDate: (date: Date) => void;
  metrics: ExpandedMetric[];
  scoringUnit?: ScoringFormat;
}

// https://tailwindcomponents.com/component/free-tailwind-css-advance-table-component
// function dropdownFunction(element) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     let list = element.parentElement.parentElement.getElementsByClassName("dropdown-content")[0];
//     list.classList.add("target");
//     for (i = 0; i < dropdowns.length; i++) {
//         if (!dropdowns[i].classList.contains("target")) {
//             dropdowns[i].classList.add("hidden");
//         }
//     }
//     list.classList.toggle("hidden");
// }

enum CompletionStatus {
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

function MetricPanel({ metrics }: { metrics: ExpandedMetric[] }) {
  return (
    <tr>
      <td colSpan={4} className="bg-gray-100/70"></td>
      <td colSpan={5} className="rounded border border-gray-100">
        <div className="px-4 pb-7 pt-3 md:px-10 md:pb-4">
          <div className="flex items-center">
            {metrics.map((metric) => (
              <Metric
                key={metric.id}
                id={metric.id}
                prompt={metric.prompt}
                score={0.5}
              ></Metric>
            ))}
          </div>
          <div className="">
            <Memo></Memo>
          </div>
          {metrics.length > 0 && (
            <div className="items-right mt-2 flex justify-end gap-2">
              <Button variant="link">Cancel</Button>
              <Button
                variant="outline"
                disabled={metrics.some((it) => it.score === undefined)}
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
function MetricRows({
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

function Memo() {
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

function DataTable({
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
            <td className="w-2"></td>
            <td className="w-2"></td>
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

function Journal({
  date,
  setDate,
  habits,
  metrics,
  scoringUnit,
}: JournalProps) {
  return (
    <>
      <div className="container flex max-w-5xl justify-center">
        <div className="w-full">
          <div className="px-4 py-4 md:px-10 md:py-7">
            <div className="flex items-center justify-between">
              <p
                tabIndex={0}
                className="text-base font-bold leading-normal text-gray-800 focus:outline-none sm:text-lg md:text-xl lg:text-2xl"
              >
                Daily Journal
              </p>
              <CreateMenu className="mt-4 inline-flex items-start justify-start rounded bg-gray-200 px-6 py-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:mt-0"></CreateMenu>
            </div>
            <div className="flex w-auto items-center justify-between">
              <TimePicker date={date} setDate={setDate}></TimePicker>
            </div>
          </div>
          <div className="bg-white px-4 py-3 md:px-6 md:py-4 xl:px-10">
            <div className="items-center justify-between sm:flex">
              Pending Tasks
            </div>
            <div className="mt-7 overflow-x-auto">
              <DataTable
                habits={habits}
                metrics={metrics}
                date={date}
                scoringUnit={scoringUnit ?? "Normalized"}
              ></DataTable>
            </div>

            {/* <div className="delay-150 flex mt-7 flex-row justify-center transition">
              <div className=" text-md mb-5 text-center">
                <button
                  className="rounded-full focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-800"
                  onClick={() => setTgl(!Tgl)}
                >
                  <div className="rounded-full bg-indigo-100 px-4 py-1 text-indigo-700 transition delay-150">
                    {Tgl ? (
                      <p>Show Compeleted Items</p>
                    ) : (
                      <p>Hide Compeleted Items</p>
                    )}
                  </div>
                </button>
              </div>
            </div>
            {Tgl ? (
              <></>
            ) : (
              <DataTable
                habits={habits}
                metrics={metrics}
                date={date}
              ></DataTable>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

const today = new Date();

const JournalPage = () => {
  const [date, setDate] = useState(today);

  const habits = api.habits.getHabits.useQuery({ date });
  const metrics = api.metrics.getMetrics.useQuery({ date });
  const profile = api.profile.getProfile.useQuery();

  if (habits.isLoading || metrics.isLoading) return <Loader></Loader>;
  if (habits.isError || metrics.isError) return <p>Query error</p>;
  const habitsData = habits.data;
  const metricsData = metrics.data; //query.data.subjectives.map((subjective) => ({ editable: true, ...subjective }));
  const user = profile.data;
  return (
    <Journal
      habits={habitsData}
      date={date}
      setDate={setDate}
      metrics={metricsData.filter((it) => it.linkedHabits.length == 0)}
      scoringUnit={user?.scoringUnit}
    ></Journal>
  );
};

export default JournalPage;
