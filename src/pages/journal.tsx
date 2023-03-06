import { Button, Stack } from "@chakra-ui/react";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faPencil,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import Layout from "../components/layout";
import { api } from "../utils/api";
const LeftChevron = () => <FontAwesomeIcon icon={faChevronLeft} />;
const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

const TimePicker = ({ date }: { date: Date }) => (
  <div
    id="time-selector"
    className="mt-3 flex h-10 w-full flex-col items-center"
  >
    <div id="selector-controls">
      <button className="bg-white bg-opacity-20 ">
        <LeftChevron></LeftChevron>
      </button>
      <span className="mx-4">{date.toDateString()}</span>
      <button className="bg-white bg-opacity-20">
        <RightChevron></RightChevron>
      </button>
    </div>
  </div>
);

interface HabitProps {
  id: string;
  description: string;
  completed: boolean;
  editable: boolean;
  setCompletion: (completed: boolean) => void;
}

const Habit = ({
  id,
  description,
  editable,
  completed,
  setCompletion,
}: HabitProps): JSX.Element => {
  return (
    <div className="my-2" key={id}>
      <input
        type="checkbox"
        aria-hidden="true"
        checked={completed}
        onChange={(event) => setCompletion(event.target.checked)}
        readOnly={!editable}
      />
      <span className={classNames({ "line-through": completed })}>
        {description}
      </span>
      <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSquareMinus}></FontAwesomeIcon>
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
    <div className="">
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

interface JournalProps {
  habits: {
    id: string;
    description: string;
    completed: boolean;
    editable: boolean;
  }[];
  date: Date;
  subjectives: {
    id: string;
    prompt: string;
    score: number | undefined;
  }[];
}

const InlineCreateHabit = () => {
  let [isActive, setActive] = useState<boolean>(false);
  let [text, setText] = useState<string>("");
  let context = api.useContext();
  let addHabit = api.journal.addHabit.useMutation({
    onSuccess() {
      context.journal.getHabits.invalidate();
    },
  });

  if (!isActive) {
    return (
      <div className="ring-1" onClick={() => setActive(true)}>
        <span>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          New habit
        </span>
      </div>
    );
  }
  return (
    <div className="ring-1">
      <input
        autoFocus
        type="text"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            console.log(text);
            addHabit.mutate(text);
            setActive(false);
          }
        }}
      ></input>
    </div>
  );
};

const InlineCreateSubjective = () => {
  let [isActive, setActive] = useState<boolean>(false);
  let [text, setText] = useState<string>("");
  let context = api.useContext();
  let addSubjective = api.journal.addSubjective.useMutation({
    onSuccess() {
      context.journal.getSubjectives.invalidate();
    },
  });

  if (!isActive) {
    return (
      <div className="ring-1" onClick={() => setActive(true)}>
        <span>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          New daily question
        </span>
      </div>
    );
  }
  return (
    <div className="ring-1">
      <input
        autoFocus
        type="text"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            console.log(text);
            addSubjective.mutate({ prompt: text });
            setActive(false);            
          } else if(event.key=="Escape") {
            setActive(false);
          }
        }}
      ></input>
    </div>
  );
};

function Journal({ date, habits, subjectives }: JournalProps) {
  let context = api.useContext();
  let setHabitCompletion = api.journal.setCompletion.useMutation({
    onSuccess() {
      context.journal.getHabits.invalidate();
    },
  });
  let setScore = api.journal.setSubjectiveScore.useMutation({
    onSuccess() {
      context.journal.getSubjectives.invalidate();
    },
  });

  return (
    <div className="container m-auto w-[80%]">
      <TimePicker date={date}></TimePicker>
      <h1 className="m-auto mt-2 text-center font-sans text-xl font-bold">
        Journal
      </h1>
      <h2 className="font-semibold">Today's Habits</h2>
      {habits.map((habit) => {
        console.log(`habit ${habit.id}, completed=${habit.completed}`);
        return (
          <Habit
            id={habit.id}
            key={habit.id}
            description={habit.description}
            completed={habit.completed}
            editable={habit.editable}
            setCompletion={(completed) =>
              setHabitCompletion.mutate({
                date: date,
                habitId: habit.id,
                completed,
              })
            }
          ></Habit>
        );
      })}
      <InlineCreateHabit></InlineCreateHabit>
      <h2 className="mt-4 font-semibold">Questions</h2>

      {subjectives.map((subjective) => (
        <Subjective
          id={subjective.id}
          key={subjective.id}
          prompt={subjective.prompt}
          score={subjective.score}
          setScore={(score: number) =>
            setScore.mutate({
              subjectiveId: subjective.id,
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

let date = new Date();

const JournalPage = () => {
  let query1 = api.journal.getHabits.useQuery({ date });
  let query2 = api.journal.getSubjectives.useQuery({ date });
  if (query1.isLoading || query2.isLoading) return <p>Loading...</p>;
  if (query1.isError || query2.isError) return <p>Query error</p>;
  let habitsData = query1.data.habits.map((habit) => ({
    editable: true,
    ...habit,
  }));
  let subjectivesData = query2.data.subjectives; //query.data.subjectives.map((subjective) => ({ editable: true, ...subjective }));
  console.log(`Got subjectives ${JSON.stringify(subjectivesData)}`);
  return (
    <Journal
      habits={habitsData}
      date={query1.data.date}
      subjectives={subjectivesData}
    ></Journal>
  );
};

export default () => <Layout main={JournalPage}></Layout>;
