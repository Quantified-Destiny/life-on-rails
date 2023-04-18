import classNames from "classnames";
import { type NextPage } from "next";
import Layout from "../components/layout";
import { api } from "../utils/api";

const textcolor = (score: number) => {
  return score < 0.25
    ? "text-red-300"
    : score < 0.7
    ? "text-yellow-400"
    : "text-green-200";
};

const displayPercent = (percent: number) => (
  <span
    className={classNames(
      "text-md rounded-md bg-slate-50 p-1 font-semibold",
      textcolor(percent)
    )}
  >{`${percent.toFixed(2)}`}</span>
);

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
        <li className="py-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Habit
            </span>
            <span className="text-md font-medium text-gray-500">
              {displayPercent(habit.score)}
            </span>
          </div>
          <div className="mt-2">
            <div className="text-lg font-semibold text-gray-900">
              {habit.name}
            </div>
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
              {displayPercent(subjective.score)}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {subjective.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface Habit {
  name: string;
  score: number;
}
interface Subjective {
  name: string;
  score: number;
}

interface Goal {
  name: string;
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
      <div className="px-2 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Pill text={"Goal"}></Pill>
          {displayPercent(goal.score)}
        </div>
        <div className="text-lg font-semibold text-gray-900">{goal.name}</div>
      </div>
      {subjectives.length == 0 && habits.length == 0 ? undefined : (
        <div className="divide-y bg-gray-50 px-4 py-2 sm:px-6">
          <NestedItems habits={habits} subjectives={subjectives}></NestedItems>
        </div>
      )}
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
          <span className="text-md rounded-md bg-slate-100 p-1 font-medium text-gray-500">
            {displayPercent(habit.score)}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">
            {habit.name}
          </div>
        </div>
      </div>
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
          <span className="text-md rounded-md bg-slate-100  p-1 font-medium text-gray-500">
            {displayPercent(subjective.score)}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">
            {subjective.name}
          </div>
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
    <div className="text-md mx-auto max-w-4xl py-6 px-4 sm:px-6 md:px-7 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
        {goals.map((goal) => (
          <GoalCard
            goal={goal.goal}
            habits={goal.habits}
            subjectives={goal.subjectives}
          ></GoalCard>
        ))}
        <h1 className="font-semibold text-gray-900 my-2">Uncategorized</h1>
        {habits.map((habit) => (
          <HabitCard name={habit.name} score={habit.score}></HabitCard>
        ))}
        {subjectives.map((subjective) => (
          <SubjectiveCard
            name={subjective.name}
            score={subjective.score}
          ></SubjectiveCard>
        ))}
      </div>
    </div>
  );
}

let today = new Date();

function OverviewPage() {
  let goalsQuery = api.goals.getGoals.useQuery({ date: today });
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;

  let data = goalsQuery.data;
  console.log(data);

  let goals = data.goals.map((item) => ({
    goal: {
      name: item.goal.name,
      score: item.goal.score,
    },
    habits: item.habits.map((habit) => ({
      name: habit.name,
      score: habit.score,
    })),
    subjectives: item.subjectives.map((subjective) => ({
      name: subjective.name,
      score: subjective.score,
    })),
  }));

  return (
    <Overview
      goals={goals}
      habits={data.habits}
      subjectives={data.subjectives}
    ></Overview>
  );
}

const Page: NextPage = () => {
  return <Layout main={OverviewPage}></Layout>;
};

export default Page;
