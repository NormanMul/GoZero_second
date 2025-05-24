import { RecognitionResult, Scan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DisposalGuideProps {
  scan?: Scan;
  recognitionResult?: RecognitionResult;
  isLoading?: boolean;
}

export function DisposalGuide({ scan, recognitionResult, isLoading = false }: DisposalGuideProps) {
  // Use either the scan's AI response or the direct recognition result
  const result = (scan?.aiResponse as RecognitionResult) || recognitionResult;
  
  if (isLoading) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="w-6 h-6 rounded-full mr-2 flex-shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result && !scan) {
    return (
      <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
        <h3 className="font-bold text-sm mb-3">How to Dispose</h3>
        <p className="text-sm text-[#757575] text-center">Disposal instructions not available</p>
      </div>
    );
  }

  // Get disposal instructions and split into steps
  let disposalInstructions = result?.disposalInstructions || '';
  
  // If no instructions from AI, use default based on material type
  if (!disposalInstructions && result?.materialType) {
    if (result.materialType.toLowerCase().includes('plastic')) {
      disposalInstructions = "Remove cap and empty contents. Rinse with water to remove residue. Crush to save space (optional). Place in plastic recycling bin or request pickup.";
    } else if (result.materialType.toLowerCase().includes('paper') || result.materialType.toLowerCase().includes('cardboard')) {
      disposalInstructions = "Remove any non-paper materials (plastic, metal). Flatten cardboard boxes. Keep dry and clean. Place in paper recycling bin or request pickup.";
    } else if (result.materialType.toLowerCase().includes('metal') || result.materialType.toLowerCase().includes('aluminum')) {
      disposalInstructions = "Empty and rinse container. Remove any non-metal parts if possible. Crush if possible to save space. Place in metal recycling bin or request pickup.";
    } else if (result.materialType.toLowerCase().includes('glass')) {
      disposalInstructions = "Empty and rinse container. Remove caps and lids (recycle separately). Do not break the glass. Place in glass recycling bin or request pickup.";
    } else if (result.materialType.toLowerCase().includes('electronic') || result.materialType.toLowerCase().includes('e-waste')) {
      disposalInstructions = "Remove batteries if applicable (recycle separately). Delete personal data if applicable. Do not break or dismantle. Take to designated e-waste collection point or request special pickup.";
    }
  }

  // Split instructions into steps
  let steps = disposalInstructions.split(/\.\s+/).filter(Boolean);
  
  // If there are no steps or only one step, create some default ones
  if (steps.length <= 1) {
    steps = [
      "Check local recycling guidelines for this specific item",
      "Clean the item if necessary",
      "Place in appropriate recycling bin",
      "Or schedule a pickup through GoZero"
    ];
  }

  return (
    <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
      <h3 className="font-bold text-sm mb-3">How to Dispose</h3>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#00AA13] bg-opacity-10 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs text-[#00AA13] font-medium">{index + 1}</span>
            </div>
            <p className="text-xs text-[#757575]">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
