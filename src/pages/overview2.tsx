/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Goal, Metric } from "@prisma/client";
import classNames from "classnames";
import { useCombobox } from "downshift";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateMenu } from "../components/createMenu";
import { EditableField } from "../components/inlineEdit";
import Layout from "../components/layout";
import {
  CreateGoalModal,
  CreateHabitModal,
  CreateMetricModal,
} from "../components/modals";
import { State, useOverviewStore } from "../components/overviewState";
import type { ExpandedHabit, ExpandedMetric } from "../server/queries";
import { api } from "../utils/api";

const textcolor = (score: number | undefined) => {
  if (typeof score === "undefined") return "text-black";
  return score < 0.25
    ? "text-red-500"
    : score < 0.7
    ? "text-yellow-500"
    : "text-green-400";
};

const bgcolor = (score: number | undefined) => {
  if (!score) return "text-black";
  return score < 0.25
    ? "bg-red-500"
    : score < 0.7
    ? "bg-yellow-500"
    : "bg-green-400";
};

function Header() {
  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <div>
        <h1 className="ml-2 text-xl font-semibold uppercase text-gray-800">
          Overview
        </h1>
      </div>
      <div className="flex">
        <button className="rounded px-2 py-2 text-gray-500 hover:bg-gray-200">
          Filter
        </button>
        <button className="rounded px-2 py-2 text-gray-500 hover:bg-gray-200">
          Sort
        </button>
        <button className="rounded px-2 py-2 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="h-6 w-6 stroke-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        <CreateMenu></CreateMenu>
        <button className="rounded stroke-gray-500 px-2 py-2 hover:bg-gray-200">
          ...
        </button>
      </div>
    </div>
  );
}

function HabitHeaderLine({
  id,
  weight,
  description,
  frequency,
  frequencyHorizon,
  score,
  completions,
}: {
  id: string;
  weight: number | undefined;
  description: string;
  frequency: number;
  frequencyHorizon: string;
  score: number;
  completions: number;
}) {
  const context = api.useContext();
  const mutation = api.habits.editHabit.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <div className="">
            <span className="mb-2 inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
              Habit
            </span>
            {weight && (
              <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
                Weight: {weight.toFixed(2)}
              </span>
            )}
          </div>
          <div className="mr-1 items-baseline text-lg font-bold">
            <EditableField
              initialText={description}
              commit={(text) =>
                mutation.mutate({ habitId: id, description: text })
              }
            ></EditableField>
            <span className="text-sm lowercase text-gray-500">
              <span className="space-x-1 text-sm">
                <span className="text-md font-bold">{completions}</span>
                <span className="">/</span>
                <span className="text-md font-bold">{frequency}</span>
                <span>
                  completions this{" "}
                  <span className="text-md font-bold">{frequencyHorizon}</span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={classNames(
              "rounded-lg bg-gray-100 p-2 text-xl font-bold",
              textcolor(score)
            )}
          >
            {score.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}

function CreateTag({ commit }: { commit: (name: string) => void }) {
  const [active, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  return (
    <div
      className="cursor-pointer rounded-r-full bg-gray-200 px-2 py-1 text-xs hover:bg-gray-200"
      onClick={() => setActive(true)}
    >
      {active ? (
        <input
          autoFocus
          type="text"
          value={text}
          className="rounded-r-full bg-gray-100 text-xs"
          onBlur={() => setActive(false)}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              console.log(text);
              commit(text);
              setActive(false);
            } else if (event.key == "Escape") {
              setText("");
              setActive(false);
            }
          }}
        ></input>
      ) : (
        "+ New Tag"
      )}
    </div>
  );
}

function getGoalsFilter(
  inputValue: string | undefined
): (_goal: Goal) => boolean {
  if (inputValue === undefined) {
    return (_goal: Goal) => true;
  }
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function goalsFilter(goal: Goal) {
    return (
      !inputValue || goal.name.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

function LinkHabitBox({ id, closeBox }: { id: string; closeBox: () => void }) {
  const context = api.useContext();

  const goalsData = api.goals.getGoals.useQuery();
  const linkHabit = api.habits.linkHabit.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });

  const goals = goalsData.data?.goals.map((it) => it.goal) ?? [];

  const [items, setItems] = useState<Goal[]>(goals);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(goals.filter(getGoalsFilter(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
  });
  return (
    <div>
      <div className="flex w-72 flex-row">
        <div className="flex gap-0.5 bg-white shadow-sm">
          <input
            placeholder="Choose a goal"
            className="w-full p-1.5"
            {...getInputProps()}
          />
          {/* <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button> */}
        </div>
        <div className="flex flex-row gap-2">
          {selectedItem ? (
            <button
              className="rounded-md bg-blue-500 px-2 font-bold text-white hover:bg-blue-700"
              onClick={() => {
                //alert(`Linked habit ${id} to goal ${selectedItem.name}`);
                linkHabit.mutate({ habitId: id, goalId: selectedItem.id });
                closeBox();
              }}
            >
              Link
            </button>
          ) : (
            <button className="cursor-not-allowed rounded bg-blue-500 px-4 py-2 font-bold text-white opacity-50">
              Link
            </button>
          )}
          <button
            className="rounded-md bg-red-600 px-2 font-bold text-white hover:bg-red-700"
            onClick={closeBox}
          >
            Cancel
          </button>
        </div>
      </div>
      <ul
        className={`absolute mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md ${
          isOpen && items.length ? "" : "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={classNames(
                {
                  "bg-blue-300": highlightedIndex === index,
                  "font-bold": selectedItem === item,
                },
                "flex flex-col px-3 py-2 shadow-sm"
              )}
              key={`${item.name}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.name}</span>
              <span className="text-sm text-gray-700">
                {item.createdAt?.toISOString() ?? "Loading..."}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function LinkHabit({ id }: { id: string }) {
  const [active, setActive] = useState<boolean>(false);
  if (!active) {
    return (
      <button
        className="font-bold text-blue-500 hover:underline"
        onClick={() => setActive(true)}
      >
        Link to Goal
      </button>
    );
  } else {
    return (
      <LinkHabitBox id={id} closeBox={() => setActive(false)}></LinkHabitBox>
    );
  }
}

function HabitFooter({
  id,
  tags,
  linkedGoal,
  linkHabit,
  unlinkHabit,
}: {
  id: string;
  tags: string[];
  linkedGoal: string | undefined;
  linkHabit: (args: { habitId: string; tagName: string }) => void;
  unlinkHabit: (args: { habitId: string; tagName: string }) => void;
}) {
  const context = api.useContext();
  const unlinkHabitFromGoal = api.habits.unlinkHabit.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="hover:bg-slate:300 flex flex-row flex-nowrap divide-x-0 divide-gray-800 whitespace-nowrap rounded-r-full bg-slate-200 px-2 py-1"
            >
              <span>{tag}</span>
              <span
                className=" hover:stroke-red-300"
                onClick={() => unlinkHabit({ habitId: id, tagName: tag })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 cursor-pointer hover:stroke-red-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          ))}
          {/* TODO add combobox features */}
          <CreateTag
            commit={(name: string) => linkHabit({ habitId: id, tagName: name })}
          ></CreateTag>
        </div>
        <div className="flex items-center space-x-4">
          {linkedGoal ? (
            <button
              className="font-bold text-blue-500 hover:underline"
              onClick={() =>
                unlinkHabitFromGoal.mutate({ habitId: id, goalId: linkedGoal })
              }
            >
              Unlink from Goal
            </button>
          ) : (
            <LinkHabit id={id}></LinkHabit>
          )}

          <button className="font-bold text-gray-500 hover:text-gray-700">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCard({
  id,
  name,
  score,
  habits,
  metrics,
}: Goal & {
  score: number;
  habits: (ExpandedHabit & {
    completions: number;
    score: number;
    metrics: ExpandedMetric[];
  })[];
  metrics: (Metric & { score: number })[];
}) {
  const context = api.useContext();
  const mutation = api.goals.editGoal.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-1 flex flex-row justify-between">
        <div className="mb-2 flex flex-col">
          <span className="mb-2 inline-block h-fit w-fit rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
            Goal
          </span>
          <div className="mb-2 flex items-center justify-between text-xl font-bold">
            <EditableField
              initialText={name}
              commit={(name) => mutation.mutate({ goalId: id, name })}
            ></EditableField>
          </div>
        </div>
        <div className="h-fit w-fit rounded-lg bg-gray-100 p-2 text-xl font-bold text-yellow-500">
          {score.toFixed(2)}
        </div>
      </div>
      <div className=" gap-x-10 space-y-2">
        {habits.map((habit) => (
          <HabitCard
            {...habit}
            weight={0.4}
            linkedGoal={id}
            key={habit.id}
          ></HabitCard>
        ))}
      </div>
    </div>
  );
}

function HabitCard({
  id,
  linkedGoal,
  score,
  weight,
  description,
  frequency,
  frequencyHorizon,
  completions,
  metrics,
  tags,
}: ExpandedHabit & {
  weight: number | undefined;
  linkedGoal?: string | undefined;
}) {
  const [createHabitActive, setCreateHabitActive] = useState<boolean>(false);

  const context = api.useContext();
  const linkHabit = api.tags.linkHabit.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });
  const unlinkHabit = api.tags.unlinkHabit.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });

  const classes = linkedGoal
    ? "rounded-sm p-6 shadow-md"
    : "rounded-lg bg-white p-6 shadow-md";

  return (
    <div className={classes}>
      <HabitHeaderLine
        id={id}
        weight={weight}
        description={description}
        frequency={frequency}
        frequencyHorizon={frequencyHorizon}
        score={score}
        completions={completions}
      ></HabitHeaderLine>
      <div className="ml-2 mt-2">
        <span className=" text-xs font-bold uppercase">Metrics</span>
      </div>
      <div className="flex flex-col flex-wrap">
        {metrics.map((m) => (
          <LinkedMetric {...m} weight={0.5} key={m.id}></LinkedMetric>
        ))}
      </div>
      {createHabitActive ? (
        <CreateLinkedMetricInline
          habitId={id}
          closeEdit={() => setCreateHabitActive(false)}
        ></CreateLinkedMetricInline>
      ) : (
        <button
          className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm font-bold text-gray-600 hover:bg-gray-200"
          onClick={() => setCreateHabitActive(true)}
        >
          + Create a new Linked Metric
        </button>
      )}
      <HabitFooter
        id={id}
        tags={tags}
        linkedGoal={linkedGoal}
        linkHabit={linkHabit.mutate}
        unlinkHabit={unlinkHabit.mutate}
      ></HabitFooter>
    </div>
  );
}

type CreateLinkedMetric = {
  prompt: string;
  type: "FIVE_POINT" | "number";
};

function CreateLinkedMetricInline({
  habitId,
  closeEdit,
}: {
  habitId: string;
  closeEdit: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLinkedMetric>();

  const context = api.useContext();

  const createLinkedMetric = api.metrics.createMetric.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });

  const onSubmit = (formData: CreateLinkedMetric) => {
    const data = { habitId, prompt: formData.prompt };
    console.log(data);
    return createLinkedMetric.mutate(data);
  };

  return (
    <div className="mt-2 rounded-lg bg-gray-100 p-4">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="prompt"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Prompt
          </label>
          <input
            type="text"
            id="prompt"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Prompt"
            required
            {...register("prompt")}
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Metric type
          </label>
          <select
            id="type"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            {...register("type")}
          >
            <option value="FIVE_POINT">5-point</option>
            <option value="number">number</option>
          </select>
        </div>
        <div className="flex flex-row gap-5">
          <button
            className="w-full rounded-lg bg-gray-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={closeEdit}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

function LinkedMetric({
  id,
  weight,
  prompt,
  score,
}: {
  id: string;
  weight: number;
  prompt: string;
  score: number;
}) {
  const context = api.useContext();
  const mutation = api.metrics.editMetric.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });

  return (
    <div className="mt-2 flex min-h-[100px] flex-row justify-between rounded-lg bg-gray-100 p-4">
      <div className="flex flex-col">
        <div className="mb-2">
          <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
            Linked Metric
          </span>
          <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
            Weight: {weight.toFixed(2)}
          </span>
        </div>
        <div className="ml-2 font-semibold">
          <EditableField
            initialText={prompt}
            commit={(text) => {
              mutation.mutate({ metricId: id, prompt: text });
            }}
          ></EditableField>
        </div>
      </div>
      <div className="h-fit bg-white px-2">
        <span
          className={classNames("h-fit text-lg font-bold", textcolor(score))}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

function OverviewPage() {
  const store = useOverviewStore();
  const goalsQuery = api.goals.getGoals.useQuery();
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;

  const data = goalsQuery.data;
  console.log(data.goals);
  return (
    <div className="h-full bg-slate-50">
      {store.modal?.state === State.CreateGoal && (
        <CreateGoalModal></CreateGoalModal>
      )}
      {store.modal?.state === State.CreateHabit && (
        <CreateHabitModal></CreateHabitModal>
      )}
      {store.modal?.state === State.CreateMetric && (
        <CreateMetricModal></CreateMetricModal>
      )}
      <div className="container mx-auto mb-10 py-2">
        <Header></Header>
        {data.goals.map((goal) => (
          <GoalCard
            {...goal.goal}
            habits={goal.habits}
            metrics={goal.metrics}
            key={goal.goal.id}
          ></GoalCard>
        ))}
        {/* Habit Card with Progress Bar */}
        <h1 className="mb-4 ml-2 text-lg font-semibold uppercase text-slate-600">
          Unlinked Items
        </h1>
        {data.habits.map((habit) => (
          <HabitCard {...habit} weight={0.5} key={habit.id}></HabitCard>
        ))}
        {data.metrics.map((metric) => {
          return (
            <LinkedMetric
              {...metric}
              weight={0.5}
              key={metric.id}
            ></LinkedMetric>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  return <Layout main={OverviewPage}></Layout>;
}

export default Page;
