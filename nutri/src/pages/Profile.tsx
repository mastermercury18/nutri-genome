
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Dna, 
  Heart, 
  Settings, 
  Bell, 
  Shield,
  Download,
  Upload,
  Edit
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    age: 45,
    height: "5'10\"",
    weight: 165,
    ethnicity: "caucasian",
    activityLevel: "moderate"
  });

  const [healthData, setHealthData] = useState({
    conditions: "Liver cirrhosis stage 2, mild hypertension",
    medications: "Lactulose, Propranolol",
    allergies: "Shellfish, peanuts",
    emergencyContact: "Jane Doe - (555) 123-4567"
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Your Health Profile
        </h1>
        <p className="text-xl text-slate-600">
          Manage your personal information and health data
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1 border-blue-200">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{profileData.name}</h2>
            <p className="text-slate-600 mb-4">{profileData.email}</p>
            
            <div className="space-y-2 mb-6">
              <Badge className="bg-green-100 text-green-700">
                <Heart className="w-3 h-3 mr-1" />
                Health Score: 78/100
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <Dna className="w-3 h-3 mr-1" />
                Genomic Profile Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="font-medium text-slate-700">Age</div>
                <div className="text-xl font-bold text-slate-800">{profileData.age}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="font-medium text-slate-700">Weight</div>
                <div className="text-xl font-bold text-slate-800">{profileData.weight}lbs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="genomic">Genomic</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={profileData.height}
                        onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={profileData.weight}
                        onChange={(e) => setProfileData({...profileData, weight: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Select value={profileData.ethnicity} onValueChange={(value) => setProfileData({...profileData, ethnicity: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="caucasian">Caucasian</SelectItem>
                          <SelectItem value="african">African American</SelectItem>
                          <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="native">Native American</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activity">Activity Level</Label>
                      <Select value={profileData.activityLevel} onValueChange={(value) => setProfileData({...profileData, activityLevel: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Lightly Active</SelectItem>
                          <SelectItem value="moderate">Moderately Active</SelectItem>
                          <SelectItem value="very">Very Active</SelectItem>
                          <SelectItem value="extra">Extra Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Health Information</span>
                  </CardTitle>
                  <CardDescription>Medical history and current health status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Current Health Conditions</Label>
                    <Textarea
                      id="conditions"
                      value={healthData.conditions}
                      onChange={(e) => setHealthData({...healthData, conditions: e.target.value})}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={healthData.medications}
                      onChange={(e) => setHealthData({...healthData, medications: e.target.value})}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies & Intolerances</Label>
                    <Input
                      id="allergies"
                      value={healthData.allergies}
                      onChange={(e) => setHealthData({...healthData, allergies: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={healthData.emergencyContact}
                      onChange={(e) => setHealthData({...healthData, emergencyContact: e.target.value})}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-red-500 to-pink-500">
                    Update Health Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="genomic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dna className="w-5 h-5 text-blue-600" />
                    <span>Genomic Data</span>
                  </CardTitle>
                  <CardDescription>Your genetic information and analysis results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h4 className="font-medium text-green-800">Genomic File Status</h4>
                      <p className="text-sm text-green-600">File uploaded and analyzed successfully</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Liver Risk Score</h4>
                      <div className="text-2xl font-bold text-blue-600">22%</div>
                      <p className="text-sm text-blue-600">Low-moderate risk based on genetic markers</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Genetic Variants</h4>
                      <div className="text-2xl font-bold text-purple-600">47</div>
                      <p className="text-sm text-purple-600">Nutritionally relevant variants identified</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700">Key Genetic Insights:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Enhanced omega-3 metabolism (FADS1 variant)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Normal vitamin D receptor function</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Moderate alcohol metabolism (ADH1B variant)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">High antioxidant enzyme activity</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Update Genomic File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <span>Notifications</span>
                    </CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Meal Reminders</h4>
                        <p className="text-sm text-slate-500">Get notified about meal times</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Health Updates</h4>
                        <p className="text-sm text-slate-500">Weekly health score updates</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Meal Plans</h4>
                        <p className="text-sm text-slate-500">When new AI plans are generated</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Privacy & Security</span>
                    </CardTitle>
                    <CardDescription>Manage your data privacy settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Data Sharing</h4>
                        <p className="text-sm text-slate-500">Share anonymized data for research</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Export Data</h4>
                        <p className="text-sm text-slate-500">Download all your data</p>
                      </div>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-slate-500">Permanently delete your account</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
