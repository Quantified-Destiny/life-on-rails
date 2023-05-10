import { RxRocket } from "react-icons/rx";

export function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RxRocket className="h-1/4 w-1/4 animate-spin"></RxRocket>
    </div>
  );
}
