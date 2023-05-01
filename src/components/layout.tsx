
import Link from "next/link";
import { useIsFetching } from "@tanstack/react-query";
import { MdOutlineDashboard, MdCalendarViewMonth, MdAddCircleOutline, MdOutlineToday, MdBarChart, MdOutlineLogout, MdPerson, MdArrowBackIosNew } from "react-icons/md";
import { useEffect, useState } from "react";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Layout = ({ main }: { main: () => JSX.Element }) => {
  const isFetching = useIsFetching();
  console.log(isFetching);

  const { data: sessionData } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await router.push("/");
    await signOut();
  };

  const [open, setOpen] = useState(true);

  const Menus = [
    { name: "Dashboard", link: '/dashboard', icon: MdBarChart, gap: true },
    { name: "Journal", link: '/journal', icon: MdOutlineToday },
    { name: "Create New", link: '/create', icon: MdAddCircleOutline },
    { name: "All Items", link: '/overview2', icon: MdOutlineDashboard },
    { name: "Habits", link: '/habits', icon: MdCalendarViewMonth },
  ]

  // Auto close menu when on mobile
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  });

  return (

    <div className="flex">

      <div className={`${open ? "w-[14rem]" : "w-20"} duration-200 p-5 pt-8 h-screen bg-gradient-to-b from-[#00164d] to-[#3c118b] fixed top-0 left-0 bottom-0`}>
        <div
          className={`absolute h-8 w-8 bg-white rounded-full cursor-pointer -right-4 top-9 border-2 border-black ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)} >
          <MdArrowBackIosNew className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></MdArrowBackIosNew>
        </div>


        <div className="flex gap-x-4 items-center">
          <a href="/journal">
            <img src="lor-logo.png" alt=""
              width="40"
              height="40"
              className={`cursor-pointer duration-100`} />
          </a>
          <h1 className={`text-white origin-left ${!open && 'hidden'}`}>
            Life on Rails
          </h1>
        </div>
        {Menus.map((menu, index) => (
          <Link
            href={menu.link}
            key={index} className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-200 hover:bg-opacity-10 rounded-md ${menu?.gap ? "mt-9" : "mt-2"}`}>
            <div>
              {React.createElement(menu?.icon, { size: 20 })}
            </div>
            <span className={`${!open && `hidden`} origin-left duration-200`}>{menu.name}</span>
          </Link>
        ))}
        <Link
          href='/profile'
          key='profile' className={`text-white text-sm flex items-end absolute bottom-14 gap-x-4 cursor-pointer p-2 hover:bg-opacity-10	hover:bg-white rounded-md`}>
          <div>
            {React.createElement(MdPerson, { size: 20 })}
          </div>
          <span className={`${!open && `hidden`} origin-left duration-200`}>Profile</span>
        </Link>
        <Link
          href='/'
          onClick={sessionData ? handleSignOut : undefined}
          key='logout' className={`text-white text-sm flex flex-row-10 items-end absolute bottom-4 gap-x-4 cursor-pointer p-2 hover:bg-opacity-10	hover:bg-white rounded-md`}>
          <div>
            {React.createElement(MdOutlineLogout, { size: 20 })}
          </div>
          <span className={`${!open && `hidden`} origin-left duration-200`}>Log Out</span>
        </Link>
      </div>
      <div className={`${open ? "pl-[14rem]" : "pl-20"} p-2 font-semi flex-1 h-screen overflow-auto`}>
        {main()}
      </div>
    </div>
  );
};
export default Layout;
