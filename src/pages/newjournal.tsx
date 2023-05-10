import { useState } from "react";
import Layout from "../components/layout";
import TimePicker from "../components/time-picker";

import { RxGear, RxRocket } from "react-icons/rx";
import { TbSquareRoundedLetterH, TbSquareRoundedLetterM } from "react-icons/tb";

import type { HabitCompletion, Tag } from "@prisma/client";
import { Metric } from "@prisma/client";
import classNames from "classnames";
import { RiCalendarCheckLine } from "react-icons/ri";

import { api } from "../utils/api";

// fixes zoomed in icons
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CheckCircle, CircleDot, CircleIcon } from "lucide-react";
import Link from "next/link";
import { RxExternalLink } from "react-icons/rx";
import { CreateMenu } from "../components/createMenu";
import { HabitSheet } from "../components/overview/habit-panel";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import MetricModal from "./metric_modal";

interface RowProps {
  id: string;
  description: string;
  date: Date;
  state: RowState;
  metrics?: Metric[];
  tags: Tag[];
  complete: () => void;
  type: "Habit" | "Metric";
}

function Status(props: { status: RowState; complete: () => void }) {
  switch (props.status) {
    case RowState.COMPLETED:
      return <CheckCircle></CheckCircle>;
    case RowState.INCOMPLETE:
      return (
        <CircleIcon
          onClick={props.complete}
          className="cursor-pointer"
        ></CircleIcon>
      );
    case RowState.PARTIAL:
      return <CircleDot></CircleDot>;
  }
}

function TypeIcon({ type }: { type: "Habit" | "Metric" }) {
  return (
    <td className="">
      <div className="flex items-center">
        {type == "Habit" ? (
          <TbSquareRoundedLetterH className="text-xl text-blue-500"></TbSquareRoundedLetterH>
        ) : (
          <TbSquareRoundedLetterM className="text-xl text-purple-500"></TbSquareRoundedLetterM>
        )}
      </div>
    </td>
  );
}

function MetricsIcon({ metrics }: { metrics?: Metric[] }) {
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

function TagsTooltip({ tags }: { tags: Tag[] }) {
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
                  data-tooltip-content={tags.map((it) => it.name).join(", ")}
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
          <TooltipContent>
            {tags.map((it) => it.name).join(", ")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

function Actions({ id }: { id: string }) {
  return (
    <div className="relative flex flex-row items-baseline gap-3 px-2 py-1">
      <HabitSheet habitId={id}>
        <RxGear className=" cursor-pointer rounded-lg text-xl text-gray-500 focus:outline-none focus:ring-1 hover:bg-gray-300"></RxGear>
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
}: {
  currentCompletions: number;
  target: number;
}) {
  return (
    <div className="flex items-center">
      <p className="ml-2 text-sm leading-none text-gray-600/40">
        {/* based off the frequency, if multiple times a day */}
        {currentCompletions}/{target}
      </p>
    </div>
  );
}

const Row = ({
  type,
  id,
  description,
  state,
  metrics,
  tags,
  complete,
}: RowProps): JSX.Element => {
  return (
    <tr
      tabIndex={0}
      className="h-12 rounded border border-gray-100 focus:outline-none"
      key={id}
    >
      <TypeIcon type={type}></TypeIcon>
      <td className="">
        <div className="flex flex-row items-center justify-center">
          <Status status={state} complete={complete}></Status>
          <Schedule currentCompletions={1} target={3}></Schedule>
        </div>
      </td>
      <td className="pl-2">
        <div className="flex items-center text-sm">0.8</div>
      </td>
      <td className="">
        <div className="flex items-center pl-2">
          {/* <span className={classNames({ "line-through": completed })}>
                  {description}
                </span> */}
          <p
            className={classNames(
              "mr-2 text-base font-medium leading-none text-gray-700",
              { "line-through": state === RowState.COMPLETED }
            )}
          >
            {description}
          </p>
          {/* only show if there's linked metrics */}
          {/* {JSON.stringify(metrics)} */}
          {type === "Habit" && <MetricsIcon metrics={metrics}></MetricsIcon>}
        </div>
      </td>

      <td className="pl-2">
        <TagsTooltip tags={tags}></TagsTooltip>
      </td>
      <td className="pl-2">
        <div className="flex items-center">
          <RiCalendarCheckLine></RiCalendarCheckLine>
          {/* last completed else -   */}
          <p className="ml-2 text-sm leading-none text-gray-600">05/01</p>
        </div>
      </td>
      <td>{type === "Habit" && <Actions id={id}></Actions>}</td>
    </tr>
  );
};

interface SubjectiveProps {
  id: string;
  prompt: string;
  score: number | undefined;
}

const Metric = ({ id, prompt, score: serverScore }: SubjectiveProps) => {
  const setScoreMutation = api.metrics.setScore.useMutation();
  const [score, setScoreState] = useState<undefined | number>(serverScore);

  const setScore = (score: number) => {
    setScoreState(score);
    setScoreMutation.mutate({
      metricId: id,
      score: score / 5,
      date: new Date(),
    });
  };

  return (
    <div className="mb-1 py-1">
      <span className="flex flex-row items-center justify-center gap-2">
        <TbSquareRoundedLetterM className="text-xl text-purple-500"></TbSquareRoundedLetterM>
        <p>{prompt}</p>
      </span>
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
    </div>
  );
};

const InlineEdit = ({
  placeholder,
  initialText,
  commit,
}: {
  placeholder: string;
  initialText: string;
  commit: (text: string) => void;
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialText);
  if (!isActive) {
    return (
      <div className="bg-slate-100">
        <span onClick={() => setActive(true)}>
          <PlusIcon className="h-4 w-4"></PlusIcon>
          {placeholder}
        </span>
      </div>
    );
  } else
    return (
      <div className="bg-slate-100">
        <input
          autoFocus
          type="text"
          value={text}
          onBlur={() => setActive(false)}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              console.log(text);
              commit(text);
              setActive(false);
            } else if (event.key == "Escape") {
              setText("");
              setActive(false);
            }
          }}
        ></input>
      </div>
    );
};

const InlineCreateSubjective = () => {
  const context = api.useContext();
  const addSubjective = api.journal.addSubjective.useMutation({
    onSuccess() {
      void context.journal.getMetrics.invalidate();
    },
  });

  return (
    <InlineEdit
      placeholder="New subjective"
      initialText=""
      commit={(text: string) => addSubjective.mutate({ prompt: text })}
    />
  );
};

function InlineCreateHabit() {
  const context = api.useContext();
  const addHabit = api.journal.addHabit.useMutation({
    onSuccess() {
      void context.journal.getHabits.invalidate();
    },
  });

  return (
    <InlineEdit
      placeholder="New habit"
      initialText=""
      commit={(text: string) => addHabit.mutate({ description: text })}
    />
  );
}

interface JournalProps {
  habits: {
    id: string;
    description: string;
    completions: HabitCompletion[];
    metrics: Metric[];
    tags: Tag[];
  }[];
  date: Date;
  setDate: (date: Date) => void;
  metrics: {
    id: string;
    prompt: string;
    score: number | undefined;
    tags: Tag[];
  }[];
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

type HabitType = {
  id: string;
  description: string;
  metrics: Metric[];
  completions: HabitCompletion[];
  tags: Tag[];
};

type MetricType = {
  id: string;
  prompt: string;
  score: number | undefined;
  tags: Tag[];
};

enum RowState {
  INCOMPLETE,
  PARTIAL,
  COMPLETED,
}

function HabitRows({ habit, date }: { habit: HabitType; date: Date }) {
  const [state, setState] = useState<RowState>(RowState.INCOMPLETE);

  return (
    <>
      <Row
        type="Habit"
        {...habit}
        date={date}
        key={habit.id}
        state={state}
        complete={
          habit.metrics.length > 0
            ? () => setState(RowState.PARTIAL)
            : () => setState(RowState.COMPLETED)
        }
      ></Row>
      {state !== RowState.INCOMPLETE && (
        <tr>
          <td colSpan={7} className="rounded border border-gray-100">
            <div className="px-4 pb-7 pt-3 md:px-10 md:pb-4">
              <form className="">
                <div className="flex items-center">
                  {habit.metrics.map((metric) => (
                    <Metric key={metric.id} {...metric} score={0.5}></Metric>
                  ))}
                </div>
                <div className="">
                  <textarea
                    placeholder="Memo"
                    className="h-14 w-full resize-none rounded border border-gray-200 py-3 pl-3 focus:h-20 focus:overflow-auto focus:outline-none"
                    defaultValue={""}
                  />
                </div>
                <div className="items-right mt-2 flex justify-end gap-2">
                  <Button variant="link">Cancel</Button>
                  <Button variant="outline">Done</Button>
                </div>
              </form>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MetricRows({ metric, date }: { metric: MetricType; date: Date }) {
  const [state, setState] = useState<RowState>(RowState.INCOMPLETE);
  return (
    <>
      <Row
        type="Metric"
        description={metric.prompt}
        id={metric.id}
        tags={metric.tags}
        date={date}
        key={metric.id}
        state={state}
        complete={() => setState(RowState.PARTIAL)}
      ></Row>
      {state === RowState.PARTIAL && (
        <tr>
          <td colSpan={7} className="rounded border border-gray-100">
            <div className="px-4 pb-7 pt-3 md:px-10 md:pb-4">
              <form className="">
                <div className="flex items-center">
                  <Metric key={metric.id} {...metric} score={0.5}></Metric>
                </div>
                <div className="">
                  <textarea
                    placeholder="Memo"
                    className="h-14 w-full resize-none rounded border border-gray-200 py-3 pl-3 focus:h-20 focus:overflow-auto focus:outline-none"
                    defaultValue={""}
                  />
                </div>
                <div className="items-right mt-2 flex justify-end gap-2">
                  <Button variant="link">Cancel</Button>
                  <Button variant="outline">Done</Button>
                </div>
              </form>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DataTable({
  habits,
  date,
  metrics,
}: {
  habits: HabitType[];
  date: Date;
  metrics: MetricType[];
}) {
  const context = api.useContext();
  const complete = api.journal.complete.useMutation({
    onSuccess() {
      void context.journal.getHabits.invalidate();
    },
  });
  const [modalMetrics, setMetrics] = useState<Metric[] | undefined>();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <MetricModal
        open={open}
        onOpenChange={setOpen}
        metrics={modalMetrics}
      ></MetricModal>

      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="font-semisbold justify-between text-center text-xs">
            <td></td>
            <td>Completions</td>
            <td>Score</td>
            <td>Name</td>
            <td></td>
            <td>Last</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <HabitRows habit={habit} date={date} key={habit.id}></HabitRows>
          ))}
          {metrics.map((metric) => (
            <MetricRows
              metric={metric}
              date={date}
              key={metric.id}
            ></MetricRows>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Journal({ date, setDate, habits, metrics }: JournalProps) {
  const context = api.useContext();
  const [Tgl, setTgl] = useState<boolean>(true);
  return (
    <>
      <div className="container flex max-w-5xl justify-center">
        <div className="w-full sm:px-6">
          <div className="px-4 py-4 md:px-10 md:py-7">
            <div className="flex items-center justify-between">
              <p
                tabIndex={0}
                className="text-base font-bold leading-normal text-gray-800 focus:outline-none sm:text-lg md:text-xl lg:text-2xl"
              >
                Daily Journal
              </p>
              <CreateMenu className="mt-4 inline-flex items-start justify-start rounded bg-gray-200 px-6 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 hover:bg-indigo-600 sm:mt-0"></CreateMenu>
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

  const habits = api.journal.getHabits.useQuery({ date });
  const metrics = api.journal.getMetrics.useQuery({ date });
  if (habits.isLoading || metrics.isLoading) return <div className="h-screen flex items-center justify-center">
  <RxRocket className="text-2xl animate-spin"></RxRocket>
</div>;
  if (habits.isError || metrics.isError) return <p>Query error</p>;
  const habitsData = habits.data;
  const metricsData = metrics.data.metrics; //query.data.subjectives.map((subjective) => ({ editable: true, ...subjective }));
  return (
    <Journal
      habits={habitsData.habits}
      date={date}
      setDate={setDate}
      metrics={metricsData}
    ></Journal>
  );
};

export default function Page() {
  return <Layout main={JournalPage}></Layout>;
}
