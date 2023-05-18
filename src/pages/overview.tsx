/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";
import { CreateMenu } from "../components/createMenu";
import { EllipsisIcon } from "../components/icons";
import {
  CreateGoalModal,
  CreateHabitModal,
  CreateMetricModal,
} from "../components/modals";
import { GoalCard } from "../components/overview/goals";
import { HabitCard } from "../components/overview/habits";
import { LinkedMetric } from "../components/overview/metrics";
import { State, useOverviewStore } from "../components/overviewState";
import { Loader } from "../components/ui/loader";
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
      <p className="mb-2 px-2 text-xs italic text-slate-500">
        All scores are based off the preference in your{" "}
        <Link href="/profile" className="underline">
          user settings
        </Link>
        .
      </p>
    </>
  );
}

function OverviewPage() {
  const store = useOverviewStore();
  const goalsQuery = api.goals.getAllGoals.useQuery();
  const profileQuery = api.profile.getProfile.useQuery();
  if (goalsQuery.isLoading || profileQuery.isLoading) return <Loader></Loader>;
  if (goalsQuery.isError || profileQuery.isError) return <p>Query error</p>;

  const data = goalsQuery.data;
  const user = profileQuery.data;
  return (
    <div className="container max-w-4xl">
      <div className="mb-10 scrollbar-none">
        {store.modal?.state === State.CreateGoal && (
          <CreateGoalModal></CreateGoalModal>
        )}
        {store.modal?.state === State.CreateHabit && (
          <CreateHabitModal></CreateHabitModal>
        )}
        {store.modal?.state === State.CreateMetric && (
          <CreateMetricModal></CreateMetricModal>
        )}
        <Header></Header>
        <div className="mx-auto mt-3 grid grid-cols-2 items-center gap-2 p-6 ">
          {data.goals.map((goal) => (
            <GoalCard
              {...goal.goal}
              habits={goal.habits}
              metrics={goal.metrics}
              key={goal.goal.id}
              scoringUnit={user.scoringUnit}
            ></GoalCard>
          ))}
          {/* Habit Card with Progress Bar */}
          <h1 className="under col-span-full my-10 ml-2 text-lg font-semibold uppercase text-slate-600">
            Unlinked Items
            <hr />
          </h1>
          {data.habits.map((habit) => (
            <HabitCard
              {...habit}
              weight={0.5}
              key={habit.id}
              scoringUnit={user.scoringUnit}
            ></HabitCard>
          ))}
          {data.metrics.map((metric) => {
            return (
              <LinkedMetric
                {...metric}
                weight={0.5}
                key={metric.id}
                offset={0}
                scoringUnit={user.scoringUnit}
              ></LinkedMetric>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default OverviewPage;
