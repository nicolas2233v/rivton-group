import type { LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";

type Option = { value: string; label: string };

export function PremiumSelect({ label, value, onValueChange, options, icon: Icon, className = "", id, invalid = false }: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  icon?: LucideIcon;
  className?: string;
  id?: string;
  invalid?: boolean;
}) {
  return (
    <Select value={value || "all"} onValueChange={(next) => onValueChange(next === "all" ? "" : next)}>
      <SelectTrigger id={id} aria-label={label} aria-invalid={invalid || undefined} className={`premium-select ${className}`}>
        <span className="flex min-w-0 items-center gap-2.5">
          {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />}
          <SelectValue placeholder={label} />
        </span>
      </SelectTrigger>
      <SelectContent sideOffset={8} collisionPadding={16} className="premium-select-menu">
        <SelectGroup>
          <SelectLabel className="px-3 pb-2 pt-3 text-[10px] uppercase text-muted-foreground">{label}</SelectLabel>
          {options.map((option) => <SelectItem key={option.value || "all"} value={option.value || "all"}>{option.label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}