import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await apiPost("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.email}`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsResetting(true);
    try {
      await apiPost("/api/auth/forgot-password", { email: forgotEmail });
      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions",
      });
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/src/assets/campusConnect_bg1.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8 slide-in-bottom">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 group mb-6"
          >
            <div className="w-10 h-10 rounded-lg campus-button flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl hero-text">Campus Connect</span>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <Card className="campus-card card-3d glass-morphism scale-pop backdrop-blur-xl border-2 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <Button 
                  variant="link" 
                  className="px-0 text-sm"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full campus-button text-white pulse-glow hover:scale-105 transition-transform" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isResetting}
                className="flex-1 campus-button text-white"
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
