import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  CheckCircle,
  Circle,
  Trophy,
  Target,
  Calendar,
  BookOpen,
  Code,
  Brain,
  Zap,
  Star,
  Award,
} from "lucide-react";

// Static roadmap (unchanged UI), completion state comes from DB
const learningTracks = {
  dsa: {
    title: "Data Structures & Algorithms",
    description: "Master fundamental DSA concepts essential for coding interviews",
    totalTopics: 45,
    completedTopics: 34,
    categories: [
      {
        name: "Arrays & Strings",
        topics: [
          { id: 1, name: "Two Pointers Technique", completed: true, difficulty: "Easy" },
          { id: 2, name: "Sliding Window", completed: true, difficulty: "Medium" },
          { id: 3, name: "String Manipulation", completed: true, difficulty: "Easy" },
          { id: 4, name: "Array Rotation", completed: false, difficulty: "Medium" },
        ]
      },
      {
        name: "Linked Lists",
        topics: [
          { id: 5, name: "Singly Linked List", completed: true, difficulty: "Easy" },
          { id: 6, name: "Doubly Linked List", completed: true, difficulty: "Medium" },
          { id: 7, name: "Cycle Detection", completed: false, difficulty: "Medium" },
          { id: 8, name: "Merge Sorted Lists", completed: true, difficulty: "Easy" },
        ]
      },
      {
        name: "Trees & Graphs",
        topics: [
          { id: 9, name: "Binary Tree Traversal", completed: true, difficulty: "Easy" },
          { id: 10, name: "Binary Search Tree", completed: true, difficulty: "Medium" },
          { id: 11, name: "Graph BFS/DFS", completed: false, difficulty: "Medium" },
          { id: 12, name: "Shortest Path Algorithms", completed: false, difficulty: "Hard" },
        ]
      },
      {
        name: "Dynamic Programming",
        topics: [
          { id: 13, name: "Fibonacci Sequence", completed: true, difficulty: "Easy" },
          { id: 14, name: "Longest Common Subsequence", completed: false, difficulty: "Medium" },
          { id: 15, name: "Knapsack Problem", completed: false, difficulty: "Hard" },
          { id: 16, name: "Edit Distance", completed: false, difficulty: "Hard" },
        ]
      }
    ]
  },
  webdev: {
    title: "Web Development",
    description: "Full-stack web development with modern technologies",
    totalTopics: 38,
    completedTopics: 22,
    categories: [
      {
        name: "Frontend Fundamentals",
        topics: [
          { id: 17, name: "HTML5 Semantics", completed: true, difficulty: "Easy" },
          { id: 18, name: "CSS Grid & Flexbox", completed: true, difficulty: "Medium" },
          { id: 19, name: "JavaScript ES6+", completed: true, difficulty: "Medium" },
          { id: 20, name: "DOM Manipulation", completed: true, difficulty: "Easy" },
        ]
      },
      {
        name: "React Ecosystem",
        topics: [
          { id: 21, name: "React Components", completed: true, difficulty: "Medium" },
          { id: 22, name: "React Hooks", completed: true, difficulty: "Medium" },
          { id: 23, name: "State Management", completed: false, difficulty: "Hard" },
          { id: 24, name: "React Router", completed: true, difficulty: "Easy" },
        ]
      },
      {
        name: "Backend Development",
        topics: [
          { id: 25, name: "Node.js Fundamentals", completed: false, difficulty: "Medium" },
          { id: 26, name: "Express.js", completed: false, difficulty: "Medium" },
          { id: 27, name: "Database Design", completed: false, difficulty: "Hard" },
          { id: 28, name: "API Development", completed: false, difficulty: "Medium" },
        ]
      }
    ]
  },
  ml: {
    title: "Machine Learning",
    description: "Learn ML algorithms and build intelligent systems",
    totalTopics: 32,
    completedTopics: 12,
    categories: [
      {
        name: "ML Fundamentals",
        topics: [
          { id: 29, name: "Linear Regression", completed: true, difficulty: "Easy" },
          { id: 30, name: "Logistic Regression", completed: true, difficulty: "Medium" },
          { id: 31, name: "Decision Trees", completed: false, difficulty: "Medium" },
          { id: 32, name: "Random Forest", completed: false, difficulty: "Hard" },
        ]
      },
      {
        name: "Deep Learning",
        topics: [
          { id: 33, name: "Neural Networks", completed: false, difficulty: "Hard" },
          { id: 34, name: "Convolutional Networks", completed: false, difficulty: "Hard" },
          { id: 35, name: "Recurrent Networks", completed: false, difficulty: "Hard" },
          { id: 36, name: "Transfer Learning", completed: false, difficulty: "Hard" },
        ]
      }
    ]
  }
};

export default function Progress() {
  const [activeTrack, setActiveTrack] = useState("dsa");
  const [completedTopics, setCompletedTopics] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    apiGet('/api/progress').then((d) => {
      const p = d.progress;
      setActiveTrack(p.activeTrack || 'dsa');
      const map: Record<number, boolean> = {};
      (p.completedTopicIds || []).forEach((id: number) => { map[id] = true; });
      setCompletedTopics(map);
    }).catch(() => {
      setActiveTrack('dsa');
      setCompletedTopics({});
    });
  }, []);

  const currentTrack = learningTracks[activeTrack as keyof typeof learningTracks];
  
  // Calculate progress
  const totalCompleted = currentTrack.categories.reduce((total, category) => {
    return total + category.topics.filter(topic => completedTopics[topic.id]).length;
  }, 0);
  
  const progressPercentage = Math.round((totalCompleted / currentTrack.totalTopics) * 100);

  const handleTopicToggle = async (topicId: number, topicName: string) => {
    try {
      await apiPost('/api/progress/toggle', { topicId });
      setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
      toast({
        title: completedTopics[topicId] ? "Topic unchecked" : "Great progress! 🎉",
        description: completedTopics[topicId]
          ? `"${topicName}" removed from completed topics`
          : `"${topicName}" marked as completed`,
      });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTrackIcon = (track: string) => {
    switch (track) {
      case "dsa": return Code;
      case "webdev": return BookOpen;
      case "ml": return Brain;
      default: return Target;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Progress Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="campus-card">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalCompleted}</div>
              <div className="text-sm text-muted-foreground">Topics Completed</div>
            </CardContent>
          </Card>
          
          <Card className="campus-card">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <div className="text-sm text-muted-foreground">Current Track</div>
            </CardContent>
          </Card>
          
          <Card className="campus-card">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="campus-card">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Tracks Started</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Tracks */}
        <Tabs value={activeTrack} onValueChange={async (v) => { setActiveTrack(v); try { await apiPost('/api/progress/track', { track: v }); } catch {} }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(learningTracks).map(([key, track]) => {
              const Icon = getTrackIcon(key);
              return (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{track.title}</span>
                  <span className="sm:hidden">{key.toUpperCase()}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(learningTracks).map(([key, track]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card className="campus-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{track.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{track.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {Math.round((totalCompleted / track.totalTopics) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalCompleted} / {track.totalTopics} completed
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{totalCompleted} / {track.totalTopics}</span>
                    </div>
                    <div className="progress-bar h-3 rounded-full overflow-hidden">
                      <ProgressBar value={progressPercentage} className="h-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {track.categories.map((category, categoryIndex) => (
                  <Card key={category.name} className="campus-card animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <Badge variant="secondary">
                          {category.topics.filter(topic => completedTopics[topic.id]).length} / {category.topics.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.topics.map((topic) => {
                          const isCompleted = completedTopics[topic.id];
                          return (
                            <div 
                              key={topic.id} 
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                                isCompleted 
                                  ? 'bg-green-50/50 border-green-200' 
                                  : 'bg-card hover:bg-muted/50'
                              }`}
                            >
                              <Checkbox
                                id={`topic-${topic.id}`}
                                checked={isCompleted}
                                onCheckedChange={() => handleTopicToggle(topic.id, topic.name)}
                                className="reaction-button"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <label 
                                    htmlFor={`topic-${topic.id}`}
                                    className={`font-medium cursor-pointer ${
                                      isCompleted ? 'line-through text-muted-foreground' : ''
                                    }`}
                                  >
                                    {topic.name}
                                  </label>
                                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(topic.difficulty)}`} />
                                  <Badge variant="outline" className="text-xs">
                                    {topic.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Achievements Section */}
        <Card className="campus-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">First Milestone</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Completed your first 10 topics in DSA
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Consistency King</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maintained a 7-day learning streak
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Multi-Track</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started learning in 3 different tracks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}