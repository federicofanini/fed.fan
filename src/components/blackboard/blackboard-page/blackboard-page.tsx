import { AchievementsList } from "../achivements-list";
import { ProfileSummary } from "../profile-summary";
import { WeeklyMenu } from "./weekly-menu";
// import { WorkoutCarousel } from "./workout-carousel";

export default function DashboardPage() {
  return (
    <>
      <WeeklyMenu />
      <div className="grid grid-cols-1 gap-4 md:flex">
        {/* <ProfileSummary /> 
        <WorkoutPlan />
        <AchievementsList />*/}
      </div>
      {/*<div className="grid grid-cols-1 gap-4 md:flex">
        <WorkoutCarousel />
      </div> */}
    </>
  );
}
