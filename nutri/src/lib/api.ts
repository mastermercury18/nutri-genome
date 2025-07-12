const API_BASE_URL = 'http://localhost:8000';

export interface MealPlanRequest {
  diabetes: string;
  lactose: string;
  calcium: string;
  ethnicity: string;
  special: string;
  genomicFile: File;
}

export interface MealPlanResponse {
  output: string;
  error?: string;
}

export interface ChatbotRequest {
  conversation_history: Array<{role: string; content: string}>;
  previous_output: string;
  input_instructions: string;
  message: string;
}

export interface ChatbotResponse {
  answer: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async generateMealPlan(data: MealPlanRequest): Promise<MealPlanResponse> {
    try {
      const formData = new FormData();
      formData.append('diabetes', data.diabetes);
      formData.append('lactose', data.lactose);
      formData.append('calcium', data.calcium);
      formData.append('ethnicity', data.ethnicity);
      formData.append('special', data.special);
      formData.append('genomicFile', data.genomicFile);

      const response = await fetch(`${this.baseUrl}/api/meal_plan_submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async chatWithBot(data: ChatbotRequest): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error chatting with bot:', error);
      return {
        answer: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const apiService = new ApiService(); 