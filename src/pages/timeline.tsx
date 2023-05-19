import {
  TbSquareRoundedLetterG,
  TbSquareRoundedLetterH,
  TbSquareRoundedLetterM,
} from "react-icons/tb";
import { api } from "../utils/api";
import { Loader } from "../components/ui/loader";

const Timeline = () => {
  const timelineQuery = api.timeline.getTimeline.useQuery();

  if (!timelineQuery.data) {
    return <Loader></Loader>;
  }
  const timeline = timelineQuery.data;

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-10">
          <h1 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl">
            Personal Timeline
          </h1>
          <p>See what you've achieved to date!</p>
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {JSON.stringify(timeline)}
            <li className="mb-10 ml-4">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                February 21, 2022
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                You archived{" "}
                <div className="inline-block">
                  <TbSquareRoundedLetterG className="mb-1 inline text-2xl text-yellow-500"></TbSquareRoundedLetterG>
                  <h3 className="inline text-yellow-800">Get in shape</h3>
                </div>
                .
              </h3>
              <p className="mb text-sm font-normal text-gray-500 dark:text-gray-400">
                Created January 21, 2022 (active for 31 days)
              </p>

              <div className="flex flex-col text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="flex flex-col">
                  <div className="flex flex-row p-2">
                    <TbSquareRoundedLetterH className="text-xl text-blue-500"></TbSquareRoundedLetterH>
                    <p className="">This is a habit</p>
                  </div>
                  <div className="flex flex-row p-2">
                    <TbSquareRoundedLetterM className="ml-4 text-xl text-purple-500"></TbSquareRoundedLetterM>
                    <p className="">This is a linked Metric</p>
                  </div>
                </div>
                <div className="flex p-2">
                  <TbSquareRoundedLetterH className="text-xl text-blue-500"></TbSquareRoundedLetterH>
                  <p className="">This is a habit</p>
                </div>
              </div>
            </li>
            <li className="mb-10 ml-4">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                February 21, 2022
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                You archived{" "}
                <div className="inline-block">
                  <TbSquareRoundedLetterH className="mb-1 inline text-2xl text-blue-500"></TbSquareRoundedLetterH>
                  <h3 className="inline">Get in shape</h3>
                </div>
                .
              </h3>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Created January 21, 2022 (active for 31 days)
              </p>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                You completed this habit 53 times.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
};

export default Timeline;
