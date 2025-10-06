import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import heroImage from "@/assets/hero-campus.jpg";
import {
  BookOpen,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Users,
  Star,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Notes Exchange",
    description: "Share and discover study materials with your peers across all subjects.",
  },
  {
    icon: MessageSquare,
    title: "Q&A Community",
    description: "Get answers to your questions from fellow students and experts.",
  },
  {
    icon: ShoppingBag,
    title: "Equipment Exchange",
    description: "Buy and sell textbooks, lab equipment, and other academic resources.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your learning journey and celebrate your achievements.",
  },
];

const stats = [
  { label: "Active Students", value: "10,000+" },
  { label: "Notes Shared", value: "50K+" },
  { label: "Questions Answered", value: "25K+" },
  { label: "Items Exchanged", value: "5K+" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science, 4th Year",
    content: "Campus Connect made studying so much easier. I found amazing notes and got help with complex algorithms!",
  },
  {
    name: "Michael Chen",
    role: "Engineering, 3rd Year",
    content: "The equipment exchange saved me hundreds on textbooks. Great community of helpful students.",
  },
  {
    name: "Emma Davis",
    role: "Biology, 2nd Year",
    content: "The Q&A section is incredible. I always find detailed answers to my lab questions.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={false} />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Welcome to{" "}
              <span className="block mt-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Campus Connect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
              Your ultimate platform for academic collaboration, resource sharing, and community building.
              Connect with fellow students and accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
              <Button size="lg" asChild className="campus-button text-white px-8 py-3 text-lg">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to excel
              <span className="hero-text block mt-2">in your academic journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful features designed to enhance collaboration and streamline your learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-lg campus-button flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What students are saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who are already using Campus Connect to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to join the community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start connecting with your peers, sharing knowledge, and accelerating your academic success today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="campus-button text-white px-8 py-3 text-lg">
              <Link to="/signup">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-3 text-lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg campus-button flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl hero-text">Campus Connect</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering students through collaborative learning and resource sharing.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center"><Shield className="w-4 h-4 mr-1" /> Secure</span>
              <span className="flex items-center"><Zap className="w-4 h-4 mr-1" /> Fast</span>
              <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> Community-Driven</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}