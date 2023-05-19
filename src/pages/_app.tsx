import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/Calendar.css";
import "../styles/globals.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/800.css";
import Layout from "../components/layout";
import {
  CreateGoalModal,
  CreateHabitModal,
  CreateMetricModal,
} from "../components/modals";
import {
  useAppState as useAppState,
  State,
} from "../components/layout/overviewState";

const Modals = () => {
  const store = useAppState();
  const reset = store.reset;
  return (
    <>
      {store.modal?.state === State.CreateGoal && (
        <CreateGoalModal close={reset}></CreateGoalModal>
      )}
      {store.modal?.state === State.CreateHabit && (
        <CreateHabitModal close={reset}></CreateHabitModal>
      )}
      {store.modal?.state === State.CreateMetric && (
        <CreateMetricModal close={reset}></CreateMetricModal>
      )}
    </>
  );
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}) => {
  // I don't know or care why TS can't find this property, but it's there
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  if ([`/`, "/login"].includes(appProps.router.pathname))
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );

  return (
    <SessionProvider session={session}>
      <Modals></Modals>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
