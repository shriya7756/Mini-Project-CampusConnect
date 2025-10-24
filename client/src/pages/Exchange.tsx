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
  ShoppingBag,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  BookOpen,
  Laptop,
  Calculator,
  Microscope,
  Heart,
  MessageCircle,
  Eye,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Removed static mocks; render only DB data

const categories = ["All Categories", "Textbooks", "Electronics", "Lab Equipment", "Calculators", "Furniture", "Study Materials"];
const conditions = ["All Conditions", "Like New", "Very Good", "Good", "Fair"];

export default function Exchange() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [priceRange, setPriceRange] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState<string | number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [listForm, setListForm] = useState({ title: "", price: "", description: "", category: "", condition: "", phone: "", location: "", tags: "" });
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [viewed, setViewed] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const getSellerName = (seller: any) => typeof seller === 'string' ? seller : (seller?.name || 'Unknown');
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  useEffect(() => {
    apiGet(`/api/exchange?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&condition=${encodeURIComponent(selectedCondition)}`)
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, [searchTerm, selectedCategory, selectedCondition]);

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesCondition = selectedCondition === "All Conditions" || item.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleListItem = async () => {
    try {
      const payload = {
        title: listForm.title,
        price: Number(listForm.price || 0),
        description: listForm.description,
        category: listForm.category,
        condition: listForm.condition,
        contact: { phone: listForm.phone, location: listForm.location },
        tags: listForm.tags,
        images,
      };
      const res = await apiPost('/api/exchange', payload);
      setItems((prev) => [res.item, ...prev]);
      toast({ title: 'Item listed successfully!', description: 'Now visible to other students.' });
      setIsListOpen(false);
      setListForm({ title: "", price: "", description: "", category: "", condition: "", phone: "", location: "", tags: "" });
      setImages([]);
    } catch (e: any) {
      toast({ title: 'Listing failed', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const handleInterest = async (itemId: any) => {
    try {
      const res = await apiPost(`/api/exchange/${itemId}/interest`, {});
      setItems((prev) => prev.map((it: any) => ((it._id || it.id) === itemId ? res.item : it)));
      toast({ 
        title: res.toggled ? '🛍️ Interested!' : '↩️ Interest removed',
        description: res.toggled ? 'The seller will be notified of your interest' : 'Interest removed'
      });
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Textbooks": return BookOpen;
      case "Electronics": return Laptop;
      case "Calculators": return Calculator;
      case "Lab Equipment": return Microscope;
      default: return ShoppingBag;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-12 w-30 h-30 bg-emerald-500/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-1/4 right-24 w-28 h-28 bg-amber-500/10 rounded-full blur-lg float-animation" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-28 left-1/5 w-44 h-44 bg-violet-500/10 rounded-full blur-2xl float-animation" style={{animationDelay: '4.5s'}}></div>
        <div className="absolute top-3/5 right-12 w-26 h-26 bg-rose-500/10 rounded-full blur-xl float-animation" style={{animationDelay: '6.5s'}}></div>
        <div className="absolute bottom-12 right-2/5 w-38 h-38 bg-sky-500/10 rounded-full blur-2xl float-animation" style={{animationDelay: '8.5s'}}></div>
        
        {/* Floating Shopping Icons */}
        <div className="absolute top-28 right-1/5 text-emerald-500/20 float-animation">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="absolute bottom-1/5 left-24 text-amber-500/20 float-animation" style={{animationDelay: '3s'}}>
          <Package className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-1/5 text-violet-500/20 float-animation" style={{animationDelay: '5s'}}>
          <ShoppingCart className="w-8 h-8" />
        </div>
      </div>
      
      <div className="relative z-10">
        <Navbar isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Equipment Exchange
            </h1>
            <p className="text-muted-foreground">
              Buy and sell textbooks, electronics, and lab equipment with fellow students
            </p>
          </div>
          
          <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
            <DialogTrigger asChild>
              <Button className="campus-button text-white mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                List Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List an Item</DialogTitle>
                <DialogDescription>
                  List your textbooks, equipment, or electronics for sale or exchange.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-title">Item Title</Label>
                    <Input id="item-title" placeholder="Name of your item" value={listForm.title} onChange={(e) => setListForm({ ...listForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price (USD)</Label>
                    <Input id="item-price" type="number" placeholder="0" value={listForm.price} onChange={(e) => setListForm({ ...listForm, price: e.target.value })} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea 
                    id="item-description" 
                    placeholder="Describe the condition, usage, and any included accessories..."
                    rows={4}
                    value={listForm.description}
                    onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Category</Label>
                    <Select value={listForm.category} onValueChange={(v) => setListForm({ ...listForm, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-condition">Condition</Label>
                    <Select value={listForm.condition} onValueChange={(v) => setListForm({ ...listForm, condition: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.slice(1).map(condition => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-info">Contact Information</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Phone number" value={listForm.phone} onChange={(e) => setListForm({ ...listForm, phone: e.target.value })} />
                    <Input placeholder="Meeting location" value={listForm.location} onChange={(e) => setListForm({ ...listForm, location: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-tags">Tags</Label>
                  <div>
                    <Input id="item-tags" placeholder="comma,separated,tags" value={listForm.tags} onChange={(e) => setListForm({ ...listForm, tags: e.target.value })} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-images">Images (up to 3)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input type="file" accept="image/*" onChange={async (e) => {
                      if (images.length >= 3) return;
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploading(true);
                        const form = new FormData();
                        form.append('image', file);
                        const token = localStorage.getItem('token');
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/exchange/upload`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || 'Upload failed');
                        setImages((prev) => prev.length < 3 ? [...prev, data.url] : prev);
                      } catch (err: any) {
                        console.error(err);
                      } finally {
                        setUploading(false);
                      }
                    }} />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((url) => (
                          <img key={url} src={url} alt="uploaded" className="w-full h-24 object-cover rounded" />
                        ))}
                        {images.length < 3 && <div className="text-xs text-muted-foreground col-span-3">You can add {3 - images.length} more image(s)</div>}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsListOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleListItem} className="campus-button text-white">
                    List Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const itemId = (item as any)._id || item.id;
            const CategoryIcon = getCategoryIcon(item.category);
            const isContactVisible = showContactInfo === itemId;
            
            return (
              <Card key={itemId} className="campus-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${item.price}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {Array.isArray(item.images) && item.images.length > 0 && (
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {item.images.slice(0,3).map((img: string, idx: number) => (
                            <CarouselItem key={`${itemId}-${idx}`}>
                              <img src={img} alt={`${item.title}-${idx+1}`} className="w-full h-40 object-cover rounded-md border" />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-2" />
                        <CarouselNext className="-right-2" />
                      </Carousel>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.interested}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.sellerAvatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(getSellerName(item.seller))}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{getSellerName(item.seller)}</span>
                  </div>
                  
                  {isContactVisible && (
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
                      <h4 className="font-semibold text-sm">Contact Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{item.contact?.phone || '—'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3" />
                          <span>{item.contact?.location || '—'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 campus-button text-white"
                      onClick={async () => {
                        const next = isContactVisible ? null : itemId;
                        setShowContactInfo(next);
                        if (next && !viewed[String(itemId)]) {
                          try {
                            const res = await apiPost(`/api/exchange/${itemId}/view`, {});
                            setItems((prev) => prev.map((it: any) => ((it._id || it.id) === itemId ? res.item : it)));
                            setViewed((v) => ({ ...v, [String(itemId)]: true }));
                          } catch {}
                        }
                      }}
                    >
                      {isContactVisible ? "Hide Contact" : "View Contact"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleInterest(itemId)}
                      className="reaction-button"
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      Interested
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or be the first to list an item.
            </p>
            <Button onClick={() => setIsListOpen(true)} className="campus-button text-white">
              <Plus className="w-4 h-4 mr-2" />
              List the first item
            </Button>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}