import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  User,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Q&A", href: "/qa", icon: MessageSquare },
  { name: "Exchange", href: "/exchange", icon: ShoppingBag },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useMemo(getUser, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg campus-button flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl hero-text">Campus Connect</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {(user?.name || "U").split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.year}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {(user?.name || "U").split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <div className="flex gap-2 mt-1">
                            {user?.year && <Badge variant="secondary">{user.year}</Badge>}
                            {user?.major && <Badge variant="outline">{user.major}</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <User className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/feedback")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Feedback
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="campus-button text-white">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}