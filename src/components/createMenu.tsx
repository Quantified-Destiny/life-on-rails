import { useState } from "react";
import { Arrow, useLayer } from "react-laag";
import { useOverviewStore } from "./overviewState";

export function CreateMenu() {
  const [isOpen, setOpen] = useState(false);

  const openCreateGoalModal = useOverviewStore(
    (store) => store.openCreateGoalModal
  );
  const openCreateHabitModal = useOverviewStore(
    (store) => store.openCreateHabitModal
  );
  const openCreateMetricModal = useOverviewStore(
    (store) => store.openCreateMetricModal
  );

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    placement: "bottom-end",
    arrowOffset: 4,
    onOutsideClick: () => setOpen(false),
  });
  console.log(isOpen);

  return (
    <>
      <button
        {...triggerProps}
        onClick={() => setOpen(!isOpen)}
        className="rounded px-2 py-2 hover:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 stroke-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            className="mt-2 h-fit w-fit"
            style={{ ...layerProps.style, zIndex: 50 }}
          >
            <ul className="z-10 w-fit origin-top-right divide-y divide-gray-100 rounded-md bg-white text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <li
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                onClick={() => {
                  setOpen(false);
                  openCreateGoalModal();
                }}
              >
                New Goal
              </li>
              <li
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                onClick={() => {
                  setOpen(false);
                  openCreateHabitModal();
                }}
              >
                New Habit
              </li>
              <li
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                onClick={() => {
                  setOpen(false);
                  openCreateMetricModal();
                }}
              >
                New Metric
              </li>
            </ul>
            <Arrow {...arrowProps} size={10} roundness={2} />
          </div>
        )}
    </>
  );
}
