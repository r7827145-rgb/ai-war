import { useI18n } from "@/lib/i18n";
import type { BusStatus } from "@/lib/mock-data";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const styles: Record<BusStatus, string> = {
  "on-time": "bg-success/15 text-success border-success/20",
  delayed: "bg-warning/20 text-warning-foreground border-warning/30",
  full: "bg-destructive/15 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: BusStatus }) {
  const { t } = useI18n();
  const Icon = status === "on-time" ? CheckCircle2 : status === "delayed" ? Clock : XCircle;
  const label = status === "on-time" ? t("onTime") : status === "delayed" ? t("delayed") : t("full");
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
}
