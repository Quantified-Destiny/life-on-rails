// import dynamic from "next/dynamic";
import { RxRocket } from "react-icons/rx";
import Layout from "../components/layout";

import type { ExpandedHabit } from "../server/queries";
import { api } from "../utils/api";

function StatsCardRow() {
  const goalsQuery = api.goals.getAllGoals.useQuery();
  const metricsQuery = api.goals.getAllMetrics.useQuery();
  if (goalsQuery.isLoading || metricsQuery.isLoading) return <p>Loading dashboard...</p>;
  if (goalsQuery.isError || metricsQuery.isError) return <p>Query error</p>;
  const goalData = goalsQuery.data;
  const metricData = metricsQuery.data;

  let redGoal = 0;
  let yellowGoal = 0;
  let greenGoal = 0;

  for (let i = 0; i < goalData.goals.length; i++) {
    const g = goalData.goals[i];
    //console.log(`goal ${g?.goal.name} - ${g?.goal.score}`)
    if ((g?.goal?.score ?? 0) < 0.4 || isNaN(g?.goal?.score ?? 0)) {
      redGoal += 1;
    } else if ((g?.goal?.score ?? 0) < 0.7) {
      yellowGoal += 1;
    } else {
      greenGoal += 1;
    }
  }

  let redHabit = 0;
  let yellowHabit = 0;
  let greenHabit = 0;

  for (let i = 0; i < goalData.goals.length; i++) {
    //habit that links to a goal
    for (let j = 0; j < (goalData.goals[i]?.habits?.length ?? 0); j++) {
      const h = goalData.goals[i]?.habits[j];
      if ((h?.score ?? 0) < 0.4) {
        redHabit += 1;
      } else if ((h?.score ?? 0) < 0.7) {
        yellowHabit += 1;
      } else {
        greenHabit += 1;
      }
    }
  }
  for (let i = 0; i < goalData.habits.length; i++) {
    //standalone habit
    const h = goalData.habits[i];
    if ((h?.score ?? 0) < 0.4) {
      redHabit += 1;
    } else if ((h?.score ?? 0) < 0.7) {
      yellowHabit += 1;
    } else {
      greenHabit += 1;
    }
  }

  let redMetric = 0;
  let yellowMetric = 0;
  let greenMetric = 0;
  const metric = metricData.metrics;

  for (let i = 0; i < metric.length; i++) {
    //all metrics
    if ((metric[i]?.score ?? 0) < 0.4) {
      redMetric += 1;
    } else if ((metric[i]?.score ?? 0) < 0.7) {
      yellowMetric += 1;
    } else {
      greenMetric += 1;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-2 max-w-screen-lg ">

    
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className=" relative flex flex-1 flex-col  rounded-xl  text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl text-white bg-indigo-800 rounded-t-xl">Goals</div>
        <div className="flex w-full flex-row content-stretch justify-stretch p-1 text-center  border-indigo-800 border-2 rounded-b-xl">
          <span className="flex-1 m-1 rounded-sm bg-green-500 p-4 text-white font-semibold">
            {greenGoal}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-yellow-500 p-4 text-white font-semibold">
            {yellowGoal}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-red-500 p-4 text-white font-semibold">
            {redGoal}
          </span>
        </div>
      </div>
      
      <div className=" relative flex flex-1 flex-col  rounded-xl  text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl text-white bg-indigo-800 rounded-t-xl">Habits</div>
        <div className="flex w-full flex-row content-stretch justify-stretch p-1 text-center  border-indigo-800 border-2 rounded-b-xl">
          <span className="flex-1 m-1 rounded-sm bg-green-500 p-4 text-white font-semibold">
            {greenHabit}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-yellow-500 p-4 text-white font-semibold">
            {yellowHabit}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-red-500 p-4 text-white font-semibold">
            {redHabit}
          </span>
        </div>
      </div>
      <div className=" relative flex flex-1 flex-col  rounded-xl  text-gray-700 shadow-md">
        <div className="p-4 text-center text-2xl text-white bg-indigo-800 rounded-t-xl">Metrics</div>
        <div className="flex w-full flex-row content-stretch justify-stretch p-1 text-center  border-indigo-800 border-2 rounded-b-xl">
          <span className="flex-1 m-1 rounded-sm bg-green-500 p-4 text-white font-semibold">
            {greenMetric}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-yellow-500 p-4 text-white font-semibold">
            {yellowMetric}
          </span>
          <span className="flex-1 m-1 rounded-sm bg-red-500 p-4 text-white font-semibold">
            {redMetric}
          </span>
        </div>
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
  metrics
}: ExpandedHabit) {
  return (
    <tr>
      <td className="border-blue-gray-50  px-5 py-3">
        <div className="flex items-center gap-4">
          <p className="text-blue-gray-900 block text-sm leading-normal antialiased">
            {description}
          </p>
        </div>
      </td>
      <td className="border-blue-gray-50 px-5 py-3">
        <div className="w-10/12">
          <p className="text-blue-gray-600  mb-1 block font-sans text-xs text-center font-medium antialiased">
            {(score * 100).toFixed(1)}
            {/* */}%
          </p>
          <div className="flex-start bg-blue-gray-50 bg-gray-200 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
            <div
              className="flex h-full items-baseline justify-center overflow-hidden break-all bg-gradient-to-tr from-red-600 to-red-400 text-white"
              style={{
                width: `${score * 100}%`,
              }}
            />
          </div>
        </div>
      </td>
      <td className="border-blue-gray-50 font-sans text-sm px-1 py-3 text-center">
        <p className="text-blue-gray-900 block text-xs leading-normal antialiased">
        {metrics.length}
        </p>
      </td>
      <td className="border-blue-gray-50 font-sans text-sm  px-1 py-3">
        <p className="text-blue-gray-900 block text-xs text-center leading-normal antialiased">
          {frequency}x per {frequencyHorizon.toLowerCase()}
        </p>
      </td>
      <td className="border-blue-gray-50 font-sans text-sm px-1 py-3 text-center">
        <p className="text-blue-gray-900 block text-xs leading-normal antialiased">
        {completions}
        </p>
      </td>
    </tr>
  );
};

function HabitsTable() {
  const query = api.habits.getHabits.useQuery();

  // api.habits.getHabits.useQuery();

  if (query.isLoading) {
    return <div className="h-screen flex items-center justify-center">
    <RxRocket className="text-2xl animate-spin"></RxRocket>
  </div>;
  } else if (query.error) {
    return <div>Error!</div>;
  }
  const habits = query.data;

  return (
    <div className="container mx-auto px-4 py-2 max-w-screen-lg ">
      <div className="relative flex flex-col overflow-auto rounded-xl bg-white border border-indigo-800 bg-clip-border text-gray-700 shadow-lg xl:col-span-2">
        <div className="relative m-0 flex items-center justify-between overflow-hidden p-6 text-gray-700 shadow-none border-b-2 bg-indigo-800">
          <div>
            <h6 className="text-white text-xl mb-1 block font-sans font-semibold leading-relaxed tracking-normal antialiased">
              Habits at Risk
            </h6>
          </div>
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
                <th className="border-blue-gray-50 border-b px-6 py-3 text-center">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Score
                  </p>
                </th>
                <th className="border-blue-gray-50 border-b px-1 py-3 text-center">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Metrics
                  </p>
                </th>
                <th className="border-blue-gray-50 border-b px-6 py-3 text-center">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Schedule
                  </p>
                </th>
                <th className="border-blue-gray-50 border-b px-1 py-3 text-center">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Completions
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                if (habit.score < 0.5) return (
                  <HabitTableRow key={habit.id} {...habit}></HabitTableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export function Home() {
  return (
    <div className="">
      <div className="m-auto h-full max-w-3xl pt-2">
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
