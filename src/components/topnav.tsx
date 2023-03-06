import React from "react";

const TopNav = () => {
  return (
    <nav
      className="
 relative
  flex
  w-full
  "
    >
      <div className="flex w-full flex-wrap items-center justify-between px-6 shadow-lg">
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
          <svg
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
          </svg>
        </button>
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
          >
          </a>
        </div>

        <div className="relative flex items-center">


          <a
            className="
        dropdown-item
        block
        w-full
        whitespace-nowrap
        bg-transparent
        py-2
        px-4
        text-sm
        font-normal
        text-gray-700
        hover:bg-gray-100
      "
            href="#"
          >
            Profile                </a>


        </div>
      </div>
    </nav>
  );
};

export default TopNav;