import { Link } from "react-router-dom";
import { GraduationCap, Heart, Github, Twitter, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Notes", href: "/notes" },
      { name: "Q&A", href: "/qa" },
      { name: "Exchange", href: "/exchange" },
      { name: "Progress", href: "/progress" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Feedback", href: "/feedback" },
      { name: "Contact Us", href: "/contact" },
      { name: "Community Guidelines", href: "/guidelines" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "DMCA", href: "/dmca" }
    ]
  };

  return (
    <footer className="bg-background border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg campus-button flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl hero-text">Campus Connect</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students to share knowledge, collaborate, and succeed together. 
              Join thousands of students building a better academic community.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:support@campusconnect.edu" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                University Campus, Education City
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} Campus Connect. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for students, by students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
