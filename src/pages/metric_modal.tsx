import { TbSquareRoundedLetterH, TbSquareRoundedLetterM } from "react-icons/tb";
import { Slider } from "../components/ui/slider";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";

function MetricModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
      <DialogContent>
        <>
          <div className="fixed w-10/12 overflow-y-auto rounded-md bg-white shadow sm:h-auto md:w-8/12 lg:w-1/2 2xl:w-2/5">
            <div className="flex items-center justify-between rounded-tl-md rounded-tr-md bg-gray-100 px-4 py-7 md:px-8 md:py-4">
              <TbSquareRoundedLetterH className="text-xl text-blue-500"></TbSquareRoundedLetterH>
              <p className="text-base font-semibold">Go jogging for an hour.</p>
              <button className="focus:outline-none">
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 7L7 21"
                    stroke="#A1A1AA"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 7L21 21"
                    stroke="#A1A1AA"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="px-4 pb-7 pt-6 md:px-10 md:pb-4 md:pt-12">
              <div className="flex items-center justify-center  text-sm text-gray-400">
                <h2>Answer your linked metrics to finish the habit.</h2>
              </div>

              <form className="mt-11">
                <div className="flex items-center">
                  <TbSquareRoundedLetterM className="text-xl text-purple-500"></TbSquareRoundedLetterM>
                  <p className=" w-1/2 px-3  py-3 text-sm leading-none text-gray-800 focus:outline-none ">
                    How was your jog?
                  </p>
                  {/* <input placeholder="Full Name" className=" w-1/2 focus:outline-none placeholder-gray-500 py-3 px-3 text-sm leading-none text-gray-800 bg-white border rounded border-gray-200" /> */}
                  <Slider
                    value={[0]}
                    min={0}
                    max={5}
                    step={1}
                    className="w-1/2"
                  ></Slider>
                </div>
                <div className="flex items-center">
                  <TbSquareRoundedLetterM className="text-xl text-purple-500"></TbSquareRoundedLetterM>
                  <p className=" w-1/2 px-3  py-3 text-sm leading-none text-gray-800 focus:outline-none ">
                    How long was your jog How long was your jog ?
                  </p>
                  {/* <input placeholder="Full Name" className=" w-1/2 focus:outline-none placeholder-gray-500 py-3 px-3 text-sm leading-none text-gray-800 bg-white border rounded border-gray-200" /> */}
                  <Slider
                    value={[0]}
                    min={0}
                    max={5}
                    step={1}
                    className="w-1/2"
                  ></Slider>
                </div>
                {/* <div className="flex items-center space-x-9 mt-8">
                                        <input placeholder="Email" type="email" className="w-1/2 focus:outline-none placeholder-gray-500 py-3 px-3 text-sm leading-none text-gray-800 bg-white border rounded border-gray-200" />
                                        <div className="w-1/2 bg-white border rounded border-gray-200 py-2.5 px-3">
                                            <select className="text-sm text-gray-500 w-full focus:outline-none">
                                                <option selected disabled value>
                                                    Category
                                                </option>
                                                <option>Designer</option>
                                                <option>Developer</option>
                                            </select>
                                        </div>
                                    </div> */}
                <div className="mt-8">
                  <textarea
                    placeholder="Habit Note"
                    className="h-24 w-full resize-none overflow-y-auto rounded border border-gray-200 py-3 pl-3 focus:outline-none"
                    defaultValue={""}
                  />
                </div>
              </form>
              <div className="mt-9 flex items-center justify-between">
                <button className="rounded bg-gray-400 px-6 py-3 text-sm text-white shadow hover:bg-gray-500">
                  Cancel
                </button>
                <button className="rounded bg-indigo-700 px-6 py-3 text-sm text-white shadow hover:bg-opacity-80">
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}

export default MetricModal;
