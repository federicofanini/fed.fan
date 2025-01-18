import { WorkoutPage } from "@/components/blackboard/workout/workout-page";
import WorkoutsLoading from "./loading";
import { Suspense } from "react";

export default function Workouts() {
  return (
    <Suspense fallback={<WorkoutsLoading />}>
      <WorkoutPage />
    </Suspense>
  );
}
