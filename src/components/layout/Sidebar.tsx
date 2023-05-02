import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { defaultNavItems, NavItem } from "./defaultNavItems";

// add NavItem prop to component prop
type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
};
const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  return (
    <div
      className={classNames({
        "fixed z-20 bg-indigo-700 text-zinc-50 md:static md:translate-x-0":
          true,
        "transition-all duration-300 ease-in-out": true,
        "w-[300px]": !collapsed,
        "w-16": collapsed,
        "-translate-x-full": !shown,
      })}
    >
      <div
        className={classNames({
          "sticky inset-0 flex h-screen flex-col justify-between md:h-full":
            true,
        })}
      >
        {/* logo and collapse button */}
        <div
          className={classNames({
            "flex items-center border-b border-b-indigo-800 transition-none":
              true,
            "justify-between p-4": !collapsed,
            "justify-center py-4": collapsed,
          })}
        >
          {!collapsed && <span className="whitespace-nowrap">My Logo</span>}
          <button
            className="grid h-10 w-10 place-content-center rounded-full opacity-0 hover:bg-indigo-800 md:opacity-100 "
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon className="h-5 w-5 fill-gray-500" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul
            className={classNames({
              "my-2 flex flex-col items-stretch gap-2": true,
            })}
          >
            {navItems.map((item, index) => {
              return (
                <li
                  key={index}
                  className={classNames({
                    "flex text-indigo-100 hover:bg-indigo-900": true, //colors
                    "transition-colors duration-300": true, //animation
                    "mx-3 gap-4 rounded-md p-2 ": !collapsed,
                    "mx-3 h-10 w-10 rounded-full p-2": collapsed,
                  })}
                >
                  <Link href={item.href} className="flex gap-2">
                    {item.icon} <span>{!collapsed && item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className={classNames({
            "grid place-content-stretch p-4 ": true,
          })}
        >
          <div className="flex h-11 items-center gap-4 overflow-hidden">
            <Image
              src={""}
              height={36}
              width={36}
              alt="profile image"
              className="rounded-full"
            />
            {!collapsed && (
              <div className="flex flex-col ">
                <span className="my-0 text-indigo-50">Tom Cook</span>
                <Link href="/" className="text-sm text-indigo-200">
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
