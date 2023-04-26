// import { useState } from "react";
// import { Table, TableHeader, TableBody, TableRow } from "@windmill/react-ui";

// type HabitItem = {
//   name: string;
//   schedule: string;
//   completions: number;
//   tags: string[];
//   score: number;
// };

// const habitItems: HabitItem[] = [
//   {
//     name: "Drink 8 cups of water",
//     schedule: "Daily",
//     completions: 7,
//     tags: ["Health"],
//     score: 70,
//   },
//   {
//     name: "Read 30 minutes",
//     schedule: "Daily",
//     completions: 5,
//     tags: ["Personal Development"],
//     score: 50,
//   },
//   {
//     name: "Run 5k",
//     schedule: "Weekly",
//     completions: 2,
//     tags: ["Fitness"],
//     score: 60,
//   },
//   {
//     name: "Meditate 10 minutes",
//     schedule: "Daily",
//     completions: 6,
//     tags: ["Mental Health"],
//     score: 80,
//   },
// ];

// const sortOptions = [
//   { value: "name", label: "Name" },
//   { value: "schedule", label: "Schedule" },
//   { value: "completions", label: "Completions" },
//   { value: "score", label: "Score" },
// ];

// const filterOptions = [
//   { value: "All", label: "All" },
//   { value: "Health", label: "Health" },
//   { value: "Personal Development", label: "Personal Development" },
//   { value: "Fitness", label: "Fitness" },
//   { value: "Mental Health", label: "Mental Health" },
// ];

// export default function HabitsTable() {
//   const [sortField, setSortField] = useState("name");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const [filterField, setFilterField] = useState("All");

//   const sortedItems = habitItems.sort((a, b) => {
//     if (a[sortField] > b[sortField]) {
//       return sortDirection === "asc" ? 1 : -1;
//     }
//     if (a[sortField] < b[sortField]) {
//       return sortDirection === "asc" ? -1 : 1;
//     }
//     return 0;
//   });

//   const filteredItems =
//     filterField === "All"
//       ? sortedItems
//       : sortedItems.filter((item) => item.tags.includes(filterField));

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <span className="mr-2">Sort by:</span>
//           <select
//             className="form-select"
//             value={sortField}
//             onChange={(e) => setSortField(e.target.value)}
//           >
//             {sortOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           <button
//             className="mx-2"
//             onClick={() =>
//               setSortDirection((direction) =>
//                 direction === "asc" ? "desc" : "asc"
//               )
//             }
//           >
//             {sortDirection === "asc" ? "▲" : "▼"}
//             </button>
//     </div>
//     <div className="flex items-center">
//       <span className="mr-2">Filter by:</span>
//       <select
//         className="form-select"
//         value={filterField}
//         onChange={(e) => setFilterField(e.target.value)}
//       >
//         {filterOptions.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   </div>
//   <Table>
//     <TableHeader>
//       <tr>
//         <th className="px-4 py-2">Name</th>
//         <th className="px-4 py-2">Schedule</th>
//         <th className="px-4 py-2">Completions</th>
//         <th className="px-4 py-2">Tags</th>
//         <th className="px-4 py-2">Score</th>
//       </tr>
//     </TableHeader>
//     <TableBody>
//       {filteredItems.map((item) => (
//         <TableRow key={item.name}>
//           <td className="px-4 py-2">{item.name}</td>
//           <td className="px-4 py-2">{item.schedule}</td>
//           <td className="px-4 py-2">{item.completions}</td>
//           <td className="px-4 py-2">{item.tags.join(", ")}</td>
//           <td className="px-4 py-2">{item.score}</td>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </div>
// );
// }

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow } from "@windmill/react-ui";

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
    { value: "Personal Development", label: "Personal Development", selected: false },
    { value: "Fitness", label: "Fitness", selected: false },
    { value: "Mental Health", label: "Mental Health", selected: false },
];

export default function HabitsTable() {
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [filterFields, setFilterFields] = useState<string[]>(["All"]);

    const sortedItems = habitItems.sort((a, b) => {
        if (a[sortField] > b[sortField]) {
            return sortDirection === "asc" ? 1 : -1;
        }
        if (a[sortField] < b[sortField]) {
            return sortDirection === "asc" ? -1 : 1;
        }
        return 0;
    });

    const filteredItems =
        filterFields.includes("All")
            ? sortedItems
            : sortedItems.filter((item) =>
                item.tags.some((tag) => filterFields.includes(tag))
            );

    const handleFilterChange = (value: string) => {
        if (value === "All") {
            setFilterFields(["All"]);
        } else {
            const index = filterFields.indexOf("All");
            if (index !== -1) {
                setFilterFields([value]);
            } else {
                const newFilterFields = [...filterFields];
                const selected = newFilterFields.includes(value);
                if (selected) {
                    newFilterFields.splice(newFilterFields.indexOf(value), 1);
                    if (newFilterFields.length === 0) {
                        setFilterFields(["All"]);
                    } else {
                        setFilterFields(newFilterFields);
                    }
                } else {
                    setFilterFields([...newFilterFields, value]);
                }
            }
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-4">
                <div>
                    <label htmlFor="sort-by">Sort by</label>
                    <select
                        id="sort-by"
                        className="mx-2"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="mx-2"
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-by">Filter by</label>
                    <select
                        id="filter-by"
                        className="mx-2"
                        value={filterFields}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        multiple
                    >
                        {filterOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                selected={option.selected}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <tr>
                        <th>Name</th>
                        <th>Schedule</th>
                        <th>Completions</th>
                        <th>Tags</th>
                        <th>Score</th>
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
        </div>
    );
}



