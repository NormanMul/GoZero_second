import axios from 'axios';

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

// Add chatbot response functionality
export interface ChatbotResponse {
  message: string;
}

// Interface for chat request
export interface ChatRequest {
  message: string;
  scanContext?: AnalysisResult;
}

interface AnalysisResult {
  itemName: string;
  category: string;
  recyclable: boolean;
  reusable: boolean;
  materialType: string;
  disposalInstructions: string;
  environmentalImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
    description: string;
  };
}

export async function analyzeImage(imageBase64: string): Promise<AnalysisResult> {
  try {
    // Remove the data:image prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const prompt = `Analyze this waste item image. Identify what it is and provide detailed recycling information in this JSON format:
    {
      "itemName": "Name of the item",
      "category": "One of: Plastic, Paper/Cardboard, Metal, Glass, E-Waste, Organic, Other",
      "recyclable": true/false,
      "reusable": true/false,
      "materialType": "Specific material type (e.g., PET plastic, aluminum, etc.)",
      "disposalInstructions": "Step by step instructions for proper disposal",
      "environmentalImpact": {
        "co2Saved": estimated CO2 saved in kg (number),
        "waterSaved": estimated water saved in liters (number),
        "energySaved": estimated energy saved in kWh (number),
        "description": "Brief fact about environmental impact of recycling this item"
      }
    }`;

    const response = await axios.post(
      QWEN_API_ENDPOINT,
      {
        model: 'qwen-vl-plus',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                { image: base64Data },
                { text: prompt }
              ]
            }
          ]
        },
        parameters: {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN_API_KEY}`
        }
      }
    );

    if (response.data && response.data.output && response.data.output.choices) {
      const content = response.data.output.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/```json([\s\S]*?)```/) || content.match(/{[\s\S]*?}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      try {
        const result = JSON.parse(jsonStr.replace(/```json|```/g, '').trim());
        return result;
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        // Fallback to default result with error message
        return getFallbackResult(content);
      }
    }
    
    throw new Error("Invalid response structure from QWEN API");
  } catch (error) {
    console.error("Error calling QWEN API:", error);
    
    // Return a fallback result
    return getFallbackResult();
  }
}

function getFallbackResult(aiResponse?: string): AnalysisResult {
  return {
    itemName: "Unidentified Item",
    category: "Other",
    recyclable: false,
    reusable: false,
    materialType: "Unknown",
    disposalInstructions: "Please try again with a clearer image or consult local recycling guidelines.",
    environmentalImpact: {
      co2Saved: 0,
      waterSaved: 0,
      energySaved: 0,
      description: "Unable to determine environmental impact for this item."
    }
  };
}

// Add chatbot functionality
export async function getChatbotResponse(request: ChatRequest): Promise<ChatbotResponse> {
  try {
    let prompt = `You are GoZero, an AI assistant for sustainable waste management. Be helpful, informative, and encouraging about proper waste management, recycling, and sustainability practices. Reply in a friendly, conversational tone.`;
    
    // Add context about the scanned item if available
    if (request.scanContext) {
      prompt += `\n\nThe user has just scanned a ${request.scanContext.itemName} made of ${request.scanContext.materialType}. 
      It is ${request.scanContext.recyclable ? 'recyclable' : 'not recyclable'} and ${request.scanContext.reusable ? 'reusable' : 'not reusable'}.
      The proper disposal instructions are: ${request.scanContext.disposalInstructions}`;
    }
    
    prompt += `\n\nUser message: ${request.message}`;
    
    const response = await axios.post(
      QWEN_API_ENDPOINT,
      {
        model: 'qwen-vl-plus',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                { text: prompt }
              ]
            }
          ]
        },
        parameters: {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN_API_KEY}`
        }
      }
    );
    
    if (response.data && response.data.output && response.data.output.choices) {
      const content = response.data.output.choices[0].message.content;
      return { message: content };
    }
    
    return { message: "I'm sorry, I couldn't process your request. Please try again." };
  } catch (error) {
    console.error("Error in chatbot response:", error);
    return { 
      message: "I'm having trouble connecting to my knowledge base. Please try again in a moment."
    };
  }
}
