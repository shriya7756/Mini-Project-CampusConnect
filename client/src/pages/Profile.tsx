import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost } from "@/lib/api";
import { User, Mail, GraduationCap, BookOpen } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", year: "", major: "" });
  const { toast } = useToast();

  useEffect(() => {
    apiGet('/api/users/me').then((d) => {
      setUser(d.user);
      setForm({ 
        name: d.user.name || '', 
        email: d.user.email || '',
        year: d.user.year || '', 
        major: d.user.major || '' 
      });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: form.name, year: form.year, major: form.major }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user') || '{}')), ...data.user }));
        toast({ title: '✅ Profile updated!', description: 'Your changes have been saved successfully.' });
      } else {
        toast({ title: 'Update failed', description: data.message || 'Please try again', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message || 'Please try again', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background particle-bg animated-gradient">
      <Navbar isAuthenticated />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    </div>
  );

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/src/assets/campusConnect_bg3.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative z-10">
      <Navbar isAuthenticated />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 slide-in-bottom">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="h-10 w-10" />
            My Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="campus-card card-3d glass-morphism scale-pop backdrop-blur-xl border-2 border-white/20 shadow-2xl">
              <CardContent className="p-6 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                    {(user?.name || 'U').split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                <p className="text-muted-foreground mb-4 flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {user?.year && (
                    <Badge className="bg-blue-500/20 text-blue-700 border-blue-300">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {user.year}
                    </Badge>
                  )}
                  {user?.major && (
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {user.major}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card className="campus-card card-3d glass-morphism scale-pop backdrop-blur-xl border-2 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Edit Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input 
                      id="name"
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="glass-morphism border-white/20"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      value={form.email} 
                      disabled
                      className="glass-morphism border-white/20 opacity-60"
                      placeholder="Email cannot be changed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Year of Study
                    </Label>
                    <Select value={form.year} onValueChange={(value) => setForm({ ...form, year: value })}>
                      <SelectTrigger className="glass-morphism border-white/20">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Major
                    </Label>
                    <Select value={form.major} onValueChange={(value) => setForm({ ...form, major: value })}>
                      <SelectTrigger className="glass-morphism border-white/20">
                        <SelectValue placeholder="Select your major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={save} 
                    disabled={saving}
                    className="campus-button text-white pulse-glow hover:scale-105 transition-transform w-full md:w-auto"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
