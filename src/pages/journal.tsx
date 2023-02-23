import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import TopNav from "../components/topnav";

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
        <div className="col-start-1 row-span-2 row-start-2 h-full w-full bg-gray-100 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
          <SideBar></SideBar>
        </div>
        <div className="col-start-2 row-start-2 h-full w-full overflow-scroll ">
          {main()}
        </div>
      </div>
    </div>
  );
};

interface HabitData {
  desciption: string;
  completed: boolean;
}

interface JournalData {
  habits: HabitData[];
  editable: boolean;
  date: Date;
}

let state: JournalData = {
  habits: [
    {
      desciption: "Go to the gym",
      completed: false,
    },
    {
      desciption: "Check the task tracker",
      completed: false,
    },
    {
      desciption: "Clean the room",
      completed: true,
    },
  ],
  editable: false,
  date: new Date(),
};

function Habit({
  habit,
  index,
}: {
  habit: HabitData;
  index: number;
}): JSX.Element {
  return (
    <div className="my-2">
      <input
        id={index.toString()}
        type="checkbox"
        aria-hidden="true"
        checked={habit.completed}
        readOnly={!state.editable}
      />
      <label
        htmlFor={index.toString()}
        className={classNames({ "line-through": habit.completed })}
      >
        {habit.desciption}
      </label>
    </div>
  );
}

const Journal = () => {
  return (
    <div className="container m-auto w-[80%]">
      <TimePicker date={state.date}></TimePicker>
      <h1 className="m-auto mt-2 text-center font-sans text-xl font-bold">
        Journal
      </h1>
      <h2 className="font-semibold">Today's Habits</h2>
      {state.habits.map((habit, index) => (
        <Habit habit={habit} index={index}></Habit>
      ))}
      <h2 className="mt-4 font-semibold">Questions</h2>
      <div className="">
        <p>How organized do you feel? </p>
        <div className="mt-1 flex flex-row gap-4">
          <div className="w-5 bg-white text-center shadow-sm ring-2">1</div>
          <div className="w-5 bg-gray-300 text-center shadow-sm ring-2">2</div>
          <div className="w-5 bg-white text-center shadow-sm ring-2">3</div>
          <div className="w-5 bg-white text-center shadow-sm ring-2">4</div>
          <div className="w-5 bg-white text-center shadow-sm ring-2">5</div>
        </div>
      </div>
    </div>
  );
};

export default () => <Layout main={Journal}></Layout>;
