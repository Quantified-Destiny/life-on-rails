import type { FrequencyHorizon } from "@prisma/client";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";

export const useInlineEdit = ({
  initialText,
  commit,
}: {
  initialText: string;
  commit: (text: string) => void;
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialText);

  const triggerProps = {
    onClick: () => setActive(true),
  };
  const editProps = {
    value: text,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value),
    onFocus: () => {
      //setText(initialText);
    },
    onBlur: () => {
      console.log("blur");
      setActive(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key == "Enter") {
        commit(text);
        console.log(`Commit with text ${text}`);
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
  initialText,
  commit,
  className,
}: {
  initialText: string;
  commit: (text: string) => void;
  className?: string;
}) => {
  const { isActive, triggerProps, editProps } = useInlineEdit({
    initialText,
    commit,
  });

  return (
    <div
      className="group flex flex-row flex-nowrap gap-1 whitespace-nowrap"
      {...triggerProps}
    >
      {isActive ? (
        <input {...editProps} autoFocus className={className} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

type DropDownProps = {
  frequencyHorizon: FrequencyHorizon;
  commit: (freq: FrequencyHorizon) => void;
  className?: string;
};

export const DropDown = ({
  frequencyHorizon,
  commit,
  className,
}: DropDownProps) => {
  return (
    <select
      defaultValue={frequencyHorizon}
      onChange={(event) => {
        commit(event.target.value as FrequencyHorizon);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLSelectElement>) => {
        if (event.key == "Enter") {
          commit(event.currentTarget.value as FrequencyHorizon);
        } else if (event.key == "Escape") {
        }
      }}
      className={className}
    >
      <option value="DAY">Day</option>
      <option value="WEEK">Week</option>
    </select>
  );
};

export const EditableNumberField = ({
  initial,
  commit,
  className,
}: {
  initial: number;
  commit: (text: number) => void;
  className: string;
}) => {
  const { isActive, triggerProps, editProps } = useInlineNumberEdit({
    initial,
    commit: (number) => commit(number),
  });

  return (
    <>
      {isActive ? (
        <input type="number" {...editProps} autoFocus className="w-7 " />
      ) : (
        <div
          className="group inline-flex flex-row flex-nowrap gap-1 whitespace-nowrap"
          {...triggerProps}
        >
          <span className={className}>{initial}</span>

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
