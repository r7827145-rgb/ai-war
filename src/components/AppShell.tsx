import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bus } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { BottomNav } from "./BottomNav";
import { useI18n } from "@/lib/i18n";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang } = useI18n();
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Bus className="size-5" />
            </div>
            <div className="leading-tight">
              <p className={`text-sm font-bold text-foreground ${lang === "ml" ? "font-malayalam" : ""}`}>{t("appName")}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Kerala · Live</p>
            </div>
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}
