import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Shield, Lock, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { adminLogin, conductorLogin } from "@/lib/admin";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Admin Login — Where is My Bus" }] }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // Try admin first, then fall back to conductor — universal login
    if (adminLogin(u, p)) {
      toast.success("Welcome, admin");
      navigate({ to: "/admin" });
      return;
    }
    const c = conductorLogin(u, p);
    if (c) {
      toast.success(`Welcome, ${c.name}`);
      navigate({ to: "/conductor" });
      return;
    }
    toast.error("Invalid credentials");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-sm">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3" /> Back
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Shield className="size-6" />
          </div>
          <h1 className="mt-3 text-center text-lg font-extrabold text-foreground">Restricted Access</h1>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Sign in with your credentials
          </p>

          <form onSubmit={submit} className="mt-5 space-y-2">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <User className="size-4 text-muted-foreground" />
              <input
                value={u}
                onChange={(e) => setU(e.target.value)}
                placeholder="Username"
                autoFocus
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <Lock className="size-4 text-muted-foreground" />
              <input
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
