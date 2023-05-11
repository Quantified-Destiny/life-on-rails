import { useIsFetching } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";

import {
  BarChart,
  Book,
  CalendarRange,
  ChevronLeft,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

import classNames from "classnames";
import type { LucideIcon } from "lucide-react";
import { useSidebarStore } from "./state";

interface MenuItem {
  name: string;
  link: string;
  icon: LucideIcon;
  gap?: boolean;
}

function Sidebar(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  Menus: MenuItem[];
}) {
  const router = useRouter();
  const path = router.asPath;
  const { data: sessionData } = useSession();

  const handleSignOut = async () => {
    await router.push("/");
    await signOut();
  };

  return (
    <div
      className={`${
        props.open ? "w-[14rem]" : "w-20"
      } fixed bottom-0 left-0 top-0 h-screen bg-gradient-to-b from-[#00164d] to-[#3c118b] p-5 pt-8 duration-200`}
    >
      <div
        className={`absolute -right-4 top-9 h-8 w-8 cursor-pointer rounded-full border-2 border-black bg-white ${
          !props.open ? "rotate-180" : ""
        }`}
        onClick={() => props.setOpen(!props.open)}
      >
        <ChevronLeft className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"></ChevronLeft>
      </div>

      <div className="flex items-center gap-x-4">
        <Link href="/newjournal">
          <img
            src="lor-logo.png"
            alt=""
            width="40"
            height="40"
            className="cursor-pointer opacity-90 duration-100"
          />
        </Link>
        <h1 className={`origin-left text-white ${!props.open ? "hidden" : ""}`}>
          Life on Rails
        </h1>
      </div>
      {props.Menus.map((menu, index) => (
        <Link
          href={menu.link}
          key={index}
          className={classNames(
            "flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-white hover:bg-slate-200 hover:bg-opacity-10",
            menu?.gap ? "mt-9" : "mt-2",
            path.includes(menu.link) ? "bg-slate-200 bg-opacity-10" : ""
          )}
        >
          <div>
            {React.createElement(menu?.icon, {
              size: 20,
            })}
          </div>
          <span
            className={`${
              !props.open ? `hidden` : ""
            } origin-left duration-200`}
          >
            {menu.name}
          </span>
        </Link>
      ))}
      <hr className="mx-2 my-8 h-px border-0 bg-gray-500 dark:bg-gray-700"></hr>

      <Link
        href="/profile"
        key="profile"
        className={classNames(
          "mt-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-white hover:bg-slate-200 hover:bg-opacity-10",
          path.includes("profile") ? "bg-slate-200 bg-opacity-10" : ""
        )}
      >
        <div>
          {React.createElement(User, {
            size: 20,
          })}
        </div>
        <span
          className={`${!props.open ? `hidden` : ""} origin-left duration-200`}
        >
          Profile
        </span>
      </Link>

      <Link
        href="/"
        onClick={sessionData ? handleSignOut : undefined}
        key="logout"
        className={`mt-2 flex cursor-pointer items-end gap-x-4 rounded-md p-2 text-sm	text-white hover:bg-white hover:bg-opacity-10`}
      >
        <div>
          {React.createElement(LogOut, {
            size: 20,
          })}
        </div>
        <span
          className={`${!props.open ? `hidden` : ""} origin-left duration-200`}
        >
          Log Out
        </span>
      </Link>
    </div>
  );
}

const menus = [
  { name: "Journal", link: "/newjournal", icon: Book, gap: true },
  // { name: "Legacy Journal", link: "/journal", icon: CalendarRange },
  { name: "Dashboard", link: "/dashboard", icon: BarChart },
  { name: "All Items", link: "/overview", icon: LayoutDashboard },
  { name: "Help", link: "/help", icon: HelpCircle },
  // { name: "New Journal", link: "/newjournal", icon: HelpCircle },
  // { name: "Habit Page", link: "/habit", icon: HelpCircle },
  // { name: "Metric Modal", link: "/metric_modal", icon: HelpCircle },
  // { name: "delete account", link: "/deactivate", icon: HelpCircle },
];

function Layout({ children }: { children: ReactNode }) {
  const { open, setOpen } = useSidebarStore();

  const isFetching = useIsFetching();

  // Auto close menu when on mobile

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} Menus={menus}></Sidebar>
      <div
        className={classNames("h-1 w-full", {
          "animate-pulse bg-green-600": isFetching,
        })}
      ></div>
      <div
        className={classNames(
          "flex-1 overflow-scroll pt-5 scrollbar-none",
          open ? "ml-[14rem]" : "ml-20"
        )}
      >
        <main
          className={classNames(
            "container mx-auto h-full overflow-scroll pt-5 scrollbar-none"
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
}
export default Layout;
