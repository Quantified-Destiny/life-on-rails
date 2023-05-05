import Layout from "../components/layout";

import type { ExpandedHabit } from "../server/queries";
import { api } from "../utils/api";

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
            <p className="text-blue-gray-900 block text-sm leading-normal antialiased">
              {description}
            </p>
          </div>
        </td>
        <td className="border-blue-gray-50 text-sm border-b px-5 py-3">
          {frequency}x per {frequencyHorizon.toLowerCase()}
        </td>
        <td className="border-blue-gray-50 border-b px-5 py-3">
          <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">
            {completions}
          </p>
        </td>
        <td className="border-blue-gray-50 border-b px-5 py-3">
          <div className="w-10/12">
            <p className="text-blue-gray-600  mb-1 block font-sans text-xs font-medium antialiased">
              {(score * 100).toFixed(1)}
              {/* */}%
            </p>
            <div className="flex-start bg-blue-gray-50 bg-gray-200 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
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
  };

  
  function HabitsTable() {
    const query = api.habits.getHabits.useQuery();
    if (query.isLoading) {
      return <div>Loading...</div>;
    } else if (query.error) {
      return <div>Error!</div>;
    }
  
    const habits = query.data;
  
    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <div className="relative flex flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg xl:col-span-2">
        <div className="relative m-0 flex items-center justify-between overflow-hidden p-6 text-gray-700 shadow-none border-b-2">
          <div>
            <h6 className="text-blue-gray-900 mb-1 block font-sans text-base font-semibold leading-relaxed tracking-normal antialiased">
              All habits
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
                <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Schedule
                  </p>
                </th>
                <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                  <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                    Completions
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
      </div>
    );
  };

const HabitsPage = () => {
    return (<>
        <HabitsTable></HabitsTable>
    </>);
    };

export default function Page() {
    return <Layout main={HabitsPage}></Layout>;
  }
  