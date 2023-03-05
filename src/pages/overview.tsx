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
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-7 lg:px-8">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"> Goal </span>
          <span className="text-sm font-medium text-gray-500"> 60% </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Get Fit</div>
          <div className="mt-2 text-gray-600">I want to get in shape and be able to run a 5K by the end of the year.</div>
        </div>
      </div>
      <div className="divide-y bg-gray-50 px-4 py-4 sm:px-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> 25% </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Run 5 miles a day</div>
              <div className="mt-2 text-gray-600">I want to build up my endurance and be able to run 5 miles a day by the end of the month.</div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> 77% </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Lift weights 3 times a week</div>
              <div className="mt-2 text-gray-600">I want to build muscle and strength by lifting weights 3 times a week.</div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> 77% </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Lift weights 3 times a week</div>
              <div className="mt-2 text-gray-600">I want to build muscle and strength by lifting weights 3 times a week.</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"> Subjective </span>
          <span className="text-sm font-medium text-gray-500"> 80% </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">How was your day?</div>
          <div className="mt-2 text-gray-600">I want to track my mood everyday.</div>
        </div>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"> Goal </span>
          <span className="text-sm font-medium text-gray-500"> January 7, 2020 </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Get Fit</div>
          <div className="mt-2 text-gray-600">I want to get in shape and be able to run a 5K by the end of the year.</div>
        </div>
      </div>
      <div className="divide-y bg-gray-50 px-4 py-4 sm:px-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> 25% </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Run 5 miles a day</div>
              <div className="mt-2 text-gray-600">I want to build up my endurance and be able to run 5 miles a day by the end of the month.</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"> Goal </span>
          <span className="text-sm font-medium text-gray-500"> January 7, 2020 </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Get Fit</div>
          <div className="mt-2 text-gray-600">I want to get in shape and be able to run a 5K by the end of the year.</div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> January 7, 2020 </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Run 5 miles a day</div>
              <div className="mt-2 text-gray-600">I want to build up my endurance and be able to run 5 miles a day by the end of the month.</div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> January 14, 2020 </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Lift weights 3 times a week</div>
              <div className="mt-2 text-gray-600">I want to build muscle and strength by lifting weights 3 times a week.</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"> Goal </span>
          <span className="text-sm font-medium text-gray-500"> January 7, 2020 </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Get Fit</div>
          <div className="mt-2 text-gray-600">I want to get in shape and be able to run a 5K by the end of the year.</div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
              <span className="text-sm font-medium text-gray-500"> January 7, 2020 </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">Run 5 miles a day</div>
              <div className="mt-2 text-gray-600">I want to build up my endurance and be able to run 5 miles a day by the end of the month.</div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"> Subjective </span>
              <span className="text-sm font-medium text-gray-500"> January 14, 2020 </span>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900">How did your workout feel?</div>
              <div className="mt-2 text-gray-600">I want to build muscle and strength by lifting weights 3 times a week.</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"> Subjective </span>
          <span className="text-sm font-medium text-gray-500"> 80% </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">How was your day?</div>
          <div className="mt-2 text-gray-600">I want to track my mood everyday.</div>
        </div>
      </div>
    </div>
    <div className="overflow-hidden rounded-lg bg-white shadow shadow-slate-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"> Habit </span>
          <span className="text-sm font-medium text-gray-500"> 50% </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-gray-900">Brushing Twice a Day</div>
          <div className="mt-2 text-gray-600">I want to improve my dental hygiene.</div>
        </div>
      </div>
    </div>
  </div>
</div>

      </>
    );
  };
  
  export default Home;

