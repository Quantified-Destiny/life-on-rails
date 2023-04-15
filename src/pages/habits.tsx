import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import Layout from "../components/layout";
import { api } from "../utils/api";

function HabitsPage() {
  return (
    <div className="container m-auto w-[80%] divide-y">
      <span>Habits</span>
    </div>
  );
}

export default () => <Layout main={HabitsPage}></Layout>;
