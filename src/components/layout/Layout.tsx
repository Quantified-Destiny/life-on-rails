import classNames from "classnames";
import { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ main }: { main: () => JSX.Element }) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={classNames({
        "grid min-h-screen bg-zinc-100": true,
        "grid-cols-sidebar": !collapsed,
        "grid-cols-sidebar-collapsed": collapsed,
        "transition-[grid-template-columns] duration-300 ease-in-out": true,
      })}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
      />
      <div className="mt-40">{main()}</div>
    </div>
  );
};
export default Layout;
