import { RxRocket } from "react-icons/rx";

export function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RxRocket className="h-40 w-40 animate-pulse px-10 duration-300 stroke-gray-500"></RxRocket>
    </div>
  );
}
