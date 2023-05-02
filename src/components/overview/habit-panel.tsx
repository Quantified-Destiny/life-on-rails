import { useMemo } from "react";
import { api } from "../../utils/api";
import { State, useOverviewStore } from "../overviewState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { HabitCard } from "./habits";
import { useTable } from "react-table";
import { LinkHabitBox } from "./habits";

const columns = [
  {
    Header: "Column 1",
    accessor: "col1", // accessor is the "key" in the data
  },
  {
    Header: "Column 2",
    accessor: "col2",
  },
];

// function GoalsTable() {
//   const data = useMemo(
//     () => [
//       {
//         col1: "Hello",
//         col2: "World",
//       },
//       {
//         col1: "react-table",
//         col2: "rocks",
//       },
//       {
//         col1: "whatever",
//         col2: "you want",
//       },
//     ],
//     []
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data });

//   return (
//     <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
//             {headerGroup.headers.map((column) => (
//               <th
//                 {...column.getHeaderProps()}
//                 style={{
//                   borderBottom: "solid 3px red",
//                   background: "aliceblue",
//                   color: "black",
//                   fontWeight: "bold",
//                 }}
//                 key={column.id}
//               >
//                 {column.render("Header")}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()} key={row.id}>
//               {row.cells.map((cell, i) => {
//                 return (
//                   <td
//                     {...cell.getCellProps()}
//                     key={i}
//                     style={{
//                       padding: "10px",
//                       border: "solid 1px gray",
//                       background: "papayawhip",
//                     }}
//                   >
//                     {cell.render("Cell")}
//                   </td>
//                 );
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }

function GoalsTable({ habitId, goals }: { habitId: string; goals: string[] }) {
  const goalQuery = api.goals.getGoals.useQuery({ ids: goals });
  if (goalQuery.isError) {
    return <p>ERROR</p>;
  }
  if (goalQuery.isLoading) {
    return <p>LOADING</p>;
  }

  return (
    <div className="w-full space-y-2 divide-y-2 divide-gray-100">
      {goalQuery.data?.map((goal) => {
        return (
          <div
            key={goal.id}
            className="flex w-full flex-row justify-between p-2"
          >
            <div>
              <p className="text-lg">{goal.name}</p>
              <p className="text-sm text-gray-300">
                Created: {goal.createdAt.toUTCString()}
              </p>
            </div>
            <div className="space-x-2">
              <Button>Unlink</Button>
              <Button>Manage</Button>
            </div>
          </div>
        );
      })}
      <LinkHabitBox id={habitId} closeBox={() => {}}></LinkHabitBox>
    </div>
  );
}

export function HabitPanel() {
  const modal = useOverviewStore((store) => store.modal);
  const reset = useOverviewStore((store) => store.reset);
  const habitId = modal?.state == State.HabitPanel ? modal?.habitId : null;

  const habitQuery = api.habits.getHabit.useQuery(
    { habitId: habitId! },
    { enabled: habitId != null }
  );

  const data = habitQuery.data;
  if (!habitId || habitQuery.isError || habitQuery.isLoading || !data) {
    return <p>ERROR</p>;
  }

  return (
    <Sheet open={modal?.state === State.HabitPanel} onOpenChange={reset}>
      <SheetContent position="right" size="lg">
        <div className="relative h-full">
          <SheetHeader>
            <SheetTitle>{data.description}</SheetTitle>
            <SheetDescription>Configure habit information</SheetDescription>
          </SheetHeader>
          <div className="">
            <HabitCard {...data} weight={0.1}></HabitCard>

            <Accordion type="multiple" defaultValue={["stats"]}>
              <AccordionItem value="stats">
                <AccordionTrigger>Stats and calendar</AccordionTrigger>
                <AccordionContent>A bunch of stats</AccordionContent>
              </AccordionItem>
              <AccordionItem value="metrics">
                <AccordionTrigger>Metrics</AccordionTrigger>
                <AccordionContent>Metrics table</AccordionContent>
              </AccordionItem>
              <AccordionItem value="goals">
                <AccordionTrigger>Goals</AccordionTrigger>
                <AccordionContent>
                  <GoalsTable goals={data.goals} habitId={habitId} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter className="absolute bottom-0 right-0 w-full bg-gray-100 px-4 py-2">
            <Button variant="default">
              <Label>Archive</Label>
            </Button>
            <Button variant="destructive">
              <Label>Delete</Label>
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
