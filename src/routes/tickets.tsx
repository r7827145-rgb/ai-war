import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bus as BusIcon, Calendar, CheckCircle2, ChevronRight, History, MapPin, Ticket as TicketIcon, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { deleteTicket, getTickets, type Ticket } from "@/lib/tickets";

export const Route = createFileRoute("/tickets")({
  component: Tickets,
  head: () => ({ meta: [{ title: "Tickets — Where is My Bus" }] }),
});

function Tickets() {
  const { t, lang } = useI18n();
  const isML = lang === "ml";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tab, setTab] = useState<"active" | "history">("active");

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const refresh = () => setTickets(getTickets());

  const { active, history } = useMemo(() => {
    return {
      active: tickets.filter((t) => t.status === "active"),
      history: tickets.filter((t) => t.status === "completed"),
    };
  }, [tickets]);

  const list = tab === "active" ? active : history;

  const remove = (id: string) => {
    if (!confirm("Cancel this ticket?")) return;
    deleteTicket(id);
    refresh();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className={`text-xl font-extrabold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("tickets")}</h1>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {tickets.length} total
        </span>
      </div>

      {/* Tabs */}
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-secondary/60 p-1">
        <button
          onClick={() => setTab("active")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
            tab === "active" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <TicketIcon className="size-3.5" /> Active
          <span className="rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">{active.length}</span>
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
            tab === "history" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <History className="size-3.5" /> History
          <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">{history.length}</span>
        </button>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            {tab === "active" ? <TicketIcon className="size-7" /> : <History className="size-7" />}
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {tab === "active" ? "No active tickets" : "No past trips yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {tab === "active" ? "Book a bus to see your ticket here" : "Completed journeys will appear here"}
          </p>
          {tab === "active" && (
            <Link to="/routes" className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
              {t("book")}
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {list.map((tk) => (
            <Link
              key={tk.id}
              to="/ticket/$id"
              params={{ id: tk.id }}
              className="block overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:border-primary"
            >
              <div className="flex items-center justify-between bg-[image:var(--gradient-primary)] px-4 py-2.5 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <BusIcon className="size-4" />
                  <span className="font-mono text-xs font-bold">{tk.busNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tk.status === "completed" && <CheckCircle2 className="size-3.5" />}
                  <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold">{tk.pnr}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-foreground">{tk.routeName}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {tk.from} → {tk.to}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-secondary/60 p-2.5 text-[11px]">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="flex items-center gap-1 font-bold"><Calendar className="size-3" />{tk.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Seats</p>
                    <p className="font-bold">{tk.seatCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">₹{tk.total}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{tk.passengerName} · {tk.passengerPhone}</span>
                  {tk.status === "active" ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(tk.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3" /> Cancel
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      View <ChevronRight className="size-3" />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
