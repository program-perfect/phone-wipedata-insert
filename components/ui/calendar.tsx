"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({ className, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker showOutsideDays={showOutsideDays} className={cn("rounded-md border bg-card p-3 text-card-foreground", className)} {...props} />;
}

export { Calendar };
