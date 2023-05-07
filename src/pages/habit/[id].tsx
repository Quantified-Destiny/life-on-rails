import { useState } from "react";
import Layout from "../../components/layout";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';

import dynamic from "next/dynamic";

import React from "react";
import { MdArrowUpward, MdScoreboard } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { AiFillFire, AiOutlineFire, AiTwotoneFire } from "react-icons/ai";
// import HeatMap from '@uiw/react-heat-map';
//Next.js error Global CSS cannot be imported from within node_modules

import "@uiw/react-heat-map/esm/style/index.css";
import "@uiw/react-heat-map/dist.css";

// import '@uiw/react-tooltip/esm/style/index.css';
// import '@uiw/react-tooltip/dist.css';

const HeatMap = dynamic(() => import("@uiw/react-heat-map"), { ssr: false });

// const Tooltip = dynamic(
//   () => import("@uiw/react-tooltip"),
//   { ssr: false }
// );

import { addDays, differenceInCalendarDays, format } from "date-fns";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { map } from "zod";

function isSameDay(a: Date, b: Date) {
  return differenceInCalendarDays(a, b) === 0;
}



// const value = [
//   { date: "2023/01/11", count: 2 },
//   { date: "2023/01/12", count: 20 },
//   { date: "2023/01/13", count: 10 },
//   ...[...Array(17).keys()].map((_, idx) => ({
//     date: `2023/02/${idx + 10}`,
//     count: 10,
//     content: "",
//   })),
//   { date: "2023/04/11", count: 10 },
//   { date: "2023/05/01", count: 10 },
//   { date: "2023/05/02", count: 10 },
//   { date: "2023/05/04", count: 10 },
// ];

function HabitsPage() {
  let router  = useRouter();
  const id = router.query.id;
  console.log(router.query.id);

  if (typeof id != "string") return <p>Error</p>;
  else return <_HabitsPage id={id}></_HabitsPage>
}

function _HabitsPage({id}: {id: string}) {
  const context = api.useContext();
  const habitData = api.habits.getHabit.useQuery({habitId: id});
  
  // highlight dates on calendar, 100 days
  const completionsData = api.habits.getCompletions.useQuery({habitId: id, timeHorizon: 100});
  const calendarData = completionsData.data?.map((item)=>(item.date))
  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (
      view === "month" &&
      calendarData?.find((dDate) => isSameDay(dDate, date))
    ) {
      return "highlight";
    }
  }

  const [tgl, setTgl] = useState<Value>();
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8">
    {/* <p>{JSON.stringify(habitData)}</p> */}
    {/* <p>{JSON.stringify(completionsData)}</p> */}

      <h1 className="mb-4 flex flex-row justify-center text-center text-2xl font-bold">
        {habitData.data?.description}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mx-1 mt-1 h-6 w-6 cursor-pointer fill-green-100 pl-1 hover:fill-green-300"
          onClick={() => setEditMode(true)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </h1>
      <p>ID: {habitData.data?.id}</p>
    <p>Created Date: {format(habitData.data?.createdAt ?? new Date(), "MM-dd-yyyy p")}</p>
    <p>Updated Date: {format(habitData.data?.updatedAt ?? new Date(), "MM-dd-yyyy p")}</p>
    <p>Frequency: {habitData.data?.frequency}</p>
    <p>frequencyHorizon: {habitData.data?.frequencyHorizon}</p>
    <p>Completion Weight: {habitData.data?.completionWeight}</p>
    <p>Metrics: {habitData.data?.metrics.length}</p>
    <p>{habitData.data?.tags}</p>

      <div className="mt-4 flex flex-wrap">
        <div className="mb-4 mt-2 w-full px-3 lg:w-6/12">
          <div className="relative mb-3 flex min-w-0 flex-col break-words rounded bg-white shadow-md">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full max-w-full flex-1 flex-grow pr-4">
                  <h5 className="text-blueGray-400 text-xs font-bold uppercase">
                    {" "}
                    Current Streak
                  </h5>
                  <span className="text-blueGray-700 text-xl font-semibold">
                    5
                  </span>
                </div>
                <div className="relative w-auto flex-initial pl-4">
                  <AiOutlineFire className="text-2xl"></AiOutlineFire>
                </div>
              </div>
              <p className="text-blueGray-400 mt-4 text-sm">
                <span className="whitespace-nowrap"> May 3</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4 mt-2 w-full px-3 lg:w-6/12">
          <div className="relative mb-3 flex min-w-0 flex-col break-words rounded bg-white shadow-md">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full max-w-full flex-1 flex-grow pr-4">
                  <h5 className="text-blueGray-400 text-xs font-bold uppercase">
                    {" "}
                    Longest Streak
                  </h5>
                  <span className="text-blueGray-700 text-xl font-semibold">
                    15
                  </span>
                </div>
                <div className="relative w-auto flex-initial pl-4">
                  <AiTwotoneFire className="text-2xl"></AiTwotoneFire>
                </div>
              </div>
              <p className="text-blueGray-400 mt-4 text-sm">
                <span className="whitespace-nowrap"> Apr 26 - May 3</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4 mt-2 w-full px-3 lg:w-6/12">
          <div className="relative mb-3 flex min-w-0 flex-col break-words rounded bg-white shadow-md">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full max-w-full flex-1 flex-grow pr-4">
                  <h5 className="text-blueGray-400 text-xs font-bold uppercase">
                    {" "}
                    Last Completed
                  </h5>
                  <span className="text-blueGray-700 text-xl font-semibold">
                    May 3
                  </span>
                </div>
                <div className="relative w-auto flex-initial pl-4">
                  <GiBackwardTime className="text-2xl"></GiBackwardTime>
                </div>
              </div>
              <p className="text-blueGray-400 mt-4 text-sm">
                <span className="whitespace-nowrap"> 1 day ago</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 w-full px-3 lg:w-6/12">
          <div className="relative mb-6 flex min-w-0 flex-col break-words rounded bg-white shadow-lg">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full max-w-full flex-1 flex-grow pr-4">
                  <h5 className="text-blueGray-400 text-xs font-bold uppercase">
                    Current Score
                  </h5>
                  <span className="text-blueGray-700 text-xl font-semibold">
                    {habitData.data?.score*100}%
                  </span>
                </div>
                <div className="relative w-auto flex-initial pl-4">
                  {/* <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-yellow-500">
              
            </div> */}
                  <MdScoreboard className="text-2xl"></MdScoreboard>
                </div>
              </div>
              <p className="text-blueGray-400 mt-4 text-sm">
                <span className="mr-2 text-emerald-500">
                  <MdArrowUpward className="inline"></MdArrowUpward> 12%{" "}
                </span>
                <span className="whitespace-nowrap"> Since last period </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Calendar
          className="w-full md:w-auto"
          onChange={(value, event) => setTgl(value)}
          value={tgl}
          tileClassName={tileClassName} //adds highlighted dates
          calendarType="US"
          maxDate={new Date()}
          minDate={new Date("12-01-2022")} //habit created date?
        />
      </div>

      
      <div className="mt-6 border border-red-500 p-5 text-center">
        linked metrics
      </div>

      {/* https://www.tailwindtoolbox.com/components/responsive-table */}
      <div className="mt-6 border border-red-500 p-10 text-center">
        activity table
      </div>

      <div className="mt-6 text-center">
        <button className="mt-10 text-red-500">Delete this Habit</button>
        {/* <button className="bg-red-500 text-white py-1 px-4 mt-5 rounded-lg">Delete this Habit</button> */}
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Edit</button> */}
      </div>
    </div>
  );
}

export default function Page() {
  return <Layout main={HabitsPage}></Layout>;
}
