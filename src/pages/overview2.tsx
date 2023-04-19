import { Goal, Habit } from "@prisma/client";
import classNames from "classnames";
import { type NextPage } from "next";
import Layout from "../components/layout";
import { api } from "../utils/api";

const textcolor = (score: number | undefined) => {
  if (!score) return "text-green-400";
  return score < 0.25
    ? "text-red-300"
    : score < 0.7
    ? "text-yellow-400"
    : "text-green-400";
};

function Header() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      </div>
      <div className="flex">
        <button className="mr-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
          Search
        </button>
        <button className="mr-2 rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700">
          Filter
        </button>
        <button className="rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700">
          Sort
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
            Weight: {weight}
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
              "rounded-lg bg-gray-100 p-2 text-xl font-bold ",
              textcolor(score)
            )}
          >
            {score}
          </div>
          {/* <span class="text-gray-400">/</span>
<div class="text-xl font-bold text-gray-400">100%</div> */}
        </div>
      </div>
      <div className="my-4">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500"
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
        <span>Habit Weight</span>
        <span>{weight}</span>
      </div>
    </div>
  );
}

function HabitFooter({ tags }: { tags: string[] }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {tags.map((tag) => (
              <div className="rounded-r-full bg-gray-200 px-2 py-1 text-xs">
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="font-bold text-blue-500 hover:underline">
            Unlink from Goal
          </button>
          <button className="font-bold text-gray-500 hover:text-gray-700">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCard({ name, score }: Goal & { score: number }) {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-1">
        <span className="mb-2 inline-block rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
          Goal
        </span>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-gray-100 p-2 text-xl font-bold text-yellow-500">
            {score}
          </div>
          {/* <span class="text-gray-400">/</span>
<div class="text-xl font-bold text-gray-400">100%</div> */}
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

      <LinkedHabit
        score={0.75}
        weight={1.0}
        description={"Run a 5k"}
        frequency={2}
        frequencyHorizon={"WEEK"}
      ></LinkedHabit>
    </div>
  );
}

function HabitCard({
  score,
  weight,
  description,
  frequency,
  frequencyHorizon,
}: Habit & { score: number; weight: number | undefined }) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
      <HabitHeaderLine
        weight={weight}
        description={description}
        frequency={frequency}
        frequencyHorizon={frequencyHorizon}
        score={score}
      ></HabitHeaderLine>
      <HabitStatusBlock
        currentCompletions={2}
        target={3}
        weight={0}
      ></HabitStatusBlock>
      <div className="mt-2 rounded-lg bg-gray-100 p-2">
        <button className="mx-auto block rounded text-sm font-bold text-gray-600">
          + Create a new Linked Metric
        </button>
      </div>
      <HabitFooter tags={["tag1", "tag2"]}></HabitFooter>
    </div>
  );
}

function LinkedHabit({
  score,
  weight,
  description,
  frequency,
  frequencyHorizon,
}: Habit & { score: number; weight: number }) {
  return (
    <div className="mb-6 rounded-sm border-l-4 p-6">
      <HabitHeaderLine
        weight={weight}
        description={description}
        frequency={frequency}
        frequencyHorizon={frequencyHorizon}
        score={score}
      ></HabitHeaderLine>
      <HabitStatusBlock
        currentCompletions={3}
        target={4}
        weight={0.1}
      ></HabitStatusBlock>

      <div className="mt-6">
        {/* Nested Habit Cards */}
        <LinkedMetric
          weight={0.5}
          prompt="Did you feel any improvement in your stamina or endurance during
                your runs this week?"
        ></LinkedMetric>
        {/* More nested Habit Cards */}
        <LinkedMetric weight={0.5} prompt="How was the run?"></LinkedMetric>

        <div className="mt-2 rounded-lg bg-gray-100 p-2">
          <button className="mx-auto block rounded text-sm font-bold text-gray-600">
            + Create a new Linked Metric
          </button>
        </div>
      </div>
      <HabitFooter tags={["tag1", "tag2"]}></HabitFooter>
    </div>
  );
}

function LinkedMetric({ weight, prompt }: { weight: number; prompt: string }) {
  return (
    <div className="mt-2 rounded-lg bg-gray-100 p-4">
      <div className="mb-2">
        <span className="inline-block rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
          Linked Metric
        </span>
        <span className="text-gray mb-2 inline-block rounded-full px-2 text-xs font-bold">
          Weight: {weight}
        </span>
      </div>
      <div className="mb-2">
        <h3 className="text-sm font-bold">{prompt}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-xs font-bold text-green-500">75%</div>
        <span className="text-gray-400">/</span>
        <div className="text-xs font-bold text-gray-400">100%</div>
      </div>
      {/* <div class="mt-2">
<div class="h-2 rounded-full bg-gray-200">
<div class="h-2 rounded-full bg-green-500" style="width: 75%"></div>
</div> */}
    </div>
  );
}

function OverviewPage() {
  return (
    <>
      {/* score, frequency/time period (schedule), weight, how many times it has been completed in the current period (2/3 times/week), maybe guages instead of progress bar, bg tint instead of pbars (implies end) */}
      <div className="bg-gray-100">
        <div className="container mx-auto py-8">
          <Header></Header>
          {/* <h1 class="mb-8 text-2xl font-bold">Overview Page</h1> */}
          {/* Goals Card */}
          <GoalCard name={"Get Fit"} score={0.65}></GoalCard>
          {/* Habit Card with Progress Bar */}
          <h1 class="mb-4 ml-2 text-lg font-semibold uppercase text-slate-600">
            Unlinked Items
          </h1>
          <HabitCard
            score={0.33}
            description={"Go for a run"}
            frequency={3}
            frequencyHorizon={"WEEK"}
          ></HabitCard>
        </div>
      </div>
    </>
  );
}

function Page() {
  return <Layout main={OverviewPage}></Layout>;
}

export default Page;
