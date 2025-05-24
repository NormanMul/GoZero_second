import { useQuery } from '@tanstack/react-query';
import { ImpactSummary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy impact data for better first-time user experience
const dummyImpactData: ImpactSummary = {
  userId: 1,
  username: "User",
  impactScore: 120,
  progressPercentage: 45,
  co2Saved: 1.4,
  waterSaved: 355,
  energySaved: 5.2,
  itemsRecycled: 3,
  treesSaved: 0.2
};

export function ImpactSummaryCard() {
  const userId = parseInt(localStorage.getItem('currentUserId') || '1');
  
  const { data: impactData, isLoading, isError } = useQuery<ImpactSummary>({
    queryKey: [`/api/impact-summary?userId=${userId}`],
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-white">
        <Skeleton className="rounded-xl h-[160px] w-full" />
      </div>
    );
  }

  // Use dummy data if actual data is not available
  const displayData = (impactData && !isError) ? impactData : dummyImpactData;
  
  // Get values from either real or dummy data
  const progress = displayData.progressPercentage;
  const co2Saved = displayData.co2Saved;
  const itemsRecycled = displayData.itemsRecycled;
  const treesSaved = displayData.treesSaved;

  // Calculate the stroke-dashoffset for the progress ring
  const calculateOffset = (percent: number) => {
    const circumference = 2 * Math.PI * 16; // 2πr where r=16
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div className="p-4 bg-white">
      <div className="rounded-xl bg-gradient-to-r from-[#00AA13] to-[#3D7CF4] p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">Your GoZero Impact</h2>
            <p className="text-sm opacity-90">Keep up the good work!</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="progress-ring w-16 h-16" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2"></circle>
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray={`${2 * Math.PI * 16}`} 
                strokeDashoffset={calculateOffset(progress)}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progress}%
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <p className="text-xs opacity-90">CO2 Saved</p>
            <p className="font-bold">{co2Saved}kg</p>
          </div>
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <p className="text-xs opacity-90">Items Recycled</p>
            <p className="font-bold">{itemsRecycled}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <p className="text-xs opacity-90">Trees Saved</p>
            <p className="font-bold">{treesSaved}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
