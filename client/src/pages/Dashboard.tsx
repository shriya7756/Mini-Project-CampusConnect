import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import {
  BookOpen,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Users,
  FileText,
  HelpCircle,
  Package,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickStats = [
  { label: "Notes Shared", value: "12", icon: FileText, color: "bg-blue-500" },
  { label: "Questions Asked", value: "8", icon: HelpCircle, color: "bg-green-500" },
  { label: "Items Listed", value: "3", icon: Package, color: "bg-purple-500" },
  { label: "Progress", value: "75%", icon: BarChart3, color: "bg-orange-500" },
];

const recentActivity = [
  {
    type: "note",
    title: "Data Structures Notes Chapter 5",
    description: "Received 12 upvotes and 3 comments",
    time: "2 hours ago",
    icon: BookOpen,
  },
  {
    type: "question",
    title: "How to implement binary search tree?",
    description: "Got 2 helpful answers",
    time: "5 hours ago",
    icon: MessageSquare,
  },
  {
    type: "exchange",
    title: "Calculus Textbook 11th Edition",
    description: "Someone is interested in buying",
    time: "1 day ago",
    icon: ShoppingBag,
  },
  {
    type: "progress",
    title: "Completed: Dynamic Programming",
    description: "Progress updated to 75%",
    time: "2 days ago",
    icon: TrendingUp,
  },
];

const quickActions = [
  {
    title: "Share Notes",
    description: "Upload and share your study materials",
    icon: BookOpen,
    href: "/notes",
    color: "bg-blue-500",
  },
  {
    title: "Ask Question",
    description: "Get help from the community",
    icon: MessageSquare,
    href: "/qa",
    color: "bg-green-500",
  },
  {
    title: "List Item",
    description: "Sell or exchange books & equipment",
    icon: ShoppingBag,
    href: "/exchange",
    color: "bg-purple-500",
  },
  {
    title: "Track Progress",
    description: "Update your learning journey",
    icon: TrendingUp,
    href: "/progress",
    color: "bg-orange-500",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening in your Campus Connect community today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="campus-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.title}
                        to={action.href}
                        className="group block animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 group-hover:scale-105">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {action.description}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="campus-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/activity">View All Activity</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Highlights */}
        <Card className="campus-card mt-8">
          <CardHeader>
            <CardTitle>Community Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 animate-fade-in">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Most Popular Note</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  "Machine Learning Fundamentals" by Sarah K.
                </p>
                <Badge variant="secondary">1.2k views</Badge>
              </div>
              
              <div className="text-center p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Hot Discussion</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  "Best resources for learning React?"
                </p>
                <Badge variant="secondary">24 replies</Badge>
              </div>
              
              <div className="text-center p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Latest Deal</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  "Algorithms Textbook - 50% off"
                </p>
                <Badge variant="secondary">Just listed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}