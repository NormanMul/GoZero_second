import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { ImpactSummaryCard } from "@/components/home/impact-summary";
import { QuickActions } from "@/components/home/quick-actions";
import { RecentActivity } from "@/components/home/recent-activity";
import { RecyclingCenters } from "@/components/home/recycling-centers";
import { RecyclingTips } from "@/components/home/recycling-tips";

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <AppHeader title="GoZero" showBackButton={false} />
      
      <div className="flex-1 overflow-y-auto pb-16">
        <ImpactSummaryCard />
        <QuickActions />
        <RecentActivity />
        <RecyclingCenters />
        <RecyclingTips />
      </div>
      
      <BottomNavigation />
    </div>
  );
}
