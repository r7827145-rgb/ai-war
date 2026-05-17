import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const taps = useRef<{ count: number; timer: ReturnType<typeof setTimeout> | null }>({ count: 0, timer: null });

  const onClick = () => {
    setLang(lang === "en" ? "ml" : "en");

    const s = taps.current;
    s.count += 1;
    if (s.timer) clearTimeout(s.timer);
    s.timer = setTimeout(() => (s.count = 0), 2000);
    if (s.count >= 6) {
      s.count = 0;
      if (s.timer) clearTimeout(s.timer);
      navigate({ to: "/admin-login" });
    }
  };

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition select-none touch-manipulation hover:bg-accent"
      aria-label="Toggle language"
    >
      <Languages className="size-3.5" />
      <span className={lang === "ml" ? "font-malayalam" : ""}>{lang === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );
}
