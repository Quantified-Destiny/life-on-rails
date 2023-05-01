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
  const habitData = api.habits.getHabit.useQuery(
    { habitId: habitId! },
    { enabled: habitId != null }
  );

  const data = habitData.data;
  if (!habitId || habitData.isError || habitData.isLoading || !data) {
    return <p>ERROR</p>;
  }

  return (
    <Sheet open={modal?.state === State.HabitPanel} onOpenChange={reset}>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>{data.description}</SheetTitle>
          <SheetDescription>
            Header
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <HabitCard {...data} weight={0.1}></HabitCard>
        </div>
        <SheetFooter>
          Footer
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
