import { useIsFetching } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  MdArrowBackIosNew,
  MdBarChart,
  MdCalendarViewMonth,
  MdOutlineDashboard,
  MdOutlineLogout,
  MdOutlineToday,
  MdPerson
} from "react-icons/md";

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
    { name: "Dashboard", link: "/dashboard", icon: MdBarChart, gap: true },
    { name: "Journal", link: "/journal", icon: MdOutlineToday },
    { name: "All Items", link: "/overview2", icon: MdOutlineDashboard },
    { name: "Habits", link: "/habits", icon: MdCalendarViewMonth },
  ];

  // Auto close menu when on mobile
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-[14rem]" : "w-20"
        } fixed bottom-0 left-0 top-0 h-screen bg-gradient-to-b from-[#00164d] to-[#3c118b] p-5 pt-8 duration-200`}
      >
        <div
          className={`absolute -right-4 top-9 h-8 w-8 cursor-pointer rounded-full border-2 border-black bg-white ${
            !open ? "rotate-180" : ""
          }`}
          onClick={() => setOpen(!open)}
        >
          <MdArrowBackIosNew className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"></MdArrowBackIosNew>
        </div>

        <div className="flex items-center gap-x-4">
          <Link href="/journal">
            <img
              src="lor-logo.png"
              alt=""
              width="40"
              height="40"
              className={`cursor-pointer duration-100`}
            />
          </Link>
          <h1 className={`origin-left text-white ${!open ? "hidden" : ""}`}>
            Life on Rails
          </h1>
        </div>
        {Menus.map((menu, index) => (
          <Link
            href={menu.link}
            key={index}
            className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-white hover:bg-slate-200 hover:bg-opacity-10 ${
              menu?.gap ? "mt-9" : "mt-2"
            }`}
          >
            <div>{React.createElement(menu?.icon, { size: 20 })}</div>
            <span
              className={`${!open ? `hidden` : ""} origin-left duration-200`}
            >
              {menu.name}
            </span>
          </Link>
        ))}
        <Link
          href="/profile"
          key="profile"
          className={`absolute bottom-14 flex cursor-pointer items-end gap-x-4 rounded-md p-2 text-sm text-white	hover:bg-white hover:bg-opacity-10`}
        >
          <div>{React.createElement(MdPerson, { size: 20 })}</div>
          <span className={`${!open ? `hidden` : ""} origin-left duration-200`}>
            Profile
          </span>
        </Link>
        <Link
          href="/"
          onClick={sessionData ? handleSignOut : undefined}
          key="logout"
          className={`flex-row-10 absolute bottom-4 flex cursor-pointer items-end gap-x-4 rounded-md p-2 text-sm text-white	hover:bg-white hover:bg-opacity-10`}
        >
          <div>{React.createElement(MdOutlineLogout, { size: 20 })}</div>
          <span className={`${!open ? `hidden` : ""} origin-left duration-200`}>
            Log Out
          </span>
        </Link>
      </div>
      <div
        className={`${
          open ? "pl-[14rem]" : "pl-20"
        } font-semi h-screen flex-1 overflow-auto p-2`}
      >
        {main()}
      </div>
    </div>
  );
};
export default Layout;
