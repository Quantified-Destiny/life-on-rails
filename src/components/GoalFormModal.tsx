import { FormEvent, useState } from "react";
import { api } from "../utils/api";

const GoalFormModal = ({onClose}: {onClose: () => void}) => {
    // const [isModalOpen, setIsModalOpen] = useState(false);

    // const handleModalToggle = () => {
    //     setIsModalOpen(!isModalOpen);
    //   };
    const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: handle form submission
    let createGoal = api.create.createGoal.useMutation();
    let newGoal = createGoal.mutate({name: goalName});
  };


return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-40">
    <div className="flex items-center justify-center min-h-screen">
        {/* <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-medium mb-4">Create Goal</h2>
        <form>
            <label className="block mb-2">
            <span className="text-gray-700">Name</span>
            <input type="text" name="name" className="form-input mt-1 block w-full" />
            </label>
            <label className="block mb-2">
            <span className="text-gray-700">Description</span>
            <textarea name="description" className="form-textarea mt-1 block w-full"></textarea>
            </label>
            <button type="submit" className="bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700">
            Create Goal
            </button>
        </form>
        </div> */}
        <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8 bg-white">
  <div className="mb-8 ">
    <h2 className="mb-2 text-2xl font-semibold text-center">Create Goal</h2>
    <form className="flex flex-col space-y-4">
      <div className="my-3 mx-2">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title"> Title </label>
        <input className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none" 
        id="goalName" 
        type="text" 
        placeholder="Enter goal title" 
        onChange={(e) => setGoalName(e.target.value)}
        required/>
      </div>

      <div className="my-3 mx-2">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="description"> Description </label>
        <textarea 
        name="description" 
        id="goalDescription" 
        className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none" 
        placeholder="Enter goal description" 
        rows={3}
        onChange={(e) => setGoalDescription(e.target.value)}
        required></textarea>
      </div>

      <div className="flex justify-end">
        <button type="button" className="text-sm mr-2 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        onClick={onClose}>Cancel</button>
        
        <button type="submit" className="text-sm inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Create Goal</button>
      </div>
    </form>
  </div>
</div>

    </div>
    </div>
);
};

export default GoalFormModal;