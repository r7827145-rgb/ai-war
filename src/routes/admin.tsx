import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Shield, LogOut, Bus as BusIcon, Calendar, Bell, Users, Plus, Trash2, Pencil, IndianRupee, TrendingUp, Send, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSession, logout, listAllBuses, saveCustomBus, deleteBus, type BusLite,
  listConductors, addConductor, deleteConductor,
  listSchedules, addSchedule, deleteSchedule,
  listNotifs, addNotif, deleteNotif,
} from "@/lib/admin";
import { getTickets } from "@/lib/tickets";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({ meta: [{ title: "Admin Panel — Where is My Bus" }] }),
});

type Tab = "overview" | "buses" | "schedules" | "conductors" | "notifications";

function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || s.kind !== "admin") {
      navigate({ to: "/admin-login" });
      return;
    }
    setReady(true);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (!ready) return <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>;

  const tabs: { id: Tab; label: string; icon: typeof BusIcon }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "buses", label: "Buses", icon: BusIcon },
    { id: "schedules", label: "Schedules", icon: Calendar },
    { id: "conductors", label: "Conductors", icon: Users },
    { id: "notifications", label: "Notify", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Shield className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-foreground">Admin Panel</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Where is My Bus</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-accent">
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
        <div className="mx-auto max-w-3xl overflow-x-auto px-4 pb-2">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                <t.icon className="size-3.5" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        {tab === "overview" && <OverviewTab />}
        {tab === "buses" && <BusesTab />}
        {tab === "schedules" && <SchedulesTab />}
        {tab === "conductors" && <ConductorsTab />}
        {tab === "notifications" && <NotifTab />}
      </main>
    </div>
  );
}

// ── Overview ─────────────────────────────────────────
function OverviewTab() {
  const tickets = getTickets();
  const totalSales = tickets.reduce((s, t) => s + t.total, 0);
  const completed = tickets.filter((t) => t.status === "completed").length;
  const buses = listAllBuses();
  const conductors = listConductors();

  const stats = [
    { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: IndianRupee, color: "from-emerald-500 to-emerald-600" },
    { label: "Total Bookings", value: tickets.length, icon: TrendingUp, color: "from-blue-500 to-blue-600" },
    { label: "Total Buses", value: buses.length, icon: BusIcon, color: "from-orange-500 to-orange-600" },
    { label: "Conductors", value: conductors.length, icon: Users, color: "from-purple-500 to-purple-600" },
    { label: "Completed Trips", value: completed, icon: TrendingUp, color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div>
      <h2 className="text-lg font-extrabold text-foreground">Dashboard</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
              <s.icon className="size-4" />
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-sm font-bold text-foreground">Recent bookings</h3>
      <div className="mt-2 space-y-2">
        {tickets.slice(0, 5).map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{t.passengerName}</p>
              <p className="truncate text-[11px] text-muted-foreground">{t.busNumber} · {t.pnr}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-primary">₹{t.total}</p>
              <p className="text-[10px] capitalize text-muted-foreground">{t.status}</p>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <p className="text-center text-xs text-muted-foreground">No bookings yet</p>}
      </div>
    </div>
  );
}

// ── Buses ─────────────────────────────────────────────
function BusesTab() {
  const [buses, setBuses] = useState<BusLite[]>([]);
  const [editing, setEditing] = useState<BusLite | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = () => setBuses(listAllBuses());
  useEffect(refresh, []);

  const remove = (id: string) => {
    if (!confirm("Delete this bus?")) return;
    deleteBus(id);
    refresh();
    toast.success("Bus deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Buses ({buses.length})</h2>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
        >
          <Plus className="size-3.5" /> Register
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {buses.map((b) => (
          <div key={b.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-primary">{b.number}</p>
                <p className="truncate text-sm font-bold">{b.routeName}</p>
                <p className="text-[11px] text-muted-foreground">{b.operator} · {b.type} · ₹{b.fare}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(b); setOpen(true); }} className="rounded-lg p-2 hover:bg-accent">
                  <Pencil className="size-3.5" />
                </button>
                <button onClick={() => remove(b.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && <BusForm initial={editing} onClose={() => { setOpen(false); refresh(); }} />}
    </div>
  );
}

function BusForm({ initial, onClose }: { initial: BusLite | null; onClose: () => void }) {
  const [f, setF] = useState<BusLite>(
    initial ?? { id: "", number: "", operator: "", type: "Ordinary", routeName: "", from: "", to: "", fare: 50, departure: "", arrival: "", totalSeats: 42 },
  );
  const set = (k: keyof BusLite, v: string | number) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.number || !f.routeName || !f.from || !f.to) return toast.error("Fill all required fields");
    saveCustomBus(initial ? f : { ...f, id: undefined });
    toast.success(initial ? "Bus updated" : "Bus registered");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold">{initial ? "Edit bus" : "Register new bus"}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-accent"><X className="size-4" /></button>
        </div>
        <div className="mt-3 space-y-2">
          {[
            ["number", "Bus Number (KL-XX-XX-9999)"],
            ["operator", "Operator"],
            ["routeName", "Route name"],
            ["from", "From"],
            ["to", "To"],
            ["departure", "Departure (HH:MM)"],
            ["arrival", "Arrival (HH:MM)"],
          ].map(([k, label]) => (
            <input key={k} value={(f as any)[k]} onChange={(e) => set(k as keyof BusLite, e.target.value)}
              placeholder={label}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          ))}
          <select value={f.type} onChange={(e) => set("type", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
            {["Ordinary", "Fast Passenger", "Super Fast", "AC Low Floor", "Volvo AC"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={f.fare} onChange={(e) => set("fare", +e.target.value)} placeholder="Fare ₹"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            <input type="number" value={f.totalSeats} onChange={(e) => set("totalSeats", +e.target.value)} placeholder="Total seats"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <button onClick={save} className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">
          {initial ? "Save changes" : "Register bus"}
        </button>
      </div>
    </div>
  );
}

// ── Schedules ────────────────────────────────────────
function SchedulesTab() {
  const [items, setItems] = useState(listSchedules());
  const buses = useMemo(listAllBuses, []);
  const [busId, setBusId] = useState(buses[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dep, setDep] = useState("");
  const [notes, setNotes] = useState("");

  const refresh = () => setItems(listSchedules());
  const add = () => {
    if (!busId || !date || !dep) return toast.error("Bus, date and departure required");
    addSchedule({ busId, date, departure: dep, notes });
    setDep(""); setNotes("");
    refresh();
    toast.success("Schedule added");
  };
  const remove = (id: string) => { deleteSchedule(id); refresh(); };

  return (
    <div>
      <h2 className="text-lg font-extrabold">Schedules</h2>
      <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-3">
        <select value={busId} onChange={(e) => setBusId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
          {buses.map((b) => <option key={b.id} value={b.id}>{b.number} · {b.routeName}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          <input type="time" value={dep} onChange={(e) => setDep(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        </div>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        <button onClick={add} className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground">
          <Plus className="size-4" /> Add schedule
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((s) => {
          const bus = buses.find((b) => b.id === s.busId);
          return (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div>
                <p className="font-mono text-xs font-bold text-primary">{bus?.number ?? s.busId}</p>
                <p className="text-sm font-bold">{s.date} · {s.departure}</p>
                {s.notes && <p className="text-[11px] text-muted-foreground">{s.notes}</p>}
              </div>
              <button onClick={() => remove(s.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-xs text-muted-foreground">No schedules yet</p>}
      </div>
    </div>
  );
}

// ── Conductors ───────────────────────────────────────
function ConductorsTab() {
  const [items, setItems] = useState(listConductors());
  const buses = useMemo(listAllBuses, []);
  const [name, setName] = useState("");
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [busId, setBusId] = useState(buses[0]?.id ?? "");

  const refresh = () => setItems(listConductors());
  const add = () => {
    if (!name || !u || !p || !busId) return toast.error("All fields required");
    if (items.some((c) => c.username === u)) return toast.error("Username already exists");
    addConductor({ name, username: u, password: p, busId });
    setName(""); setU(""); setP("");
    refresh();
    toast.success("Conductor created");
  };

  return (
    <div>
      <h2 className="text-lg font-extrabold">Conductors</h2>
      <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Conductor name"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          <input value={p} onChange={(e) => setP(e.target.value)} placeholder="Password"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        </div>
        <select value={busId} onChange={(e) => setBusId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
          {buses.map((b) => <option key={b.id} value={b.id}>{b.number} · {b.routeName}</option>)}
        </select>
        <button onClick={add} className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground">
          <Plus className="size-4" /> Create conductor
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((c) => {
          const bus = buses.find((b) => b.id === c.busId);
          return (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">@{c.username} · {bus?.number ?? "—"}</p>
              </div>
              <button
                onClick={() => { if (confirm("Remove conductor?")) { deleteConductor(c.id); refresh(); } }}
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-xs text-muted-foreground">No conductors yet</p>}
      </div>
    </div>
  );
}

// ── Notifications ────────────────────────────────────
function NotifTab() {
  const [items, setItems] = useState(listNotifs());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const refresh = () => setItems(listNotifs());
  const send = () => {
    if (!title) return toast.error("Title required");
    addNotif({ title, body });
    setTitle(""); setBody("");
    refresh();
    toast.success("Notification sent");
  };

  return (
    <div>
      <h2 className="text-lg font-extrabold">Notifications</h2>
      <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message body" rows={3}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        <button onClick={send} className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground">
          <Send className="size-4" /> Send notification
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((n) => (
          <div key={n.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold">{n.title}</p>
                {n.body && <p className="text-[11px] text-muted-foreground">{n.body}</p>}
                <p className="mt-1 text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => { deleteNotif(n.id); refresh(); }} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-xs text-muted-foreground">No notifications</p>}
      </div>
    </div>
  );
}
