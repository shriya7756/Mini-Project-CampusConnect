import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/Navbar";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare,
  Search,
  ThumbsUp,
  MessageCircle,
  Plus,
  Filter,
  CheckCircle,
  Calendar,
  User,
  ArrowUp,
  Reply,
  Trash2,
  HelpCircle,
} from "lucide-react";

// Removed static mocks; render only DB data

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Chemistry", "Physics", "Biology", "Business"];

export default function QA() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [askForm, setAskForm] = useState({ title: "", description: "", tags: "", subject: "" });
  const { toast } = useToast();
  const [viewed, setViewed] = useState<Record<string, boolean>>({});

  const getAuthorName = (author: any) => typeof author === 'string' ? author : (author?.name || 'Unknown');
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  useEffect(() => {
    const qs = new URLSearchParams();
    if (selectedSubject && selectedSubject !== 'All Subjects') qs.set('subject', selectedSubject);
    apiGet(`/api/qa/questions${qs.toString() ? `?${qs.toString()}` : ''}`).then((d) => setQuestions(d.questions)).catch(() => setQuestions([]));
  }, [selectedSubject]);

  const filteredQuestions = questions.filter((question: any) => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "All Subjects" || (question.subject || "").toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const handleAskQuestion = async () => {
    try {
      const payload = { ...askForm, tags: askForm.tags };
      const res = await apiPost("/api/qa/questions", payload);
      setQuestions((prev) => [res.question, ...prev]);
      toast({ title: "Question posted successfully!", description: "Shared with the community." });
      setIsAskOpen(false);
      setAskForm({ title: "", description: "", tags: "", subject: "" });
    } catch (e: any) {
      toast({ title: "Post failed", description: e.message || "Try again", variant: "destructive" });
    }
  };

  const handleUpvote = async (questionId: any, answerId?: any) => {
    try {
      let res;
      if (answerId) {
        res = await apiPost(`/api/qa/questions/${questionId}/answers/${answerId}/upvote`, {});
        toast({ 
          title: res.toggled ? '👍 Answer upvoted!' : '↩️ Upvote removed',
          description: res.toggled ? 'You upvoted this answer' : 'Upvote removed from answer'
        });
      } else {
        res = await apiPost(`/api/qa/questions/${questionId}/upvote`, {});
        toast({ 
          title: res.toggled ? '❓ Question upvoted!' : '↩️ Upvote removed',
          description: res.toggled ? 'You upvoted this question' : 'Upvote removed from question'
        });
      }
      setQuestions((prev) => prev.map((q: any) => ((q._id || q.id) === questionId ? res.question : q)));
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const toggleQuestion = async (questionId: any) => {
    const next = expandedQuestion === questionId ? null : questionId;
    setExpandedQuestion(next);
    if (next && !viewed[String(questionId)]) {
      try {
        const res = await apiPost(`/api/qa/questions/${questionId}/view`, {});
        setQuestions((prev) => prev.map((q: any) => ((q._id || q.id) === questionId ? res.question : q)));
        setViewed((v) => ({ ...v, [String(questionId)]: true }));
      } catch {}
    }
  };

  const handleDeleteAnswer = async (questionId: any, answerId: string) => {
    try {
      const res = await apiPost(`/api/qa/questions/${questionId}/answers/${answerId}/delete`, {});
      setQuestions((prev) => prev.map((q: any) => ((q._id || q.id) === questionId ? res.question : q)));
      toast({ title: '🗑️ Answer deleted', description: 'Answer has been removed' });
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-16 w-28 h-28 bg-orange-500/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-1/3 left-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl float-animation" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-24 right-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl float-animation" style={{animationDelay: '5s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg float-animation" style={{animationDelay: '7s'}}></div>
        <div className="absolute bottom-16 left-1/3 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl float-animation" style={{animationDelay: '9s'}}></div>
        
        {/* Floating Question Mark Icons */}
        <div className="absolute top-24 left-1/4 text-orange-500/20 float-animation">
          <MessageSquare className="w-7 h-7" />
        </div>
        <div className="absolute bottom-1/4 right-20 text-cyan-500/20 float-animation" style={{animationDelay: '4s'}}>
          <HelpCircle className="w-6 h-6" />
        </div>
        <div className="absolute top-2/3 left-16 text-red-500/20 float-animation" style={{animationDelay: '6s'}}>
          <MessageSquare className="w-8 h-8" />
        </div>
      </div>
      
      <div className="relative z-10">
        <Navbar isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              Q&A Community
            </h1>
            <p className="text-muted-foreground">
              Ask questions and share knowledge with fellow students
            </p>
          </div>
          
          <Dialog open={isAskOpen} onOpenChange={setIsAskOpen}>
            <DialogTrigger asChild>
              <Button className="campus-button text-white mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>  
                <DialogTitle>Ask a Question</DialogTitle>
                <DialogDescription>
                  Get help from the community by asking a detailed question.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="question-title">Question Title</Label>
                  <Input id="question-title" placeholder="What's your question? Be specific." value={askForm.title} onChange={(e) => setAskForm({ ...askForm, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-subject">Subject</Label>
                  <Select value={askForm.subject} onValueChange={(v) => setAskForm({ ...askForm, subject: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-description">Description</Label>
                  <Textarea 
                    id="question-description" 
                    placeholder="Provide more details about your question. Include what you've tried and what specifically you're stuck on."
                    rows={6}
                    value={askForm.description}
                    onChange={(e) => setAskForm({ ...askForm, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-tags">Tags</Label>
                  <Input id="question-tags" placeholder="Add tags separated by commas (e.g., python, algorithms, data-structures)" value={askForm.tags} onChange={(e) => setAskForm({ ...askForm, tags: e.target.value })} />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAskQuestion} className="campus-button text-white">
                    Post Question
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => {
            const qid = question._id || question.id;
            return (
            <Card key={qid} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {question.solved && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <Badge variant={question.solved ? "default" : "secondary"}>
                      {question.solved ? "Solved" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{question.views || 0} views</span>
                    <span>{(question.answers?.length || 0)} answers</span>
                  </div>
                </div>
                
                <CardTitle 
                  className="text-xl hover:text-primary cursor-pointer transition-colors"
                  onClick={() => toggleQuestion(qid)}
                >
                  {question.title}
                </CardTitle>
                
                <p className="text-muted-foreground">{question.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {question.tags.map(tag => (
                    <Badge key={`${qid}-${tag}`} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary reaction-button"
                      onClick={() => handleUpvote(qid)}
                    >
                      <ArrowUp className="w-4 h-4" />
                      <span>{question.upvotes || 0}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary reaction-button"
                      onClick={() => toggleQuestion(qid)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{(question.answers?.length || 0)} answers</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={question.authorAvatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(getAuthorName(question.author))}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getAuthorName(question.author)}</span>
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(question.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>

                {/* Expanded Answers Section */}
                {expandedQuestion === qid && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <h4 className="font-semibold text-lg">Answers</h4>
                    {(question.answers || []).map((answer: any, aidx: number) => {
                      const currentUserId = getCurrentUserId();
                      const isOwner = String(answer.author._id || answer.author) === String(currentUserId);
                      return (
                        <div key={answer._id || `${qid}-ans-${aidx}`} className={`p-4 rounded-lg border ${answer.isAccepted ? 'border-green-200 bg-green-50/50' : 'border-border'}`}>
                          {answer.isAccepted && (
                            <div className="flex items-center space-x-2 text-green-600 mb-2">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Accepted Answer</span>
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-3">
                            <p className="flex-1 select-text">{answer.content}</p>
                            {isOwner && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAnswer(qid, answer._id)}
                                className="ml-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <button 
                              className="flex items-center space-x-1 text-muted-foreground hover:text-primary reaction-button"
                              onClick={() => handleUpvote(qid, answer._id)}
                            >
                              <ArrowUp className="w-3 h-3" />
                              <span>{answer.upvotes || 0}</span>
                            </button>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <span>{getAuthorName(answer.author)}</span>
                              <span>•</span>
                              <span>{new Date(answer.createdAt || question.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4">
                      <Textarea placeholder="Write your answer..." className="mb-2" id={`answer-${qid}`} />
                      <Button size="sm" className="campus-button text-white" onClick={async () => {
                        const el = document.getElementById(`answer-${qid}`) as HTMLTextAreaElement | null;
                        if (!el || !el.value.trim()) return;
                        try {
                          const res = await apiPost(`/api/qa/questions/${qid}/answers`, { content: el.value.trim() });
                          setQuestions((prev) => [res.question, ...prev.filter((q: any) => (q._id || q.id) !== qid)]);
                          el.value = '';
                        } catch (e: any) {
                          toast({ title: 'Failed to post answer', description: e.message || 'Try again', variant: 'destructive' });
                        }
                      }}>
                        <Reply className="w-3 h-3 mr-1" />
                        Post Answer
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );})}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or be the first to ask a question.
            </p>
            <Button onClick={() => setIsAskOpen(true)} className="campus-button text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ask the first question
            </Button>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}