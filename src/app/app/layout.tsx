"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { api } from "@/utils/api";
import type { ReactNode } from "react";
import Layout from "@/components/layout";
import { usePathname } from "next/navigation";


function L({ children }: { children: ReactNode }) {
  const path = usePathname()
  
  console.log(children);
  return (
    <Layout path={path || "/"}>
      <TooltipProvider>{children}</TooltipProvider>;
    </Layout>
  );
}

export default api.withTRPC(L);
