import { Goal, Habit, Metric } from "@prisma/client";
import classNames from "classnames";
import Layout from "../components/layout";
import { api } from "../utils/api";

const textcolor = (score: number | undefined) => {
  if (!score) return "text-black";
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

function HabitFooter({ tags, linked }: { tags: string[]; linked: boolean }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="rounded-r-full bg-gray-200 px-2 py-1 text-xs"
              >
                {tag}
              </div>
            ))}
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
  habits: (Habit & { completions: number; score: number; metrics: Metric[] })[];
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
        <HabitCard {...habit} weight={0.4} linked={true}></HabitCard>
      ))}
    </div>
  );
}

function HabitCard({
  linked = false,
  score,
  weight,
  description,
  frequency,
  frequencyHorizon,
  completions,
  metrics,
}: Habit & {
  score: number;
  weight: number | undefined;
  completions: number;
  linked: boolean;
  metrics: Metric[];
}) {
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
        <LinkedMetric {...m} weight={0.5}></LinkedMetric>
      ))}
      <button className="mx-auto mt-2 block w-full rounded bg-gray-100 p-2 text-sm font-bold text-gray-600 hover:bg-gray-200">
        + Create a new Linked Metric
      </button>
      <HabitFooter tags={["tag1", "tag2"]} linked={linked}></HabitFooter>
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
          Weight: {weight.toFixed(2)}
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

let today = new Date();

function OverviewPage() {
  let goalsQuery = api.goals.getGoals.useQuery({ date: today });
  if (goalsQuery.isLoading) return <p>Loading...</p>;
  if (goalsQuery.isError) return <p>Query error</p>;

  let data = goalsQuery.data;
  console.log(data.goals);
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-8">
        <>
          <Header></Header>
          {data.goals.map((goal) => (
            <GoalCard
              {...goal.goal}
              habits={goal.habits}
              metrics={goal.metrics}
            ></GoalCard>
          ))}
          {/* Habit Card with Progress Bar */}
          <h1 className="mb-4 ml-2 text-lg font-semibold uppercase text-slate-600">
            Unlinked Items
          </h1>
          {data.habits.map((habit) => (
            <HabitCard {...habit} weight={0.5} linked={false}></HabitCard>
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
