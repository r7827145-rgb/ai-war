import { lazy, Suspense } from "react";

const Map = lazy(() => import("./LiveMapInner").then((m) => ({ default: m.LiveMapInner })));

// Eagerly start fetching the map chunk as soon as this module is parsed in the browser
if (typeof window !== "undefined") {
  void import("./LiveMapInner");
}

export interface LiveMapProps {
  height?: string;
  focusBusId?: string;
  showRoutes?: boolean;
  fitKerala?: boolean;
}

export function LiveMap(props: LiveMapProps) {
  const height = props.height ?? "60vh";
  return (
    <Suspense
      fallback={
        <div
          className="grid place-items-center rounded-2xl border border-border bg-secondary/40 text-xs text-muted-foreground"
          style={{ height }}
        >
          Loading map…
        </div>
      }
    >
      <Map {...props} />
    </Suspense>
  );
}
