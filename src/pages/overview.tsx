/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  TbSquareRoundedLetterG,
  TbSquareRoundedLetterH,
  TbSquareRoundedLetterM,
} from "react-icons/tb";
import { CreateMenu } from "../components/createMenu";
import { GoalCard } from "../components/overview/goals";
import { HabitCard } from "../components/overview/habits";
import { LinkedMetric } from "../components/overview/metrics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../components/ui/command";
import { Label } from "../components/ui/label";
import { Loader } from "../components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";

function ArchivedItems() {
  const archivedItemsQuery = api.overview.getArchivedItems.useQuery();
  const context = api.useContext();
  const unarchiveGoal = api.goals.unarchive.useMutation({
    onSettled() {
      void context.goals.invalidate();
      void context.overview.getArchivedItems.invalidate();
    },
  });
  const unarchiveHabit = api.habits.unarchive.useMutation({
    onSettled() {
      void context.goals.invalidate();
      void context.habits.invalidate();
      void context.overview.getArchivedItems.invalidate();
    },
  });
  const unarchiveMetric = api.metrics.unarchive.useMutation({
    onSettled() {
      void context.goals.invalidate();
      void context.metrics.invalidate();
      void context.overview.getArchivedItems.invalidate();
    },
  });

  if (!archivedItemsQuery.data)
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="archived">
          <AccordionContent>
            <Loader></Loader>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  const { goals, habits, metrics } = archivedItemsQuery.data;
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="archived">
        <AccordionTrigger>Archived Items</AccordionTrigger>
        <AccordionContent>
          {goals.map((goal) => (
            <div
              className="flex w-full flex-row items-center justify-between gap-2"
              key={goal.id}
            >
              <div className="col-span-1 flex w-auto flex-row items-center gap-2">
                <TbSquareRoundedLetterG className="text-2xl text-yellow-500"></TbSquareRoundedLetterG>
                {goal.name}
              </div>
              <div className="flex flex-row items-center space-x-2 justify-self-end whitespace-nowrap">
                <Button
                  variant="secondary"
                  onClick={() => unarchiveGoal.mutate({ goalId: goal.id })}
                >
                  Unarchive
                </Button>
              </div>
            </div>
          ))}
          {habits.map((habit) => (
            <div
              className="flex w-full flex-row items-center justify-between gap-2"
              key={habit.id}
            >
              <div className="col-span-1 flex w-auto flex-row items-center gap-2">
                <TbSquareRoundedLetterH className="text-2xl text-yellow-500"></TbSquareRoundedLetterH>
                {habit.description}
              </div>
              <div className="flex flex-row items-center space-x-2 justify-self-end whitespace-nowrap">
                <Button
                  variant="secondary"
                  onClick={() => unarchiveHabit.mutate({ habitId: habit.id })}
                >
                  Unarchive
                </Button>
              </div>
            </div>
          ))}
          {metrics.map((metric) => (
            <div
              className="flex w-full flex-row items-center justify-between gap-2"
              key={metric.id}
            >
              <div className="col-span-1 flex w-auto flex-row items-center gap-2">
                <TbSquareRoundedLetterM className="text-2xl text-yellow-500"></TbSquareRoundedLetterM>
                {metric.prompt}
              </div>
              <div className="flex flex-row items-center space-x-2 justify-self-end whitespace-nowrap">
                <Button
                  variant="secondary"
                  onClick={() =>
                    unarchiveMetric.mutate({ metricId: metric.id })
                  }
                >
                  Unarchive
                </Button>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function ConfigureOverview({
  filters,
  setFilters,
}: {
  filters: Filters | undefined;
  setFilters: (filters: Filters | undefined) => void;
}) {
  const tagsQuery = api.tags.getTags.useQuery();
  const [open, setOpen] = useState(false);

  if (!tagsQuery.data) {
    return (
      <div className="mx-auto w-full text-center">
        <div className="mb-4">
          <h4 className="font-semibold uppercase leading-none">Configure</h4>
        </div>
        <div className="">
          <div className="flex flex-row items-center gap-4">
            <Label className="text-sm uppercase text-gray-500">Tags</Label>
            <div>
              <Loader></Loader>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full text-center">
      <div className="mb-4">
        <h4 className="font-semibold uppercase leading-none">Configure</h4>
      </div>
      <div className="">
        <div className="flex flex-row items-center gap-4">
          <Label className="text-sm uppercase text-gray-500">Tags</Label>
          <div className="flex flex-row items-center gap-2">
            {filters?.tags.map((tag) => (
              <span key={tag} className="rounded-lg bg-gray-200">
                {tag}
              </span>
            ))}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="secondary">Add a tag</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput
                    placeholder="Pick a tag..."
                    onKeyDown={(it) => {
                      if (it.key === "Enter") {
                        setFilters({
                          tags: [
                            ...(filters?.tags ?? []),
                            it.currentTarget.value,
                          ],
                        });
                        setOpen(false);
                      }
                    }}
                  />
                  <CommandEmpty>No tag found.</CommandEmpty>
                  <CommandGroup>
                    {tagsQuery.data.map((tag) => (
                      <CommandItem
                        key={tag.name}
                        onSelect={(currentValue) => {
                          setFilters({
                            tags: [...(filters?.tags ?? []), currentValue],
                          });
                          setOpen(false);
                        }}
                      >
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {filters && (
        <div className="mt-6">
          <Button
            variant="link"
            onClick={() => {
              setFilters(undefined);
              setOpen(false);
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

function Header({
  filters,
  setFilters,
}: {
  filters: Filters | undefined;
  setFilters: (filters: Filters | undefined) => void;
}) {
  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <div>
          <h1 className="ml-2 text-xl font-semibold uppercase text-gray-800">
            Overview
          </h1>
        </div>
        <div className="flex">
          <CreateMenu></CreateMenu>
          <button className="rounded px-2 py-2 hover:bg-gray-200">
            <Popover>
              <PopoverTrigger asChild>
                <SlidersHorizontal className="fill-gray-500 stroke-gray-500" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ConfigureOverview
                  filters={filters}
                  setFilters={setFilters}
                ></ConfigureOverview>
              </PopoverContent>
            </Popover>
          </button>
        </div>
      </div>
      <p className="mb-2 px-2 text-xs italic text-slate-500">
        All scores are based off the preference in your{" "}
        <Link href="/profile" className="underline">
          user settings
        </Link>
        .
      </p>
    </>
  );
}

type Filters = {
  tags: string[];
};

function filteredData(
  data: RouterOutputs["goals"]["getAllGoals"],
  filters: Filters | undefined
) {
  if (!filters) return data;
  const selectedTags = new Set(filters.tags);

  const goals = data.goals.filter(
    (goal) =>
      goal.goal.tags.some((tag) => selectedTags.has(tag.name)) ||
      goal.habits.some((habit) =>
        habit.tags.some((tag) => selectedTags.has(tag))
      ) ||
      goal.metrics.some((metric) =>
        metric.tags.some((tag) => selectedTags.has(tag.name))
      )
  );
  const habits = data.habits.filter((it) =>
    it.tags.some((tag) => selectedTags.has(tag))
  );
  const metrics = data.metrics.filter((it) =>
    it.tags.some((tag) => selectedTags.has(tag.name))
  );
  console.log(data.habits);
  console.log(selectedTags);
  return {
    goals,
    habits,
    metrics,
  };
}

function OverviewPage() {
  const [filters, setFilters] = useState<Filters>();
  const goalsQuery = api.goals.getAllGoals.useQuery();
  const profileQuery = api.profile.getProfile.useQuery();
  if (goalsQuery.isLoading || profileQuery.isLoading) return <Loader></Loader>;
  if (goalsQuery.isError || profileQuery.isError) return <p>Query error</p>;

  const data = filteredData(goalsQuery.data, filters);
  const user = profileQuery.data;
  console.log(data);
  return (
    <div className="container max-w-4xl">
      <div className="mb-10 scrollbar-none">
        <Header filters={filters} setFilters={setFilters}></Header>
        <div className="mx-auto mt-3 grid grid-cols-2 items-center gap-2 p-6 ">
          {data.goals.map((goal) => (
            <GoalCard
              {...goal.goal}
              habits={goal.habits}
              metrics={goal.metrics}
              key={goal.goal.id}
              scoringUnit={user.scoringUnit}
            ></GoalCard>
          ))}
          {/* Habit Card with Progress Bar */}
          <h1 className="under col-span-full my-10 ml-2 text-lg font-semibold uppercase text-slate-600">
            Unlinked Items
            <hr />
          </h1>
          {data.habits.map((habit) => (
            <HabitCard
              {...habit}
              weight={0.5}
              key={habit.id}
              scoringUnit={user.scoringUnit}
            ></HabitCard>
          ))}
          {data.metrics.map((metric) => {
            return (
              <LinkedMetric
                {...metric}
                weight={0.5}
                key={metric.id}
                offset={0}
                scoringUnit={user.scoringUnit}
              ></LinkedMetric>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <ArchivedItems></ArchivedItems>
      </div>
    </div>
  );
}
export default OverviewPage;
