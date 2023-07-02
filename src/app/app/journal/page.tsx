"use client";
import TimePicker from "@/components/time-picker";
import { useState } from "react";

// fixes zoomed in icons
import { CreateMenu } from "@/components/createMenu";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Memo } from "@/schema";

enum JournalEventType {
  MEMO,
  HABIT_COMPLETION,
  METRIC_COMPLETION,
}

interface JournalEvent {
  type: JournalEventType;
  start: Date;
  end?: Date;
}

interface MemoEvent extends JournalEvent {
  type: JournalEventType.MEMO;
  text: string;
}

interface HabitCompletionEvent extends JournalEvent {
  type: JournalEventType.HABIT_COMPLETION;
  habitId: string;
  metricAnswers: MetricAnswerEvent[];
}

interface MetricAnswerEvent extends JournalEvent {
  type: JournalEventType.METRIC_COMPLETION;
  metricId: string;
  score: number;
  value: number;
}

function MemoCard({ memo }: { memo: Memo }) {
  return (
    <Card>
      <Input type="text" placeholder="What do you want to write down?"></Input>
    </Card>
  );
}

function Journal() {
  const [date, setDate] = useState(today);
  return (
    <>
      <div className="flex max-w-5xl justify-center">
        <div className="w-full">
          <div className="px-4 py-4 md:px-10 md:py-7">
            <div className="flex items-center justify-between">
              <p
                tabIndex={0}
                className="text-base font-bold leading-normal text-gray-800 focus:outline-none sm:text-lg md:text-xl lg:text-2xl"
              >
                Daily Journal
              </p>
              <CreateMenu className="mt-4 inline-flex items-start justify-start rounded bg-gray-200 px-6 py-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:mt-0"></CreateMenu>
            </div>
            <div className="flex w-auto items-center justify-between">
              <TimePicker date={date} setDate={setDate}></TimePicker>
            </div>
          </div>
          <div className="px-4 py-3 md:px-6 md:py-4 xl:px-10">
            <MemoCard
              memo={{
                id: "",
                createdAt: date.toISOString(),
                updatedAt: date.toISOString(),
                text: "",
              }}
            ></MemoCard>
          </div>
        </div>
      </div>
    </>
  );
}

const today = new Date();

const JournalPage = () => {
  return <Journal></Journal>;
};

export default JournalPage;
