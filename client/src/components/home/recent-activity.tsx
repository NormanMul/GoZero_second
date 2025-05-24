import { useQuery } from '@tanstack/react-query';
import { Scan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const userId = parseInt(localStorage.getItem('currentUserId') || '1');
  
  const { data: scans, isLoading } = useQuery<Scan[]>({
    queryKey: [`/api/scans?userId=${userId}`],
  });

  const formatTimestamp = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'Unknown date';
    
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold">Recent Activity</h2>
        <Link href="/history">
          <a className="text-[#00AA13] text-sm font-medium">View All</a>
        </Link>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          // Skeleton loader while data is loading
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white gozero-shadow rounded-xl p-3">
              <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))
        ) : scans && scans.length > 0 ? (
          // Display recent scans
          scans.slice(0, 3).map(scan => (
            <Link key={scan.id} href={`/result/${scan.id}`}>
              <a className="bg-white gozero-shadow rounded-xl p-3 block">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center mr-3">
                    {scan.imageUrl ? (
                      <img 
                        src={scan.imageUrl} 
                        alt={scan.itemName} 
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Item';
                        }}
                      />
                    ) : (
                      <div className="text-center text-xs text-[#757575]">{scan.itemName.slice(0, 1)}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{scan.itemName}</h3>
                      <span className="text-xs text-[#4CAF50] font-medium">
                        +{scan.co2Saved || 0}kg CO2 saved
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#757575]">
                        {scan.recyclable ? 'Recyclable' : 'Non-recyclable'}
                      </span>
                      <span className="text-xs text-[#757575]">
                        {scan.createdAt ? formatTimestamp(scan.createdAt) : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))
        ) : (
          // No data state
          <div className="bg-white gozero-shadow rounded-xl p-5 text-center">
            <p className="text-sm text-[#757575]">No recycling activity yet. Start by scanning an item!</p>
            <Link href="/scanner">
              <a className="mt-3 inline-block text-[#00AA13] text-sm font-medium">
                Scan First Item
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
