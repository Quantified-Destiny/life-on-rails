import dynamic from "next/dynamic";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import Layout from "../components/layout";

// import HeatMap from '@uiw/react-heat-map';
//Next.js error Global CSS cannot be imported from within node_modules

import "@uiw/react-heat-map/dist.css";
import "@uiw/react-heat-map/esm/style/index.css";

// import '@uiw/react-tooltip/esm/style/index.css';
// import '@uiw/react-tooltip/dist.css';

const HeatMap = dynamic(() => import("@uiw/react-heat-map"), { ssr: false });

// const Tooltip = dynamic(
//   () => import("@uiw/react-tooltip"),
//   { ssr: false }
// );


import type { Metric } from "@prisma/client";
import classNames from "classnames";
import { differenceInCalendarDays } from "date-fns";
function isSameDay(a: Date, b: Date) {
  return differenceInCalendarDays(a, b) === 0;
}

import { api } from "../utils/api";

// fixes zoomed in icons
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/button";

interface HabitProps {
  id: string;
  description: string;
  date: Date;
  completed: boolean;
  metrics: Metric[];
  editable: boolean;
  setCompletion: (completed: boolean) => void;
  edit: (description: string) => void;
  deleteHabit: () => void;
}

const Habit = ({
  id,
  date,
  description,
  editable,
  completed,
  metrics,
  setCompletion,
  edit,
  deleteHabit,
}: HabitProps): JSX.Element => {
  const [editMode, setEditMode] = useState(false);

  // FIXME this state really should belong to the edit part of this component
  const [text, setText] = useState(description);
  if (editMode)
    return (
      <div>
        <input
          autoFocus
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              edit(text);
              setEditMode(false);
            } else if (event.key == "Escape") {
              setEditMode(false);
            }
          }}
        ></input>
      </div>
    );

  const context = api.useContext();
  const mutation = api.journal.setSubjectiveScore.useMutation({
    onSuccess() {
      void context.journal.getMetrics.invalidate();
    },
  });

  const setScore = (subjectiveId: string, score: number) =>
    mutation.mutate({
      metricId: subjectiveId,
      date: date,
      score: score,
    });

  return (
    <div className="my-2" key={id}>
      <div className="flex flex-row">
        <input
          type="checkbox"
          className="mr-1"
          aria-hidden="true"
          checked={completed}
          onChange={(event) => setCompletion(event.target.checked)}
          readOnly={!editable}
        />
        <span className={classNames({ "line-through": completed })}>
          {description}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 cursor-pointer fill-green-200 hover:fill-green-300"
          onClick={() => setEditMode(true)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 cursor-pointer fill-red-300 hover:fill-red-400"
          onClick={deleteHabit}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
          />
        </svg>
      </div>
      {metrics.length != 0 && (
        <div className="ml-4 py-2 pl-2 shadow-md">
          {metrics.map((metric) => (
            <>
              <span className="">{metric.prompt}</span>
              <br></br>
              <div className="inline-flex gap-2">
                {[...Array(5).keys()].map((score) => (
                  <button
                    className="rounded-l bg-gray-300 px-2 font-semibold text-gray-800 hover:bg-gray-400"
                    onClick={() => setScore(metric.id, 0)}
                    key={score}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

interface SubjectiveProps {
  id: string;
  prompt: string;
  score: number | undefined;
  setScore: (score: number) => void;
}

const Subjective = ({ id, prompt, score, setScore }: SubjectiveProps) => {
  return (
    <div className="mb-1 py-1">
      <p>{prompt}</p>
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
      commit={(text: string) => addHabit.mutate(text)}
    />
  );
}

interface JournalProps {
  habits: {
    id: string;
    description: string;
    completed: boolean;
    editable: boolean;
    metrics: Metric[];
  }[];
  date: Date;
  setDate: (date: Date) => void;
  metrics: {
    id: string;
    prompt: string;
    score: number | undefined;
  }[];
}

function Journal({ date, setDate, habits, metrics }: JournalProps) {
  const context = api.useContext();
  const setHabitCompletion = api.journal.setCompletion.useMutation({
    onSuccess() {
      void context.journal.getHabits.invalidate();
    },
  });
  const setScore = api.journal.setSubjectiveScore.useMutation({
    onSuccess() {
      void context.journal.getMetrics.invalidate();
    },
  });
  const deleteHabit = api.journal.deleteHabit.useMutation({
    onSuccess() {
      void context.journal.getHabits.invalidate();
    },
  });
  const editHabit = api.journal.editHabit.useMutation({
    onSuccess() {
      void context.journal.getHabits.invalidate();
    },
  });

  return (
    <>
      <div className="w-full sm:px-6">
        {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
        <div className="px-4 py-4 md:px-10 md:py-7">
          <div className="flex items-center justify-between">
            <p
              tabIndex={0}
              className="text-base font-bold leading-normal text-gray-800 focus:outline-none sm:text-lg md:text-xl lg:text-2xl"
            >
              Today's Journal
            </p>
            <div className="flex cursor-pointer items-center rounded bg-gray-200 px-4 py-3 text-sm font-medium leading-none text-gray-600 hover:bg-gray-300">
              <p>Sort By:</p>
              <select
                aria-label="select"
                className="ml-1 bg-transparent focus:text-indigo-600 focus:outline-none"
              >
                <option className="text-sm text-indigo-800">Latest</option>
                <option className="text-sm text-indigo-800">Oldest</option>
                <option className="text-sm text-indigo-800">Latest</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-4 md:px-8 md:py-7 xl:px-10">
          <div className="items-center justify-between sm:flex">
            <div className="flex items-center">
              <a
                className="rounded-full focus:bg-indigo-50 focus:outline-none  focus:ring-2 focus:ring-indigo-800"
                href=" javascript:void(0)"
              >
                <div className="rounded-full bg-indigo-100 px-8 py-2 text-indigo-700">
                  <p>All</p>
                </div>
              </a>
              <a
                className="ml-4 rounded-full focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-800 sm:ml-8"
                href="javascript:void(0)"
              >
                <div className="rounded-full px-8 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 ">
                  <p>Habits</p>
                </div>
              </a>
              <a
                className="ml-4 rounded-full focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-800 sm:ml-8"
                href="javascript:void(0)"
              >
                <div className="rounded-full px-8 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 ">
                  <p>Metrics</p>
                </div>
              </a>
            </div>
            <button className="mt-4 inline-flex items-start justify-start rounded bg-indigo-700 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 hover:bg-indigo-600 sm:mt-0">
              <p className="text-sm font-medium leading-none text-white">
                Add Habit
              </p>
            </button>
          </div>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <tbody>
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Marketing Keynote Presentation
                      </p>
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
                    </div>
                  </td>
                  <td className="pl-24">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-red-100 px-3 py-3 text-sm leading-none text-red-700 focus:outline-none">
                      Due today at 18:00
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16  rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="focus:text-indigo-600 ">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        UX Wireframes
                      </p>
                    </div>
                  </td>
                  <td className="pl-24">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-gray-100 px-6 py-3 text-sm leading-none text-gray-700 focus:outline-none">
                      Due on 21.02.21
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:text-indigo-600 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Marketing Keynote Presentation
                      </p>
                    </div>
                  </td>
                  <td className="pl-24" />
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-gray-100 px-7 py-3 text-sm leading-none text-gray-700 focus:outline-none">
                      Due tomorrow
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100  px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          defaultChecked={false}
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Development Phase 1
                      </p>
                    </div>
                  </td>
                  <td className="pl-24" />
                  <td className="pl-5" />
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-red-300 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-red-300 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Marketing Keynote Presentation
                      </p>
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
                    </div>
                  </td>
                  <td className="pl-24">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-gray-100 px-7 py-3 text-sm leading-none text-gray-700 focus:outline-none">
                      Due tomorrow
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Marketing Keynote Presentation
                      </p>
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
                    </div>
                  </td>
                  <td className="pl-24" />
                  <td className="pl-5" />
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        CSS and functionality
                      </p>
                    </div>
                  </td>
                  <td className="pl-24">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-red-100 px-3 py-3 text-sm leading-none text-red-700 focus:outline-none">
                      Due Today at 18:00
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Marketing Keynote Presentation
                      </p>
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
                    </div>
                  </td>
                  <td className="pl-24" />
                  <td className="pl-5">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="h-3" />
                <tr
                  tabIndex={0}
                  className="h-16 rounded border border-gray-100 focus:outline-none"
                >
                  <td>
                    <div className="ml-5">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gray-200">
                        <input
                          placeholder="checkbox"
                          type="checkbox"
                          className="checkbox absolute h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                        />
                        <div className="check-icon hidden rounded-sm bg-indigo-700 text-white">
                          <svg
                            className="icon icon-tabler icon-tabler-check"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center pl-5">
                      <p className="mr-2 text-base font-medium leading-none text-gray-700">
                        Vue integration
                      </p>
                    </div>
                  </td>
                  <td className="pl-24">
                    <div className="flex items-center">
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
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        Urgent
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 10H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 15H16.6667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 5V5.00667"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10V10.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 15V15.0067"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33331 17.4998V6.6665C3.33331 6.00346 3.59671 5.36758 4.06555 4.89874C4.53439 4.4299 5.17027 4.1665 5.83331 4.1665H14.1666C14.8297 4.1665 15.4656 4.4299 15.9344 4.89874C16.4033 5.36758 16.6666 6.00346 16.6666 6.6665V11.6665C16.6666 12.3295 16.4033 12.9654 15.9344 13.4343C15.4656 13.9031 14.8297 14.1665 14.1666 14.1665H6.66665L3.33331 17.4998Z"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.1665V9.17484"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        23
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 5.83339L7.08333 11.2501C6.75181 11.5816 6.56556 12.0312 6.56556 12.5001C6.56556 12.9689 6.75181 13.4185 7.08333 13.7501C7.41485 14.0816 7.86449 14.2678 8.33333 14.2678C8.80217 14.2678 9.25181 14.0816 9.58333 13.7501L15 8.33339C15.663 7.67034 16.0355 6.77107 16.0355 5.83339C16.0355 4.8957 15.663 3.99643 15 3.33339C14.337 2.67034 13.4377 2.29785 12.5 2.29785C11.5623 2.29785 10.663 2.67034 10 3.33339L4.58333 8.75005C3.58877 9.74461 3.03003 11.0935 3.03003 12.5001C3.03003 13.9066 3.58877 15.2555 4.58333 16.2501C5.57789 17.2446 6.92681 17.8034 8.33333 17.8034C9.73985 17.8034 11.0888 17.2446 12.0833 16.2501L17.5 10.8334"
                          stroke="#52525B"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="ml-2 text-sm leading-none text-gray-600">
                        04/07
                      </p>
                    </div>
                  </td>
                  <td className="pl-5">
                    <button className="rounded bg-gray-100 px-3 py-3 text-sm leading-none text-gray-700 focus:outline-none hover:bg-gray-200">
                      Due Today at 18:00
                    </button>
                  </td>
                  <td className="pl-4">
                    <button className="rounded bg-gray-100 px-5 py-3 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:bg-gray-200">
                      View
                    </button>
                  </td>
                  <td>
                    <div className="relative px-5 pt-2">
                      <button
                        className="rounded-md focus:outline-none focus:ring-2"
                        role="button"
                        aria-label="option"
                      >
                        <svg
                          className="dropbtn"
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                            stroke="#9CA3AF"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="dropdown-content absolute right-0 z-30 mr-6 hidden w-24 bg-white shadow">
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Edit</p>
                        </div>
                        <div
                          tabIndex={0}
                          className="w-full cursor-pointer px-4 py-4 text-xs focus:text-indigo-600 focus:outline-none hover:bg-indigo-700 hover:text-white"
                        >
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: ".checkbox:checked + .check-icon {\n  display: flex;\n}\n",
        }}
      />
    </>
  );
}

const today = new Date();

const JournalPage = () => {
  const [date, setDate] = useState(today);

  const habits = api.journal.getHabits.useQuery({ date });
  const metrics = api.journal.getMetrics.useQuery({ date });
  if (habits.isLoading || metrics.isLoading) return <p>Loading...</p>;
  if (habits.isError || metrics.isError) return <p>Query error</p>;
  const habitsData = habits.data.habits.map((habit) => ({
    editable: true,
    ...habit,
  }));
  const metricsData = metrics.data.metrics; //query.data.subjectives.map((subjective) => ({ editable: true, ...subjective }));
  console.log(`Got subjectives ${JSON.stringify(metricsData)}`);
  return (
    <Journal
      habits={habitsData}
      date={date}
      setDate={setDate}
      metrics={metricsData}
    ></Journal>
  );
};

export default function Page() {
  return <Layout main={JournalPage}></Layout>;
}
