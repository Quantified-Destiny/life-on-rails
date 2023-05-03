import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function CreateTag({ commit }: { commit: (name: string) => void }) {
  const [active, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  return (
    <div
      className="cursor-pointer rounded-r-full bg-gray-200 px-2 py-1 text-xs hover:bg-gray-200"
      onClick={() => setActive(true)}
    >
      {active ? (
        <input
          autoFocus
          type="text"
          value={text}
          className="h-4 rounded-r-full bg-gray-100 text-xs"
          onBlur={() => setActive(false)}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              console.log(text);
              commit(text);
              setActive(false);
            } else if (event.key == "Escape") {
              setText("");
              setActive(false);
            }
          }}
        ></input>
      ) : (
        <span className="w-content group flex h-4 flex-row items-center gap-1">
          <PlusIcon className="h-4 w-4"></PlusIcon>
          <span className="hidden whitespace-nowrap group-hover:inline-block">
            New Tag
          </span>
        </span>
      )}
    </div>
  );
}

export function TagList(props: {
  tags: string[];
  unlink: (tagName: string) => void;
  link: (tagName: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2 pt-2">
      {props.tags.map((tag) => (
        <div
          key={tag}
          className="hover:bg-slate:300 flex flex-row flex-nowrap items-center rounded-r-full bg-slate-200"
        >
          <span className="h-4 text-xs">{tag}</span>
          <button
            className="h-6 w-6 hover:stroke-red-300"
            onClick={() => props.unlink(tag)}
          >
            <MinusCircleIcon></MinusCircleIcon>
          </button>
        </div>
      ))}
      {/* TODO add combobox features */}
      <CreateTag commit={(name: string) => props.link(name)}></CreateTag>
    </div>
  );
}
