// Admin / Conductor mock data layer (localStorage)
import { MOCK_BUSES, type Bus } from "./mock-data";

const ADMIN_USER = "admin786";
const ADMIN_PASS = "admin786";

const SK = {
  session: "wimb_admin_session",
  conductors: "wimb_conductors",
  customBuses: "wimb_custom_buses",
  deletedBuses: "wimb_deleted_buses",
  busOverrides: "wimb_bus_overrides",
  schedules: "wimb_schedules",
  notifs: "wimb_notifications",
};

export type Session =
  | { kind: "admin"; username: string }
  | { kind: "conductor"; id: string; name: string; busId: string }
  | null;

export interface Conductor {
  id: string;
  name: string;
  username: string;
  password: string;
  busId: string;
  createdAt: number;
}

export interface Schedule {
  id: string;
  busId: string;
  date: string;
  departure: string;
  notes?: string;
}

export interface AdminNotif {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read?: boolean;
}

const read = <T,>(k: string, fb: T): T => {
  if (typeof window === "undefined") return fb;
  try {
    return JSON.parse(localStorage.getItem(k) || "null") ?? fb;
  } catch {
    return fb;
  }
};
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

// ── Auth ─────────────────────────────────────────────
export function getSession(): Session {
  return read<Session>(SK.session, null);
}
export function setSession(s: Session) {
  if (s) write(SK.session, s);
  else localStorage.removeItem(SK.session);
}
export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    setSession({ kind: "admin", username });
    return true;
  }
  return false;
}
export function conductorLogin(username: string, password: string): Conductor | null {
  const c = listConductors().find((x) => x.username === username && x.password === password);
  if (c) {
    setSession({ kind: "conductor", id: c.id, name: c.name, busId: c.busId });
    return c;
  }
  return null;
}
export function logout() {
  setSession(null);
}

// ── Conductors ───────────────────────────────────────
export function listConductors(): Conductor[] {
  return read<Conductor[]>(SK.conductors, []);
}
export function addConductor(c: Omit<Conductor, "id" | "createdAt">) {
  const all = listConductors();
  const next: Conductor = { ...c, id: "c_" + Math.random().toString(36).slice(2, 9), createdAt: Date.now() };
  all.push(next);
  write(SK.conductors, all);
  return next;
}
export function deleteConductor(id: string) {
  write(SK.conductors, listConductors().filter((c) => c.id !== id));
}

// ── Buses (mock + custom + overrides + deletions) ───
export interface BusLite {
  id: string;
  number: string;
  operator: string;
  type: string;
  routeName: string;
  from: string;
  to: string;
  fare: number;
  departure: string;
  arrival: string;
  totalSeats: number;
}

export function listAllBuses(): BusLite[] {
  const deleted = new Set(read<string[]>(SK.deletedBuses, []));
  const overrides = read<Record<string, Partial<BusLite>>>(SK.busOverrides, {});
  const base: BusLite[] = MOCK_BUSES.filter((b) => !deleted.has(b.id)).map((b: Bus) => ({
    id: b.id,
    number: b.number,
    operator: b.operator.en,
    type: b.type,
    routeName: b.routeName.en,
    from: b.from.en,
    to: b.to.en,
    fare: b.fare,
    departure: b.departure,
    arrival: b.arrival,
    totalSeats: b.totalSeats,
  })).map((b) => ({ ...b, ...(overrides[b.id] || {}) }));
  const custom = read<BusLite[]>(SK.customBuses, []);
  return [...base, ...custom];
}
export function saveCustomBus(b: Omit<BusLite, "id"> & { id?: string }) {
  const custom = read<BusLite[]>(SK.customBuses, []);
  if (b.id && custom.some((x) => x.id === b.id)) {
    write(SK.customBuses, custom.map((x) => (x.id === b.id ? { ...x, ...b } as BusLite : x)));
    return b.id;
  }
  // editing a mock bus → store override
  if (b.id && MOCK_BUSES.some((m) => m.id === b.id)) {
    const overrides = read<Record<string, Partial<BusLite>>>(SK.busOverrides, {});
    overrides[b.id] = { ...overrides[b.id], ...b };
    write(SK.busOverrides, overrides);
    return b.id;
  }
  const id = b.id || "bx_" + Math.random().toString(36).slice(2, 8);
  custom.push({ ...b, id } as BusLite);
  write(SK.customBuses, custom);
  return id;
}
export function deleteBus(id: string) {
  const custom = read<BusLite[]>(SK.customBuses, []);
  if (custom.some((x) => x.id === id)) {
    write(SK.customBuses, custom.filter((x) => x.id !== id));
    return;
  }
  const deleted = read<string[]>(SK.deletedBuses, []);
  if (!deleted.includes(id)) deleted.push(id);
  write(SK.deletedBuses, deleted);
}

// ── Schedules ────────────────────────────────────────
export function listSchedules(): Schedule[] {
  return read<Schedule[]>(SK.schedules, []);
}
export function addSchedule(s: Omit<Schedule, "id">) {
  const all = listSchedules();
  const next = { ...s, id: "s_" + Math.random().toString(36).slice(2, 8) };
  all.push(next);
  write(SK.schedules, all);
  return next;
}
export function deleteSchedule(id: string) {
  write(SK.schedules, listSchedules().filter((s) => s.id !== id));
}

// ── Notifications ────────────────────────────────────
export function listNotifs(): AdminNotif[] {
  return read<AdminNotif[]>(SK.notifs, []);
}
export function addNotif(n: Omit<AdminNotif, "id" | "createdAt">) {
  const all = listNotifs();
  const next = { ...n, id: "n_" + Math.random().toString(36).slice(2, 8), createdAt: Date.now() };
  all.unshift(next);
  write(SK.notifs, all);
  return next;
}
export function deleteNotif(id: string) {
  write(SK.notifs, listNotifs().filter((n) => n.id !== id));
}
