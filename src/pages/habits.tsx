import Layout from "../components/layout";

function HabitsPage() {
  return (
    <div className="container m-auto w-[80%] divide-y">
      <span>Habits</span>
    </div>
  );
}

export default () => <Layout main={HabitsPage}></Layout>;
