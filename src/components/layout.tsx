import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopNav from "../components/topnav";

const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

import { faHome, faBook, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  return (
    
<div className="flex flex-col bg-gray-800 h-full px-4 py-8">
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
//     <div className="relative h-screen">
//   <div className="flex items-center justify-between px-6 py-3 bg-gray-100">
//     <div className="flex items-center space-x-4">
//       {/* Add your logo or image here */}
//       <img src="/path/to/your/logo.png" alt="Logo" className="h-6 w-auto" />
//       <nav className="space-x-4">
//         <a href="#">Link 1</a>
//         <a href="#">Link 2</a>
//         <a href="#">Link 3</a>
//       </nav>
//     </div>
//     <div className="flex items-center space-x-4">
//       <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded">Profile</button>
//       <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded">Sign Out</button>
//     </div>
//   </div>
//   <div className="flex flex-row h-full">
//     <div className="flex-none w-64 h-full bg-gray-200 border-r">
//       {/* Add your sidebar content here */}
//       <nav className="flex flex-col">
//         <a href="#">Sidebar Link 1</a>
//         <a href="#">Sidebar Link 2</a>
//         <a href="#">Sidebar Link 3</a>
//       </nav>
//     </div>
//     <div className="flex-grow h-full">
//       {/* Add your main content here */}
//       <h1>Main Content</h1>
//     </div>
//   </div>
// </div>

    <div className="relative inset-0">
      <div className="relative z-50 grid grid-cols-[10em_1fr] grid-rows-[3em_1fr]">
        <div id="topbar" className="col-span-2 col-start-1 row-start-1">
          <TopNav></TopNav>
        </div>
        <div className="col-start-1 row-span-2 row-start-2 bg-gray-100">
          <SideBar></SideBar>
        </div>
        <div className="col-start-2 row-start-2 min-h-screen">
          {main()}
        </div>
      </div>
    </div>
  );
};
export default Layout;
