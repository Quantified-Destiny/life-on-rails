import "../styles/globals.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/800.css";
import classNames from "classnames";
import Link from "next/link";


const TopNav = () => {
  return (
    <nav
      className="relative flex h-full"
    >
      <div className="flex w-full flex-wrap items-center justify-between pr-6 shadow">
        <button
          className="
      navbar-toggler
      border-0
      bg-transparent
      py-2 px-2.5
      text-gray-500
      hover:no-underline
      hover:shadow-none
      focus:no-underline focus:shadow-none focus:outline-none focus:ring-0
    "
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <img src="/lor-logo.png" className="w-9" alt="" />
          {/* <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="bars"
            className="w-6"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
            ></path>
          </svg> */}
        </button>
        <div className="text-sm font-bold text-blue-600">
          {/* text-[#21A8F6] */}
          Life on Rails
        </div>
        <div className="flex-grow items-center" id="navbarSupportedContent">
          <a
            className="
        mt-2
        mr-1
        flex
        items-center
        text-gray-900
        hover:text-gray-900
        focus:text-gray-900
        lg:mt-0
      "
            href="#"
          ></a>
        </div>

        <div className="relative flex items-center">
          <button
            className="rounded-full bg-gray-500 px-2 py-1 text-xs font-semibold text-white no-underline transition hover:bg-black/20"
          >
            <Link href="/newjournal">
            {"Go to app"}
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};



function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <div className="flex flex-col">
          <TopNav></TopNav>
          <main
            className={classNames(
              "container prose prose-slate mx-auto mt-10 h-full w-full overflow-scroll bg-white pt-5 scrollbar-none mb-20"
            )}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
export default RootLayout;
