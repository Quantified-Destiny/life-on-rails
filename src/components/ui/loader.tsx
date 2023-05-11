import { RxRocket } from "react-icons/rx";

export function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RxRocket className="h-40 w-40 animate-spin px-10"></RxRocket>
    </div>
  );
}
