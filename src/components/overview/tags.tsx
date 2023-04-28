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
          className="rounded-r-full bg-gray-100 text-xs"
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
        "+ New Tag"
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
          className="hover:bg-slate:300 flex flex-row flex-nowrap divide-x-0 divide-gray-800 whitespace-nowrap rounded-r-full bg-slate-200 px-2 py-1"
        >
          <span>{tag}</span>
          <span
            className=" hover:stroke-red-300"
            onClick={() => props.unlink(tag)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer hover:stroke-red-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
      ))}
      {/* TODO add combobox features */}
      <CreateTag commit={(name: string) => props.link(name)}></CreateTag>
    </div>
  );
}
