
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import Layout from "../components/layout";
import { api } from "../utils/api";

import GoalFormModal from "../components/GoalFormModal";



const CreatePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (<>
        {isModalOpen && (
            <GoalFormModal
                onClose={() => {
                    setIsModalOpen(false);
                }}
            />
        )}

        <div className="mx-auto max-w-xl border border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-semibold">Choose an option:</h2>
            <div className="flex flex-col space-y-4">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={handleModalToggle}>
                    <span className="mr-2">
                        <i className="fas fa-bullseye"></i>
                    </span>
                    <span>Create Goal</span>
                </button>
                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="mr-2"><i className="fas fa-tasks"></i></span>
                    <span>Create Subjective</span>
                </button>
                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                    <span className="mr-2"><i className="fas fa-sticky-note"></i></span>
                    <span>Create Habit</span>
                </button>
            </div>
        </div>
    </>
    );
};

export default () => <Layout main={CreatePage}></Layout>;