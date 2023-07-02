import { ClerkProvider } from "@clerk/nextjs";

import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/800.css";
import "../styles/Calendar.css";
import "../styles/globals.css";
import PWAMeta from "../components/pwa-meta";
import Head from "next/head";

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(children);
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <PWAMeta/>
        </Head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;