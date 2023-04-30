/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { FrequencyHorizon, Goal } from "@prisma/client";
import classNames from "classnames";
import { useCombobox } from "downshift";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ExpandedHabit } from "../../server/queries";
import { api } from "../../utils/api";
import { DropDown, EditableField, EditableNumberField } from "../inlineEdit";
import { textcolor } from "./lib";
import { LinkedMetric } from "./metrics";
import { TagList } from "./tags";
import { useOverviewStore } from "../overviewState";

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

export function HabitHeaderLine({
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
  frequencyHorizon: FrequencyHorizon;
  score: number;
  completions: number;
}) {
  const context = api.useContext();
  const mutation = api.habits.editHabit.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });
  const editFrequency = api.habits.editFrequency.useMutation({
    onSuccess: () => {
      void context.goals.getGoals.invalidate();
    },
  });
  const editFrequencyHorizon = api.habits.editFrequencyHorizon.useMutation({
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
            {/* {weight && (
              <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
                Weight: {weight.toFixed(2)}
              </span>
            )} */}
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
                <span className="text-md font-bold">Completed</span>

                <span className="text-md font-bold">{completions}</span>
                <span className="">/</span>
                <EditableNumberField
                  initial={frequency}
                  commit={(number) =>
                    editFrequency.mutate({ habitId: id, frequency: number })
                  }
                ></EditableNumberField>
                <span className="text-md font-bold">times this</span>
                <DropDown
                  frequencyHorizon={frequencyHorizon}
                  commit={(freq) =>
                    editFrequencyHorizon.mutate({
                      habitId: id,
                      frequencyHorizon: freq,
                    })
                  }
                ></DropDown>
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

export function LinkHabitBox({
  id,
  closeBox,
}: {
  id: string;
  closeBox: () => void;
}) {
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

export function LinkHabit({ id }: { id: string }) {
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

export function HabitFooter({
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

  const deleteHabit = api.habits.deleteHabit.useMutation({
    onSuccess() {
      void context.goals.getGoals.invalidate();
    },
  });

  const openHabitPanel = useOverviewStore((store) => store.openHabitPanel);

  return (
    <div className="mt-6 border-t-2 border-gray-200/50 pt-4">
      <div className="flex justify-between">
        <TagList
          tags={tags}
          link={(tag) => linkHabit({ habitId: id, tagName: tag })}
          unlink={(tag) => unlinkHabit({ habitId: id, tagName: tag })}
        ></TagList>
        <div className="flex items-center space-x-4">
          {linkedGoal ? (
            <button
              className="font-bold text-blue-500 hover:underline"
              onClick={() =>
                unlinkHabitFromGoal.mutate({ habitId: id, goalId: linkedGoal })
              }
            >
              Unlink
            </button>
          ) : (
            <LinkHabit id={id}></LinkHabit>
          )}
          <button
            className="font-bold text-gray-500 hover:text-red-300"
            onClick={() => deleteHabit.mutate({ habitId: id })}
          >
            Delete
          </button>
          <button
            className="font-bold text-gray-500 hover:text-red-300"
            onClick={() => openHabitPanel(id)}
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}

export function HabitCard({
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
      <div className="my-2">
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
      </div>
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
    <div className="mt-2 rounded-lg p-4">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            id="prompt"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
