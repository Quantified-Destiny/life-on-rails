import { useState } from "react";
import { api } from "../utils/api";

const SubjectiveFormModal = ({ onClose }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalToggle = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };
  const [subjectiveName, setsubjectiveName] = useState("");
  const [subjectiveDescription, setsubjectiveDescription] = useState("");

  let query = api.goals.getGoalOnly.useQuery();
  let goals = query.data?.goalData;

  const [selectedGoalID, setSelectedGoalID] = useState("");
  const handleGoalChange = (event) => {
    setSelectedGoalID(event.target.value);
  };

  const dropdownList = () => {
    if (goals == null) {
      return (
        <div>
          <span>No goal to be selected</span>
        </div>

      );
    } else {
      return (
        <div>
          <select
            id="goal"
            name="goal"
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
            value={selectedGoalID}
            onChange={handleGoalChange}
          >
            <option value="">Select a goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission
    let createSubjective = api.create.createSubjective.useMutation();
    let newSubjective = createSubjective.mutate({ prompt: subjectiveName });

    let createSubjectiveMeasureGoal = api.create.createSubjectiveMeasureGoal.useMutation();
    let newLink = createSubjectiveMeasureGoal.mutate({ goalId: selectedGoalID, subjectiveId: newSubjective.data.ownerId})

    //how to add this relationship to the array in goal table and subjective table
  };


  return (

    <div className="fixed z-10 inset-0 bg-black bg-opacity-40">
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8 bg-white">
          <div className="mb-8 ">
            <h2 className="mb-2 text-2xl font-semibold text-center">Create Subjective</h2>
            <form className="flex flex-col space-y-4">
              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title"> Title </label>
                <input className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  id="subjectiveName"
                  type="text"
                  placeholder="Enter subjective title"
                  onChange={(e) => setsubjectiveName(e.target.value)}
                  required />
              </div>

              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="description"> Description </label>
                <textarea
                  name="description"
                  id="subjectiveDescription"
                  className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  placeholder="Enter subjective description"
                  rows="3"
                  onChange={(e) => setsubjectiveDescription(e.target.value)}
                  required></textarea>
              </div>

              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" for="description"> Link to a Goal (Optional)</label>
              </div>
              <dropdownList></dropdownList>
              <div className="flex justify-end">
                <button type="button" className="text-sm mr-2 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={onClose}>Cancel</button>

                <button type="submit" className="text-sm inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">Create Subjective</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectiveFormModal;