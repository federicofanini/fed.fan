import { createClient } from "@/utils/supabase/server";
import { WorkoutForm } from "./create-workout/workout-form";
import { redirect } from "next/navigation";
import { SavedWorkouts } from "./saved-workouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function WorkoutPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <Tabs defaultValue="saved" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="saved">Workouts</TabsTrigger>
        <TabsTrigger value="create">Create Workouts</TabsTrigger>
      </TabsList>
      <TabsContent value="create" className="mt-6">
        <WorkoutForm />
      </TabsContent>
      <TabsContent value="saved" className="mt-6">
        <SavedWorkouts />
      </TabsContent>
    </Tabs>
  );
}
