import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import TopNav from "../components/topnav";

import {
  faBook,
  faChartSimple,
  faHome,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useIsFetching } from "@tanstack/react-query";
import classNames from "classnames";

function SideBar() {
  return (
    <div className="fixed flex h-full flex-col bg-gray-800/80 px-4 py-8 shadow-[inset_-25px_-15px_80px_#46464620] backdrop-blur-md">
      <h1 className="mb-8 text-2xl  text-white">Navigation</h1>
      <ul className="flex flex-col space-y-2">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faChartSimple} className="mr-2 h-6 w-6" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/overview2"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2 h-6 w-6" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link
            href="/journal"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faBook} className="mr-2 h-6 w-6" />
            <span>Journal</span>
          </Link>
        </li>
        <li>
          <Link
            href="/create"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-6 w-6" />
            <span>Create</span>
          </Link>
        </li>
        <li>
          <Link
            href="/habits"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            <span>Habits</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

const Layout = ({ main }: { main: () => JSX.Element }) => {
  const isFetching = useIsFetching();
  console.log(isFetching);

  return (
    <div className="relative inset-0">
      <div className="z-50 grid min-h-screen grid-cols-[10em_1fr] grid-rows-[3em_1fr]">
        <div
          id="topbar"
          className="fixed z-50 col-span-2 col-start-1 row-start-1 w-full bg-white"
        >
          <TopNav></TopNav>
          <div
            className={classNames("absolute left-0 bottom-0 z-10 h-1 w-full", {
              hidden: isFetching === 0,
              "animate-pulse bg-green-400": isFetching > 0,
            })}
          ></div>
        </div>
        <div className="col-start-1 row-span-2 row-start-2 bg-gray-100">
          <SideBar></SideBar>
        </div>
        <div className="relative col-start-2 row-start-2 bg-slate-50">
          {main()}
        </div>
      </div>
    </div>
  );
};
export default Layout;
