export interface ParsedMeal {
  name: string;
  calories: number;
  macronutrients: {
    carbs: number;
    protein: number;
    fat: number;
  };
  ingredients: string[];
  notes?: string;
}

export interface ParsedMealPlan {
  [key: string]: ParsedMeal | undefined;
}

export function parseMealPlanResponse(aiResponse: string): ParsedMealPlan | { rawText: string } {
  if (!aiResponse || aiResponse.length < 50) {
    return { rawText: aiResponse };
  }

  // Regex to match meal sections (Breakfast, Snack, Lunch, Dinner, etc.)
  const mealSectionRegex = /###?\s*([A-Za-z ]+)(?: \((\d+) kcal\))?([\s\S]*?)(?=\n---|\n###|$)/g;
  const macroRegex = /Carbs: (\d+)g[^\n]*Protein: (\d+)g[^\n]*Fat: (\d+)g/i;
  const ingredientRegex = /- ([^\n]+)\n/g;

  const mealPlan: ParsedMealPlan = {};
  let match;

  while ((match = mealSectionRegex.exec(aiResponse)) !== null) {
    const mealName = match[1].trim();
    const calories = match[2] ? parseInt(match[2]) : 0;
    const sectionText = match[3];

    // Extract macronutrients
    let macros = { carbs: 0, protein: 0, fat: 0 };
    const macroMatch = macroRegex.exec(sectionText);
    if (macroMatch) {
      macros = {
        carbs: parseInt(macroMatch[1]),
        protein: parseInt(macroMatch[2]),
        fat: parseInt(macroMatch[3]),
      };
    }

    // Extract ingredients (lines starting with -)
    const ingredients: string[] = [];
    let ingMatch;
    const lines = sectionText.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('- ')) {
        ingredients.push(line.replace('- ', '').trim());
      }
    }

    // Fallback: try to extract ingredients from bullet points under the meal
    if (ingredients.length === 0) {
      const bulletRegex = /\* ([^\n]+)/g;
      while ((ingMatch = bulletRegex.exec(sectionText)) !== null) {
        ingredients.push(ingMatch[1].trim());
      }
    }

    // Add meal to plan
    mealPlan[mealName.toLowerCase()] = {
      name: mealName,
      calories,
      macronutrients: macros,
      ingredients,
      notes: sectionText.trim(),
    };
  }

  // If no meals found, fallback to raw text
  if (Object.keys(mealPlan).length === 0) {
    return { rawText: aiResponse };
  }

  return mealPlan;
}

export function extractHealthInsights(aiResponse: string): string[] {
  const insights: string[] = [];
  try {
    const healthKeywords = [
      'liver', 'diabetes', 'calcium', 'fiber', 'antioxidant', 'omega', 'protein',
      'vitamin', 'mineral', 'anti-inflammatory', 'heart', 'blood', 'sugar'
    ];
    const lines = aiResponse.toLowerCase().split('\n');
    for (const line of lines) {
      for (const keyword of healthKeywords) {
        if (line.includes(keyword) && line.length > 20) {
          insights.push(line.trim());
          break;
        }
      }
    }
    if (insights.length === 0) {
      return [
        "Personalized nutrition based on your health profile",
        "Optimized for liver health and function",
        "Balanced macronutrients for your dietary needs",
        "Cultural preferences integrated into meal planning"
      ];
    }
    return insights.slice(0, 4);
  } catch (error) {
    return [
      "Personalized nutrition based on your health profile",
      "Optimized for liver health and function",
      "Balanced macronutrients for your dietary needs",
      "Cultural preferences integrated into meal planning"
    ];
  }
} 