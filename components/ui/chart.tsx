"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<keyof typeof THEMES, string>;
  };
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

function ChartContainer({ id, className, children, config, ...props }: React.ComponentProps<"div"> & { config: ChartConfig; children: React.ReactNode }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-slot="chart" data-chart={chartId} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children as React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, value]) => value.theme || value.color);
  if (!colorConfig.length) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `${prefix} [data-chart=${id}] { ${colorConfig
            .map(([key, itemConfig]) => {
              const color = itemConfig.theme?.[theme as keyof typeof THEMES] || itemConfig.color;
              return color ? `--color-${key}: ${color};` : null;
            })
            .filter(Boolean)
            .join(" ")} }`)
          .join("
"),
      }}
    />
  );
}

function ChartTooltipContent({ className, active, payload, label }: { className?: string; active?: boolean; payload?: Array<{ name?: string; value?: React.ReactNode; color?: string }>; label?: React.ReactNode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn("rounded-lg border bg-background p-2 text-xs shadow-sm", className)}>
      {label ? <div className="mb-1 font-medium">{label}</div> : null}
      <div className="grid gap-1">
        {payload.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-mono font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;
function ChartLegendContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center justify-center gap-4", className)} {...props} />;
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, useChart };
