import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopNav from "../components/topnav";

const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

import { faHome, faBook, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  return (
    
<div className="flex flex-col bg-gray-800 h-screen px-4 py-8">
  <h1 className="text-white font-bold text-2xl mb-8">Navigation</h1>
  <ul className="flex flex-col space-y-2">
    <li>
      <a href="/overview" className="flex items-center text-white opacity-75 hover:opacity-100">
      <FontAwesomeIcon icon={faHome} className="mr-2" />
      <span>Overview</span>
      </a>
    </li>
    <li>
      <a href="journal" className="flex items-center text-white opacity-75 hover:opacity-100">

        <FontAwesomeIcon icon={faBook} className="mr-2" />
      <span>Daily Journal</span>
      </a>
    </li>
    <li>
      <a href="create" className="flex items-center text-white opacity-75 hover:opacity-100">
        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
      <span>Create</span>
      </a>
    </li>
  </ul>
</div>

    // <div className="h-full w-full ">
    //   <div className="inset-0 mx-auto mt-4 flex h-full w-[90%] flex-col items-stretch justify-start gap-2 align-middle">
    //     <div className="ml-1 text-left text-sm font-semibold">OVERVIEW</div>
    //     <div className="ml-4">Goals</div>
    //     <div className="ml-4 bg-gray-300">Journal</div>
    //     <hr className="border-1 w-full cursor-pointer border-gray-300" />
    //     <div className="ml-1 text-sm font-semibold">MANAGE</div>
    //     <div className="ml-3">
    //       <RightChevron></RightChevron> Create
    //     </div>
    //     <hr className="border-1 w-full cursor-pointer border-gray-300" />
    //     <div className="ml-1 text-sm font-semibold">REVIEW</div>
    //     <div className="ml-3">Timeline</div>
    //     <hr className="w-full cursor-pointer border-2 border-gray-300" />
    //   </div>
    // </div>
  );
}


const Layout = ({ main }: { main: () => JSX.Element }) => {
  return (
    <div className="absolute inset-0 min-h-[100vh] min-w-[100vw]">
      <div className="relative z-50 grid h-full w-full grid-cols-[10em_1fr] grid-rows-[3em_1fr]">
        <div id="topbar" className="col-span-2 col-start-1 row-start-1">
          <TopNav></TopNav>
        </div>
        <div className="col-start-1 row-span-2 row-start-2 h-full w-full bg-gray-100 shadow-[2.0px_2.0px_2.0px_rgba(0,0,0,0.38)]">
          <SideBar></SideBar>
        </div>
        <div className="col-start-2 row-start-2 h-full w-full overflow-scroll ">
          {main()}
        </div>
      </div>
    </div>
  );
};
export default Layout;
