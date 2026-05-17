import type { Bus } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { StatusBadge } from "./StatusBadge";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bus as BusIcon, IndianRupee, Users, ChevronRight } from "lucide-react";

export function BusCard({ bus }: { bus: Bus }) {
  const { lang, t } = useI18n();
  const isML = lang === "ml";
  return (
    <Link
      to="/bus/$busId"
      params={{ busId: bus.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <BusIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wide text-muted-foreground">{bus.number}</p>
            <h3 className={`truncate text-base font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>
              {isML ? bus.routeName.ml : bus.routeName.en}
            </h3>
            <p className="text-[11px] text-muted-foreground">{bus.type}</p>
          </div>
        </div>
        <StatusBadge status={bus.status} />
      </div>

      <div className={`mt-3 flex items-center gap-2 text-sm text-muted-foreground ${isML ? "font-malayalam" : ""}`}>
        <span className="truncate">{isML ? bus.from.ml : bus.from.en}</span>
        <ArrowRight className="size-3.5 shrink-0" />
        <span className="truncate">{isML ? bus.to.ml : bus.to.en}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary/60 p-3">
        <div>
          <p className="text-[11px] text-muted-foreground">{t("eta")}</p>
          <p className="text-sm font-bold text-primary">
            {bus.etaMinutes}
            <span className={`ml-1 text-xs font-normal text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("minutes")}</span>
          </p>
        </div>
        <div>
          <p className={`text-[11px] text-muted-foreground ${isML ? "font-malayalam" : ""}`}>
            {bus.seatsAvailable > 0 ? t("seatsAvailable") : t("standingRoom")}
          </p>
          <p className="flex items-center gap-1 text-sm font-bold text-foreground">
            <Users className="size-3.5 text-muted-foreground" />
            {bus.seatsAvailable}/{bus.totalSeats}
          </p>
        </div>
        <div>
          <p className={`text-[11px] text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("fare")}</p>
          <p className="flex items-center text-sm font-bold text-foreground">
            <IndianRupee className="size-3.5" />
            {bus.fare}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{bus.departure} · {bus.durationMins} min</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          {t("viewRoute")} <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}
