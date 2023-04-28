import { State, useOverviewStore } from "../overviewState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Sheet,
} from "../ui/sheet";

export function HabitPanel() {
  const modal = useOverviewStore((store) => store.modal);
  const reset = useOverviewStore((store) => store.reset);

  return (
    <Sheet open={modal?.state === State.HabitPanel} onOpenChange={reset}>
      <SheetContent position="right" size="sm">
        <SheetHeader>
          <SheetTitle>
            Habit {modal?.state == State.HabitPanel ? modal?.habitId : ""}
          </SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you{"'"}re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
