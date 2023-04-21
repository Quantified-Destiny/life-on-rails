import { Goal, Habit, Metric } from "@prisma/client";
import classNames from "classnames";
import Layout from "../components/layout";
import { api } from "../utils/api";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { SelectItem } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { ExpandedHabit, ExpandedMetric } from "../server/queries";
import { useState } from "react";

const textcolor = (score: number | undefined) => {
  if (typeof score === "undefined") return "text-black";
  return score < 0.25
    ? "text-red-500"
    : score < 0.7
    ? "text-yellow-500"
    : "text-green-400";
};

enum State {
  None,
  CreateLinkedHabit,
}

interface CreateLinkedHabit {
  state: State.CreateLinkedHabit;
  habitId: string;
  desc: string;
}
interface OverviewStore {
  modal: CreateLinkedHabit | undefined;
  openCreateLinkedModal: (habitId: string, desc: string) => void;
  reset: () => void;
}

const useStore = create<OverviewStore>()((set) => ({
  modal: undefined,
  openCreateLinkedModal: (habitId, desc) => {
    set((_state) => ({
      modal: { state: State.CreateLinkedHabit, habitId, desc },
    }));
  },
  reset: () => {
    set((_) => ({ modal: undefined }));
  },
}));

const bgcolor = (score: number | undefined) => {
  if (!score) return "text-black";
  return score < 0.25
    ? "bg-red-500"
    : score < 0.7
    ? "bg-yellow-500"
    : "bg-green-400";
};

const SelectType = () => (
  <Select.Root>
    <Select.Trigger className="SelectTrigger" aria-label="Food">
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <Select.Label className="SelectLabel">Fruits</Select.Label>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </Select.Group>

          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Vegetables</Select.Label>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" disabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </Select.Group>

          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Meat</Select.Label>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

interface FormData {
  prompt: string;
  type: "FIVE_POINT|NUMBER";
}

function CreateLinkedHabitModal({ visible }: { visible: boolean }) {
  let reset = useStore((store) => store.reset);
  let modal = useStore((store) => store.modal);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    reset();
    console.log(data);
  };

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto overflow-x-hidden backdrop-blur-sm backdrop-brightness-50",
        { hidden: !visible }
      )}
      onKeyDown={(it) => {
        console.log(it);
        if (it.key == "Escape") reset();
      }}
    >
      <div className="relative max-h-full w-full max-w-md">
        {/* Modal content */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
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
              Create a metric linked to {modal?.desc}
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="prompt"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prompt
                </label>
                <input
                  type="text"
                  id="prompt"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="name@company.com"
                  required
                  {...register("prompt")}
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
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
    </div>
  );
}

function Header() {
  return (
    <div className="mb-4 flex w-full items-end justify-between">
      <div>
        <h1 className="ml-2 text-xl font-semibold uppercase text-gray-800">
          Overview
        </h1>
      </div>
      <div className="flex">
        <button className="rounded py-2 px-2 text-gray-500 hover:bg-gray-200">
          Filter
        </button>
        <button className="rounded py-2 px-2 text-gray-500 hover:bg-gray-200">
          Sort
        </button>
        <button className="rounded py-2 px-2 text-gray-500 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        <button className="rounded stroke-gray-500 py-2 px-2 hover:bg-gray-200">
          ...
        </button>
      </div>
    </div>
  );
}

function HabitHeaderLine({
  weight,
  description,
  frequency,
  frequencyHorizon,
  score,
}: {
  weight: number | undefined;
  description: string;
  frequency: number;
  frequencyHorizon: string;
  score: number;
}) {
  return (
    <>
      <div className="mb-1">
        <span className="mb-2 inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
          Habit
        </span>
        {weight && (
          <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
            Weight: {weight.toFixed(2)}
          </span>
        )}
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className="whitespace-nowrap">
          <span className="mr-1 text-lg font-bold">{description}</span>
          <span className="text-sm lowercase text-gray-500">
            {frequency}x per {frequencyHorizon}
          </span>
        </span>
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
      <div className="my-4">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className={classNames(
              "h-2 rounded-full bg-green-500",
              bgcolor(score)
            )}
            style={{ width: score * 100 + "%" }}
          />
        </div>
      </div>
    </>
  );
}

function HabitStatusBlock({
  currentCompletions,
  target,
  weight,
}: {
  currentCompletions: number;
  target: number;
  weight: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm font-bold text-gray-500">
        <span>Completions (Current Period)</span>
        <span>
          {currentCompletions} out of {target}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm font-bold text-gray-500">
        <span>Completions Weight</span>
        <span>{weight}</span>
      </div>
    </div>
  );
}

function CreateTag({ commit }: { commit: (name: string) => void }) {
  let [active, setActive] = useState<boolean>(false);
  let [text, setText] = useState<string>("");
  return (
    <div
      className="rounded-r-full bg-gray-200 px-2 py-1 text-xs hover:bg-gray-200"
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

function HabitFooter({
  id,
  tags,
  linked,
  linkHabit,
  unlinkHabit,
}: {
  id: string;
  tags: string[];
  linked: boolean;
  linkHabit: (args: { habitId: string; tagName: string }) => void;
  unlinkHabit: (args: { habitId: string; tagName: string }) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex justify-between">
        <div>
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
              commit={(name: string) =>
                linkHabit({ habitId: id, tagName: name })
              }
            ></CreateTag>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {linked ? (
            <button className="font-bold text-blue-500 hover:underline">
              Unlink from Goal
            </button>
          ) : (
            <button className="font-bold text-blue-500 hover:underline">
              Link to Goal
            </button>
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
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-1">
        <span className="mb-2 inline-block rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
          Goal
        </span>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-gray-100 p-2 text-xl font-bold text-yellow-500">
            {score.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-5 rounded-full bg-gray-200">
          <div
            className="h-5 rounded-full bg-yellow-600"
            style={{ width: "65%" }}
          />
        </div>
      </div>
      {habits.map((habit) => (
        <HabitCard
          {...habit}
          weight={0.4}
          linked={true}
          key={habit.id}
        ></HabitCard>
      ))}
    </div>
  );
}

function HabitCard({
  id,
  linked = false,
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
  linked: boolean;
}) {
  let openModal = useStore((store) => store.openCreateLinkedModal);

  let context = api.useContext();
  let linkHabit = api.tags.linkHabit.useMutation({
    onSuccess() {
      context.goals.getGoals.invalidate();
    },
  });
  let unlinkHabit = api.tags.unlinkHabit.useMutation({
    onSuccess() {
      context.goals.getGoals.invalidate();
    },
  });

  let classes = linked
    ? "mb-6 rounded-sm border-l-4 p-6"
    : "mb-6 rounded-lg bg-white p-6 shadow-md";

  return (
    <div className={classes}>
      <HabitHeaderLine
        weight={weight}
        description={description}
        frequency={frequency}
        frequencyHorizon={frequencyHorizon}
        score={score}
      ></HabitHeaderLine>
      <HabitStatusBlock
        currentCompletions={completions}
        target={frequency}
        weight={0.76}
      ></HabitStatusBlock>
      {metrics.map((m) => (
        <LinkedMetric {...m} weight={0.5} key={m.id}></LinkedMetric>
      ))}
      <button
        className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm font-bold text-gray-600 hover:bg-gray-200"
        onClick={() => openModal(id, description)}
      >
        + Create a new Linked Metric
      </button>
      <HabitFooter
        id={id}
        tags={tags}
        linked={linked}
        linkHabit={linkHabit.mutate}
        unlinkHabit={unlinkHabit.mutate}
      ></HabitFooter>
    </div>
  );
}

function LinkedMetric({
  weight,
  prompt,
  score,
}: {
  weight: number;
  prompt: string;
  score: number;
}) {
  return (
    <div className="mt-2 rounded-lg bg-gray-100 p-4">
      <div className="mb-2">
        <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
          Linked Metric
        </span>
        <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
          Weight: {weight.toFixed(2)}
        </span>
      </div>
      <div className="flex w-full justify-between space-x-2">
        <div className="mb-2">
          <h3 className="text-sm font-bold">{prompt}</h3>
        </div>
        <div className="bg-white px-2">
          <span
            className={classNames(
              "min-w-fit text-xs font-bold",
              textcolor(score)
            )}
          >
            {score}
          </span>
        </div>
      </div>
      {/* <div class="mt-2">
<div class="h-2 rounded-full bg-gray-200">
<div class="h-2 rounded-full bg-green-500" style="width: 75%"></div>
</div> */}
    </div>
  );
}

let today = new Date();

function OverviewPage() {
  let store = useStore();
  let goalsQuery = api.goals.getGoals.useQuery({ date: today });
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;

  let data = goalsQuery.data;
  console.log(data.goals);
  return (
    <div className="bg-gray-100">
      <CreateLinkedHabitModal
        visible={store.modal?.state === State.CreateLinkedHabit}
      ></CreateLinkedHabitModal>
      <div className="container mx-auto py-8">
        <>
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
            <HabitCard
              {...habit}
              weight={0.5}
              linked={false}
              key={habit.id}
            ></HabitCard>
          ))}
        </>
      </div>
    </div>
  );
}

function Page() {
  return <Layout main={OverviewPage}></Layout>;
}

export default Page;
