import { useState } from "react";
import { Phone, Mail, Menu, X } from "lucide-react";
import { Link } from "react-router";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-foreground sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-nosfondo.png" alt="G&G Auto" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-foreground">G&G Auto</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/70 hover:text-secondary font-medium transition-colors">
              Home
            </Link>
            <Link to="/catalogo" className="text-foreground/70 hover:text-secondary font-medium transition-colors">
              Catalogo
            </Link>
            <Link to="/chi-siamo" className="text-foreground/70 hover:text-secondary font-medium transition-colors">
              Chi Siamo
            </Link>
            <Link to="/contatti" className="text-foreground/70 hover:text-secondary font-medium transition-colors">
              Contatti
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+39061234567" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+39 06 123 4567</span>
            </a>
            <a href="mailto:info@ggauto.it" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              <span>info@ggauto.it</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-border animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className="block px-3 py-3 text-base font-medium text-foreground/70 hover:text-secondary hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/catalogo"
              className="block px-3 py-3 text-base font-medium text-foreground/70 hover:text-secondary hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalogo
            </Link>
            <Link
              to="/chi-siamo"
              className="block px-3 py-3 text-base font-medium text-foreground/70 hover:text-secondary hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Chi Siamo
            </Link>
            <Link
              to="/contatti"
              className="block px-3 py-3 text-base font-medium text-foreground/70 hover:text-secondary hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contatti
            </Link>
            <div className="pt-4 mt-4 border-t border-border flex flex-col gap-4">
              <a href="tel:+39061234567" className="flex items-center gap-3 px-3 py-1 text-sm text-foreground/70">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+39 06 123 4567</span>
              </a>
              <a href="mailto:info@ggauto.it" className="flex items-center gap-3 px-3 py-1 text-sm text-foreground/70">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@ggauto.it</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
