import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost } from "@/lib/api";
import { MessageSquare, Bug, Lightbulb, Heart, Send } from "lucide-react";

export default function Feedback() {
  const [form, setForm] = useState({
    category: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const { toast } = useToast();

  const categories = [
    { value: "bug", label: "Bug Report", icon: Bug, color: "text-red-500" },
    { value: "feature", label: "Feature Request", icon: Lightbulb, color: "text-yellow-500" },
    { value: "improvement", label: "Improvement", icon: Heart, color: "text-pink-500" },
    { value: "general", label: "General Feedback", icon: MessageSquare, color: "text-blue-500" }
  ];

  // Load existing feedback list
  const loadList = async () => {
    try {
      const d = await apiGet('/api/feedback');
      setList(Array.isArray(d.feedback) ? d.feedback : []);
    } catch {
      setList([]);
    }
  };

  // Load feedback on mount
  useEffect(() => {
    loadList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.subject || !form.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      await apiPost('/api/feedback', form);
      toast({ 
        title: "🎉 Feedback sent!", 
        description: "Saved successfully."
      });
      setForm({ category: "", subject: "", message: "" });
      loadList();
    } catch (e: any) {
      toast({ 
        title: "Failed to send feedback", 
        description: e.message || "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setSending(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === form.category);

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/src/assets/campusConnect_bg1.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10">
      <Navbar isAuthenticated />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 slide-in-bottom">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="h-10 w-10" />
            Feedback
          </h1>
          <p className="text-muted-foreground text-lg">
            Help us improve Campus Connect by sharing your thoughts and suggestions
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="campus-card card-3d glass-morphism scale-pop backdrop-blur-xl border-2 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Share Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Feedback Category *</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger className="glass-morphism border-white/20">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${category.color}`} />
                              {category.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="glass-morphism border-white/20"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="glass-morphism border-white/20 min-h-32"
                    placeholder="Please provide detailed feedback. If reporting a bug, include steps to reproduce it."
                  />
                </div>

                {/* Category-specific guidance */}
                {selectedCategory && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <selectedCategory.icon className={`h-4 w-4 ${selectedCategory.color}`} />
                      <span className="font-medium">{selectedCategory.label} Guidelines</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {form.category === 'bug' && "Please describe what you expected to happen vs. what actually happened. Include any error messages and steps to reproduce the issue."}
                      {form.category === 'feature' && "Describe the feature you'd like to see and how it would benefit you and other students."}
                      {form.category === 'improvement' && "Tell us what could work better and your suggestions for improvement."}
                      {form.category === 'general' && "Share any thoughts, compliments, or general suggestions about Campus Connect."}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full campus-button text-white pulse-glow hover:scale-105 transition-transform"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="mt-8">
            <Card className="campus-card glass-morphism border-white/10">
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {list.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">No feedback submitted yet.</p>
                ) : (
                  <ul className="divide-y">
                    {list.map((fb: any) => (
                      <li key={fb._id} className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">{fb.subject}</div>
                          <span className="text-xs text-muted-foreground">{new Date(fb.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">Category: {fb.category}</div>
                        <p className="text-sm whitespace-pre-wrap">{fb.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
