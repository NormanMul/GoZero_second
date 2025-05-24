import { useState } from 'react';
import { analyzeImage } from '@/lib/ai-service';
import { apiRequest } from '@/lib/queryClient';
import { RecognitionResult, Scan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useItemRecognition() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [createdScan, setCreatedScan] = useState<Scan | null>(null);
  const { toast } = useToast();

  const recognizeItem = async (imageBase64: string) => {
    setIsAnalyzing(true);
    try {
      // Send the image to the AI service for analysis
      const result = await analyzeImage(imageBase64);
      setRecognitionResult(result);
      
      // Get the current user from localStorage
      const userId = parseInt(localStorage.getItem('currentUserId') || '1');
      
      // Create a scan record in the database
      const scanData = {
        userId,
        imageUrl: imageBase64,
        itemName: result.itemName,
        categoryId: null, // We'll need to map to our categories or create a new one
        co2Saved: result.environmentalImpact.co2Saved,
        waterSaved: result.environmentalImpact.waterSaved,
        energySaved: result.environmentalImpact.energySaved,
        recyclable: result.recyclable ? 1 : 0,
        reusable: result.reusable ? 1 : 0,
        aiResponse: result,
        status: 'scanned'
      };
      
      const response = await apiRequest('POST', '/api/scans', scanData);
      const scan = await response.json();
      setCreatedScan(scan);
      
      return { recognitionResult: result, scan };
    } catch (error) {
      console.error('Error recognizing item:', error);
      toast({
        title: 'Recognition Failed',
        description: 'Could not analyze the image. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    recognitionResult,
    createdScan,
    recognizeItem,
  };
}
