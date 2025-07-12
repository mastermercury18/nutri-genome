
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, User, Heart, Target, Sparkles, Loader2, Dna } from "lucide-react";
import { toast } from "sonner";
import { apiService, MealPlanRequest } from "@/lib/api";
import { parseMealPlanResponse, extractHealthInsights } from "@/lib/mealPlanParser";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [genomicFile, setGenomicFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    diabetes: "",
    lactose: "",
    calcium: "",
    ethnicity: "",
    special: ""
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        setGenomicFile(file);
        toast.success("Genomic file uploaded successfully!");
      } else {
        toast.error("Please upload a .txt file containing your genomic data.");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePlan = async () => {
    if (!genomicFile) {
      toast.error("Please upload your genomic file first.");
      return;
    }
    
    const requiredFields = ['diabetes', 'lactose', 'calcium', 'ethnicity'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsGenerating(true);
    toast.success("Generating your personalized meal plan...");

    try {
      const mealPlanRequest: MealPlanRequest = {
        diabetes: formData.diabetes,
        lactose: formData.lactose,
        calcium: formData.calcium,
        ethnicity: formData.ethnicity,
        special: formData.special,
        genomicFile: genomicFile
      };

      const response = await apiService.generateMealPlan(mealPlanRequest);
      
      if (response.error) {
        toast.error(`Error generating meal plan: ${response.error}`);
        return;
      }

      // Parse the AI response into structured data
      const parsedMealPlan = parseMealPlanResponse(response.output);
      const healthInsights = extractHealthInsights(response.output);

      // Store the generated data in localStorage for the MealPlan component
      localStorage.setItem('generatedMealPlan', JSON.stringify(parsedMealPlan));
      localStorage.setItem('healthInsights', JSON.stringify(healthInsights));
      localStorage.setItem('aiResponse', response.output);
      localStorage.setItem('userPreferences', JSON.stringify(formData));

      toast.success("Meal plan generated successfully!");
      
      // Navigate to the meal plan page (nested route)
      navigate('/app/meal-plan');
      
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Your Health Dashboard
        </h1>
        <p className="text-xl text-slate-600">
          Upload your genomic data and provide your health information to generate a personalized meal plan
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Genomic Data Upload */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Dna className="w-6 h-6" />
              <span>Genomic Data</span>
            </CardTitle>
            <CardDescription>
              Upload your genomic data file for personalized analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <Label htmlFor="genomic-file" className="cursor-pointer">
                <div className="text-lg font-medium text-green-700 mb-2">
                  Upload Genomic Data
                </div>
                <div className="text-sm text-green-600">
                  Click to upload or drag and drop your .txt file
                </div>
              </Label>
              <Input
                id="genomic-file"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {genomicFile && (
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <FileText className="w-4 h-4" />
                <span>{genomicFile.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Information Form */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <User className="w-6 h-6" />
              <span>Health Profile</span>
            </CardTitle>
            <CardDescription>
              Provide additional information for personalized meal planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diabetes">Diabetes Risk *</Label>
                <Select value={formData.diabetes} onValueChange={(value) => handleInputChange('diabetes', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diabetes risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="diabetic">Diabetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lactose">Lactose Intolerance *</Label>
                <Select value={formData.lactose} onValueChange={(value) => handleInputChange('lactose', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lactose tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No Intolerance</SelectItem>
                    <SelectItem value="mild">Mild Intolerance</SelectItem>
                    <SelectItem value="severe">Severe Intolerance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calcium">Calcium Intake *</Label>
                <Select value={formData.calcium} onValueChange={(value) => handleInputChange('calcium', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select calcium level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adequate">Adequate</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="severely_low">Severely Low</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity *</Label>
                <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caucasian">Caucasian</SelectItem>
                    <SelectItem value="african">African American</SelectItem>
                    <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
                    <SelectItem value="native">Native American</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special">Special Dietary Requests</Label>
              <Textarea
                id="special"
                placeholder="e.g., vegetarian, vegan, gluten-free, specific allergies, cultural preferences..."
                value={formData.special}
                onChange={(e) => handleInputChange('special', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button 
          onClick={handleGeneratePlan} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Meal Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Personalized Meal Plan
            </>
          )}
        </Button>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-purple-200">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Personalized Analysis</h3>
            <p className="text-sm text-purple-600">
              Your genomic data is analyzed using quantum neural networks for precise health insights
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Liver Health Focus</h3>
            <p className="text-sm text-orange-600">
              Specialized nutrition plans designed for liver cirrhosis and related conditions
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">AI-Powered</h3>
            <p className="text-sm text-green-600">
              Advanced AI generates customized meal plans based on your unique health profile
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
