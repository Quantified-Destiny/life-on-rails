import "../styles/globals.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/800.css";
import classNames from "classnames";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <div className="flex flex-col">
          <div className="h-20 w-full border-2 border-gray-300 bg-gray-200 shadow-sm"></div>
          <main
            className={classNames(
              "container prose prose-slate mx-auto mt-20 h-full w-full overflow-scroll bg-white pt-5 scrollbar-none"
            )}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
export default RootLayout;
