import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, GraduationCap, Clock, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentDetail {
  id?: number;
  name: string;
  email: string;
  university: string;
  plan: string;
  lastActive: string;
  status: string;
}

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-primary-soft text-primary ring-primary/20";
    case "suspended":
      return "bg-[oklch(0.96_0.06_50)] text-accent ring-accent/30";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

export function StudentDetailModal({
  student,
  open,
  onOpenChange,
}: {
  student: StudentDetail | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!student) return null;
  const initials = student.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/25 text-primary font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-lg">{student.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3" />
                {student.email}
              </DialogDescription>
            </div>
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                statusClass(student.status),
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  student.status.toLowerCase() === "active" && "bg-primary",
                  student.status.toLowerCase() === "suspended" && "bg-accent",
                  !["active", "suspended"].includes(student.status.toLowerCase()) &&
                    "bg-muted-foreground",
                )}
              />
              {student.status}
            </span>
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat icon={GraduationCap} label="University" value={student.university} />
          <Stat icon={BadgeCheck} label="Plan" value={student.plan} />
          <Stat icon={Clock} label="Last active" value={student.lastActive} />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" asChild>
            <a href={`mailto:${student.email}`}>
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-[13.5px] font-medium">{value}</div>
    </div>
  );
}
