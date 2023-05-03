/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { CreateMenu } from "../components/createMenu";
import { EllipsisIcon } from "../components/icons";
import Layout from "../components/layout";
import {
  CreateGoalModal,
  CreateHabitModal,
  CreateMetricModal,
} from "../components/modals";
import { GoalCard } from "../components/overview/goals";
import { HabitPanel } from "../components/overview/habit-panel";
import { HabitCard } from "../components/overview/habits";
import { LinkedMetric } from "../components/overview/metrics";
import { State, useOverviewStore } from "../components/overviewState";
import { api } from "../utils/api";

function Header() {
  return (
    <>
    <div className="mb-2 flex w-full items-center justify-between">
      <div>
        <h1 className="ml-2 text-xl font-semibold uppercase text-gray-800">
          Overview
        </h1>
      </div>
      <div className="flex">
        <button className="rounded px-2 py-2 text-gray-500 hover:bg-gray-200">
          Filter
        </button>
        <button className="rounded px-2 py-2 text-gray-500 hover:bg-gray-200">
          Sort
        </button>
        <button className="rounded px-2 py-2 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="h-6 w-6 stroke-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        <CreateMenu></CreateMenu>
        <button className="rounded stroke-gray-500 px-2 py-2 hover:bg-gray-200">
          <EllipsisIcon></EllipsisIcon>
        </button>
      </div>
    </div>
    <p className="px-2 mb-2 text-xs text-slate-500 italic">All scores are based off the last 2 weeks based on your <a href="/profile" className="underline">user settings</a>.</p>
    
    </>
  );
}

function OverviewPage() {
  const store = useOverviewStore();
  const goalsQuery = api.goals.getAllGoals.useQuery();
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;

  const data = goalsQuery.data;
  return (
    <div className="scrollbar-none">
      {store.modal?.state === State.CreateGoal && (
        <CreateGoalModal></CreateGoalModal>
      )}
      {store.modal?.state === State.HabitPanel && <HabitPanel></HabitPanel>}
      {store.modal?.state === State.CreateHabit && (
        <CreateHabitModal></CreateHabitModal>
      )}
      {store.modal?.state === State.CreateMetric && (
        <CreateMetricModal></CreateMetricModal>
      )}
      <div className="mx-auto mb-10 px-10 py-2 scrollbar-none">
        <Header></Header>
        {data.goals.map((goal) => (
          <GoalCard
            {...goal.goal}
            habits={goal.habits}
            metrics={goal.metrics}
            key={goal.goal.id}
          ></GoalCard>
        ))}
        {/* Habit Card with Progress Bar */}
        <h1 className="mb-4 ml-2 text-lg font-semibold uppercase text-slate-600">
          Unlinked Items
        </h1>
        <div className="space-y-2">
          {data.habits.map((habit) => (
            <HabitCard {...habit} weight={0.5} key={habit.id}></HabitCard>
          ))}
          {data.metrics.map((metric) => {
            return (
              <LinkedMetric
                {...metric}
                weight={0.5}
                key={metric.id}
              ></LinkedMetric>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Page() {
  return <Layout main={OverviewPage}></Layout>;
}

export default Page;
