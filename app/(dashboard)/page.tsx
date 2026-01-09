import { HeroSection } from "@/components/dashboard/HeroSection";
import { NextMatch } from "@/components/dashboard/NextMatch";
import { LatestMatchResult } from "@/components/dashboard/LatestMatchResult";
import { LeagueTable } from "@/components/dashboard/LeagueTable";
import { NewsWidget } from "@/components/dashboard/NewsWidget";
import { EventsWidget } from "@/components/dashboard/EventsWidget";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LatestMatchResult />
        <NextMatch />
        <LeagueTable />
      </div>

      <div className="w-full">
        <NewsWidget />
        <EventsWidget />
      </div>
    </div>
  );
}
