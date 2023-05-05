import { useState } from "react";
import Layout from "../components/layout";
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css';

import dynamic from "next/dynamic";

import React from 'react';
import { MdArrowUpward, MdScoreboard } from 'react-icons/md';
import { GiBackwardTime } from 'react-icons/gi';
import { AiFillFire, AiOutlineFire, AiTwotoneFire } from 'react-icons/ai';
// import HeatMap from '@uiw/react-heat-map'; 
//Next.js error Global CSS cannot be imported from within node_modules


import '@uiw/react-heat-map/esm/style/index.css';
import '@uiw/react-heat-map/dist.css';

// import '@uiw/react-tooltip/esm/style/index.css';
// import '@uiw/react-tooltip/dist.css';


const HeatMap = dynamic(
  () => import("@uiw/react-heat-map"),
  { ssr: false }
);

// const Tooltip = dynamic(
//   () => import("@uiw/react-tooltip"),
//   { ssr: false }
// );

import { addDays, differenceInCalendarDays } from "date-fns";

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

const all_event_dates = ['04-22-2023', '04-23-2023', '5-3-2023']  
const highlightedDates = all_event_dates.map((dateString) => new Date(dateString));

function tileClassName({ date, view }) {
    if (
      view === "month" &&
      highlightedDates.find((dDate) => isSameDay(dDate, date))
    ) {
      return "highlight";
      // return ["add-new-class", "false"];
    }
}

const value = [
  { date: '2023/01/11', count: 2 },
  { date: '2023/01/12', count: 20 },
  { date: '2023/01/13', count: 10 },
  ...[...Array(17)].map((_, idx) => ({ date: `2023/02/${idx + 10}`, count: 10, content: '' })),
  { date: '2023/04/11', count: 10 },
  { date: '2023/05/01', count: 10 },
  { date: '2023/05/02', count: 10 },
  { date: '2023/05/04', count: 10 },
];

function HabitsPage() {

  const [tgl, setTgl] = useState("");
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-md">
      <h1 className="text-2xl text-center flex flex-row justify-center font-bold mb-4">Go jogging for 1 hour
      <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 pl-1 mt-1 mx-1 cursor-pointer fill-green-100 hover:fill-green-300"
          onClick={() => setEditMode(true)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </h1>
      
      <p className="text-center mb-4 text-gray-500">Started on December 1st, 2022</p>
      
      <div className="flex flex-col items-center justify-center">
        <Calendar 
          className="w-full md:w-auto"
          onChange={(value, event) => setTgl(value)} 
          value={tgl} 
          tileClassName={tileClassName} //adds highlighted dates
          calendarType = "US"
          maxDate = {new Date()}
          minDate={new Date('12-01-2022')} //habit created date?
        />
      </div>

      <div className="flex flex-wrap mt-4">
  <div className="mt-2 w-full lg:w-6/12 px-3 mb-4">
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 shadow-md">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {" "}
              Current Streak
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              5
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <AiOutlineFire className="text-2xl"></AiOutlineFire>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span className="whitespace-nowrap"> May 3</span>
        </p>
      </div>
    </div>
  </div>
  <div className="mt-2 w-full lg:w-6/12 px-3 mb-4">
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 shadow-md">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {" "}
              Longest Streak
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              15
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <AiTwotoneFire className="text-2xl"></AiTwotoneFire>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span className="whitespace-nowrap"> Apr 26 - May 3</span>
        </p>
      </div>
    </div>
  </div>
  <div className="mt-2 w-full lg:w-6/12 px-3 mb-4">
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 shadow-md">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {" "}
              Last Completed
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              May 3
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <GiBackwardTime className="text-2xl"></GiBackwardTime>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span className="whitespace-nowrap"> 1 day ago</span>
        </p>
      </div>
    </div>
  </div>
  <div className="mt-2 w-full lg:w-6/12 px-3">
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              Current Score
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              51.02%{" "}
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            {/* <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-yellow-500">
              
            </div> */}
            <MdScoreboard className="text-2xl"></MdScoreboard>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span className="text-emerald-500 mr-2">
            <MdArrowUpward className="inline"></MdArrowUpward> 12%{" "}
          </span>
          <span className="whitespace-nowrap"> Since last period </span>
        </p>
      </div>
    </div>
  </div>
</div>
<div className="mt-6 text-center border p-5 border-red-500">
            linked metrics

        </div>

        {/* https://www.tailwindtoolbox.com/components/responsive-table */}
        <div className="mt-6 text-center border p-10 border-red-500">
            activity table 

        </div>

      <div className="mt-6 text-center">
        <button className="text-red-500 mt-10">Delete this Habit</button>
        {/* <button className="bg-red-500 text-white py-1 px-4 mt-5 rounded-lg">Delete this Habit</button> */}
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Edit</button> */}
      </div>
    </div>
  );
}

export default () => <Layout main={HabitsPage}></Layout>;