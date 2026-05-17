import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ml" : "en")}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-accent"
      aria-label="Toggle language"
    >
      <Languages className="size-3.5" />
      <span className={lang === "ml" ? "font-malayalam" : ""}>{lang === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );
}
