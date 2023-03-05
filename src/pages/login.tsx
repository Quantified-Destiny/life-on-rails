

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5215a8] to-[#2b33d7]">
  <div className="mt-16 w-full rounded bg-gray-50 p-10 shadow md:w-1/2 lg:w-1/3">
    <p  className="text-center text-xl font-extrabold leading-6 text-gray-800 focus:outline-none">Life on Rails</p>
    <p className="text-m pt-6 text-center text-gray-800">Sign up or Sign in</p>
    <button aria-label="Continue with google" role="button" className="mt-8 flex w-full items-center rounded-lg border border-gray-700 py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1">
      <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" />
      <p className="ml-4 text-base font-medium text-gray-700">Continue with Google</p>
    </button>
    <button aria-label="Continue with github" role="button" className="mt-4 flex w-full items-center rounded-lg border border-gray-700 py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1">
      <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg3.svg" alt="github" />
      <p className="ml-4 text-base font-medium text-gray-700">Continue with Github</p>
    </button>
    <button aria-label="Continue with twitter" role="button" className="mt-4 flex w-full items-center rounded-lg border border-gray-700 py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1">
      <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg4.svg" alt="twitter" />
      <p className="ml-4 text-base font-medium text-gray-700">Continue with Twitter</p>
    </button>
  </div>
</div>
      </>
    );
  };
  
  export default Home;

