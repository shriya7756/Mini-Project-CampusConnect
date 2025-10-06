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
  BookOpen,
  Upload,
  Search,
  ThumbsUp,
  MessageCircle,
  Heart,
  Download,
  Filter,
  Plus,
  Star,
  Calendar,
  User,
} from "lucide-react";

// Removed static mocks; render only DB data

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Chemistry", "Physics", "Biology", "Business"];

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", subject: "", tags: "" });
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const getAuthorName = (author: any) => typeof author === 'string' ? author : (author?.name || 'Unknown');
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  useEffect(() => {
    apiGet("/api/notes")
      .then((data) => setNotes(data.notes))
      .catch(() => setNotes([]));
  }, []);

  const filteredNotes = notes.filter((note: any) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "All Subjects" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleUpload = async () => {
    try {
      const payload = { ...uploadForm, tags: uploadForm.tags, fileUrl };
      const res = await apiPost("/api/notes", payload);
      setNotes((prev) => [res.note, ...prev]);
      toast({ title: "Notes uploaded successfully!", description: "Your notes have been shared." });
      setIsUploadOpen(false);
      setUploadForm({ title: "", description: "", subject: "", tags: "" });
      setFileUrl(null);
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message || "Try again", variant: "destructive" });
    }
  };

  const handleReaction = (noteId: number, reactionType: string) => {
    toast({
      title: `${reactionType} added!`,
      description: "Your reaction has been recorded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Notes Exchange
            </h1>
            <p className="text-muted-foreground">
              Share and discover study materials from your fellow students
            </p>
          </div>
          
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="campus-button text-white mt-4 md:mt-0">
                <Upload className="w-4 h-4 mr-2" />
                Share Notes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Share Your Notes</DialogTitle>
                <DialogDescription>
                  Upload your study materials to help fellow students learn.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter note title" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of your notes" value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={uploadForm.subject} onValueChange={(v) => setUploadForm({ ...uploadForm, subject: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="comma,separated,tags" value={uploadForm.tags} onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input type="file" accept="application/pdf,image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setFileUploading(true);
                        const form = new FormData();
                        form.append('file', file);
                        const token = localStorage.getItem('token');
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notes/upload`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || 'Upload failed');
                        setFileUrl(data.url);
                      } catch (err: any) {
                        console.error(err);
                      } finally {
                        setFileUploading(false);
                      }
                    }} />
                    {fileUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                    {fileUrl && <p className="text-sm text-green-600 mt-2">File uploaded</p>}
                    <p className="text-xs text-muted-foreground">PDF or images up to ~10MB</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} className="campus-button text-white">
                    Upload Notes
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
              placeholder="Search notes, topics, or tags..."
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

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <Card key={note.id} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {note.subject}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3" />
                    <span>{note.upvotes}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {note.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {note.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {getInitials(getAuthorName(note.author))}
                    </AvatarFallback>
                  </Avatar>
                  <span>{getAuthorName(note.author)}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary reaction-button"
                      onClick={() => handleReaction(note.id, "Upvote")}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{note.upvotes}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary reaction-button"
                      onClick={() => handleReaction(note.id, "Comment")}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{note.comments}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary reaction-button"
                      onClick={() => handleReaction(note.id, "Like")}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {note.fileUrl && (
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center h-8 px-3 border rounded-md text-sm hover:bg-muted"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button onClick={() => setIsUploadOpen(true)} className="campus-button text-white">
              <Plus className="w-4 h-4 mr-2" />
              Share the first note
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}