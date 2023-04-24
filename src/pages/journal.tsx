import { Button, Stack } from "@chakra-ui/react";


import classNames from "classnames";
import { useState } from "react";
import Layout from "../components/layout";
import { api } from "../utils/api";
import TimePicker from "../components/time-picker";
import type { Metric } from "@prisma/client";


import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// fixes zoomed in icons
import "@fortawesome/fontawesome-svg-core/styles.css";

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
      <Stack direction="row" spacing={4} align="center">
        <Button
          onClick={() => setScore(1)}
          colorScheme="teal"
          size="xs"
          variant={score == 1 ? "solid" : "outline"}
        >
          1
        </Button>
        <Button
          onClick={() => setScore(2)}
          colorScheme="teal"
          size="xs"
          variant={score == 2 ? "solid" : "outline"}
        >
          2
        </Button>
        <Button
          onClick={() => setScore(3)}
          colorScheme="teal"
          size="xs"
          variant={score == 3 ? "solid" : "outline"}
        >
          3
        </Button>
        <Button
          onClick={() => setScore(4)}
          colorScheme="teal"
          size="xs"
          variant={score == 4 ? "solid" : "outline"}
        >
          4
        </Button>
        <Button
          onClick={() => setScore(5)}
          colorScheme="teal"
          size="xs"
          variant={score == 5 ? "solid" : "outline"}
        >
          5
        </Button>
      </Stack>
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
          <FontAwesomeIcon className="mx-1" icon={faPlus}></FontAwesomeIcon>
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
    <div className="container m-auto w-[80%]">
      <TimePicker date={date} setDate={setDate}></TimePicker>
      <h1 className="m-auto mt-2 text-center text-xl font-bold">Journal</h1>
      <h2 className="font-semibold">Today{"'"}s Habits</h2>
      {habits.map((habit) => {
        console.log(
          `habit ${habit.id}, completed=${habit.completed.toString()}`
        );
        return (
          <Habit
            id={habit.id}
            date={date}
            key={habit.id}
            description={habit.description}
            metrics={habit.metrics}
            completed={habit.completed}
            editable={habit.editable}
            setCompletion={(completed) =>
              setHabitCompletion.mutate({
                date: date,
                habitId: habit.id,
                completed,
              })
            }
            edit={(description: string) =>
              editHabit.mutate({
                habitId: habit.id,
                description,
              })
            }
            deleteHabit={() =>
              deleteHabit.mutate({
                habitId: habit.id,
              })
            }
          ></Habit>
        );
      })}
      <InlineCreateHabit></InlineCreateHabit>
      <h2 className="pt-8 font-semibold">Today{"'"}s Questions</h2>

      {metrics.map((subjective) => (
        <Subjective
          id={subjective.id}
          key={subjective.id}
          prompt={subjective.prompt}
          score={subjective.score}
          setScore={(score: number) =>
            setScore.mutate({
              metricId: subjective.id,
              date: date,
              score: score,
            })
          }
        ></Subjective>
      ))}
      <InlineCreateSubjective></InlineCreateSubjective>
    </div>
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

export default function () {
  return <Layout main={JournalPage}></Layout>;
}
