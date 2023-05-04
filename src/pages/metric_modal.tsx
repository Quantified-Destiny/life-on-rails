import React from "react";
import Head from "next/head";
import { Slider } from "../components/ui/slider";
import { TbSquareRoundedLetterG, TbSquareRoundedLetterH, TbSquareRoundedLetterM} from 'react-icons/tb';
function Index() {
    return (
        <>
            <div id="popup" className="z-50 fixed w-full flex justify-center inset-0">
                <div onclick="popuphandler(false)" className="w-full h-full bg-gray-900 z-0 absolute inset-0" />
                <div className="mx-auto container">
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                            <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
                            <TbSquareRoundedLetterH className="text-blue-500 text-xl"></TbSquareRoundedLetterH>
                                <p className="text-base font-semibold">Go jogging for an hour.</p>
                                <button onclick="popuphandler(false)" className="focus:outline-none">
                                    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 7L7 21" stroke="#A1A1AA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 7L21 21" stroke="#A1A1AA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="px-4 md:px-10 pt-6 md:pt-12 md:pb-4 pb-7">
                                <div className="flex items-center text-sm  text-gray-400 justify-center">
                                    <h2>Answer your linked metrics to finish the habit.</h2>
                                </div>
                                
                                <form className="mt-11">
                                    <div className="flex items-center">
                                    <TbSquareRoundedLetterM className="text-purple-500 text-xl"></TbSquareRoundedLetterM>
                                        <p className=" w-1/2 focus:outline-none  py-3 px-3 text-sm leading-none text-gray-800 ">How was your jog?</p>
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
                                    <TbSquareRoundedLetterM className="text-purple-500 text-xl"></TbSquareRoundedLetterM>
                                        <p className=" w-1/2 focus:outline-none  py-3 px-3 text-sm leading-none text-gray-800 ">How long was your jog How long was your jog ?</p>
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
                                        <textarea placeholder="Habit Note" className="py-3 pl-3 overflow-y-auto h-24 border rounded border-gray-200 w-full resize-none focus:outline-none" defaultValue={""} />
                                    </div>
                                </form>
                                <div className="flex items-center justify-between mt-9">
                                    <button onclick="popuphandler(false)" className="px-6 py-3 bg-gray-400 hover:bg-gray-500 shadow rounded text-sm text-white">
                                        Cancel
                                    </button>
                                    <button className="px-6 py-3 bg-indigo-700 hover:bg-opacity-80 shadow rounded text-sm text-white">Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
