import { Phone, Mail } from "lucide-react";
import { Link } from "react-router";

export function Navbar() {
  return (
    <nav className="bg-white text-foreground sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-nosfondo.png" alt="G&G Auto" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-foreground">G&G Auto</span>
          </Link>

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
            <a href="tel:+39123456789" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+39 123 456 789</span>
            </a>
            <a href="mailto:info@ggauto.it" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              <span>info@ggauto.it</span>
            </a>
          </div>

          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
