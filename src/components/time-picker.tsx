import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// fixes zoomed in icons
import "@fortawesome/fontawesome-svg-core/styles.css";

import { addDays, subDays } from "date-fns";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";

const LeftChevron = () => <FontAwesomeIcon icon={faChevronLeft} />;
const RightChevron = () => <FontAwesomeIcon icon={faChevronRight} />;

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const today = new Date();
const maxDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

const TimePicker = ({ date, setDate }: TimePickerProps) => {
  const handlePrevDay = () => {
    setDate(subDays(date, 1));
  };

  const handleNextDay = () => {
    setDate(addDays(date, 1));
  };

  const showNextDayButton = date.toDateString() !== maxDate.toDateString();
  return (
    <div
      id="time-selector"
      className="mt-3 flex h-10 w-full flex-col items-center pt-1"
    >
      <div id="selector-controls" className="flex items-center">
        <button onClick={handlePrevDay} className="bg-white bg-opacity-20 px-2">
          <LeftChevron></LeftChevron>
        </button>
        <DatePicker
          selected={date}
          onChange={(date) => date && setDate(date)}
          maxDate={maxDate}
          className="text-center"
          dateFormat="EEEE, MMMM dd, yyyy"
        />

        <button
          onClick={handleNextDay}
          className={`bg-white bg-opacity-20 px-2 ${
            date >= maxDate ? "cursor-default opacity-50" : ""
          }`}
          disabled={date >= maxDate}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            color={date >= maxDate ? "#ccc" : "#000"}
          />
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
