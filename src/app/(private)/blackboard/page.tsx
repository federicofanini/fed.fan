export default async function Blackboard() {
  return (
    <div className="container max-w-[1050px] py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Your digital stage
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Build your story</h3>
          <p className="text-muted-foreground mb-4">
            This is your space to showcase your journey, achievements, and
            inspire others who share your vision.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Share your founder journey</li>
            <li>✓ Highlight key milestones</li>
            <li>✓ Showcase your innovations</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Connect & collaborate</h3>
          <p className="text-muted-foreground mb-4">
            Turn connections into meaningful collaborations and build your
            community of supporters.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Network with fellow builders</li>
            <li>✓ Engage with your audience</li>
            <li>✓ Find potential collaborators</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Grow your influence</h3>
          <p className="text-muted-foreground mb-4">
            Build your personal brand and expand your impact in the community.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Track audience engagement</li>
            <li>✓ Share your expertise</li>
            <li>✓ Build your legacy</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Your story deserves to be heard. Start building your presence and
          connecting with those who share your passion.
        </p>
      </div>
    </div>
  );
}
