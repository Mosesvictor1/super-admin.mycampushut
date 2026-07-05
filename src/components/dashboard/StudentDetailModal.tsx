import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, GraduationCap, Clock, BadgeCheck, MessageSquare, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Plan, UserStatus } from "@/lib/mock-data";

export interface StudentDetail {
  name: string;
  email: string;
  university: string;
  plan: Plan;
  lastActive: string;
  status: UserStatus;
}

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-primary-soft text-primary ring-primary/20",
  Inactive: "bg-muted text-muted-foreground ring-border",
  Suspended: "bg-[oklch(0.96_0.06_50)] text-accent ring-accent/30",
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
                statusStyles[student.status],
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  student.status === "Active" && "bg-primary",
                  student.status === "Inactive" && "bg-muted-foreground",
                  student.status === "Suspended" && "bg-accent",
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
          <Stat icon={MessageSquare} label="Support tickets" value="0 open" />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3.5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Recent activity
          </div>
          <ul className="mt-2 space-y-1.5 text-[13px]">
            <li className="flex items-center justify-between">
              <span>Completed lesson · Neural Networks 3</span>
              <span className="text-muted-foreground">1h ago</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Applied · Frontend Intern @ Acme Labs</span>
              <span className="text-muted-foreground">Yesterday</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Renewed subscription · {student.plan}</span>
              <span className="text-muted-foreground">3 days ago</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="mt-4 flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.success(`Email sent to ${student.email}`)}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive"
              onClick={() => {
                toast.error(`Suspended ${student.name} (demo)`);
                onOpenChange(false);
              }}
            >
              <Ban className="h-3.5 w-3.5" />
              Suspend
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
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
