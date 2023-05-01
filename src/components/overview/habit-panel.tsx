import { ExpandedHabit } from "../../server/queries";
import { api } from "../../utils/api";
import { State, useOverviewStore } from "../overviewState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
          </div>
          <SheetFooter className="absolute bottom-0 right-0 w-full">
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
