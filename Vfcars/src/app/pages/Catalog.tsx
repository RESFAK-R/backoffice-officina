import { useState, useEffect, useMemo } from "react";
import { supabase, type CarForSale } from "../lib/supabaseClient";
import { CarCard } from "../components/CarCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";

export function Catalog() {
  const [cars, setCars] = useState<CarForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [bodyTypeFilter, setBodyTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await supabase
        .from("cars_for_sale")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      setCars(data || []);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    let filtered = [...cars];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          (car.trim && car.trim.toLowerCase().includes(query)) ||
          `${car.brand} ${car.model}`.toLowerCase().includes(query)
      );
    }

    // Fuel filter
    if (fuelFilter !== "all") {
      filtered = filtered.filter((car) => car.fuel === fuelFilter);
    }

    // Transmission filter
    if (transmissionFilter !== "all") {
      filtered = filtered.filter((car) => car.transmission === transmissionFilter);
    }

    // Body type filter
    if (bodyTypeFilter !== "all") {
      filtered = filtered.filter((car) => car.body_type === bodyTypeFilter);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((car) => car.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((car) => car.price <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year-desc":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "mileage-asc":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
    }

    return filtered;
  }, [cars, searchQuery, fuelFilter, transmissionFilter, bodyTypeFilter, sortBy, priceRange]);

  const resetFilters = () => {
    setSearchQuery("");
    setFuelFilter("all");
    setTransmissionFilter("all");
    setBodyTypeFilter("all");
    setSortBy("price-asc");
    setPriceRange({ min: "", max: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Catalogo Auto</h1>
          <p className="text-lg opacity-90">
            Trova l'auto perfetta tra {cars.length} veicoli disponibili
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-semibold">Filtri di Ricerca</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cerca marca, modello o allestimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Prezzo: Crescente</SelectItem>
                <SelectItem value="price-desc">Prezzo: Decrescente</SelectItem>
                <SelectItem value="year-desc">Anno: Più Recente</SelectItem>
                <SelectItem value="year-asc">Anno: Meno Recente</SelectItem>
                <SelectItem value="mileage-asc">Km: Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Fuel Type */}
            <Select value={fuelFilter} onValueChange={setFuelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Carburante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="Benzina">Benzina</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Ibrido">Ibrido</SelectItem>
                <SelectItem value="Ibrido Plug-in">Ibrido Plug-in</SelectItem>
                <SelectItem value="Elettrico">Elettrico</SelectItem>
              </SelectContent>
            </Select>

            {/* Transmission */}
            <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cambio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="Manuale">Manuale</SelectItem>
                <SelectItem value="Automatica">Automatica</SelectItem>
              </SelectContent>
            </Select>

            {/* Body Type */}
            <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="Berlina">Berlina</SelectItem>
                <SelectItem value="Station Wagon">Station Wagon</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Coupé">Coupé</SelectItem>
                <SelectItem value="Cabrio">Cabrio</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Input
              type="number"
              placeholder="Prezzo min (€)"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Prezzo max (€)"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>

          {(searchQuery || fuelFilter !== "all" || transmissionFilter !== "all" || bodyTypeFilter !== "all" || priceRange.min || priceRange.max) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedCars.length} {filteredAndSortedCars.length === 1 ? "risultato" : "risultati"}
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reimposta Filtri
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredAndSortedCars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nessun risultato trovato</h3>
            <p className="text-muted-foreground mb-4">
              Prova a modificare i filtri di ricerca
            </p>
            <Button onClick={resetFilters}>Reimposta Filtri</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
