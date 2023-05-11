import { RxRocket } from "react-icons/rx";

export function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RxRocket className="h-24 w-24 animate-spin px-10"></RxRocket>
    </div>
  );
}
