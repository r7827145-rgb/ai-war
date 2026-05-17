import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bus as BusIcon, Clock, IndianRupee, MapPin, Ticket as TicketIcon, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LiveMap } from "@/components/LiveMap";
import { StatusBadge } from "@/components/StatusBadge";
import { getBusById } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/bus/$busId")({
  component: BusDetail,
  loader: ({ params }) => {
    const bus = getBusById(params.busId);
    if (!bus) throw notFound();
    return { bus };
  },
  notFoundComponent: () => (
    <AppShell>
      <p className="p-8 text-center text-sm text-muted-foreground">Bus not found.</p>
      <Link to="/routes" className="mx-auto block w-fit text-sm font-semibold text-primary">← Back to routes</Link>
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.bus.number ?? "Bus"} — Where is My Bus` }],
  }),
});

function BusDetail() {
  const { bus } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const isML = lang === "ml";

  return (
    <AppShell>
      <Link to="/routes" className={`inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground ${isML ? "font-malayalam" : ""}`}>
        <ArrowLeft className="size-4" /> {t("backToBuses")}
      </Link>

      <header className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <BusIcon className="size-6" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{bus.number}</p>
              <h1 className={`text-lg font-extrabold leading-tight text-foreground ${isML ? "font-malayalam" : ""}`}>
                {isML ? bus.routeName.ml : bus.routeName.en}
              </h1>
              <p className={`text-xs text-muted-foreground ${isML ? "font-malayalam" : ""}`}>
                {isML ? bus.operator.ml : bus.operator.en} · {bus.type}
              </p>
            </div>
          </div>
          <StatusBadge status={bus.status} />
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className={`font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>{isML ? bus.from.ml : bus.from.en}</span>
          <ArrowRight className="size-3.5 text-muted-foreground" />
          <span className={`font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>{isML ? bus.to.ml : bus.to.en}</span>
        </div>
      </header>

      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={`text-sm font-bold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("liveTracking")}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> LIVE
          </span>
        </div>
        <LiveMap height="38vh" focusBusId={bus.id} />
      </section>

      <div className="sticky top-[64px] z-30 -mx-4 mt-4 border-y border-border bg-card/95 px-4 py-2.5 shadow-[var(--shadow-card)] backdrop-blur">
        <Link
          to="/book/$busId"
          params={{ busId: bus.id }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <TicketIcon className="size-4" />
          <span className={isML ? "font-malayalam" : ""}>{t("bookNow")}</span>
          <span>· ₹{bus.fare}</span>
        </Link>
      </div>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <Stat icon={<Clock className="size-4" />} label={t("eta")} value={`${bus.etaMinutes} ${t("minutes")}`} />
        <Stat icon={<IndianRupee className="size-4" />} label={t("fare")} value={`₹${bus.fare}`} />
        <Stat icon={<Users className="size-4" />} label={t("seatsAvailable")} value={`${bus.seatsAvailable}/${bus.totalSeats}`} />
        <Stat icon={<Clock className="size-4" />} label={t("duration")} value={`${bus.durationMins} min`} />
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className={`text-sm font-bold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("busDetails")}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
          <dt className={`text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("operator")}</dt>
          <dd className={`text-right font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>{isML ? bus.operator.ml : bus.operator.en}</dd>
          <dt className={`text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("type")}</dt>
          <dd className="text-right font-semibold text-foreground">{bus.type}</dd>
          <dt className={`text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("departure")}</dt>
          <dd className="text-right font-semibold text-foreground">{bus.departure}</dd>
          <dt className={`text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("arrival")}</dt>
          <dd className="text-right font-semibold text-foreground">{bus.arrival}</dd>
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className={`text-sm font-bold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("routeStops")}</h2>
        <ol className="mt-3 space-y-3">
          {bus.stopList.map((s: typeof bus.stopList[number], i: number) => {
            const passed = bus.progress >= s.progress;
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="relative flex flex-col items-center">
                  <div className={`grid size-7 place-items-center rounded-full border-2 ${passed ? "border-success bg-success/15 text-success" : "border-border bg-background text-muted-foreground"}`}>
                    <MapPin className="size-3.5" />
                  </div>
                  {i < bus.stopList.length - 1 && <div className={`h-8 w-0.5 ${passed ? "bg-success/50" : "bg-border"}`} />}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>{isML ? s.name.ml : s.name.en}</p>
                  <p className="text-[11px] text-muted-foreground">{passed ? "Passed" : "Upcoming"}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{icon}<span>{label}</span></div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
