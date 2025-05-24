import { useQuery } from '@tanstack/react-query';
import { ImpactSummary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function ImpactSummaryCard() {
  const userId = parseInt(localStorage.getItem('currentUserId') || '1');
  
  const { data: impactData, isLoading } = useQuery<ImpactSummary>({
    queryKey: [`/api/impact-summary?userId=${userId}`],
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-white">
        <Skeleton className="rounded-xl h-[160px] w-full" />
      </div>
    );
  }

  // Fallback values if data isn't available
  const progress = impactData?.progressPercentage || 0;
  const co2Saved = impactData?.co2Saved || 0;
  const itemsRecycled = impactData?.itemsRecycled || 0;
  const treesSaved = impactData?.treesSaved || 0;

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
