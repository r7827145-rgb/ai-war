import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Bus as BusIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Phone,
  ScanLine,
  Share2,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { completeTicket, getTicket, qrUrl, type Ticket } from "@/lib/tickets";

export const Route = createFileRoute("/ticket/$id")({
  component: TicketView,
  validateSearch: z.object({ just: z.number().optional() }),
  head: () => ({ meta: [{ title: "Your ticket — Where is My Bus" }] }),
  loader: ({ params }) => {
    if (typeof window === "undefined") return { id: params.id };
    const t = getTicket(params.id);
    if (!t) throw notFound();
    return { id: params.id };
  },
});

function TicketView() {
  const { id } = Route.useParams();
  const { just } = Route.useSearch();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [showSuccess, setShowSuccess] = useState(!!just);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const t = getTicket(id);
    if (!t) {
      navigate({ to: "/tickets" });
      return;
    }
    setTicket(t);
    if (just) {
      const tm = setTimeout(() => setShowSuccess(false), 2200);
      return () => clearTimeout(tm);
    }
  }, [id, just, navigate]);

  const handleScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 1400));
    completeTicket(id);
    setTicket(getTicket(id) ?? null);
    setScanning(false);
  };

  const handleShare = async () => {
    if (!ticket) return;
    const text = `🎫 Bus Ticket — ${ticket.busNumber}\n${ticket.from} → ${ticket.to}\nDate: ${ticket.date}\nPNR: ${ticket.pnr}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Bus Ticket", text });
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  if (!ticket) {
    return (
      <AppShell>
        <p className="p-8 text-center text-sm text-muted-foreground">Loading ticket…</p>
      </AppShell>
    );
  }

  const isCompleted = ticket.status === "completed";
  const qrPayload = `WIMB|${ticket.pnr}|${ticket.busNumber}|${ticket.date}|${ticket.passengerName}|${ticket.seatCount}`;

  return (
    <AppShell>
      <Link to="/tickets" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All tickets
      </Link>

      {showSuccess && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-3 text-success">
          <CheckCircle2 className="size-5" />
          <div>
            <p className="text-sm font-bold">Booking confirmed!</p>
            <p className="text-[11px] opacity-80">Show this ticket to the conductor</p>
          </div>
        </div>
      )}

      {/* Ticket card */}
      <article className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        {/* Header */}
        <div className="relative bg-[image:var(--gradient-primary)] p-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">E-Ticket</p>
              <h1 className="text-lg font-extrabold leading-tight">{ticket.routeName}</h1>
              <p className="mt-0.5 text-[11px] opacity-90">{ticket.operator} · {ticket.busType}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                  isCompleted ? "bg-white/25" : "bg-white/20 text-white"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="size-3" /> : <span className="size-1.5 animate-pulse rounded-full bg-white" />}
                {isCompleted ? "COMPLETED" : "ACTIVE"}
              </span>
              <p className="mt-2 font-mono text-[10px] opacity-80">{ticket.busNumber}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wide opacity-75">From</p>
              <p className="text-base font-extrabold leading-tight">{ticket.from}</p>
              <p className="text-[11px] opacity-90">{ticket.departure}</p>
            </div>
            <div className="flex flex-col items-center px-2">
              <BusIcon className="size-5 opacity-90" />
              <div className="my-1 h-px w-10 bg-white/40" />
              <span className="text-[9px] font-bold opacity-80">{ticket.date}</span>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] uppercase tracking-wide opacity-75">To</p>
              <p className="text-base font-extrabold leading-tight">{ticket.to}</p>
              <p className="text-[11px] opacity-90">{ticket.arrival}</p>
            </div>
          </div>
        </div>

        {/* Tear notch */}
        <div className="relative">
          <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="mx-4 border-t-2 border-dashed border-border" />
        </div>

        {/* Passenger details */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <Detail icon={<User className="size-3.5" />} label="Passenger" value={ticket.passengerName} />
            <Detail icon={<Phone className="size-3.5" />} label="Mobile" value={`+91 ${ticket.passengerPhone}`} />
            <Detail
              icon={<TicketIcon className="size-3.5" />}
              label="Seats"
              value={`${ticket.seatCount} seat${ticket.seatCount > 1 ? "s" : ""}`}
            />
            <Detail
              icon={<MapPin className="size-3.5" />}
              label="Boarding"
              value={ticket.boardingPoint || ticket.from}
            />
            <Detail icon={<Calendar className="size-3.5" />} label="Date" value={ticket.date} />
            <Detail
              icon={<Clock className="size-3.5" />}
              label="Booked"
              value={new Date(ticket.bookedAt).toLocaleDateString()}
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 p-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">PNR</p>
              <p className="font-mono text-base font-extrabold text-primary">{ticket.pnr}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total Paid</p>
              <p className="text-base font-extrabold text-foreground">₹{ticket.total}</p>
              <p className="text-[10px] capitalize text-muted-foreground">
                {ticket.paymentMethod === "cash" ? "Cash on bus" : ticket.paymentMethod}
              </p>
            </div>
          </div>

          {/* QR */}
          <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-background p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {isCompleted ? "Ticket used" : "Scan to validate"}
            </p>
            <div className="relative mx-auto mt-3 w-fit">
              <img
                src={qrUrl(qrPayload, 220)}
                alt="Ticket QR code"
                width={220}
                height={220}
                className={`rounded-lg ${isCompleted ? "opacity-30 grayscale" : ""}`}
              />
              {isCompleted && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="rotate-[-15deg] rounded-lg border-4 border-success bg-background/80 px-4 py-1 text-lg font-extrabold uppercase text-success">
                    Used
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground">{ticket.pnr}</p>
          </div>

          {!isCompleted ? (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-3 text-xs font-semibold text-muted-foreground">
              <ScanLine className="size-4" />
              Waiting for conductor to scan
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-success/10 p-3 text-center text-xs font-semibold text-success">
              ✓ Journey completed on{" "}
              {ticket.completedAt ? new Date(ticket.completedAt).toLocaleString() : "—"}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card py-2.5 text-xs font-bold text-foreground hover:bg-accent"
            >
              <Share2 className="size-3.5" /> Share
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card py-2.5 text-xs font-bold text-foreground hover:bg-accent"
            >
              <Download className="size-3.5" /> Save
            </button>
          </div>
        </div>
      </article>
    </AppShell>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
