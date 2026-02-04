-- =====================================================
-- OFFICINA MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =====================================================
-- Questo script crea tutte le tabelle necessarie per il sistema
-- di gestione officina. Esegui questo script nell'SQL Editor di Supabase.
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELLA: customers (Clienti)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    province VARCHAR(5),
    country VARCHAR(100) DEFAULT 'Italia',
    fiscal_code VARCHAR(16),
    vat_number VARCHAR(15),
    pec VARCHAR(255),
    sdi_code VARCHAR(7),
    notes TEXT,
    customer_type VARCHAR(20) DEFAULT 'private' CHECK (customer_type IN ('private', 'business')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per ricerche frequenti
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_fiscal_code ON public.customers(fiscal_code);
CREATE INDEX IF NOT EXISTS idx_customers_vat_number ON public.customers(vat_number);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- =====================================================
-- TABELLA: vehicles (Veicoli)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    plate VARCHAR(20) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    vin VARCHAR(17),
    engine_code VARCHAR(50),
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'lpg', 'methane', 'hybrid', 'electric')),
    displacement INTEGER,
    power_kw INTEGER,
    color VARCHAR(50),
    mileage INTEGER,
    registration_date DATE,
    mot_expiry DATE,
    insurance_expiry DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per ricerche frequenti
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON public.vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles(vin);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_plate_unique ON public.vehicles(plate);

-- =====================================================
-- TABELLA: employees (Dipendenti)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'mechanic' CHECK (role IN ('admin', 'manager', 'mechanic', 'receptionist')),
    specializations TEXT[],
    hourly_rate DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);

-- =====================================================
-- TABELLA: work_orders (Ordini di Lavoro)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'waiting_parts', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    entry_date DATE DEFAULT CURRENT_DATE,
    estimated_completion DATE,
    actual_completion DATE,
    entry_mileage INTEGER,
    problem_description TEXT NOT NULL,
    diagnosis TEXT,
    internal_notes TEXT,
    labor_hours DECIMAL(10, 2) DEFAULT 0,
    labor_rate DECIMAL(10, 2) DEFAULT 45.00,
    parts_total DECIMAL(10, 2) DEFAULT 0,
    labor_total DECIMAL(10, 2) DEFAULT 0,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 22.00,
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    assigned_to UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funzione per generare numero ordine automatico
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'OL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('work_order_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequenza per numeri ordine
CREATE SEQUENCE IF NOT EXISTS work_order_seq START 1;

-- Trigger per numero ordine automatico
DROP TRIGGER IF EXISTS set_order_number ON public.work_orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Indici
CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle_id ON public.work_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_entry_date ON public.work_orders(entry_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned_to ON public.work_orders(assigned_to);

-- =====================================================
-- TABELLA: work_order_items (Righe Ordini di Lavoro)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.work_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('part', 'labor', 'service')),
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) DEFAULT 0,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) DEFAULT 0,
    inventory_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger per calcolare total_price automaticamente
CREATE OR REPLACE FUNCTION calculate_item_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price := NEW.quantity * NEW.unit_price * (1 - NEW.discount_percent / 100);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calc_item_total ON public.work_order_items;
CREATE TRIGGER calc_item_total
    BEFORE INSERT OR UPDATE ON public.work_order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_item_total();

CREATE INDEX IF NOT EXISTS idx_work_order_items_work_order_id ON public.work_order_items(work_order_id);

-- =====================================================
-- TABELLA: invoices (Fatture)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE,
    work_order_id UUID REFERENCES public.work_orders(id),
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    payment_date DATE,
    payment_method VARCHAR(50),
    subtotal DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 22.00,
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    sdi_status VARCHAR(50),
    sdi_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funzione per generare numero fattura automatico
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := 'FT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequenza per numeri fattura
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- Trigger per numero fattura automatico
DROP TRIGGER IF EXISTS set_invoice_number ON public.invoices;
CREATE TRIGGER set_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_work_order_id ON public.invoices(work_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON public.invoices(issue_date);

-- =====================================================
-- TABELLA: appointments (Appuntamenti)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'arrived', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON public.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_vehicle_id ON public.appointments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- =====================================================
-- TABELLA: inventory (Magazzino/Inventario)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    supplier VARCHAR(255),
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 5,
    unit VARCHAR(20) DEFAULT 'pz',
    purchase_price DECIMAL(10, 2) DEFAULT 0,
    selling_price DECIMAL(10, 2) DEFAULT 0,
    location VARCHAR(100),
    barcode VARCHAR(50),
    oem_codes TEXT[],
    compatible_vehicles TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funzione per generare SKU automatico
CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sku IS NULL THEN
        NEW.sku := 'SKU-' || LPAD(NEXTVAL('sku_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequenza per SKU
CREATE SEQUENCE IF NOT EXISTS sku_seq START 1;

-- Trigger per SKU automatico
DROP TRIGGER IF EXISTS set_sku ON public.inventory;
CREATE TRIGGER set_sku
    BEFORE INSERT ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION generate_sku();

CREATE INDEX IF NOT EXISTS idx_inventory_category ON public.inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON public.inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON public.inventory(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON public.inventory(quantity) WHERE quantity < min_quantity;

-- =====================================================
-- TABELLA: service_history (Storico Interventi)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.service_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id),
    service_date DATE DEFAULT CURRENT_DATE,
    mileage INTEGER,
    service_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    next_service_mileage INTEGER,
    next_service_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_history_vehicle_id ON public.service_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_history_service_date ON public.service_history(service_date);

-- =====================================================
-- FUNZIONI TRIGGER PER updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per updated_at su tutte le tabelle
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_orders_updated_at ON public.work_orders;
CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON public.employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Abilita RLS su tutte le tabelle
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;

-- Policy permissive per utenti autenticati (da personalizzare in base alle esigenze)
-- NOTA: Queste policy permettono accesso completo agli utenti autenticati.
-- In produzione, potresti voler restringere l'accesso in base ai ruoli.

CREATE POLICY "Allow authenticated read access" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.customers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.vehicles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.employees FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.work_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.work_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.work_orders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.work_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.work_order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.work_order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.work_order_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.invoices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.invoices FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.appointments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.inventory FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.service_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.service_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON public.service_history FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON public.service_history FOR DELETE TO authenticated USING (true);

-- Policy per accesso anonimo in lettura (opzionale - rimuovi se non necessario)
-- CREATE POLICY "Allow anon read access" ON public.customers FOR SELECT TO anon USING (true);

-- =====================================================
-- VISTE UTILI
-- =====================================================

-- Vista per ordini di lavoro attivi con dettagli
CREATE OR REPLACE VIEW public.active_work_orders_view AS
SELECT 
    wo.*,
    v.plate,
    v.brand,
    v.model,
    c.name AS customer_name,
    c.phone AS customer_phone,
    e.first_name || ' ' || e.last_name AS assigned_employee
FROM public.work_orders wo
JOIN public.vehicles v ON wo.vehicle_id = v.id
JOIN public.customers c ON v.customer_id = c.id
LEFT JOIN public.employees e ON wo.assigned_to = e.id
WHERE wo.status NOT IN ('completed', 'cancelled');

-- Vista per fatture non pagate
CREATE OR REPLACE VIEW public.unpaid_invoices_view AS
SELECT 
    i.*,
    c.name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    CURRENT_DATE - i.due_date AS days_overdue
FROM public.invoices i
JOIN public.customers c ON i.customer_id = c.id
WHERE i.status IN ('sent', 'overdue')
ORDER BY i.due_date;

-- Vista per articoli con scorta bassa
CREATE OR REPLACE VIEW public.low_stock_items_view AS
SELECT *
FROM public.inventory
WHERE quantity <= min_quantity
ORDER BY quantity;

-- Vista per appuntamenti oggi
CREATE OR REPLACE VIEW public.today_appointments_view AS
SELECT 
    a.*,
    c.name AS customer_name,
    c.phone AS customer_phone,
    v.plate,
    v.brand,
    v.model
FROM public.appointments a
JOIN public.customers c ON a.customer_id = c.id
LEFT JOIN public.vehicles v ON a.vehicle_id = v.id
WHERE DATE(a.scheduled_at) = CURRENT_DATE
ORDER BY a.scheduled_at;

-- =====================================================
-- DATI DI ESEMPIO (opzionale - rimuovi in produzione)
-- =====================================================

-- Decommentare per inserire dati di esempio
/*
INSERT INTO public.customers (name, email, phone, address, city, postal_code, province, fiscal_code, customer_type) VALUES
('Mario Rossi', 'mario.rossi@email.com', '+39 333 1234567', 'Via Roma 123', 'Milano', '20100', 'MI', 'RSSMRA80A01F205X', 'private'),
('Auto Service SRL', 'info@autoservice.it', '+39 02 1234567', 'Via Industria 45', 'Monza', '20900', 'MB', NULL, 'business'),
('Giulia Bianchi', 'giulia.bianchi@email.com', '+39 347 9876543', 'Corso Italia 78', 'Milano', '20122', 'MI', 'BNCGLI85B42F205Y', 'private');

INSERT INTO public.vehicles (customer_id, plate, brand, model, year, fuel_type, mileage) VALUES
((SELECT id FROM public.customers WHERE name = 'Mario Rossi'), 'AB123CD', 'Fiat', '500', 2019, 'gasoline', 45000),
((SELECT id FROM public.customers WHERE name = 'Mario Rossi'), 'EF456GH', 'Volkswagen', 'Golf', 2020, 'diesel', 32000),
((SELECT id FROM public.customers WHERE name = 'Giulia Bianchi'), 'IJ789KL', 'Toyota', 'Yaris', 2021, 'hybrid', 28000);

INSERT INTO public.inventory (name, category, brand, quantity, min_quantity, purchase_price, selling_price) VALUES
('Olio Motore 5W30 1L', 'Lubrificanti', 'Castrol', 50, 10, 8.50, 15.00),
('Filtro Olio Universale', 'Filtri', 'Bosch', 25, 5, 5.00, 12.00),
('Pastiglie Freno Anteriori', 'Freni', 'Brembo', 12, 4, 25.00, 55.00),
('Candele NGK', 'Accensione', 'NGK', 40, 8, 4.00, 10.00);
*/

-- =====================================================
-- FINE SCRIPT
-- =====================================================
