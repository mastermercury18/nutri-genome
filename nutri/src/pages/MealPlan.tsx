import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  Clock, 
  Users, 
  Flame, 
  Heart, 
  Download,
  RefreshCw,
  ChefHat,
  Apple,
  Fish,
  Salad,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ParsedMealPlan, ParsedMeal } from "@/lib/mealPlanParser";
import { apiService, MealPlanRequest } from "@/lib/api";

const MealPlan = () => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<ParsedMealPlan | { rawText: string } | null>(null);
  const [healthInsights, setHealthInsights] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    // Load generated meal plan data from localStorage
    const storedMealPlan = localStorage.getItem('generatedMealPlan');
    const storedInsights = localStorage.getItem('healthInsights');
    const storedPreferences = localStorage.getItem('userPreferences');

    if (storedMealPlan) {
      setMealPlan(JSON.parse(storedMealPlan));
    }
    if (storedInsights) {
      setHealthInsights(JSON.parse(storedInsights));
    }
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  const handleRegenerate = async () => {
    if (!userPreferences) {
      toast.error("No user preferences found. Please go back to the dashboard.");
      return;
    }

    setIsRegenerating(true);
    toast.success("Regenerating your meal plan...");

    try {
      const mealPlanRequest: MealPlanRequest = {
        diabetes: userPreferences.diabetes,
        lactose: userPreferences.lactose,
        calcium: userPreferences.calcium,
        ethnicity: userPreferences.ethnicity,
        special: userPreferences.special
      };

      const response = await apiService.generateMealPlan(mealPlanRequest);
      
      if (response.error) {
        toast.error(`Error regenerating meal plan: ${response.error}`);
        return;
      }

      // Parse the new AI response
      const { parseMealPlanResponse, extractHealthInsights } = await import("@/lib/mealPlanParser");
      const newMealPlan = parseMealPlanResponse(response.output);
      const newInsights = extractHealthInsights(response.output);

      // Update state and localStorage
      setMealPlan(newMealPlan);
      setHealthInsights(newInsights);
      localStorage.setItem('generatedMealPlan', JSON.stringify(newMealPlan));
      localStorage.setItem('healthInsights', JSON.stringify(newInsights));
      localStorage.setItem('aiResponse', response.output);

      toast.success("Meal plan regenerated successfully!");
    } catch (error) {
      console.error('Error regenerating meal plan:', error);
      toast.error("Failed to regenerate meal plan. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleExport = () => {
    // Create a downloadable meal plan
    const mealPlanText = `Personalized Meal Plan\n\n${JSON.stringify(mealPlan, null, 2)}`;
    const blob = new Blob([mealPlanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personalized-meal-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Meal plan exported successfully!");
  };

  // Helper to check if mealPlan is structured or rawText
  const isStructuredMealPlan = (plan: any): plan is ParsedMealPlan => {
    return plan && typeof plan === 'object' && !('rawText' in plan);
  };

  // Render structured meal plan if available
  const renderStructuredMealPlan = (plan: ParsedMealPlan) => {
    // Only show known meal types in a nice order if present
    const mealOrder = [
      'breakfast', 'snack', 'lunch', 'dinner', 'evening snack', 'total daily macronutrients'
    ];
    return (
      <div className="grid gap-6">
        {mealOrder.map((key) => {
          const meal = plan[key];
          if (!meal) return null;
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <span className="capitalize">{meal.name}</span>
                  {meal.calories > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                      {meal.calories} cal
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="font-medium text-slate-700">
                  {meal.notes}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Carbs: {meal.macronutrients.carbs}g</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Protein: {meal.macronutrients.protein}g</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Fat: {meal.macronutrients.fat}g</span>
                  </div>
                </div>
                {meal.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-700">Key Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Render fallback raw text if parsing failed
  const renderRawText = (rawText: string) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 whitespace-pre-wrap font-mono text-sm text-slate-700">
      {rawText}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Your AI-Generated Meal Plan
        </h1>
        <p className="text-xl text-slate-600">
          Personalized nutrition optimized for liver health based on your genomic profile
        </p>
      </div>

      {/* Meal Plan Display */}
      {mealPlan ? (
        isStructuredMealPlan(mealPlan)
          ? renderStructuredMealPlan(mealPlan)
          : renderRawText((mealPlan as { rawText: string }).rawText)
      ) : (
        <div className="text-center text-slate-500">No meal plan found. Please generate one from the dashboard.</div>
      )}

      {/* Nutritional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Liver Health Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthInsights.length > 0 ? (
              healthInsights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{insight}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Low sodium content supports liver function</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Antioxidant-rich foods reduce inflammation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Balanced protein supports liver regeneration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Omega-3 rich meals reduce liver fat</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Genomic Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Your genetic profile indicates high fiber tolerance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Mediterranean diet genes are favorably expressed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Low risk for vitamin D deficiency</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Enhanced omega-3 metabolism detected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealPlan;
