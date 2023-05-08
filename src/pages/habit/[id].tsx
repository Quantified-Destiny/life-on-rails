import { useState } from "react";
import Layout from "../../components/layout";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import formatDistance from "date-fns/formatDistance";

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

import { addDays, differenceInCalendarDays, differenceInDays, format, max } from "date-fns";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { map } from "zod";
import { DropDown, EditableField, EditableNumberField } from "../../components/inlineEdit";
import { LinkedMetric } from "../../components/overview/metrics";

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
  const calendarData = completionsData.data?.map((item)=>(item.date));
  console.log(completionsData);
  const maxDate = calendarData?.reduce(function (a, b) { return a > b ? a : b; });
  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (
      view === "month" &&
      calendarData?.find((dDate) => isSameDay(dDate, date))
    ) {
      return "highlight";
    }
  }
  const editFrequency = api.habits.editFrequency.useMutation({
    onSuccess: () => {
      void context.habits.getHabit.invalidate();
    },
  });
  const editFrequencyHorizon = api.habits.editFrequencyHorizon.useMutation({
    onSuccess: () => {
      void context.habits.getHabit.invalidate();
    },
  });
  const [tgl, setTgl] = useState<Value>();
  const [date, setDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const mutation = api.habits.editHabit.useMutation({
    onSuccess: () => {
      void context.habits.getHabits.invalidate();
    },
  });
  return (<>
    
    <div className="container mx-auto max-w-screen-md px-4 py-8">
    {/* <p>{JSON.stringify(habitData)}</p> */}
    {/* <p>{JSON.stringify(completionsData)}</p> */}

      <h1 className="mb-4 flex flex-row justify-center text-center text-2xl font-bold">
        <EditableField
            initialText={habitData.data?.description}
            commit={(text) => {
              mutation.mutate({ habitId: id, description: text });
            }}
            className="ml-2 font-semibold"
          ></EditableField>
      </h1>
      <h2 className="mb-4 flex flex-row justify-center text-center text-lg">
        <EditableNumberField
          initial={habitData.data?.frequency}
          commit={(number) =>
            editFrequency.mutate({ habitId: id, frequency: number })
          }
          className="mr-1"
        ></EditableNumberField>
        <span className="text-md">{" "}times per</span>
          <DropDown
            frequencyHorizon={habitData.data?.frequencyHorizon}
            commit={(freq) =>
              editFrequencyHorizon.mutate({
                habitId: id,
                frequencyHorizon: freq,
              })
            }
            className="lowercase"
          ></DropDown>
      </h2>

      
      <div className="mt-4 flex flex-wrap">
        <div className="mb-2 mt-2 w-full px-3 lg:w-6/12 flex justify-start flex-auto gap-x-3">
          {/* <p>Completion Weight: {habitData.data?.completionWeight}</p>
          <p>Metrics: {habitData.data?.metrics.length}</p> */}
          {habitData.data?.tags.map((it)=>(<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-slate-600 bg-slate-200 last:mr-0 mr-1">
            {it}
          </span>))}
        </div>
      </div>

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
                    {maxDate?.toDateString()}
                  </span>
                </div>
                <div className="relative w-auto flex-initial pl-4">
                  <GiBackwardTime className="text-2xl"></GiBackwardTime>
                </div>
              </div>
              <p className="text-blueGray-400 mt-4 text-sm">
                <span className="whitespace-nowrap"> {differenceInCalendarDays(new Date(), maxDate)} day ago</span>
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
                    {(habitData.data?.score*100).toFixed(2)}%
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
      <p className="text-sm mb-2 font-bold">{date.toDateString()}</p>
        <Calendar
          className="w-full md:w-auto"
          onChange={(date:Date) => setDate(date)}
          value={date}
          tileClassName={tileClassName} 
          calendarType="US"
          maxDate={new Date()}
          minDate={habitData.data?.createdAt} 
        />
      </div>

      
      <div className="mt-5 text-center">
        <h3 className="font-semibold">Linked Metrics</h3>
        {habitData.data?.metrics.map((metric) => {
          return (
            <div className="flex flex-row justify-between w-full rounded-lg px-3 py-2 bg-gray-50">
            <LinkedMetric
              {...metric}
              weight={0.5}
              key={metric.id}
              offset={0}
            ></LinkedMetric>
            </div>
          );
        })}
      </div>

      {/* https://www.tailwindtoolbox.com/components/responsive-table */}
      <div className="mt-6 border border-red-500 p-10 text-center">
        <p>activity table for {date.toISOString()}</p>
        {/* filter for date and show only those activities  */}
        {completionsData.data?.map((it) => (
          <p>{it.date.toString()}-{it.memo ?? "no memo"}-{it.isCompleted.toString()}</p>
        ))}
<ol className="pt-1 relative border-l border-gray-300 dark:border-gray-700">                  
    <li className="mb-2 ml-4">            
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
        </span>
        <div className="items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">10:30 am</time>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">You completed this habit.</div>
        </div>
    </li>
    <li className="mb-2 ml-4">            
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
        </span>
        <div className="items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">10:40 am</time>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">You unchecked this habit.</div>
        </div>
    </li>
    <li className="mb-2 ml-4">
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">

        </span>
        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
            <div className="items-center justify-between mb-3 sm:flex">
                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">10:45 am</time>
                <div className="text-sm font-normal text-gray-500 dark:text-gray-300">You completed this habit with a memo.</div>
            </div>
            <div className="p-3 text-xs italic text-left font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quo, aspernatur pariatur in sequi aliquam aliquid dolor est alias molestiae, amet odio iure sapiente nulla id recusandae accusantium consectetur nam.</div>
        </div>
    </li>

</ol>

      </div>
      <div className="mt-3 text-sm italic">
        <p>Date Created: {format(habitData.data?.createdAt ?? new Date(), "MM-dd-yyyy p")}</p>
        <p>Last Updated: {format(habitData.data?.updatedAt ?? new Date(), "MM-dd-yyyy p")}</p>
      </div>
      <div className="mt-10 text-center">
      
        <button className=" text-red-500 text-md">Delete this Habit</button>
        {/* <button className="bg-red-500 text-white py-1 px-4 mt-5 rounded-lg">Delete this Habit</button> */}
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Edit</button> */}
      </div>
    </div>
    </>
  );
}

export default function Page() {
  return <Layout main={HabitsPage}></Layout>;
}
