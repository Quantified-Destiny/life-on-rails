/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateMenu } from "../components/createMenu";
import { ArchivedItems } from "../components/overview/archived-items";
import type { Filters } from "../components/overview/configure";
import {
  ConfigureOverview,
  filteredData,
} from "../components/overview/configure";
import { GoalCard } from "../components/overview/goals";
import { HabitCard } from "../components/overview/habits";
import { LinkedMetric } from "../components/overview/metrics";
import { Loader } from "../components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { api } from "../utils/api";
import {templates, TemplatesPage} from "../pages/templates";

function Header({
  filters,
  setFilters,
}: {
  filters: Filters | undefined;
  setFilters: (filters: Filters | undefined) => void;
}) {
  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <div>
          <h1 className="ml-2 text-xl font-semibold uppercase text-gray-800">
            Overview
          </h1>
        </div>
        <div className="flex">
          <CreateMenu></CreateMenu>
          <button className="rounded px-2 py-2 hover:bg-gray-200">
            <Popover>
              <PopoverTrigger asChild>
                <SlidersHorizontal className="fill-gray-500 stroke-gray-500" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ConfigureOverview
                  filters={filters}
                  setFilters={setFilters}
                ></ConfigureOverview>
              </PopoverContent>
            </Popover>
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
  const [filters, setFilters] = useState<Filters>();
  const goalsQuery = api.goals.getAllGoals.useQuery();
  const profileQuery = api.profile.getProfile.useQuery();
  if (goalsQuery.isLoading || profileQuery.isLoading) return <Loader></Loader>;
  if (goalsQuery.isError || profileQuery.isError) return <p>Query error</p>;

  const data = filteredData(goalsQuery.data, filters);
  const user = profileQuery.data;
  console.log(data);
  if (goalsQuery.data == undefined) {
    return (
      <TemplatesPage></TemplatesPage>
    );
  }

  return (
    <div className="container max-w-4xl">
      <div className="mb-10 scrollbar-none">
        <Header filters={filters} setFilters={setFilters}></Header>
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
      <div className="w-full">
        <ArchivedItems></ArchivedItems>
      </div>
    </div>
  );
}
export default OverviewPage;
