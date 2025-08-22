import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GridContainer({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
}
