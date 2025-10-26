import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
 
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiGet } from "@/lib/api";
import { Settings as SettingsIcon, Moon, Sun, Lock, Bell, Palette, Shield } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ name: "", year: "", major: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const tokenHeader = localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};

  useEffect(() => {
    // Load user data
    apiGet('/api/users/me').then((d) => {
      setUser(d.user);
      setProfile({ name: d.user.name || '', year: d.user.year || '', major: d.user.major || '' });
    }).finally(() => setLoading(false));
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Load other preferences
    setNotifications(localStorage.getItem('notifications') !== 'false');
  }, []);

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('theme', enabled ? 'dark' : 'light');
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast({ 
      title: enabled ? '🌙 Dark mode enabled' : '☀️ Light mode enabled',
      description: 'Theme preference saved'
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...tokenHeader },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user') || '{}')), ...data.user }));
        toast({ title: '✅ Profile updated!', description: 'Your changes have been saved.' });
      } else {
        toast({ title: 'Update failed', description: data.message, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!pwd.currentPassword || !pwd.newPassword) {
      toast({ title: 'Please fill in both password fields', variant: 'destructive' });
      return;
    }
    if (pwd.newPassword.length < 6) {
      toast({ title: 'New password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/me/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...tokenHeader },
        body: JSON.stringify(pwd),
      });
      const data = await res.json();
      if (res.ok) {
        setPwd({ currentPassword: '', newPassword: '' });
        toast({ title: '🔒 Password updated!', description: 'Your password has been changed successfully.' });
      } else {
        toast({ title: 'Password change failed', description: data.message, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Password change failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = () => {
    localStorage.setItem('notifications', notifications.toString());
    toast({ title: '⚙️ Preferences saved!', description: 'Your settings have been updated.' });
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
        backgroundImage: `url('/src/assets/hero-campus.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10">
      <Navbar isAuthenticated />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 slide-in-bottom">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="h-10 w-10" />
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your Campus Connect experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance & Theme Row */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Theme
                </h3>
                <p className="text-sm text-muted-foreground">Customize the look and feel of your interface</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/30">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className="mt-4">
              <Button onClick={savePreferences} className="campus-button text-white">
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Notifications Row */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h3>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/30">
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new messages and updates
                </p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Security Row */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </h3>
                <p className="text-sm text-muted-foreground">Update your password and security settings</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Current Password
                </Label>
                <Input 
                  type="password" 
                  value={pwd.currentPassword} 
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  New Password
                </Label>
                <Input 
                  type="password" 
                  value={pwd.newPassword} 
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={changePassword} 
                disabled={saving}
                className="campus-button text-white"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>

          {/* Profile Settings Row */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Profile Settings
                </h3>
                <p className="text-sm text-muted-foreground">Update your profile information</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input 
                  value={profile.year} 
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  placeholder="e.g., 2nd"
                />
              </div>
              <div className="space-y-2">
                <Label>Major</Label>
                <Input 
                  value={profile.major} 
                  onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                  placeholder="Your major"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={saveProfile} 
                disabled={saving}
                className="campus-button text-white"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
