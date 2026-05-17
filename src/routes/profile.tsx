import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  Star,
  Ticket as TicketIcon,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { getTickets } from "@/lib/tickets";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — Where is My Bus" }] }),
});

interface ProfileRow {
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

function Profile() {
  const { t, lang, setLang } = useI18n();
  const isML = lang === "ml";
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setName(data.display_name ?? "");
          setPhone(data.phone ?? "");
        }
      });
  }, [user]);

  const stats = useMemo(() => {
    const tickets = getTickets();
    const active = tickets.filter((x) => x.status === "active").length;
    const completed = tickets.filter((x) => x.status === "completed").length;
    return { total: tickets.length, active, completed };
  }, [user?.id]);

  if (loading) {
    return (
      <AppShell>
        <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <h1 className={`text-xl font-extrabold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("profile")}</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <UserIcon className="size-7" />
          </div>
          <p className={`mt-4 text-sm font-semibold text-foreground ${isML ? "font-malayalam" : ""}`}>
            {isML ? "സൈൻ ഇൻ ചെയ്യുക" : "Sign in to view your profile"}
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            {isML ? "സൈൻ ഇൻ" : "Sign in"}
          </Link>
        </div>
      </AppShell>
    );
  }

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: name, phone })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      setEditing(false);
      setProfile((p) => ({ ...(p ?? { avatar_url: null }), display_name: name, phone } as ProfileRow));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const avatar = profile?.avatar_url ?? user.user_metadata?.avatar_url;
  const displayName = name || user.email?.split("@")[0] || "Traveller";

  return (
    <AppShell>
      <h1 className={`text-xl font-extrabold text-foreground ${isML ? "font-malayalam" : ""}`}>{t("profile")}</h1>

      {/* Hero card */}
      <div className="mt-4 overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt="" className="size-16 rounded-full border-2 border-white/40 object-cover" />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-white/20 text-white">
              <UserIcon className="size-7" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold">{displayName}</p>
            <p className="flex items-center gap-1 truncate text-xs opacity-90">
              <Mail className="size-3" /> {user.email}
            </p>
            {phone && (
              <p className="flex items-center gap-1 truncate text-xs opacity-90">
                <Phone className="size-3" /> +91 {phone}
              </p>
            )}
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="grid size-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
            aria-label="Edit profile"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Total" value={stats.total} />
          <Stat label="Active" value={stats.active} />
          <Stat label="Completed" value={stats.completed} />
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <section className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold text-foreground">Edit profile</h2>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Display name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Phone</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <Phone className="size-4 text-muted-foreground" />
              <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} inputMode="numeric" placeholder="9876543210" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </label>
          <button onClick={save} disabled={saving} className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </section>
      )}

      {/* Quick actions */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <QuickAction
          icon={<TicketIcon className="size-5" />}
          label="My Tickets"
          sub={`${stats.total} bookings`}
          onClick={() => navigate({ to: "/tickets" })}
        />
        <QuickAction
          icon={<MapPin className="size-5" />}
          label="Find Bus"
          sub="Search routes"
          onClick={() => navigate({ to: "/" })}
        />
      </section>

      {/* Settings list */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <Row
          icon={<Globe className="size-4" />}
          label="Language"
          right={
            <button
              onClick={() => setLang(lang === "en" ? "ml" : "en")}
              className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-accent-foreground"
            >
              {lang === "en" ? "English" : "മലയാളം"}
            </button>
          }
        />
        <Row icon={<Bell className="size-4" />} label="Notifications" right={<ChevronRight className="size-4 text-muted-foreground" />} onClick={() => toast.info("Notification settings coming soon")} />
        <Row icon={<CreditCard className="size-4" />} label="Payment methods" right={<ChevronRight className="size-4 text-muted-foreground" />} onClick={() => toast.info("Only Cash on Bus is available now")} />
        <Row icon={<Shield className="size-4" />} label="Privacy & Security" right={<ChevronRight className="size-4 text-muted-foreground" />} onClick={() => toast.info("Privacy settings coming soon")} />
        <Row icon={<HelpCircle className="size-4" />} label="Help & Support" right={<ChevronRight className="size-4 text-muted-foreground" />} onClick={() => toast.info("Contact: support@wimb.app")} />
        <Row icon={<Star className="size-4" />} label="Rate the app" right={<ChevronRight className="size-4 text-muted-foreground" />} onClick={() => toast.success("Thanks for the love!")} />
        <Row icon={<Info className="size-4" />} label="About" right={<span className="text-xs text-muted-foreground">v1.0.0</span>} />
      </section>

      <button
        onClick={handleSignOut}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-bold text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-4" /> Sign out
      </button>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">Where is My Bus · Made with ❤️ in Kerala</p>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/15 p-2.5 text-center backdrop-blur">
      <p className="text-lg font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-90">{label}</p>
    </div>
  );
}

function QuickAction({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] hover:bg-accent"
    >
      <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}

function Row({ icon, label, right, onClick }: { icon: React.ReactNode; label: string; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-accent/50"
    >
      <div className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      {right}
    </button>
  );
}
