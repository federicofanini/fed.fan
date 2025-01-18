import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { ClientFrequencyDialog } from "./client-frequency-dialog";
import { ClientEditScheduleButton } from "./client-edit-schedule-button";

const DAYS = [
  { value: "1", label: "Mon" },
  { value: "2", label: "Tue" },
  { value: "3", label: "Wed" },
  { value: "4", label: "Thu" },
  { value: "5", label: "Fri" },
  { value: "6", label: "Sat" },
  { value: "7", label: "Sun" },
];

export async function SetFrequencyDialog() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const frequency = await prisma.workout_frequency.findUnique({
    where: {
      user_id: user.id,
    },
  });

  return (
    <ClientFrequencyDialog
      days={DAYS}
      initialFrequency={frequency?.frequency}
    />
  );
}

export async function EditScheduleButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const frequency = await prisma.workout_frequency.findUnique({
    where: {
      user_id: user.id,
    },
  });

  if (!frequency?.frequency) return null;

  // Get current day (1-7, Monday = 1)
  const today = new Date().getDay();
  const dayNumber = today === 0 ? "7" : today.toString();

  // Check if today is a workout day
  const workoutDays = frequency.frequency.split(",");
  const showButton = workoutDays.includes(dayNumber);

  if (!showButton) return null;

  return (
    <ClientEditScheduleButton
      days={DAYS}
      initialFrequency={frequency.frequency}
    />
  );
}
