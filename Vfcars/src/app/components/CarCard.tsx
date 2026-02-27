import { Link } from "react-router";
import { type CarForSale } from "../lib/supabaseClient";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Fuel, Gauge, Calendar, Cog } from "lucide-react";
import { Badge } from "./ui/badge";

interface CarCardProps {
  car: CarForSale;
}

export function CarCard({ car }: CarCardProps) {
  const image = car.image_urls?.[0];

  return (
    <Link to={`/auto/${car.id}`} className="group">
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
        <div className="relative overflow-hidden aspect-[4/3]">
          {image ? (
            <img
              src={image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageWithFallback
                src=""
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {car.featured && (
            <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
              In Evidenza
            </Badge>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
              {car.brand} {car.model}
            </h3>
            {car.trim && (
              <p className="text-sm text-muted-foreground">{car.trim}</p>
            )}
            <p className="text-2xl font-bold text-secondary mt-1">
              €{car.price.toLocaleString("it-IT")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-secondary" />
              <span>{car.mileage.toLocaleString("it-IT")} km</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-secondary" />
              <span>{car.fuel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cog className="w-4 h-4 text-secondary" />
              <span>{car.transmission}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {car.power_cv ? `${car.power_cv} CV` : ''}{car.power_cv && car.body_type ? ' • ' : ''}{car.body_type || ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
