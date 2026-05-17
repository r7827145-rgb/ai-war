export type TicketStatus = "active" | "completed";
export type PaymentMethod = "cash" | "gpay" | "card";

export interface Ticket {
  id: string;
  busId: string;
  busNumber: string;
  routeName: string;
  operator: string;
  busType: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  date: string; // ISO yyyy-mm-dd
  seatCount: number;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  passengerAge?: string;
  passengerGender?: string;
  boardingPoint?: string;
  fare: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: TicketStatus;
  bookedAt: number;
  completedAt?: number;
  pnr: string;
}

const KEY = "wimb_tickets_v2";

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function getTicket(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function saveTicket(t: Ticket) {
  const all = getTickets();
  all.unshift(t);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateTicket(id: string, patch: Partial<Ticket>) {
  const all = getTickets().map((t) => (t.id === id ? { ...t, ...patch } : t));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function completeTicket(id: string) {
  updateTicket(id, { status: "completed", completedAt: Date.now() });
}

export function deleteTicket(id: string) {
  const all = getTickets().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function generatePNR() {
  return "WIMB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function qrUrl(data: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
}
