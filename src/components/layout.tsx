import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopNav from "../components/topnav";
import Link from "next/link";
const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

import {
  faHome,
  faBook,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  return (
    <div className="flex h-full flex-col bg-gray-800 px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">Navigation</h1>
      <ul className="flex flex-col space-y-2">
        <li>
          <Link
            href="/overview"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link
            href="journal"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            <span>Journal</span>
          </Link>
        </li>
        <li>
          <Link
            href="create"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            <span>Create</span>
          </Link>
        </li>
        <li>
          <Link
            href="habits"
            className="flex items-center text-white opacity-75 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 mr-2"
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
  return (
    <div className="relative inset-0">
      <div className="relative z-50 grid grid-cols-[10em_1fr] grid-rows-[3em_1fr]">
        <div id="topbar" className="col-span-2 col-start-1 row-start-1">
          <TopNav></TopNav>
        </div>
        <div className="col-start-1 row-span-2 row-start-2 bg-gray-100">
          <SideBar></SideBar>
        </div>
        <div className="col-start-2 row-start-2 min-h-screen">{main()}</div>
      </div>
    </div>
  );
};
export default Layout;
