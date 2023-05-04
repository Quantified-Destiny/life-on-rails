import { useState } from "react";
import Layout from "../components/layout";
import TimePicker from "../components/time-picker";

import { TbSquareRoundedLetterG, TbSquareRoundedLetterH, TbSquareRoundedLetterM} from 'react-icons/tb';
import { RiCalendarCheckLine } from 'react-icons/ri';
import { differenceInCalendarDays, startOfYear } from "date-fns";
import type { TileArgs } from "react-calendar/dist/cjs/shared/types";
function isSameDay(a: Date, b: Date) {
  return differenceInCalendarDays(a, b) === 0;
}
import type { Metric } from "@prisma/client";
import classNames from "classnames";

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
    <div className="container flex justify-center max-w-5xl">

    
  <div className="sm:px-6 w-full">
    <div className="px-4 md:px-10 py-4 md:py-7">
      <div className="flex items-center justify-between">
        <p
          tabIndex={0}
          className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800"
        >
          Daily Journal
        </p>
        <div className="py-2 px-2 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
          <p>Sort By:</p>
          <select
            aria-label="select"
            className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
          >
            <option className="text-sm text-indigo-800">Urgency</option>
            <option className="text-sm text-indigo-800">Oldest</option>
            <option className="text-sm text-indigo-800">Newest</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <TimePicker date={date} setDate={setDate}></TimePicker>
      </div>
    </div>
    <div className="bg-white py-3 md:py-4 px-4 md:px-6 xl:px-10">
      <div className="sm:flex items-center justify-between">
        <div className="flex items-center">
          <a
            className="rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800"
            href=" javascript:void(0)"
          >
            <div className="py-2 px-4 bg-indigo-100 text-indigo-700 rounded-full">
              <p>All</p>
            </div>
          </a>
          <a
            className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            href="javascript:void(0)"
          >
            <div className="py-2 px-4 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full ">
              <p>Completed</p>
            </div>
          </a>
          <a
            className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            href="javascript:void(0)"
          >
            <div className="py-2 px-4 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full ">
              <p>Pending</p>
            </div>
          </a>
        </div>
        <button
          onClick="popuphandler(true)"
          className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
        >
          <p className="text-sm font-medium leading-none text-white">
            Add New
          </p>
        </button>
      </div>
      <div className="mt-7 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs justify-between">
              <th></th>
              <th>Type</th>
              <th>Name</th>
              <th></th>
              <th>Last</th>
              <th>Done</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              tabIndex={0}
              className="focus:outline-none h-12 border border-gray-100 rounded"
            >
              <td>
                <div className="ml-5">
                  <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                    <input
                      placeholder="checkbox"
                      type="checkbox"
                      className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                    />
                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
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
              <td className="pl-2">
                <div className="flex items-center">  
                  <TbSquareRoundedLetterH className="text-blue-500 text-xl"></TbSquareRoundedLetterH>
                </div>
              </td>
              <td className="">
                <div className="flex items-center pl-2">
                
                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                    Go Jogging for an hour
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
              
              <td className="pl-2">
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
                  
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <RiCalendarCheckLine></RiCalendarCheckLine>
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    05/01
                  </p>
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    1/3
                  </p>
                </div>
              </td>
              <td className="pl-5">
                <button className="focus:ring-2 focus:ring-offset-2 focus:ring-red-300 text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none">
                  View
                </button>
              </td>
              <td>
                <div className="relative px-5 pt-2">
                  <button
                    className="focus:ring-2 rounded-md focus:outline-none"
                    onClick="dropdownFunction(this)"
                    role="button"
                    aria-label="option"
                  >
                    <svg
                      className="dropbtn"
                      onClick="dropdownFunction(this)"
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
                  <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Edit</p>
                    </div>
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Delete</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              tabIndex={0}
              className="focus:outline-none h-12 border border-gray-100 rounded"
            >
              <td>
                <div className="ml-5">
                  <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                    <input
                      placeholder="checkbox"
                      type="checkbox"
                      className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                    />
                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
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
              <td className="pl-2">
                <div className="flex items-center">  
                  <TbSquareRoundedLetterH className="text-blue-500 text-xl"></TbSquareRoundedLetterH>
                </div>
              </td>
              <td className="">
                <div className="flex items-center pl-2">
                
                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                    Go gym for 30 minutes
                  </p>
                  
                </div>
              </td>
              
              <td className="pl-2">
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
                  
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <RiCalendarCheckLine></RiCalendarCheckLine>
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    05/01
                  </p>
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    0/1
                  </p>
                </div>
              </td>
              <td className="pl-5">
                <button className="focus:ring-2 focus:ring-offset-2 focus:ring-red-300 text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none">
                  View
                </button>
              </td>
              <td>
                <div className="relative px-5 pt-2">
                  <button
                    className="focus:ring-2 rounded-md focus:outline-none"
                    onClick="dropdownFunction(this)"
                    role="button"
                    aria-label="option"
                  >
                    <svg
                      className="dropbtn"
                      onClick="dropdownFunction(this)"
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
                  <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Edit</p>
                    </div>
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Delete</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              tabIndex={0}
              className="focus:outline-none h-12 border border-gray-100 rounded"
            >
              <td>
                <div className="ml-5">
                  <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                    <input
                      placeholder="checkbox"
                      type="checkbox"
                      className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                    />
                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
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
              <td className="pl-2">
                <div className="flex items-center">  
                  <TbSquareRoundedLetterM className="text-purple-500 text-xl"></TbSquareRoundedLetterM>
                </div>
              </td>
              <td className="">
                <div className="flex items-center pl-2">
                
                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                    How was your day?
                  </p>
                </div>
              </td>
              
              <td className="pl-2">
                <div className="flex items-center">
                
                  
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <RiCalendarCheckLine></RiCalendarCheckLine>
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    05/02
                  </p>
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    0/1
                  </p>
                </div>
              </td>
              <td className="pl-5">
                <button className="focus:ring-2 focus:ring-offset-2 focus:ring-red-300 text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none">
                  View
                </button>
              </td>
              <td>
                <div className="relative px-5 pt-2">
                  <button
                    className="focus:ring-2 rounded-md focus:outline-none"
                    onClick="dropdownFunction(this)"
                    role="button"
                    aria-label="option"
                  >
                    <svg
                      className="dropbtn"
                      onClick="dropdownFunction(this)"
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
                  <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Edit</p>
                    </div>
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Delete</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr
              tabIndex={0}
              className="focus:outline-none h-12 border border-gray-100 rounded"
            >
              <td>
                <div className="ml-5">
                  <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                    <input
                      placeholder="checkbox"
                      type="checkbox"
                      className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                    />
                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
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
              <td className="pl-2">
                <div className="flex items-center">  
                  <TbSquareRoundedLetterM className="text-purple-500 text-xl"></TbSquareRoundedLetterM>
                </div>
              </td>
              <td className="">
                <div className="flex items-center pl-2">
                
                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                    How was your day?
                  </p>
                </div>
              </td>
              
              <td className="pl-2">
                <div className="flex items-center">
                
                  
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <RiCalendarCheckLine></RiCalendarCheckLine>
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    05/02
                  </p>
                </div>
              </td>
              <td className="pl-2">
                <div className="flex items-center">
                  <p className="text-sm leading-none text-gray-600 ml-2">
                    0/1
                  </p>
                </div>
              </td>
              <td className="pl-5">
                <button className="focus:ring-2 focus:ring-offset-2 focus:ring-red-300 text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none">
                  View
                </button>
              </td>
              <td>
                <div className="relative px-5 pt-2">
                  <button
                    className="focus:ring-2 rounded-md focus:outline-none"
                    onClick="dropdownFunction(this)"
                    role="button"
                    aria-label="option"
                  >
                    <svg
                      className="dropbtn"
                      onClick="dropdownFunction(this)"
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
                  <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                    >
                      <p>Edit</p>
                    </div>
                    <div
                      tabIndex={0}
                      className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
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
      __html: ".checkbox:checked + .check-icon {\n  display: flex;\n}\n"
    }}
  />
  </div>
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