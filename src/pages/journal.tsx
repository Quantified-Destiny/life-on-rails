import { Button, Stack } from "@chakra-ui/react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import TopNav from "../components/topnav";
import { api } from "../utils/api";
const LeftChevron = () => <FontAwesomeIcon icon={faChevronLeft} />;
const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

function SideBar() {
  return (
    <div className="h-full w-full ">
      <div className="inset-0 mx-auto mt-4 flex h-full w-[90%] flex-col items-stretch justify-start gap-2 align-middle">
        <div className="ml-1 text-left text-sm font-semibold">OVERVIEW</div>
        <div className="ml-4">Goals</div>
        <div className="ml-4 bg-gray-300">Journal</div>
        <hr className="border-1 w-full cursor-pointer border-gray-300" />
        <div className="ml-1 text-sm font-semibold">MANAGE</div>
        <div className="ml-3">
          <RightChevron></RightChevron> Create
        </div>
        <hr className="border-1 w-full cursor-pointer border-gray-300" />
        <div className="ml-1 text-sm font-semibold">REVIEW</div>
        <div className="ml-3">Timeline</div>
        <hr className="w-full cursor-pointer border-2 border-gray-300" />
      </div>
    </div>
  );
}

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

const Layout = ({ main }: { main: () => JSX.Element }) => {
  return (
    <div className="absolute inset-0 min-h-[100vh] min-w-[100vw]">
      <div className="relative z-50 grid h-full w-full grid-cols-[10em_1fr] grid-rows-[3em_1fr]">
        <div id="topbar" className="col-span-2 col-start-1 row-start-1">
          <TopNav></TopNav>
        </div>
        <div className="col-start-1 row-span-2 row-start-2 h-full w-full bg-gray-100 shadow-[2.0px_2.0px_2.0px_rgba(0,0,0,0.38)]">
          <SideBar></SideBar>
        </div>
        <div className="col-start-2 row-start-2 h-full w-full overflow-scroll ">
          {main()}
        </div>
      </div>
    </div>
  );
};

interface HabitProps {
  id: string;
  description: string;
  completed: boolean;
  editable: boolean;
}

const Habit = ({
  description,
  editable,
  completed,
}: HabitProps): JSX.Element => {
  return (
    <div className="my-2">
      <input
        type="checkbox"
        aria-hidden="true"
        checked={completed}
        readOnly={!editable}
      />
      <span className={classNames({ "line-through": completed })}>
        {description}
      </span>
    </div>
  );
};

interface SubjectiveProps {
  id: string;
  prompt: string;
  score: number | undefined;
}

const Subjective = ({ id, prompt, score }: SubjectiveProps) => {
  const utils = api.useContext();
  let setScore = api.journal.setSubjectiveScore.useMutation({
    onSuccess() {
      utils.journal.getSubjectives.invalidate();
    }
  });
  return (
    <div className="">
      <p>{prompt}</p>
      <Stack direction="row" spacing={4} align="center" >
        <Button onClick={() => setScore.mutate({ id, score: 1 })} colorScheme="teal" size='xs' variant={score==1?"solid": 'outline'}>
          1
        </Button>
        <Button colorScheme="teal" size='xs' variant='outline'>
          2
        </Button>
        <Button colorScheme="teal" size='xs' variant='outline'>
          3
        </Button>
        <Button colorScheme="teal" size='xs' variant='outline'>
          4
        </Button>
        <Button colorScheme="teal" size='xs' variant='outline'>
          5
        </Button>
      </Stack>
    </div>
  )
}

interface JournalProps {
  habits: HabitProps[];
  date: Date;
  subjectives: SubjectiveProps[];
}

const Journal = ({ date, habits, subjectives }: JournalProps) => {
  return (
    <div className="container m-auto w-[80%]">
      <TimePicker date={date}></TimePicker>
      <h1 className="m-auto mt-2 text-center font-sans text-xl font-bold">
        Journal
      </h1>
      <h2 className="font-semibold">Today's Habits</h2>

      {habits.map((habit, index) => (
        <Habit
          id={index.toString()}
          description={habit.description}
          completed={habit.completed}
          editable={habit.editable}
        ></Habit>
      ))}

      <h2 className="mt-4 font-semibold">Questions</h2>

      {subjectives.map((subjective, index) => (
        <Subjective
          id={subjective.id}
          prompt={subjective.prompt}
          score={subjective.score}
        ></Subjective>
      ))}

    </div>
  );
};

let date = new Date();

const JournalPage = () => {
  let query1 = api.journal.getHabits.useQuery({ date });
  let query2 = api.journal.getSubjectives.useQuery({ date });
  if (query1.isLoading || query2.isLoading) return <p>Loading...</p>;
  if (query1.isError || query2.isError) return <p>Query error</p>;
  let habitsData = query1.data.habits.map((habit) => ({ editable: true, ...habit }));
  let subjectivesData = query2.data.subjectives //query.data.subjectives.map((subjective) => ({ editable: true, ...subjective }));
  return (
    <Journal
      habits={habitsData}
      date={query1.data.date}
      subjectives={subjectivesData}
    ></Journal>
  );
};

export default () => <Layout main={JournalPage}></Layout>;
