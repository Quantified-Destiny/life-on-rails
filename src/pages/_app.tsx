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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout main={() => <Component {...pageProps} />}></Layout>;
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
