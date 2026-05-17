import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LiveMap } from "@/components/LiveMap";
import { BusCard } from "@/components/BusCard";
import { MOCK_BUSES, KERALA_PLACES } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
export const Route = createFileRoute("/routes")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: RoutesPage,
  head: () => ({ meta: [{ title: "Routes — Where is My Bus" }] }),
});

function RoutesPage() {
  const { t, lang } = useI18n();
  const isML = lang === "ml";
  const navigate = useNavigate({ from: "/routes" });
  const { q } = Route.useSearch();
  const [text, setText] = useState(q);

  useEffect(() => setText(q), [q]);

  const filtered = useMemo(() => {
    const term = text.trim().toLowerCase();
    if (!term) return MOCK_BUSES;
    return MOCK_BUSES.filter((b) => {
      const stopMatch = b.stopList.some(
        (s) => s.name.en.toLowerCase().includes(term) || s.name.ml.includes(text),
      );
      return (
        b.number.toLowerCase().includes(term) ||
        b.routeName.en.toLowerCase().includes(term) ||
        b.routeName.ml.includes(text) ||
        b.from.en.toLowerCase().includes(term) ||
        b.to.en.toLowerCase().includes(term) ||
        stopMatch
      );
    });
  }, [text]);

  const placeChips = KERALA_PLACES.slice(0, 8);

  return (
    <AppShell>
      <h1 className={`text-xl font-extrabold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("routes")}</h1>
      <p className={`mt-1 text-sm text-muted-foreground ${isML ? "font-malayalam" : ""}`}>{t("liveBuses")}</p>

      <div className="mt-4 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
        <label className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              navigate({ search: { q: e.target.value }, replace: true });
            }}
            placeholder={t("searchPlaceholder")}
            className={`w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground ${isML ? "font-malayalam" : ""}`}
          />
          {text && (
            <button onClick={() => { setText(""); navigate({ search: { q: "" }, replace: true }); }} aria-label="clear">
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </label>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {placeChips.map((p) => (
            <button
              key={p.id}
              onClick={() => { setText(p.name.en); navigate({ search: { q: p.name.en }, replace: true }); }}
              className={`shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-primary ${isML ? "font-malayalam" : ""}`}
            >
              {isML ? p.name.ml : p.name.en}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <LiveMap height="38vh" fitKerala />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "bus" : "buses"}
        </p>
      </div>

      <div className="mt-2 space-y-3">
        {filtered.length === 0 ? (
          <p className={`rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground ${isML ? "font-malayalam" : ""}`}>
            {t("noResults")}
          </p>
        ) : (
          filtered.map((b) => <BusCard key={b.id} bus={b} />)
        )}
      </div>
    </AppShell>
  );
}
