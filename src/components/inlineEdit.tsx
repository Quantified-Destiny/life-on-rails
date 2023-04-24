import { FrequencyHorizon } from "@prisma/client";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";

export const useInlineEdit = ({
  placeholder,
  initialText,
  commit,
}: {
  placeholder: string;
  initialText: string;
  commit: (text: string) => void;
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialText);

  const triggerProps = {
    onClick: () => setActive(true),
  };
  const editProps = {
    placeholder,
    value: text,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value),
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key == "Enter") {
        commit(text);
        console.log(`Commit with text ${text}`);
        setActive(false);
      } else if (event.key == "Escape") {
        setText("");
        setActive(false);
      }
    },
  };

  return {
    isActive,
    triggerProps,
    editProps,
  };
};

export const useInlineNumberEdit = ({
  initial,
  commit,
}: {
  initial: number;
  commit: (text: number) => void;
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [number, setNumber] = useState(initial);

  const triggerProps = {
    onClick: () => setActive(true),
  };
  const editProps = {
    value: number,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      setNumber(parseInt(e.target.value)),
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key == "Enter") {
        commit(number);
        console.log(`Commit with text ${number}`);
        setActive(false);
      } else if (event.key == "Escape") {
        setActive(false);
      }
    },
  };

  return {
    isActive,
    triggerProps,
    editProps,
  };
};

export const EditableField = ({
  placeholder,
  initialText,
  commit,
}: {
  placeholder?: string;
  initialText: string;
  commit: (text: string) => void;
}) => {
  const { isActive, triggerProps, editProps } = useInlineEdit({
    placeholder: placeholder ?? "No placeholder",
    initialText,
    commit,
  });

  return (
    <>
      {isActive ? (
        <input {...editProps} autoFocus className="font-bold" />
      ) : (
        <div
          className="group flex flex-row flex-nowrap gap-1 whitespace-nowrap"
          {...triggerProps}
        >
          <span>{initialText}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="hidden h-6 w-6 group-hover:inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
      )}
    </>
  );
};

type DropDownProps = {
  frequencyHorizon: FrequencyHorizon;
  commit: (freq: FrequencyHorizon) => void;
};

export const DropDown = ({ frequencyHorizon, commit }: DropDownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (showDropdown) {
    return (
      <select
        defaultValue={frequencyHorizon}
        onChange={(event) => {
          commit(event.target.value as FrequencyHorizon);
          setShowDropdown(false);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLSelectElement>) => {
          if (event.key == "Enter") {
            commit(event.currentTarget.value as FrequencyHorizon);
            setShowDropdown(false);
          } else if (event.key == "Escape") {
            setShowDropdown(false);
          }
        }}
      >
        <option value="DAY">Day</option>
        <option value="WEEK">Week</option>
      </select>
    );
  } else
    return (
      <span className="group">
        <span onClick={() => setShowDropdown(true)}>{frequencyHorizon}</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="hidden h-6 w-6 group-hover:inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </span>
      </span>
    );
};

export const EditableNumberField = ({
  initial,
  commit,
}: {
  initial: number;
  commit: (text: number) => void;
}) => {
  const { isActive, triggerProps, editProps } = useInlineNumberEdit({
    initial,
    commit: (number) => commit(number),
  });

  return (
    <>
      {isActive ? (
        <input
          type="number"
          {...editProps}
          autoFocus
          className="w-7 font-bold"
        />
      ) : (
        <div
          className="group inline-flex flex-row flex-nowrap gap-1 whitespace-nowrap"
          {...triggerProps}
        >
          <span>{initial}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="hidden h-6 w-6 group-hover:inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
      )}
    </>
  );
};
