import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Life on Rails</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex min-h-screen flex-col items-center justify-center bg-white bg-gradient-to-b from-[#5ef4ca5a] to-[#4389faab] dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Ride the rails to success
          </h1>
          <p className="mb-8 text-lg font-normal dark:text-gray-400 sm:px-16 lg:px-48 lg:text-xl">
            Empower your journey to success with Life on Rails - the app that
            tracks your goals, habits, and progress.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <AuthShowcase />
            {/* <a
              href="#"
              className="inline-flex bg-gray-200 justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Learn more
            </a> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();

  const session = useSession();
  if (session.status == "authenticated") {
    void router.push("/newjournal");
  }

  return (
    <>
      {!sessionData && (
        // <button
        //   className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        //   onClick={() => void signIn()}
        // >
        //   Sign in
        // </button>
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          onClick={() => void signIn()}
        >
          Get started
          <svg
            aria-hidden="true"
            className="-mr-1 ml-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}
    </>
  );
};
