import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-nosfondo.png" alt="G&G Auto" className="h-10 w-auto" />
              <span className="text-xl font-semibold">G&G Auto</span>
            </div>
            <p className="text-sm opacity-80">
              Il tuo partner di fiducia per l'acquisto di auto usate certificate. Qualità, trasparenza e servizio professionale.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigazione</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-sm opacity-80 hover:text-secondary transition-colors">
                  Catalogo Auto
                </Link>
              </li>
              <li>
                <Link to="/chi-siamo" className="text-sm opacity-80 hover:text-secondary transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link to="/contatti" className="text-sm opacity-80 hover:text-secondary transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Servizi</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Vendita Auto Usate Certificate</li>
              <li>Garanzia 12 Mesi</li>
              <li>Finanziamenti Personalizzati</li>
              <li>Valutazione Permuta</li>
              <li>Assistenza Post-Vendita</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Via Roma 123<br />20100 Milano (MI)</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+39123456789" className="hover:text-secondary transition-colors">
                  +39 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@autoselect.it" className="hover:text-secondary transition-colors">
                  info@autoselect.it
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-80">
          <p>© {new Date().getFullYear()} G&G Auto. Tutti i diritti riservati.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-secondary transition-colors">Cookie Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-secondary transition-colors">Termini e Condizioni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
