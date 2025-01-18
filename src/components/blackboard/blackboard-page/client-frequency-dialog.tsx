"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "lucide-react";
import { setWorkoutFrequency } from "@/actions/workout/workout-frequency";
import { toast } from "sonner";

interface Day {
  value: string;
  label: string;
}

interface ClientFrequencyDialogProps {
  days: Day[];
  initialFrequency: string | null | undefined;
}

export function ClientFrequencyDialog({
  days,
  initialFrequency,
}: ClientFrequencyDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialFrequency ? initialFrequency.split(",") : []
  );

  async function handleSave() {
    const frequency = selectedDays.sort().join(",");
    const response = await setWorkoutFrequency({ frequency });

    if (response?.data?.success) {
      toast.success("Workout schedule updated");
      setOpen(false);
    } else {
      toast.error("Failed to update workout schedule");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Set Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Workout Schedule</DialogTitle>
          <DialogDescription>
            Choose which days you want to work out
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ToggleGroup
            type="multiple"
            value={selectedDays}
            onValueChange={setSelectedDays}
            className="justify-start"
          >
            {days.map((day) => (
              <ToggleGroupItem
                key={day.value}
                value={day.value}
                aria-label={day.label}
                className="w-12"
              >
                {day.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
