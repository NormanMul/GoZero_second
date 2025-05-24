import { RecognitionResult, Scan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getImpactFact } from '@/lib/impact-calculator';

interface EnvironmentalImpactProps {
  scan?: Scan;
  recognitionResult?: RecognitionResult;
  isLoading?: boolean;
}

export function EnvironmentalImpact({ scan, recognitionResult, isLoading = false }: EnvironmentalImpactProps) {
  // Always prioritize the direct recognition result over the scan data
  const result = recognitionResult;
  
  if (isLoading) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
        <Skeleton className="h-20 rounded-lg" />
      </div>
    );
  }

  if (!result && !scan) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <h3 className="font-bold text-sm mb-3">Environmental Impact</h3>
        <p className="text-sm text-[#757575] text-center">Environmental impact data not available</p>
      </div>
    );
  }

  const co2Saved = scan?.co2Saved || result?.environmentalImpact?.co2Saved || 0;
  const waterSaved = scan?.waterSaved || result?.environmentalImpact?.waterSaved || 0;
  const energySaved = scan?.energySaved || result?.environmentalImpact?.energySaved || 0;
  
  // Get impact description or generate one
  const impactDescription = result?.environmentalImpact?.description || 
    getImpactFact(scan?.itemName || result?.materialType || 'Plastic');

  return (
    <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
      <h3 className="font-bold text-sm mb-3">Environmental Impact</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F5F5F5] p-2 rounded-lg">
          <p className="text-xs text-[#757575]">CO2 Saved</p>
          <p className="font-bold text-sm">{co2Saved}kg</p>
        </div>
        <div className="bg-[#F5F5F5] p-2 rounded-lg">
          <p className="text-xs text-[#757575]">Water Saved</p>
          <p className="font-bold text-sm">{waterSaved}L</p>
        </div>
        <div className="bg-[#F5F5F5] p-2 rounded-lg">
          <p className="text-xs text-[#757575]">Energy Saved</p>
          <p className="font-bold text-sm">{energySaved} kWh</p>
        </div>
      </div>
      <div className="bg-[#F5F5F5] rounded-lg p-3">
        <p className="text-xs">{impactDescription}</p>
      </div>
    </div>
  );
}
