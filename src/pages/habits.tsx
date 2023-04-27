import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Layout from "../components/layout";

import dynamic from "next/dynamic";

// import HeatMap from '@uiw/react-heat-map';
//Next.js error Global CSS cannot be imported from within node_modules

import "@uiw/react-heat-map/dist.css";
import "@uiw/react-heat-map/esm/style/index.css";

// import '@uiw/react-tooltip/esm/style/index.css';
// import '@uiw/react-tooltip/dist.css';

const HeatMap = dynamic(() => import("@uiw/react-heat-map"), { ssr: false });

// const Tooltip = dynamic(
//   () => import("@uiw/react-tooltip"),
//   { ssr: false }
// );

import { differenceInCalendarDays } from "date-fns";
import type { TileArgs } from "react-calendar/dist/cjs/shared/types";

function isSameDay(a: Date, b: Date) {
  return differenceInCalendarDays(a, b) === 0;
}

const all_event_dates = ["04-22-2023", "04-23-2023"];
const highlightedDates = all_event_dates.map(
  (dateString) => new Date(dateString)
);

function tileClassName({ date, view }: TileArgs) {
  if (
    view === "month" &&
    highlightedDates.find((dDate) => isSameDay(dDate, date))
  ) {
    return "highlight";
    // return ["add-new-class", "false"];
  }
}

const value = [
  { date: "2023/01/11", count: 2, content: "" },
  { date: "2023/01/12", count: 20, content: "" },
  { date: "2023/01/13", count: 10, content: "" },
  ...[...Array(17).keys()].map((_, idx) => ({
    date: `2023/02/${idx + 10}`,
    count: 10,
    content: "",
  })),
  { date: "2023/04/11", count: 10, content: "" },
  { date: "2023/05/01", count: 10, content: "" },
  { date: "2023/05/02", count: 10, content: "" },
  { date: "2023/05/04", count: 10, content: "" },
];

function HabitsPage() {
  const events = ['04-03-2023', '04-15-2023', '4-25-2023'];
  const [tgl, setTgl] = useState("");
  const linkedGoal = {
    id: "123",
    name: "Exercise every day",
    link: "/goals/123",
  };
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Go jogging for 1 hour
      </h1>
      <p className="mb-4 text-center text-gray-500">
        Created on December 1st, 2022
      </p>

      <div className="flex flex-col items-center justify-center">
        {linkedGoal && (
          <a className="text-center my-4" href={linkedGoal.link}>
            <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-2">
              Linked Goal: {linkedGoal.name}
            </button>
          </a>
        )}
        <Calendar 
          className="w-full md:w-auto"
          onChange={(value, event) => {
            if (value instanceof Date) setTgl(value);
            else console.log("not a date");
            console.log(value);
            console.log(event);
          }}
          value={tgl}
          tileClassName={tileClassName} //adds highlighted dates
          calendarType="US"
          maxDate={new Date()}
          minDate={new Date("12-01-2022")} //habit created date?
        />
      </div>

      <div className="my-8 flex flex-col items-center justify-center">
        <HeatMap
          value={value}
          startDate={new Date("2023/01/01")}
          width={600}
          legendCellSize={0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="text-md mb-4 font-bold">Done in the month</h2>
          <p className="text-md text-center">5</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="text-md mb-4 font-bold">Total done</h2>
          <p className="text-md text-center">15</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="text-md mb-4 font-bold">Current streak</h2>
          <p className="text-md text-center">2</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="text-md mb-4 font-bold">Best streak</h2>
          <p className="text-md text-center">6</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="mr-4 rounded-lg bg-red-500 px-4 py-2 text-white">
          Delete
        </button>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
          Edit
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Layout main={HabitsPage}></Layout>;
}
