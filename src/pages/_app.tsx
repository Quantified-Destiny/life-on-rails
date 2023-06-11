import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "../utils/api";

import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/800.css";
import Layout from "../components/layout";
import {
  Modals
} from "../components/modals";
import { TooltipProvider } from "../components/ui/tooltip";
import "../styles/Calendar.css";
import "../styles/globals.css";


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
    <ClerkProvider {...pageProps}>
      <TooltipProvider delayDuration={400} skipDelayDuration={400}>
        <SessionProvider session={session}>
          <Modals></Modals>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </TooltipProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
