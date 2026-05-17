import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, Navigation, Search, Ticket as TicketIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LiveMap } from "@/components/LiveMap";
import { BusCard } from "@/components/BusCard";
import { HeroVideo } from "@/components/HeroVideo";
import { useI18n } from "@/lib/i18n";
import { KERALA_PLACES, MOCK_BUSES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Where is My Bus — Live Kerala bus tracking & ticket booking" },
      { name: "description", content: "Track Kerala public transport in real time across all 14 districts. Find routes, ETAs, fares, and book tickets in Malayalam or English." },
    ],
  }),
});

function Home() {
  const { t, lang } = useI18n();
  const isML = lang === "ml";
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const places = KERALA_PLACES.filter(
      (p) =>
        p.name.en.toLowerCase().includes(term) ||
        p.name.ml.includes(q) ||
        p.district.toLowerCase().includes(term),
    ).slice(0, 5);
    const buses = MOCK_BUSES.filter(
      (b) =>
        b.number.toLowerCase().includes(term) ||
        b.routeName.en.toLowerCase().includes(term) ||
        b.from.en.toLowerCase().includes(term) ||
        b.to.en.toLowerCase().includes(term),
    ).slice(0, 5);
    return { places, buses };
  }, [q]);

  const submit = () => {
    if (!q.trim()) return;
    navigate({ to: "/routes", search: { q } });
  };

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl text-primary-foreground shadow-[var(--shadow-elevated)]">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <HeroVideo className="rounded-3xl" />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/75 via-primary/60 to-primary/80" />
        </div>
        <div className="absolute -right-10 -top-10 z-[1] size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-[2] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
            {isML ? "തത്സമയം · 14 ജില്ലകൾ" : "Live · all 14 districts"}
          </p>
          <h1 className={`mt-1 text-2xl font-extrabold leading-tight ${isML ? "font-malayalam" : ""}`}>
            {t("findBus")}
          </h1>
          <p className={`mt-1 text-sm text-primary-foreground/85 ${isML ? "font-malayalam" : ""}`}>
            {t("findBusSub")}
          </p>

          <div className="mt-4 rounded-2xl bg-card p-3 text-foreground shadow-[var(--shadow-card)]">
            <label className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3 py-2.5">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={t("searchPlaceholder")}
                className={`w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground ${isML ? "font-malayalam" : ""}`}
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="clear" className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )}
            </label>

            {q && (suggestions as any).places && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover">
                {(suggestions as any).places.length === 0 && (suggestions as any).buses.length === 0 ? (
                  <p className={`p-3 text-xs text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("noResults")}</p>
                ) : (
                  <>
                    {(suggestions as any).places.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => navigate({ to: "/routes", search: { q: p.name.en } })}
                        className="flex w-full items-center gap-2 border-b border-border p-2.5 text-left text-sm last:border-b-0 hover:bg-accent"
                      >
                        <MapPin className="size-4 text-primary" />
                        <span className={`flex-1 ${isML ? "font-malayalam" : ""}`}>{isML ? p.name.ml : p.name.en}</span>
                        <span className="text-[11px] text-muted-foreground">{p.district}</span>
                      </button>
                    ))}
                    {(suggestions as any).buses.map((b: any) => (
                      <Link
                        key={b.id}
                        to="/bus/$busId"
                        params={{ busId: b.id }}
                        className="flex items-center gap-2 border-b border-border p-2.5 text-left text-sm last:border-b-0 hover:bg-accent"
                      >
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{b.number}</span>
                        <span className={`flex-1 truncate ${isML ? "font-malayalam" : ""}`}>{isML ? b.routeName.ml : b.routeName.en}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}

            <button
              onClick={submit}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <span className={isML ? "font-malayalam" : ""}>{t("search")}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        {/* Fallback bg in case video hasn't loaded */}
        <div className="absolute inset-0 -z-[1] rounded-3xl bg-[image:var(--gradient-hero)]" />
      </section>

      <section className="mt-5">
        <h2 className={`mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground ${isML ? "font-malayalam" : ""}`}>
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Navigation, label: t("track"), to: "/routes" as const },
            { icon: TicketIcon, label: t("tickets"), to: "/tickets" as const },
            { icon: MapPin, label: t("nearby"), to: "/routes" as const },
          ].map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)] transition hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <span className={`text-xs font-semibold leading-tight ${isML ? "font-malayalam" : ""}`}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={`text-sm font-bold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("liveBuses")}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> LIVE
          </span>
        </div>
        <LiveMap height="42vh" fitKerala />
      </section>

      <section className="mt-6 space-y-3">
        <h2 className={`text-sm font-bold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("popularRoutes")}</h2>
        {MOCK_BUSES.slice(0, 6).map((b) => (
          <BusCard key={b.id} bus={b} />
        ))}
      </section>
    </AppShell>
  );
}
