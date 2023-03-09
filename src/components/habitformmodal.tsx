import { FormEvent, useState } from "react";
import { api } from "../utils/api";


interface GoalSelectorProps {
  goals: {
    id: string,
    name: string
  }[],
  selectedGoal: string | undefined,
  onSelect: (goalId: string) => void,

}
const GoalSelector = ({ goals, selectedGoal, onSelect }: GoalSelectorProps) => {
  if (goals == undefined) {
    return (
      <div>
        <span>No goals available</span>
      </div>

    );
  }
  return (
    <div>
      <select
        id="goal"
        name="goal"
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
        value={selectedGoal}
        onChange={(event) => onSelect(event.target.value)}
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
};

interface HabitFormProps {
  goals: {
    id: string,
    name: string
  }[]
  onClose: () => void
  createHabit: (habitName: string, selectedGoal: string | undefined) => void
}


function HabitForm({ goals, onClose, createHabit }: HabitFormProps) {
  const [habitName, setHabitName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>(undefined);
    return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-40">
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8 bg-white">
          <div className="mb-8 ">
            <h2 className="mb-2 text-2xl font-semibold text-center">Create Habit</h2>
            <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); createHabit(habitName, selectedGoal); onClose(); }}>
              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title"> Title </label>
                <input className="text-sm focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
                  id="goalName"
                  type="text"
                  placeholder="Enter habit title"
                  onChange={(e) => setHabitName(e.target.value)}
                  required />
              </div>

              <div className="my-3 mx-2">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="description"> Link to a Goal (Optional)</label>
                <GoalSelector goals={goals} selectedGoal={selectedGoal} onSelect={setSelectedGoal}></GoalSelector>
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
  )
}



const HabitFormModal = ({ onClose }: { onClose: () => void }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalToggle = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };

  let createHabit = api.create.createHabit.useMutation();
  let createLinkedHabit = api.create.createLinkedHabit.useMutation();

  let query = api.goals.getGoalOnly.useQuery();
  if (query.isLoading) return <p>loading...</p>;
  else if (query.isError) return <p>error</p>;
  let goals = query.data.goalData;

  const createHabitFn = (habitName: string, goalId: string | undefined) => {
    // TODO: handle form submission
    if (goalId == undefined) {
      console.log(`Creating standalone habit with description ${habitName}`);
      createHabit.mutate({ description: habitName });
    } else {
      console.log(`Creating habit with description ${habitName} (linked to ${goalId})`);
      createLinkedHabit.mutate({ description: habitName, goalId: goalId });
    }
  };


  return <HabitForm goals={goals} onClose={onClose} createHabit={createHabitFn}></HabitForm>;
};

export default HabitFormModal;