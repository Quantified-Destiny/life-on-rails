import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { api } from "../../utils/api";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      {text}
    </span>
  );
}

interface HabitProps {
  name: string;
}

function GoalCard({
  name,
  score,
  habits,
}: {
  name: string;
  score: number;
  habits: HabitProps[];
}) {
  return (
    <div className="mx-auto mt-2 w-[80%] rounded-lg bg-white shadow shadow-slate-300">
      <section>
        <section className="body-font text-gray-600">
          <div className="container mx-auto px-5 py-24">
            <div className="flex w-full flex-row justify-between text-center">
              <h1 className="title-font mb-2 text-2xl font-bold text-black">
                {name}
              </h1>
              <div className="">
                <div className="w-10">
                  <Sparklines
                    data={[5, 10, 5, 20, 8, 15]}
                    limit={5}
                    width={20}
                    height={10}
                  >
                    <SparklinesLine style={{ fill: "none" }} />
                  </Sparklines>
                </div>
                <div>
                  <Pill text={score.toFixed(1)}></Pill>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold uppercase text-gray-600">
              HABITS
            </span>
            <div className="m-auto rounded-lg bg-white shadow shadow-slate-300">
              <div className="mx-2 mt-4 flex-col divide-y divide-gray-200">
                {habits.map((habit) => {
                  return <div>{habit.name}</div>;
                })}
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

function GoalPage() {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id != "string") {
    return <span>error</span>;
  }

  const query = api.goals.getGoal.useQuery({ id });
  if (query.isLoading) {
    return <span>loading...</span>;
  } else if (query.error) {
    return <span>error</span>;
  }

  return (
    <GoalCard
      name={query.data.goal.name}
      score={0.5}
      habits={query.data.habits.map((habit) => ({
        name: habit.habit.description,
      }))}
    ></GoalCard>
  );
}

export default function () {
  return <Layout main={GoalPage}></Layout>;
}
