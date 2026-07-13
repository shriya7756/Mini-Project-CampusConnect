import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ notes: any[]; qas: any[] }>({ notes: [], qas: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setResults({ notes: [], qas: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiGet(`/api/search?q=${encodeURIComponent(query)}`);
        setResults({ notes: data.notes || [], qas: data.qas || [] });
      } catch (err: any) {
        setError(err.message || "Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const hasResults = results.notes.length > 0 || results.qas.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground mt-2">
            Showing results for <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : !query ? (
          <div className="text-center py-20 text-muted-foreground">Please enter a search query.</div>
        ) : !hasResults ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Notes Results */}
            {results.notes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Notes</h2>
                  <Badge variant="secondary" className="ml-2">{results.notes.length}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.notes.map((note) => (
                    <Card key={note._id} className="flex flex-col hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                          <Badge variant="outline">{note.subject}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                          {note.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto pt-4 flex justify-between items-center text-sm text-muted-foreground border-t">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            👍 {note.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            💬 {note.comments || 0}
                          </span>
                        </div>
                        <span>{format(new Date(note.createdAt), "MMM d, yyyy")}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Q&A Results */}
            {results.qas.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Q&A Discussions</h2>
                  <Badge variant="secondary" className="ml-2">{results.qas.length}</Badge>
                </div>
                <div className="grid gap-4">
                  {results.qas.map((qa) => (
                    <Card key={qa._id} className="hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <CardTitle className="text-lg mb-2">{qa.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {qa.description}
                            </CardDescription>
                          </div>
                          {qa.solved && (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Solved
                            </Badge>
                          )}
                        </div>
                        {qa.tags && qa.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {qa.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex gap-4">
                          <span>{qa.answers?.length || 0} answers</span>
                          <span>{qa.upvotes || 0} votes</span>
                        </div>
                        <span>{format(new Date(qa.createdAt), "MMM d, yyyy")}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
