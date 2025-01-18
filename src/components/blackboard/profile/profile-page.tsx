import { ProfileInfo } from "./profile-info";
import { ProfilePreview } from "./profile-preview";

export default function ProfilePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="md:col-span-2 md:order-2">
        <ProfilePreview />
      </div>
      <div className="md:col-span-4 md:order-1">
        <ProfileInfo />
      </div>
    </div>
  );
}
