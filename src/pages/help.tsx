import Layout from "../components/layout";


const HelpPage = () => {
    return (<>
        <section className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-10 mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 lg:text-3xl dark:text-white">
                    FAQ's
                </h1>
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                <div>
                    <div>
                        <button className="flex items-center focus:outline-none">
                            <svg
                                className="flex-shrink-0 w-6 h-6 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                />
                            </svg>
                            <h1 className="mx-4 text-md text-gray-700 dark:text-white">
                                How can I pay for my appointment ?
                            </h1>
                        </button>
                        <div className="flex mt-8 md:mx-10 text-sm">
                            <span className="border border-blue-500" />
                            <p className="max-w-3xl px-4 text-gray-500 dark:text-gray-300">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, eum
                                quae. Harum officiis reprehenderit ex quia ducimus minima id
                                provident molestias optio nam vel, quidem iure voluptatem, repellat
                                et ipsa.
                            </p>
                        </div>
                    </div>
                    <hr className="my-8 border-gray-200 dark:border-gray-700" />
                    <div>
                        <button className="flex items-center focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 w-6 h-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <h1 className="mx-4 text-md text-gray-700 dark:text-white">
                                What can I expect at my first consultation ?
                            </h1>
                        </button>
                    </div>
                    <hr className="my-8 border-gray-200 dark:border-gray-700" />
                    <div>
                        <button className="flex items-center focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 w-6 h-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <h1 className="mx-4 text-md text-gray-700 dark:text-white">
                                What are your opening hours ?
                            </h1>
                        </button>
                    </div>
                    <hr className="my-8 border-gray-200 dark:border-gray-700" />
                    <div>
                        <button className="flex items-center focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 w-6 h-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <h1 className="mx-4 text-md text-gray-700 dark:text-white">
                                Do I need a referral ?
                            </h1>
                        </button>
                    </div>
                    <hr className="my-8 border-gray-200 dark:border-gray-700" />
                    <div>
                        <button className="flex items-center focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 w-6 h-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <h1 className="mx-4 text-md text-gray-700 dark:text-white">
                                Is the cost of the appointment covered by private health insurance ?
                            </h1>
                        </button>
                    </div>
                </div>
            </div>
            
        </section>
        <div className="absolute bottom-0 right-0 z-[-1]">
                <svg
                    width="1440"
                    height="886"
                    viewBox="0 0 1440 886"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        opacity="0.5"
                        d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
                        fill="url(#paint0_linear)"
                    />
                    <defs>
                        <linearGradient
                            id="paint0_linear"
                            x1="1308.65"
                            y1="1142.58"
                            x2="602.827"
                            y2="-418.681"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#3056D3" stop-opacity="0.36" />
                            <stop offset="1" stop-color="#F5F2FD" stop-opacity="0" />
                            <stop offset="1" stop-color="#F5F2FD" stop-opacity="0.096144" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
    </>
    );
};

export default function Page() {
    return <Layout main={HelpPage}></Layout>;
}