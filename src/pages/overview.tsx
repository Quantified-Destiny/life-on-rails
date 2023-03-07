import { type NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout";
import { api } from "../utils/api";

interface PillProps {
  text: string;
}

function Pill({ text }: PillProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      {text}
    </span>
  );
}

interface NestedItemsProps {
  habits: Habit[];
  subjectives: Subjective[];
}

function NestedItems({ habits, subjectives }: NestedItemsProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {habits.map((habit) => (
        <li className="py-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Habit
            </span>
            <span className="text-md font-medium text-gray-500">
              {habit.score * 100 + "%"}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {habit.name}
            </div>
            <div className="mt-2 text-gray-600">{habit.description}</div>
          </div>
        </li>
      ))}

      {subjectives.map((subjective) => (
        <li className="py-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              Subjective
            </span>
            <span className="text-md font-medium text-gray-500">
              {subjective.score * 100 + "%"}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {subjective.name}
            </div>
            <div className="mt-2 text-gray-600">{subjective.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface Habit {
  name: string;
  description: string;
  score: number;
}
interface Subjective {
  name: string;
  description: string;
  score: number;
}

interface Goal {
  name: string;
  description: string;
  score: number;
}
interface GoalCardProps {
  goal: Goal;
  habits: Habit[];
  subjectives: Subjective[];
}

function GoalCard({ goal, habits, subjectives }: GoalCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Pill text={"Goal"}></Pill>
          <span className="text-md font-medium text-gray-500  bg-slate-100 p-1 rounded-md">
            {goal.score * 100 + "%"}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Get Fit</div>
          <div className="mt-2 text-gray-600">{goal.description}</div>
        </div>
      </div>
      {subjectives.length == 0 && habits.length == 0 ? undefined : (
        <div className="divide-y bg-gray-50 px-4 py-4 sm:px-6">
          <NestedItems habits={habits} subjectives={subjectives}></NestedItems>
        </div>
      )}
    </div>
  );
}

function SubjectiveCard(subjective: Subjective) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            Subjective
          </span>
          <span className="text-md font-medium text-gray-500  bg-slate-100 p-1 rounded-md">
            {subjective.score * 100 + "%"}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">
            {subjective.name}
          </div>
          <div className="mt-2 text-gray-600">{subjective.description}</div>
        </div>
      </div>
    </div>
  );
}
function HabitCard(habit: Habit) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Habit
          </span>
          <span className="text-md font-medium text-gray-500 bg-slate-100 p-1 rounded-md">
            {habit.score * 100 + "%"}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">
            {habit.name}
          </div>
          <div className="mt-2 text-gray-600">{habit.description}</div>
        </div>
      </div>
    </div>
  );
}

interface OverviewProps {
  goals: { goal: Goal; habits: Habit[]; subjectives: Subjective[] }[];
  habits: Habit[];
  subjectives: Subjective[];
}

function Overview({ goals, habits, subjectives }: OverviewProps) {
  return (
    <div className="mx-auto max-w-5xl py-6 px-4 text-md sm:px-6 md:px-7 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
        {goals.map((goal) => (
          <GoalCard
            goal={goal.goal}
            habits={goal.habits}
            subjectives={goal.subjectives}
          ></GoalCard>
        ))}
        {habits.map((habit) => (
          <HabitCard
            name={habit.name}
            description={habit.description}
            score={habit.score}
          ></HabitCard>
        ))}
        {subjectives.map((subjective) => (
          <SubjectiveCard
            name={subjective.name}
            description={subjective.description}
            score={subjective.score}
          ></SubjectiveCard>
        ))}
      </div>
    </div>
  );
}

let habits: Habit[] = [
  {
    name: "Eat an apple a day",
    description: "An apple a day keeps the doctor away.",
    score: 0.6,
  },
];
let subjectives: Subjective[] = [
  {
    name: "How was my today?",
    description: "I want to track my overall rating of my day.",
    score: 0.1,
  },
  {
    name: "How organize do I feel today?",
    description: "I want to track of how organized I feel.",
    score: 0.1,
  },
];

let goal: Goal = {
  name: "Run 5 miles a day",
  description:
    "I want to get in shape and be able to run a 5K by the end of the year.",
  score: 0.6,
};

let goals = [
  {
    goal,
    habits,
    subjectives,
  },
];

let today = new Date();

function OverviewPage() {
  //api.journal.getHabits.useQuery({ date: today });
  //api.journal.getSubjectives.useQuery({ date: today });
  let goalsQuery = api.goals.getGoals.useQuery({ date: today });
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;
  console.log(goalsQuery.data);
  let goals = goalsQuery.data.map((g) => ({
    goal: { name: g.name, description: "", score: 0.0 },
    habits: g.habits.map((it) => ({
      name: it.habit.description,
      description: it.habit.description,
      score: 0.0,
    })),
    subjectives: g.subjectives.map((it) => ({
      name: it.subjective.prompt,
      description: "kamslkd",
      score: 0.0,
    })),
  }));

  return (
    <Overview
      goals={goals}
      habits={habits}
      subjectives={subjectives}
    ></Overview>
  );
}

const Page: NextPage = () => {
  return <Layout main={OverviewPage}></Layout>;
};

export default Page;
