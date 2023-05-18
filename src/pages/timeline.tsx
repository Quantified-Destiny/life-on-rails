import { CornerDownRight } from "lucide-react";
import { TbSquareRoundedLetterH, TbSquareRoundedLetterM, TbSquareRoundedLetterG } from "react-icons/tb";

const Timeline = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl mb-3">
            Personal Timeline
          </h1>
          <p>See what you've achieved to date!</p>
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            <li className="mb-10 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 21, 2022</time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">You archived  <div className="inline-block">
        <TbSquareRoundedLetterG className="text-2xl text-yellow-500 mb-1 inline"></TbSquareRoundedLetterG>
        <h3 className="text-yellow-800 inline">Get in shape</h3>
        </div>.</h3>
              <p className="mb text-sm font-normal text-gray-500 dark:text-gray-400">Created January 21, 2022 (active for 31 days)</p>

              <div className="flex flex-col text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="flex flex-col">
                    <div className="flex flex-row p-2">
                        <TbSquareRoundedLetterH className="text-xl text-blue-500"></TbSquareRoundedLetterH>
                        <p className="">This is a habit</p>
                    </div>
                    <div className="flex flex-row p-2">
                        <TbSquareRoundedLetterM className="text-xl ml-4 text-purple-500"></TbSquareRoundedLetterM>
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
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 21, 2022</time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">You archived  <div className="inline-block">
        <TbSquareRoundedLetterH className="text-2xl text-blue-500 mb-1 inline"></TbSquareRoundedLetterH>
        <h3 className="inline">Get in shape</h3>
        </div>.</h3>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Created January 21, 2022 (active for 31 days)</p>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">You completed this habit 53 times.</p>

           
              
            </li>
          </ol>
        </div>
      </section>

    </>
  );
};

export default Timeline;
