

import { useState } from "react";

const HabitFormModal = ({ onClose }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalToggle = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };
  const [habitName, sethabitName] = useState("");
  const [habitDescription, sethabitDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission
  };


  return (

    <div className="fixed z-10 inset-0 bg-black bg-opacity-40">
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8 bg-white">
          <div className="mb-8 ">
            <h2 className="mb-2 text-2xl font-semibold text-center">Create Habit</h2>
            <form className="flex flex-col space-y-4">
              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title"> Title </label>
                <input className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  id="goalName"
                  type="text"
                  placeholder="Enter habit title"
                  onChange={(e) => sethabitName(e.target.value)}
                  required />
              </div>

              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="description"> Description </label>
                <textarea
                  name="description"
                  id="goalDescription"
                  className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  placeholder="Enter habit description"
                  rows="3"
                  onChange={(e) => sethabitDescription(e.target.value)}
                  required></textarea>
              </div>

              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" for="description"> Link to a Goal (Optional)</label>
                <select
                  id="goal"
                  name="goal"
                  className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  value="helo">
                    {/* value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}>
          <option value="" ">Select a goal</option>
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option> */}
                  <option value=" ">Select a goal</option>
                <option >
                  {/* {goal.name} */}
                helo
                </option>
              </select>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm mr-2 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}>Cancel</button>

            <button type="submit" className="text-sm inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">Create Habit</button>

          </div>
        </form>
      </div>
    </div>
      </div >
    </div >
  );
};

export default HabitFormModal;