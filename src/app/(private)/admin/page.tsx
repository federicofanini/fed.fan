import { AddExerciseForm } from "@/components/blackboard/admin/add-exercise";
import { BulkAddExercisesButton } from "@/components/blackboard/admin/bulk-add-exercises";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <BulkAddExercisesButton />
      <AddExerciseForm />
    </div>
  );
}
