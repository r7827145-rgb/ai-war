import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Ticket, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const { t, lang } = useI18n();
  const { pathname } = useLocation();

  const items = [
    { to: "/", icon: Home, label: t("home") },
    { to: "/routes", icon: Map, label: t("routes") },
    { to: "/tickets", icon: Ticket, label: t("tickets") },
    { to: "/profile", icon: User, label: t("profile") },
  ] as const;
  
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const { to, icon: Icon, label } = item;
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`size-5 ${active ? "scale-110" : ""} transition-transform`} />
                <span className={lang === "ml" ? "font-malayalam" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
