/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { State, useOverviewStore } from "./overviewState";
import classNames from "classnames";
import { api } from "../utils/api";
import type { ReactNode } from "react";

interface FormData {
  prompt: string;
  type: "FIVE_POINT|NUMBER";
}

function Modal({
  close,
  children,
}: {
  close: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto overflow-x-hidden backdrop-blur-sm backdrop-brightness-50"
      )}
      onKeyDown={(it) => {
        console.log(it);
        if (it.key == "Escape") close();
      }}
    >
      {children}
    </div>
  );
}

export function CreateGoalModal() {
  interface GoalCreate {
    name: string;
  }
  const reset = useOverviewStore((store) => store.reset);

  const context = api.useContext();
  const mutation = api.goals.createGoal.useMutation({
    onSuccess() {
      void context.goals.getAllGoals.invalidate();
    },
  });

  const { register, handleSubmit } = useForm<GoalCreate>();
  const onSubmit = (data: GoalCreate) => {
    reset();
    console.log(data);
    mutation.mutate({
      name: data.name,
    });
  };

  return (
    <Modal close={reset}>
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={reset}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Create a goal
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="name"
                  required
                  {...register("name")}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export function CreateHabitModal() {
  interface HabitCreate {
    description: string;
  }
  const reset = useOverviewStore((store) => store.reset);

  const context = api.useContext();
  const mutation = api.habits.createHabit.useMutation({
    onSuccess() {
      void context.goals.getAllGoals.invalidate();
    },
  });

  const { register, handleSubmit } = useForm<HabitCreate>();
  const onSubmit = (data: HabitCreate) => {
    reset();
    console.log(data);
    mutation.mutate({
      description: data.description,
    });
  };

  return (
    <Modal close={reset}>
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={reset}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Create a habit
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="name"
                  required
                  {...register("description")}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export function CreateMetricModal() {
  interface MetricCreate {
    prompt: string;
  }
  const reset = useOverviewStore((store) => store.reset);

  const context = api.useContext();
  const mutation = api.metrics.createMetric.useMutation({
    onSuccess() {
      void context.goals.getAllGoals.invalidate();
    },
  });

  const { register, handleSubmit } = useForm<MetricCreate>();
  const onSubmit = (data: MetricCreate) => {
    reset();
    console.log(data);
    mutation.mutate({
      prompt: data.prompt,
    });
  };

  return (
    <Modal close={reset}>
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={reset}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Create a metric
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="name"
                  required
                  {...register("prompt")}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
