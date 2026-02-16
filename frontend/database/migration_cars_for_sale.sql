-- =====================================================
-- MIGRAZIONE: Tabella cars_for_sale (Auto in Vendita)
-- =====================================================
-- Esegui questo script nell'SQL Editor di Supabase
-- per aggiungere la sezione vendita auto.
-- =====================================================

-- =====================================================
-- TABELLA: cars_for_sale (Auto in Vendita)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cars_for_sale (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(150),
    year INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    mileage INTEGER DEFAULT 0,
    fuel VARCHAR(30) NOT NULL CHECK (fuel IN ('Benzina', 'Diesel', 'GPL', 'Metano', 'Ibrido', 'Ibrido Plug-in', 'Elettrico')),
    transmission VARCHAR(30) DEFAULT 'Manuale' CHECK (transmission IN ('Manuale', 'Automatica')),
    body_type VARCHAR(30) CHECK (body_type IN ('Berlina', 'Station Wagon', 'SUV', 'Coupé', 'Cabrio', 'Monovolume', 'Citycar', 'Furgone', 'Altro')),
    color VARCHAR(50),
    interior_color VARCHAR(50),
    power_cv INTEGER,
    displacement INTEGER,
    doors INTEGER DEFAULT 5,
    seats INTEGER DEFAULT 5,
    plate VARCHAR(20),
    vin VARCHAR(17),
    emissions_class VARCHAR(30),
    fuel_consumption VARCHAR(30),
    acceleration VARCHAR(30),
    top_speed VARCHAR(30),
    equipment TEXT[] DEFAULT '{}',
    description TEXT,
    image_urls TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per ricerche frequenti
CREATE INDEX IF NOT EXISTS idx_cars_for_sale_brand ON public.cars_for_sale(brand);
CREATE INDEX IF NOT EXISTS idx_cars_for_sale_status ON public.cars_for_sale(status);
CREATE INDEX IF NOT EXISTS idx_cars_for_sale_featured ON public.cars_for_sale(featured);
CREATE INDEX IF NOT EXISTS idx_cars_for_sale_price ON public.cars_for_sale(price);
CREATE INDEX IF NOT EXISTS idx_cars_for_sale_year ON public.cars_for_sale(year);

-- Trigger per updated_at
DROP TRIGGER IF EXISTS update_cars_for_sale_updated_at ON public.cars_for_sale;
CREATE TRIGGER update_cars_for_sale_updated_at
    BEFORE UPDATE ON public.cars_for_sale
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.cars_for_sale ENABLE ROW LEVEL SECURITY;

-- Accesso anonimo in lettura (per il sito vetrina pubblico)
CREATE POLICY "Allow anon read access" ON public.cars_for_sale
    FOR SELECT TO anon USING (true);

-- Accesso completo per utenti autenticati (backoffice)
CREATE POLICY "Allow authenticated read access" ON public.cars_for_sale
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.cars_for_sale
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.cars_for_sale
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.cars_for_sale
    FOR DELETE TO authenticated USING (true);

-- =====================================================
-- DATI DI ESEMPIO (opzionale)
-- =====================================================
-- Inserisce le auto attualmente hardcoded nel sito Vfcars
INSERT INTO public.cars_for_sale (brand, model, trim, year, price, mileage, fuel, transmission, body_type, color, power_cv, doors, seats, emissions_class, fuel_consumption, acceleration, top_speed, equipment, description, image_urls, featured, status) VALUES
('Audi', 'A4 Avant', 'S Line', 2022, 38900, 15000, 'Diesel', 'Automatica', 'Station Wagon', 'Nero Metallizzato', 204, 5, 5, 'Euro 6d', '5.2 L/100km', '7.1 s', '240 km/h',
 ARRAY['Navigatore MMI Plus', 'Virtual Cockpit Plus', 'Sensori di parcheggio', 'Telecamera posteriore', 'Cruise control adattivo', 'Sedili riscaldati', 'LED Matrix', 'Portellone elettrico'],
 'Audi A4 Avant in condizioni eccellenti. Revisionata e certificata dalla nostra officina. Tagliando completo effettuato. Garanzia 12 mesi inclusa.',
 ARRAY['https://images.unsplash.com/photo-1670686189004-3f824f40027e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpJTIwYTQlMjBhdmFudCUyMGJsYWNrfGVufDF8fHx8MTc3MDU0NDM2NHww&ixlib=rb-4.1.0&q=80&w=1080'],
 true, 'available'),

('BMW', 'Serie 3 Touring', '320d Business', 2021, 42500, 22000, 'Diesel', 'Automatica', 'Station Wagon', 'Bianco Alpino', 190, 5, 5, 'Euro 6d', '4.9 L/100km', '7.5 s', '235 km/h',
 ARRAY['BMW Live Cockpit Professional', 'Parking Assistant Plus', 'Driving Assistant', 'Sedili sport', 'Climatizzatore automatico tri-zona', 'Fari LED adattivi', 'Gancio traino', 'Cerchi in lega 18"'],
 'BMW Serie 3 Touring 320d con pacchetto Business. Unico proprietario. Manutenzione completa presso BMW Service. Condizioni perfette.',
 ARRAY['https://images.unsplash.com/photo-1609781465248-63a3b89d9060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjAzJTIwc2VyaWVzJTIwd2hpdGV8ZW58MXx8fHwxNzcwNTQ0MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
 true, 'available'),

('Mercedes-Benz', 'Classe C Station Wagon', 'Plug-in Hybrid', 2023, 49900, 8000, 'Ibrido', 'Automatica', 'Station Wagon', 'Grigio Selenite', 204, 5, 5, 'Euro 6d-ISC-FCM', '1.3 L/100km', '7.8 s', '230 km/h',
 ARRAY['MBUX con schermo 11.9"', 'Digital Light', 'Pacchetto parcheggio con telecamera 360°', 'Sedili comfort con regolazione elettrica', 'Impianto audio Burmester', 'Tetto panoramico', 'Keyless-Go', 'Sospensioni adattive'],
 'Mercedes-Benz Classe C Plug-in Hybrid, quasi nuova. Ideale per chi cerca prestazioni ed efficienza.',
 ARRAY['https://images.unsplash.com/photo-1701336843410-31897aea08a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGMlMjBjbGFzcyUyMGdyZXl8ZW58MXx8fHwxNzcwNTQ0MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
 true, 'available'),

('Volkswagen', 'Golf GTI', 'Performance', 2022, 35900, 18000, 'Benzina', 'Manuale', 'Berlina', 'Rosso Tornado', 245, 5, 5, 'Euro 6d-ISC-FCM', '6.8 L/100km', '6.2 s', '250 km/h',
 ARRAY['Sedili sportivi Tartan', 'Digital Cockpit Pro', 'Climatizzatore automatico', 'Park Assist', 'Fari LED IQ.Light', 'Sistema audio Beats', 'Cerchi Pretoria 18"', 'Differenziale autobloccante elettronico'],
 'Volkswagen Golf GTI, l''icona delle sportive compatte. Perfetta per gli appassionati di guida.',
 ARRAY['https://images.unsplash.com/photo-1678476727289-3b70c3a7f59b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xrc3dhZ2VuJTIwZ29sZiUyMGd0aSUyMHJlZHxlbnwxfHx8fDE3NzA1NDQzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
 false, 'available'),

('Alfa Romeo', 'Giulia', 'Veloce Q4', 2021, 36900, 25000, 'Benzina', 'Automatica', 'Berlina', 'Rosso Competizione', 280, 4, 5, 'Euro 6d', '7.2 L/100km', '5.7 s', '240 km/h',
 ARRAY['Sedili in pelle e Alcantara', 'Sistema Infotainment 8.8"', 'Harman Kardon Premium Sound', 'Sospensioni sportive', 'Pinze freno Brembo', 'Paddle al volante', 'Cerchi in lega 19"', 'Trazione integrale Q4'],
 'Alfa Romeo Giulia Veloce Q4 con trazione integrale. Design italiano e prestazioni sportive.',
 ARRAY['https://images.unsplash.com/photo-1724139927924-07a04041c320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGZhJTIwcm9tZW8lMjBnaXVsaWElMjByZWR8ZW58MXx8fHwxNzcwNTQ0MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
 false, 'available'),

('Volvo', 'XC60', 'Recharge T8', 2023, 58900, 5000, 'Ibrido Plug-in', 'Automatica', 'SUV', 'Blu Denim', 455, 5, 5, 'Euro 6d-ISC-FCM', '2.1 L/100km', '4.9 s', '180 km/h',
 ARRAY['Pilot Assist II', 'Bowers & Wilkins Premium Sound', 'Sospensioni ad aria', 'Panoramic Sunroof', 'Sedili Nappa con massaggio', 'Head-up Display', '360° Camera', 'Wireless Charging'],
 'Volvo XC60 T8 Recharge, il SUV plug-in hybrid più potente. Sicurezza ai massimi livelli.',
 ARRAY['https://images.unsplash.com/photo-1608050819323-87a1f3f617ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x2byUyMHN1diUyMGJsdWV8ZW58MXx8fHwxNzcwNTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
 true, 'available'),

('Porsche', 'Macan', 'S', 2022, 72900, 12000, 'Benzina', 'Automatica', 'SUV', 'Nero Intenso', 380, 5, 5, 'Euro 6d-ISC-FCM', '9.7 L/100km', '5.1 s', '259 km/h',
 ARRAY['Porsche Communication Management', 'Pacchetto Sport Chrono', 'Sospensioni pneumatiche', 'Sedili sportivi Plus', 'Sistema audio BOSE', 'Tetto panoramico fisso', 'ParkAssist con telecamera', 'Cerchi Turbo 20"'],
 'Porsche Macan S, prestazioni da sportiva in un SUV compatto. Tagliandi certificati Porsche Center.',
 ARRAY['https://images.unsplash.com/photo-1737821164217-dcf0fa20013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3JzY2hlJTIwbWFjYW4lMjBibGFja3xlbnwxfHx8fDE3NzA1NDQzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
 false, 'available'),

('Tesla', 'Model 3', 'Long Range AWD', 2023, 51900, 10000, 'Elettrico', 'Automatica', 'Berlina', 'Bianco Perla', 366, 4, 5, '0 g/km', '0 L/100km', '4.4 s', '233 km/h',
 ARRAY['Autopilot Enhanced', 'Premium Audio', 'Tetto panoramico in vetro', 'Sedili riscaldati', 'Supercharging illimitato', 'Connettività Premium', 'Cerchi Aero 19"', 'Trazione integrale'],
 'Tesla Model 3 Long Range AWD. Autonomia di 614 km. Tecnologia all''avanguardia.',
 ARRAY['https://images.unsplash.com/photo-1610470832703-95d40c3fad55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMG1vZGVsJTIwMyUyMHdoaXRlfGVufDF8fHx8MTc3MDQ0NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'],
 true, 'available');

-- =====================================================
-- FINE MIGRAZIONE
-- =====================================================
