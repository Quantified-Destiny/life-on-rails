import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow } from "@windmill/react-ui";
import ReactSelect from "react-select";

type HabitItem = {
  name: string;
  schedule: string;
  completions: number;
  tags: string[];
  score: number;
};

const habitItems: HabitItem[] = [
  {
    name: "Drink 8 cups of water",
    schedule: "Daily",
    completions: 7,
    tags: ["Health"],
    score: 70,
  },
  {
    name: "Read 30 minutes",
    schedule: "Daily",
    completions: 5,
    tags: ["Personal Development"],
    score: 50,
  },
  {
    name: "Run 5k",
    schedule: "Weekly",
    completions: 2,
    tags: ["Fitness"],
    score: 60,
  },
  {
    name: "Meditate 10 minutes",
    schedule: "Daily",
    completions: 6,
    tags: ["Mental Health"],
    score: 80,
  },
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "schedule", label: "Schedule" },
  { value: "completions", label: "Completions" },
  { value: "score", label: "Score" },
];

const filterOptions = [
  { value: "All", label: "All", selected: true },
  { value: "Health", label: "Health", selected: false },
  {
    value: "Personal Development",
    label: "Personal Development",
    selected: false,
  },
  { value: "Fitness", label: "Fitness", selected: false },
  { value: "Mental Health", label: "Mental Health", selected: false },
];

export default function HabitsTable() {
  const [sortField, setSortField] = useState<keyof HabitItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFilters, setSelectedFilters] = useState(filterOptions);

  const sortedItems = habitItems.sort((a, b) => {
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1;
    } else if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1;
    } else {
      return 0;
    }
  });

  const handleSort = (field: keyof HabitItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilter = (option: { value: string; label: string }) => {
    const newSelectedFilters = selectedFilters.map((filter) => {
      if (filter.value === option.value) {
        return { ...filter, selected: !filter.selected };
      } else {
        return filter;
      }
    });

    setSelectedFilters(newSelectedFilters);
  };

  const filteredItems = selectedFilters.find((option) => option.value === "All")
    ?.selected
    ? sortedItems
    : sortedItems.filter((item) =>
        item.tags.some(
          (tag) =>
            selectedFilters.find((option) => option.value === tag)?.selected
        )
      );

  return (
    <>
      <div className="mb-4 flex flex-col justify-between sm:flex-row">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-medium">Habits</h2>
        </div>
        <div className="w-full sm:w-auto">
          <ReactSelect
            options={sortOptions}
            value={sortOptions.find((option) => option.value === sortField)}
            onChange={(option) => handleSort(option?.value as keyof HabitItem)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <ReactSelect
            options={filterOptions}
            isMulti
            value={selectedFilters.filter((filter) => filter.selected)}
            onChange={(options) =>
              options && options.length > 0
                ? setSelectedFilters(options.map((it) => it))
                : setSelectedFilters([
                    { value: "All", label: "All", selected: true },
                  ])
            }
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort("name")}>
              Name
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleSort("schedule")}
            >
              Schedule
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleSort("completions")}
            >
              Completions
            </th>
            <th className="cursor-pointer" onClick={() => handleSort("tags")}>
              Tags
            </th>
            <th className="cursor-pointer" onClick={() => handleSort("score")}>
              Score
            </th>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item, i) => (
            <TableRow key={i}>
              <td>{item.name}</td>
              <td>{item.schedule}</td>
              <td>{item.completions}</td>
              <td>{item.tags.join(", ")}</td>
              <td>{item.score}</td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
