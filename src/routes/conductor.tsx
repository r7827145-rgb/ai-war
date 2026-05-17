import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserCog, LogOut, ScanLine, Ticket as TicketIcon, IndianRupee, CheckCircle2, Clock, Bus as BusIcon } from "lucide-react";
import { toast } from "sonner";
import { getSession, logout, listAllBuses, type Session } from "@/lib/admin";
import { getTickets, completeTicket, type Ticket } from "@/lib/tickets";

export const Route = createFileRoute("/conductor")({
  component: ConductorDash,
  head: () => ({ meta: [{ title: "Conductor Dashboard — Where is My Bus" }] }),
});

type Tab = "overview" | "tickets" | "scanner";

function ConductorDash() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const s = getSession();
    if (!s || s.kind !== "conductor") {
      navigate({ to: "/admin-login" });
      return;
    }
    setSession(s);
    setTickets(getTickets());
  }, [navigate]);

  const refresh = () => setTickets(getTickets());

  const myBus = useMemo(() => {
    if (!session || session.kind !== "conductor") return null;
    return listAllBuses().find((b) => b.id === session.busId) ?? null;
  }, [session]);

  const myTickets = useMemo(() => {
    if (!myBus) return [];
    return tickets.filter((t) => t.busId === myBus.id || t.busNumber === myBus.number);
  }, [tickets, myBus]);

  const stats = useMemo(() => {
    const approved = myTickets.filter((t) => t.status === "completed");
    const waiting = myTickets.filter((t) => t.status === "active");
    const revenue = myTickets.reduce((s, t) => s + t.total, 0);
    return { total: myTickets.length, approved: approved.length, waiting: waiting.length, revenue };
  }, [myTickets]);

  if (!session || session.kind !== "conductor") {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  const handleLogout = () => { logout(); navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <UserCog className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold">{session.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {myBus ? `${myBus.number} · ${myBus.routeName}` : "Conductor"}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-accent">
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
          {([
            ["overview", "Overview", IndianRupee],
            ["tickets", "Tickets", TicketIcon],
            ["scanner", "Scanner", ScanLine],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                tab === id ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
              }`}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        {tab === "overview" && <Overview stats={stats} bus={myBus} />}
        {tab === "tickets" && <TicketsList tickets={myTickets} onChange={refresh} />}
        {tab === "scanner" && <Scanner tickets={myTickets} onScan={refresh} />}
      </main>
    </div>
  );
}

function Overview({ stats, bus }: { stats: { total: number; approved: number; waiting: number; revenue: number }; bus: { number: string; routeName: string } | null }) {
  const items = [
    { label: "Total Bookings", value: stats.total, icon: TicketIcon, color: "from-blue-500 to-blue-600" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: "from-emerald-500 to-emerald-600" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "from-green-500 to-green-600" },
    { label: "Waiting", value: stats.waiting, icon: Clock, color: "from-orange-500 to-orange-600" },
  ];
  return (
    <div>
      {bus && (
        <div className="mb-4 rounded-2xl border border-border bg-card p-4">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <BusIcon className="size-3" /> Assigned bus
          </p>
          <p className="mt-1 font-mono text-sm font-extrabold text-primary">{bus.number}</p>
          <p className="text-sm font-bold">{bus.routeName}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {items.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
              <s.icon className="size-4" />
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketsList({ tickets, onChange }: { tickets: Ticket[]; onChange: () => void }) {
  const approve = (id: string) => {
    completeTicket(id);
    onChange();
    toast.success("Ticket approved");
  };
  if (tickets.length === 0) return <p className="text-center text-xs text-muted-foreground">No tickets for your bus yet</p>;
  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <div key={t.id} className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold">{t.passengerName}</p>
              <p className="text-[11px] text-muted-foreground">{t.passengerPhone} · {t.seatCount} seat(s)</p>
              <p className="mt-1 font-mono text-[10px] text-primary">{t.pnr}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold">₹{t.total}</p>
              {t.status === "completed" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success"><CheckCircle2 className="size-3" /> Approved</span>
              ) : (
                <button onClick={() => approve(t.id)} className="mt-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Scanner({ tickets, onScan }: { tickets: Ticket[]; onScan: () => void }) {
  const [pnr, setPnr] = useState("");
  const [scanning, setScanning] = useState(false);
  const [last, setLast] = useState<{ ok: boolean; msg: string; ticket?: Ticket } | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  const verifyCode = (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return;
    const pnrFromCode = code.startsWith("WIMB|") ? code.split("|")[1] : code;
    const ticket = tickets.find((t) => t.pnr === pnrFromCode);
    if (!ticket) {
      setLast({ ok: false, msg: "Ticket not found for this bus" });
      return;
    }
    if (ticket.status === "completed") {
      setLast({ ok: false, msg: "Ticket already used", ticket });
      return;
    }
    completeTicket(ticket.id);
    onScan();
    setLast({ ok: true, msg: "Ticket verified ✓", ticket: { ...ticket, status: "completed" } });
    setPnr("");
    toast.success("Ticket verified");
  };

  const stopCamera = async () => {
    const s = scannerRef.current;
    if (s) {
      try { await s.stop(); } catch { /* noop */ }
      try { await s.clear(); } catch { /* noop */ }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const startCamera = async () => {
    setScanning(true);
    setLast(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      // wait for the container to mount
      await new Promise((r) => setTimeout(r, 50));
      const el = document.getElementById("qr-cam");
      if (!el) throw new Error("Camera area not ready");
      const inst = new Html5Qrcode("qr-cam");
      scannerRef.current = inst;
      await inst.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          verifyCode(decoded);
          stopCamera();
        },
        () => { /* ignore per-frame errors */ },
      );
    } catch (err) {
      toast.error("Unable to open camera. Allow camera permission or enter PNR manually.");
      console.error(err);
      setScanning(false);
    }
  };

  useEffect(() => () => { void stopCamera(); }, []);

  return (
    <div>
      <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-card p-6 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground">
          <ScanLine className="size-8" />
        </div>
        <p className="mt-3 text-sm font-bold">QR / PNR Scanner</p>
        <p className="text-[11px] text-muted-foreground">Tap scan to open camera, or enter PNR manually</p>

        {!scanning ? (
          <button
            onClick={startCamera}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            <ScanLine className="size-4" /> Scan QR
          </button>
        ) : (
          <div className="mt-4">
            <div id="qr-cam" className="mx-auto overflow-hidden rounded-xl bg-black" style={{ width: "100%", maxWidth: 320 }} />
            <button
              onClick={stopCamera}
              className="mt-3 rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-accent"
            >
              Stop camera
            </button>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            value={pnr}
            onChange={(e) => setPnr(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && verifyCode(pnr)}
            placeholder="WIMB123ABC"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-center font-mono text-sm font-bold outline-none focus:border-primary"
          />
          <button onClick={() => verifyCode(pnr)} className="rounded-xl bg-secondary px-5 text-sm font-bold">
            Verify
          </button>
        </div>
      </div>

      {last && (
        <div className={`mt-4 rounded-2xl border-2 p-4 ${last.ok ? "border-success bg-success/10" : "border-destructive bg-destructive/10"}`}>
          <p className={`flex items-center gap-1 text-sm font-extrabold ${last.ok ? "text-success" : "text-destructive"}`}>
            {last.ok ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
            {last.msg}
          </p>
          {last.ticket && (
            <div className="mt-2 text-xs text-foreground">
              <p className="font-bold">{last.ticket.passengerName}</p>
              <p>{last.ticket.from} → {last.ticket.to} · {last.ticket.seatCount} seat(s)</p>
              <p className="font-mono text-[10px] text-muted-foreground">{last.ticket.pnr}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
