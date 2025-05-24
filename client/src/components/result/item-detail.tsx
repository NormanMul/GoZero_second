import { RecognitionResult, Scan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemDetailProps {
  scan?: Scan;
  recognitionResult?: RecognitionResult;
  isLoading?: boolean;
}

export function ItemDetail({ scan, recognitionResult, isLoading = false }: ItemDetailProps) {
  // Always prioritize the direct recognition result passed from the parent
  const result = recognitionResult;
  
  if (isLoading) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <div className="flex items-start">
          <Skeleton className="w-20 h-20 rounded-lg mr-3" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!result && !scan) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <p className="text-sm text-[#757575] text-center">Item details not available</p>
      </div>
    );
  }

  const itemName = scan?.itemName || result?.itemName || 'Unknown Item';
  const isRecyclable = scan?.recyclable === 1 || result?.recyclable || false;
  const materialType = result?.materialType || 'Unknown';
  const description = result?.disposalInstructions || 'No additional information available';

  return (
    <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
      <div className="flex items-start">
        <div className="w-20 h-20 rounded-lg bg-[#F5F5F5] flex items-center justify-center mr-3">
          {scan?.imageUrl ? (
            <img 
              src={scan.imageUrl} 
              alt={itemName} 
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Item';
              }}
            />
          ) : (
            <div className="text-center text-base text-[#757575]">{itemName.slice(0, 1)}</div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">{itemName}</h2>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${isRecyclable ? 'bg-[#4CAF50] text-white' : 'bg-[#F44336] text-white'} rounded-full px-2 py-0.5 mr-2`}>
              {isRecyclable ? 'Recyclable' : 'Non-recyclable'}
            </span>
            <span className="text-xs text-[#757575]">{materialType}</span>
          </div>
          <p className="text-xs text-[#757575] mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
