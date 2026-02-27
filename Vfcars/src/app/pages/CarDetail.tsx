import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase, type CarForSale } from "../lib/supabaseClient";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Car as CarIcon,
  Zap,
  Users,
  DoorOpen,
  Wind,
  TrendingUp,
  Gauge as SpeedIcon,
  Shield,
  FileCheck,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Link } from "react-router";

export function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarForSale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("cars_for_sale")
        .select("*")
        .eq("id", id)
        .single();

      setCar(data);
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Auto non trovata</h2>
          <Button onClick={() => navigate("/catalogo")}>
            Torna al Catalogo
          </Button>
        </div>
      </div>
    );
  }

  const image = car.image_urls?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Torna Indietro
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              {image ? (
                <img
                  src={image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageWithFallback
                    src=""
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {car.featured && (
                <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                  In Evidenza
                </Badge>
              )}
            </div>
          </div>

          {/* Main Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-1">
                {car.brand} {car.model}
              </h1>
              {car.trim && (
                <p className="text-lg text-muted-foreground mb-2">{car.trim}</p>
              )}
              <p className="text-3xl font-bold text-secondary">
                €{car.price.toLocaleString("it-IT")}
              </p>
            </div>

            {/* Key Specs */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Anno</p>
                    <p className="font-semibold">{car.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chilometraggio</p>
                    <p className="font-semibold">{car.mileage.toLocaleString("it-IT")} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Fuel className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carburante</p>
                    <p className="font-semibold">{car.fuel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Cog className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cambio</p>
                    <p className="font-semibold">{car.transmission}</p>
                  </div>
                </div>

                {car.power_cv && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Potenza</p>
                      <p className="font-semibold">{car.power_cv} CV</p>
                    </div>
                  </div>
                )}

                {car.body_type && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <CarIcon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrozzeria</p>
                      <p className="font-semibold">{car.body_type}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contatti" className="flex-1">
                <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
                  <Phone className="mr-2 w-5 h-5" />
                  Contattaci
                </Button>
              </Link>
              <a href="mailto:info@autoselect.it" className="flex-1">
                <Button size="lg" variant="outline" className="w-full">
                  <Mail className="mr-2 w-5 h-5" />
                  Richiedi Info
                </Button>
              </a>
            </div>

            {/* Guarantees */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>Garanzia 12 Mesi</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileCheck className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>Certificata in Officina</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {car.description && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Descrizione</h2>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </Card>
        )}

        {/* Technical Specifications */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Specifiche Tecniche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {car.doors && (
              <div className="flex items-start gap-3">
                <DoorOpen className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Porte</p>
                  <p className="text-muted-foreground">{car.doors}</p>
                </div>
              </div>
            )}

            {car.seats && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Posti</p>
                  <p className="text-muted-foreground">{car.seats}</p>
                </div>
              </div>
            )}

            {car.emissions_class && (
              <div className="flex items-start gap-3">
                <Wind className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Emissioni</p>
                  <p className="text-muted-foreground">{car.emissions_class}</p>
                </div>
              </div>
            )}

            {car.fuel_consumption && (
              <div className="flex items-start gap-3">
                <Fuel className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Consumo</p>
                  <p className="text-muted-foreground">{car.fuel_consumption}</p>
                </div>
              </div>
            )}

            {car.acceleration && (
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">0-100 km/h</p>
                  <p className="text-muted-foreground">{car.acceleration}</p>
                </div>
              </div>
            )}

            {car.top_speed && (
              <div className="flex items-start gap-3">
                <SpeedIcon className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Velocità Massima</p>
                  <p className="text-muted-foreground">{car.top_speed}</p>
                </div>
              </div>
            )}

            {car.color && (
              <div className="flex items-start gap-3">
                <CarIcon className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Colore</p>
                  <p className="text-muted-foreground">{car.color}</p>
                </div>
              </div>
            )}

            {car.interior_color && (
              <div className="flex items-start gap-3">
                <CarIcon className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Interni</p>
                  <p className="text-muted-foreground">{car.interior_color}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Equipment */}
        {car.equipment && car.equipment.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Dotazioni</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {car.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-primary to-primary/90 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Interessato a questa auto?</h2>
          <p className="text-lg mb-6 opacity-90">
            Contattaci per maggiori informazioni o per prenotare un test drive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contatti">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                <Phone className="mr-2 w-5 h-5" />
                Contattaci Ora
              </Button>
            </Link>
            <a href="tel:+39123456789">
              <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-primary border-white">
                <Phone className="mr-2 w-5 h-5" />
                +39 123 456 789
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
