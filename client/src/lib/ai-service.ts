import { apiRequest } from "./queryClient";
import { RecognitionResult } from "./types";

export async function analyzeImage(imageBase64: string): Promise<RecognitionResult> {
  try {
    const res = await apiRequest("POST", "/api/analyze-image", { imageBase64 });
    return await res.json();
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image");
  }
}
