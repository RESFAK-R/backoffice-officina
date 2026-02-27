import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Shield, Award, FileCheck, Search } from "lucide-react";
import { supabase, type CarForSale } from "../lib/supabaseClient";
import { CarCard } from "../components/CarCard";
import { Button } from "../components/ui/button";

const heroImage = "https://images.unsplash.com/photo-1736426341937-656fc3363b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MDU0NDM2M3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Home() {
  const [featuredCars, setFeaturedCars] = useState<CarForSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("cars_for_sale")
        .select("*")
        .eq("status", "available")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      setFeaturedCars(data || []);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Il Tuo Prossimo Viaggio Inizia Qui
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Auto usate certificate, garantite e pronte per la strada. Qualità professionale e trasparenza in ogni dettaglio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogo">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                  Scopri il Catalogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contatti">
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-primary border-white">
                  Contattaci
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Garanzia 12 Mesi</h3>
              <p className="text-sm text-muted-foreground">
                Tutte le nostre auto includono garanzia completa
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <FileCheck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Certificate</h3>
              <p className="text-sm text-muted-foreground">
                Controlli tecnici completi nella nostra officina
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Qualità Premium</h3>
              <p className="text-sm text-muted-foreground">
                Selezioniamo solo auto in condizioni eccellenti
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Trasparenza</h3>
              <p className="text-sm text-muted-foreground">
                Storico completo e documentazione verificata
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Auto in Evidenza</h2>
              <p className="text-muted-foreground">
                Le migliori opportunità selezionate per te
              </p>
            </div>
            <Link to="/catalogo">
              <Button variant="outline">
                Vedi Tutto
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Non hai trovato l'auto giusta?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contattaci e ti aiuteremo a trovare l'auto perfetta per le tue esigenze
          </p>
          <Link to="/contatti">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
              Parla con un Esperto
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
