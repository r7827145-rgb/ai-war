import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Bus as BusIcon,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  Lock,
  Minus,
  Plus,
  Smartphone,
  User,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getBusById } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { generatePNR, saveTicket, type PaymentMethod, type Ticket } from "@/lib/tickets";

export const Route = createFileRoute("/book/$busId")({
  component: Booking,
  loader: ({ params }) => {
    const bus = getBusById(params.busId);
    if (!bus) throw notFound();
    return { bus };
  },
  head: () => ({ meta: [{ title: "Book ticket — Where is My Bus" }] }),
});

type Step = "details" | "payment" | "processing";

function Booking() {
  const { bus } = Route.useLoaderData();
  const { lang } = useI18n();
  const isML = lang === "ml";
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "O" | "">("");
  const [date, setDate] = useState(today);
  const [seatCount, setSeatCount] = useState(1);
  const [boarding, setBoarding] = useState(bus.from.en);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [processing, setProcessing] = useState(false);

  const total = seatCount * bus.fare;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Enter full name";
    if (phone.length !== 10) e.phone = "Enter 10-digit mobile";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!age || +age < 1 || +age > 120) e.age = "Enter valid age";
    if (!gender) e.gender = "Select gender";
    if (!date) e.date = "Pick travel date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitDetails = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setStep("payment");
  };

  const confirmPay = async () => {
    setProcessing(true);
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1600));
    const tk: Ticket = {
      id: crypto.randomUUID(),
      busId: bus.id,
      busNumber: bus.number,
      routeName: bus.routeName.en,
      operator: bus.operator.en,
      busType: bus.type,
      from: bus.from.en,
      to: bus.to.en,
      departure: bus.departure,
      arrival: bus.arrival,
      date,
      seatCount,
      passengerName: name.trim(),
      passengerPhone: phone,
      passengerEmail: email || undefined,
      passengerAge: age,
      passengerGender: gender,
      boardingPoint: boarding,
      fare: bus.fare,
      total,
      paymentMethod: method,
      status: "active",
      bookedAt: Date.now(),
      pnr: generatePNR(),
    };
    saveTicket(tk);
    navigate({ to: "/ticket/$id", params: { id: tk.id }, search: { just: 1 } });
  };

  return (
    <AppShell>
      <Link
        to="/bus/$busId"
        params={{ busId: bus.id }}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>

      <header className="mt-3 overflow-hidden rounded-2xl bg-[image:var(--gradient-primary)] p-4 text-primary-foreground shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 opacity-90">
          <BusIcon className="size-4" />
          <p className="font-mono text-[11px] font-bold">{bus.number}</p>
          <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{bus.type}</span>
        </div>
        <h1 className={`mt-1 text-base font-extrabold ${isML ? "font-malayalam" : ""}`}>
          {isML ? bus.routeName.ml : bus.routeName.en}
        </h1>
        <div className="mt-2 flex items-center justify-between text-xs opacity-95">
          <div>
            <p className="font-bold">{bus.departure}</p>
            <p className="opacity-80">{bus.from.en}</p>
          </div>
          <div className="flex-1 px-3 text-center text-[10px] opacity-80">{bus.durationMins} min</div>
          <div className="text-right">
            <p className="font-bold">{bus.arrival}</p>
            <p className="opacity-80">{bus.to.en}</p>
          </div>
        </div>
      </header>

      <Stepper step={step} />

      {step === "details" && (
        <form onSubmit={submitDetails} className="mt-4 space-y-4">
          <Section title="Passenger details" icon={<User className="size-4" />}>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Full name *" error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anjali Ramesh"
                  className="input"
                  autoFocus
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Age *" error={errors.age}>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="25"
                    inputMode="numeric"
                    className="input"
                  />
                </Field>
                <Field label="Gender *" error={errors.gender}>
                  <div className="flex gap-1">
                    {(["M", "F", "O"] as const).map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 rounded-lg border px-1 py-2 text-xs font-bold transition ${
                          gender === g
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <Field label="Mobile number *" error={errors.phone}>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-xl border border-r-0 border-border bg-secondary/60 px-3 text-xs font-bold text-muted-foreground">
                    +91
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    inputMode="numeric"
                    className="input rounded-l-none"
                  />
                </div>
              </Field>
              <Field label="Email (optional)" error={errors.email}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                />
              </Field>
            </div>
          </Section>

          <Section title="Journey details" icon={<BusIcon className="size-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Travel date *" error={errors.date}>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Seats">
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setSeatCount((s) => Math.max(1, s - 1))}
                    className="grid size-7 place-items-center rounded-lg bg-secondary text-foreground hover:bg-accent"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="text-sm font-bold">{seatCount}</span>
                  <button
                    type="button"
                    onClick={() => setSeatCount((s) => Math.min(6, s + 1))}
                    className="grid size-7 place-items-center rounded-lg bg-secondary text-foreground hover:bg-accent"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </Field>
            </div>
            <Field label="Boarding point">
              <select value={boarding} onChange={(e) => setBoarding(e.target.value)} className="input">
                {bus.stopList.map((s: any, i: number) => (
                  <option key={i} value={s.name.en}>
                    {s.name.en}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <div className="sticky bottom-20 z-30 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {seatCount} seat{seatCount > 1 ? "s" : ""} × ₹{bus.fare}
              </span>
              <span className="text-base font-extrabold text-primary">₹{total}</span>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Continue to Payment →
            </button>
          </div>
        </form>
      )}

      {step === "payment" && (
        <div className="mt-4 space-y-4">
          <Section title="Choose payment method" icon={<CreditCard className="size-4" />}>
            <div className="space-y-2">
              <PayOption
                active={method === "cash"}
                onClick={() => setMethod("cash")}
                icon={<Banknote className="size-5" />}
                title="Cash on Bus"
                subtitle="Pay the conductor directly"
                badge="Available"
              />
              <PayOption
                disabled
                icon={<Smartphone className="size-5" />}
                title="Google Pay / UPI Apps"
                subtitle="GPay, PhonePe, Paytm"
                badge="Coming Soon"
              />
              <PayOption
                disabled
                icon={<CreditCard className="size-5" />}
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, RuPay"
                badge="Coming Soon"
              />
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-[11px] text-muted-foreground">
              <Lock className="mt-0.5 size-3.5 shrink-0" />
              <p>
                Your booking is held instantly. For Cash on Bus, show your QR ticket to the conductor at boarding.
              </p>
            </div>
          </Section>

          <Section title="Fare breakdown">
            <Row label={`Base fare × ${seatCount}`} value={`₹${bus.fare * seatCount}`} />
            <Row label="Service fee" value="₹0" />
            <Row label="GST" value="Included" />
            <div className="my-2 border-t border-border" />
            <Row label={<span className="font-bold">Total payable</span>} value={<span className="font-extrabold text-primary">₹{total}</span>} />
          </Section>

          <div className="sticky bottom-20 z-30 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
            <div className="flex gap-2">
              <button
                onClick={() => setStep("details")}
                className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground hover:bg-accent"
              >
                Back
              </button>
              <button
                onClick={confirmPay}
                className="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="size-4" />
                  {total} · Confirm Booking
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          {processing ? (
            <>
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-foreground">Confirming your booking…</p>
              <p className="text-xs text-muted-foreground">Please don't close this page</p>
            </>
          ) : (
            <CheckCircle2 className="size-10 text-success" />
          )}
        </div>
      )}

      {/* Tailwind utility shortcut for inputs */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: hsl(var(--primary)); }
      `}</style>
    </AppShell>
  );
}

function Stepper({ step }: { step: Step }) {
  const items: { id: Step; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "payment", label: "Payment" },
    { id: "processing", label: "Confirm" },
  ];
  const idx = items.findIndex((i) => i.id === step);
  return (
    <div className="mt-4 flex items-center gap-2">
      {items.map((it, i) => (
        <div key={it.id} className="flex flex-1 items-center gap-2">
          <div
            className={`grid size-6 place-items-center rounded-full text-[10px] font-bold transition ${
              i <= idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-[11px] font-semibold ${i <= idx ? "text-foreground" : "text-muted-foreground"}`}>
            {it.label}
          </span>
          {i < items.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < idx ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[10px] font-semibold text-destructive">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function PayOption({
  icon,
  title,
  subtitle,
  badge,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        disabled
          ? "cursor-not-allowed border-border bg-muted/30 opacity-60"
          : active
            ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
            : "border-border bg-background hover:border-primary"
      }`}
    >
      <div
        className={`grid size-10 place-items-center rounded-lg ${
          active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          disabled ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"
        }`}
      >
        {badge}
      </span>
    </button>
  );
}
