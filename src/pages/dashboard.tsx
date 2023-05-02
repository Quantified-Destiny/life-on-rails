// import dynamic from "next/dynamic";
// import NoSsr from "../components/NoSsr";

import Layout from "../components/layout/layout";

import { ClockIcon } from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";

const StatisticsChart = dynamic(
  () => {
    return import("../components/StatisticsChart");
  },
  { ssr: false }
);

import { statisticsChartsData } from "../data";
import type { ExpandedHabit } from "../server/queries";
import { api } from "../utils/api";

function StatsCardRow() {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-10">
      <div className=" min-w-10 max-w-50 divide-y-black relative flex flex-1 flex-col divide-y-2 rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl ">Goals</div>
        <div className="flex w-full flex-row content-stretch justify-stretch divide-x-2 p-1 text-center">
          <span className="flex-1 rounded-sm bg-green-400 p-4 text-white">
            10
          </span>
          <span className="flex-1 rounded-sm bg-yellow-400 p-4 text-white">
            4
          </span>
          <span className="flex-1 rounded-sm bg-red-400 p-4 text-white">7</span>
        </div>
      </div>
      <div className="divide-y-black relative flex flex-1 flex-col divide-y-2 rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl ">Habits</div>
        <div className="flex w-full flex-row content-stretch justify-stretch divide-x-2 p-1 text-center">
          <span className="flex-1 rounded-sm bg-green-400 p-4 text-white">
            10
          </span>
          <span className="flex-1 rounded-sm bg-yellow-400 p-4 text-white">
            4
          </span>
          <span className="flex-1 rounded-sm bg-red-400 p-4 text-white">7</span>
        </div>
      </div>
      <div className="divide-y-black relative flex flex-1 flex-col divide-y-2 rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl ">Metrics</div>
        <div className="flex w-full flex-row content-stretch justify-stretch divide-x-2 p-1 text-center">
          <span className="flex-1 rounded-sm bg-green-400 p-4 text-white">
            10
          </span>
          <span className="flex-1 rounded-sm bg-yellow-400 p-4 text-white">
            4
          </span>
          <span className="flex-1 rounded-sm bg-red-400 p-4 text-white">7</span>
        </div>
      </div>
    </div>
  );
}

function HabitTableRow({
  description,
  frequency,
  frequencyHorizon,
  score,
  completions,
}: ExpandedHabit) {
  return (
    <tr>
      <td className="border-blue-gray-50 border-b px-5 py-3">
        <div className="flex items-center gap-4">
          <p className="text-blue-gray-900 block font-sans text-sm  leading-normal antialiased">
            {description}
          </p>
        </div>
      </td>
      <td className="border-blue-gray-50 border-b px-5 py-3">
        {frequency}x per {frequencyHorizon}
      </td>
      <td className="border-blue-gray-50 border-b px-5 py-3">
        <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">
          {completions}
        </p>
      </td>
      <td className="border-blue-gray-50 border-b px-5 py-3">
        <div className="w-10/12">
          <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">
            {(score * 100).toFixed(1)}
            {/* */}%
          </p>
          <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
            <div
              className="flex h-full items-baseline justify-center overflow-hidden break-all bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
              style={{
                width: `${score * 100}%`,
              }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

function HabitsTable() {
  const query = api.habits.getHabits.useQuery();
  if (query.isLoading) {
    return <div>Loading...</div>;
  } else if (query.error) {
    return <div>Error!</div>;
  }

  const habits = query.data;

  return (
    <div className="relative flex flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md xl:col-span-2">
      <div className="relative m-0 flex items-center justify-between overflow-hidden rounded-xl bg-transparent bg-clip-border p-6 text-gray-700 shadow-none">
        <div>
          <h6 className="text-blue-gray-900 mb-1 block font-sans text-base font-semibold leading-relaxed tracking-normal antialiased">
            Habits at risk
          </h6>
          <p className="text-blue-gray-600 flex items-center gap-1 font-sans text-sm font-normal leading-normal antialiased">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              aria-hidden="true"
              className="h-4 w-4 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <strong>30 archived</strong> this month
          </p>
        </div>
        <button
          aria-expanded="false"
          aria-haspopup="menu"
          id=":R15umH2:"
          className="text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currenColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="overflow-x-scroll p-6 px-0 pb-2 pt-0">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                  Habits
                </p>
              </th>
              <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                  Schedule
                </p>
              </th>
              <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                  Completions this period
                </p>
              </th>
              <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                  Score
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <HabitTableRow key={habit.id} {...habit}></HabitTableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <div className="">
      <div className="m-auto mx-20 h-full pt-10">
        <StatsCardRow></StatsCardRow>

        <HabitsTable></HabitsTable>

        {/* <div className="mb-6 mt-5 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {statisticsChartsData.map((props) => (
            <StatisticsChart
              key={props.title}
              {...props}
              footer={
                <p className="text-blue-gray-600 flex items-center font-sans text-sm font-normal leading-normal antialiased">
                  <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                  &nbsp;{props.footer}
                </p>
              }
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}

const DashboardPage = () => <Layout main={Home}></Layout>;

export default DashboardPage;
