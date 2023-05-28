import type { ReactNode } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const HelpIcon = ({ children }: { children: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger>
      <AiFillQuestionCircle className="h-6 w-6" />
    </TooltipTrigger>
    <TooltipContent>
      {children}
    </TooltipContent>
  </Tooltip>
);
