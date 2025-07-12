
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Dna, 
  Brain, 
  UtensilsCrossed, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Dna,
      title: "Genomic Analysis",
      description: "Upload your genomic data for personalized risk assessment using quantum neural networks"
    },
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Generative AI creates customized meal plans based on your genetic profile and health needs"
    },
    {
      icon: UtensilsCrossed,
      title: "Liver-Friendly Meals",
      description: "Specialized nutrition plans designed for liver cirrhosis and related conditions"
    }
  ];

  const benefits = [
    "Personalized nutrition based on your DNA",
    "Liver cirrhosis risk assessment",
    "AI-generated meal plans with recipes",
    "Cultural and dietary preference integration",
    "Progress tracking and analytics",
    "Evidence-based nutritional guidance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              NutriGenome AI
            </span>
          </div>
          
          <Link to="/app">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Quantum AI-Powered Nutrition</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Personalized Nutrition for
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Liver Health
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI meal planning using your genomic data to create personalized nutrition plans 
            for liver cirrhosis management and optimal health outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 text-lg">
                Start Your Health Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Advanced Health Technology
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Combining quantum neural networks with generative AI to revolutionize personalized nutrition
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-blue-100 hover:border-blue-200 transition-colors hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Why Choose NutriGenome AI?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Our platform combines cutting-edge genomic science with AI to deliver 
                unprecedented personalization in nutritional care.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Medically Validated</h3>
                <p className="text-blue-100 mb-6">
                  Our algorithms are developed in collaboration with hepatologists and 
                  nutritionists to ensure clinical accuracy and safety.
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-blue-100">Accuracy in risk assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have improved their liver health with personalized AI nutrition.
          </p>
          
          <Link to="/app">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NutriGenome AI</span>
          </div>
          <p className="text-slate-400">
            Revolutionizing personalized nutrition through quantum AI and genomic science.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
