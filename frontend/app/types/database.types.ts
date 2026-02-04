export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string
                    name: string
                    email: string | null
                    phone: string | null
                    address: string | null
                    city: string | null
                    postal_code: string | null
                    province: string | null
                    country: string
                    fiscal_code: string | null
                    vat_number: string | null
                    pec: string | null
                    sdi_code: string | null
                    notes: string | null
                    customer_type: 'private' | 'business'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email?: string | null
                    phone?: string | null
                    address?: string | null
                    city?: string | null
                    postal_code?: string | null
                    province?: string | null
                    country?: string
                    fiscal_code?: string | null
                    vat_number?: string | null
                    pec?: string | null
                    sdi_code?: string | null
                    notes?: string | null
                    customer_type?: 'private' | 'business'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string | null
                    phone?: string | null
                    address?: string | null
                    city?: string | null
                    postal_code?: string | null
                    province?: string | null
                    country?: string
                    fiscal_code?: string | null
                    vat_number?: string | null
                    pec?: string | null
                    sdi_code?: string | null
                    notes?: string | null
                    customer_type?: 'private' | 'business'
                    created_at?: string
                    updated_at?: string
                }
            }
            vehicles: {
                Row: {
                    id: string
                    customer_id: string
                    plate: string
                    brand: string
                    model: string
                    year: number | null
                    vin: string | null
                    engine_code: string | null
                    fuel_type: 'gasoline' | 'diesel' | 'lpg' | 'methane' | 'hybrid' | 'electric' | null
                    displacement: number | null
                    power_kw: number | null
                    color: string | null
                    mileage: number | null
                    registration_date: string | null
                    mot_expiry: string | null
                    insurance_expiry: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    plate: string
                    brand: string
                    model: string
                    year?: number | null
                    vin?: string | null
                    engine_code?: string | null
                    fuel_type?: 'gasoline' | 'diesel' | 'lpg' | 'methane' | 'hybrid' | 'electric' | null
                    displacement?: number | null
                    power_kw?: number | null
                    color?: string | null
                    mileage?: number | null
                    registration_date?: string | null
                    mot_expiry?: string | null
                    insurance_expiry?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    plate?: string
                    brand?: string
                    model?: string
                    year?: number | null
                    vin?: string | null
                    engine_code?: string | null
                    fuel_type?: 'gasoline' | 'diesel' | 'lpg' | 'methane' | 'hybrid' | 'electric' | null
                    displacement?: number | null
                    power_kw?: number | null
                    color?: string | null
                    mileage?: number | null
                    registration_date?: string | null
                    mot_expiry?: string | null
                    insurance_expiry?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            work_orders: {
                Row: {
                    id: string
                    order_number: string
                    vehicle_id: string
                    status: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
                    priority: 'low' | 'normal' | 'high' | 'urgent'
                    entry_date: string
                    estimated_completion: string | null
                    actual_completion: string | null
                    entry_mileage: number | null
                    problem_description: string
                    diagnosis: string | null
                    internal_notes: string | null
                    labor_hours: number | null
                    labor_rate: number | null
                    parts_total: number
                    labor_total: number
                    discount_percent: number
                    discount_amount: number
                    subtotal: number
                    vat_rate: number
                    vat_amount: number
                    total_amount: number
                    assigned_to: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number?: string
                    vehicle_id: string
                    status?: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
                    priority?: 'low' | 'normal' | 'high' | 'urgent'
                    entry_date?: string
                    estimated_completion?: string | null
                    actual_completion?: string | null
                    entry_mileage?: number | null
                    problem_description: string
                    diagnosis?: string | null
                    internal_notes?: string | null
                    labor_hours?: number | null
                    labor_rate?: number | null
                    parts_total?: number
                    labor_total?: number
                    discount_percent?: number
                    discount_amount?: number
                    subtotal?: number
                    vat_rate?: number
                    vat_amount?: number
                    total_amount?: number
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    vehicle_id?: string
                    status?: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
                    priority?: 'low' | 'normal' | 'high' | 'urgent'
                    entry_date?: string
                    estimated_completion?: string | null
                    actual_completion?: string | null
                    entry_mileage?: number | null
                    problem_description?: string
                    diagnosis?: string | null
                    internal_notes?: string | null
                    labor_hours?: number | null
                    labor_rate?: number | null
                    parts_total?: number
                    labor_total?: number
                    discount_percent?: number
                    discount_amount?: number
                    subtotal?: number
                    vat_rate?: number
                    vat_amount?: number
                    total_amount?: number
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            work_order_items: {
                Row: {
                    id: string
                    work_order_id: string
                    item_type: 'part' | 'labor' | 'service'
                    description: string
                    quantity: number
                    unit_price: number
                    discount_percent: number
                    total_price: number
                    inventory_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    work_order_id: string
                    item_type: 'part' | 'labor' | 'service'
                    description: string
                    quantity?: number
                    unit_price?: number
                    discount_percent?: number
                    total_price?: number
                    inventory_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    work_order_id?: string
                    item_type?: 'part' | 'labor' | 'service'
                    description?: string
                    quantity?: number
                    unit_price?: number
                    discount_percent?: number
                    total_price?: number
                    inventory_id?: string | null
                    created_at?: string
                }
            }
            invoices: {
                Row: {
                    id: string
                    invoice_number: string
                    work_order_id: string | null
                    customer_id: string
                    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
                    issue_date: string
                    due_date: string
                    payment_date: string | null
                    payment_method: string | null
                    subtotal: number
                    discount_amount: number
                    vat_rate: number
                    vat_amount: number
                    total_amount: number
                    notes: string | null
                    sdi_status: string | null
                    sdi_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    invoice_number?: string
                    work_order_id?: string | null
                    customer_id: string
                    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
                    issue_date?: string
                    due_date?: string
                    payment_date?: string | null
                    payment_method?: string | null
                    subtotal?: number
                    discount_amount?: number
                    vat_rate?: number
                    vat_amount?: number
                    total_amount?: number
                    notes?: string | null
                    sdi_status?: string | null
                    sdi_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    invoice_number?: string
                    work_order_id?: string | null
                    customer_id?: string
                    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
                    issue_date?: string
                    due_date?: string
                    payment_date?: string | null
                    payment_method?: string | null
                    subtotal?: number
                    discount_amount?: number
                    vat_rate?: number
                    vat_amount?: number
                    total_amount?: number
                    notes?: string | null
                    sdi_status?: string | null
                    sdi_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    customer_id: string
                    vehicle_id: string | null
                    scheduled_at: string
                    duration_minutes: number
                    service_type: string
                    status: 'scheduled' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show'
                    notes: string | null
                    reminder_sent: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    vehicle_id?: string | null
                    scheduled_at: string
                    duration_minutes?: number
                    service_type: string
                    status?: 'scheduled' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show'
                    notes?: string | null
                    reminder_sent?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    vehicle_id?: string | null
                    scheduled_at?: string
                    duration_minutes?: number
                    service_type?: string
                    status?: 'scheduled' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show'
                    notes?: string | null
                    reminder_sent?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            inventory: {
                Row: {
                    id: string
                    sku: string
                    name: string
                    description: string | null
                    category: string
                    brand: string | null
                    supplier: string | null
                    quantity: number
                    min_quantity: number
                    unit: string
                    purchase_price: number
                    selling_price: number
                    location: string | null
                    barcode: string | null
                    oem_codes: string[] | null
                    compatible_vehicles: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sku?: string
                    name: string
                    description?: string | null
                    category: string
                    brand?: string | null
                    supplier?: string | null
                    quantity?: number
                    min_quantity?: number
                    unit?: string
                    purchase_price?: number
                    selling_price?: number
                    location?: string | null
                    barcode?: string | null
                    oem_codes?: string[] | null
                    compatible_vehicles?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sku?: string
                    name?: string
                    description?: string | null
                    category?: string
                    brand?: string | null
                    supplier?: string | null
                    quantity?: number
                    min_quantity?: number
                    unit?: string
                    purchase_price?: number
                    selling_price?: number
                    location?: string | null
                    barcode?: string | null
                    oem_codes?: string[] | null
                    compatible_vehicles?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            employees: {
                Row: {
                    id: string
                    user_id: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    role: 'admin' | 'manager' | 'mechanic' | 'receptionist'
                    specializations: string[] | null
                    hourly_rate: number | null
                    hire_date: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    role?: 'admin' | 'manager' | 'mechanic' | 'receptionist'
                    specializations?: string[] | null
                    hourly_rate?: number | null
                    hire_date?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    role?: 'admin' | 'manager' | 'mechanic' | 'receptionist'
                    specializations?: string[] | null
                    hourly_rate?: number | null
                    hire_date?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            service_history: {
                Row: {
                    id: string
                    vehicle_id: string
                    work_order_id: string
                    service_date: string
                    mileage: number | null
                    service_type: string
                    description: string
                    next_service_mileage: number | null
                    next_service_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    vehicle_id: string
                    work_order_id: string
                    service_date?: string
                    mileage?: number | null
                    service_type: string
                    description: string
                    next_service_mileage?: number | null
                    next_service_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    vehicle_id?: string
                    work_order_id?: string
                    service_date?: string
                    mileage?: number | null
                    service_type?: string
                    description?: string
                    next_service_mileage?: number | null
                    next_service_date?: string | null
                    created_at?: string
                }
            }
        }
    }
}

// Extended types with relations
export interface CustomerWithVehicles extends Database['public']['Tables']['customers']['Row'] {
    vehicles: Database['public']['Tables']['vehicles']['Row'][]
}

export interface VehicleWithCustomer extends Database['public']['Tables']['vehicles']['Row'] {
    customers: Database['public']['Tables']['customers']['Row']
}

export interface WorkOrderWithRelations extends Database['public']['Tables']['work_orders']['Row'] {
    vehicles: VehicleWithCustomer
    work_order_items: Database['public']['Tables']['work_order_items']['Row'][]
    invoices?: Database['public']['Tables']['invoices']['Row'][]
}

export interface InvoiceWithRelations extends Database['public']['Tables']['invoices']['Row'] {
    customers: Database['public']['Tables']['customers']['Row']
    work_orders?: WorkOrderWithRelations
}

export interface AppointmentWithRelations extends Database['public']['Tables']['appointments']['Row'] {
    customers: Database['public']['Tables']['customers']['Row']
    vehicles?: Database['public']['Tables']['vehicles']['Row']
}

// Helper types
export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert']
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update']

export type WorkOrder = Database['public']['Tables']['work_orders']['Row']
export type WorkOrderInsert = Database['public']['Tables']['work_orders']['Insert']
export type WorkOrderUpdate = Database['public']['Tables']['work_orders']['Update']

export type WorkOrderItem = Database['public']['Tables']['work_order_items']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type InventoryItem = Database['public']['Tables']['inventory']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type ServiceHistory = Database['public']['Tables']['service_history']['Row']

// Status types
export type WorkOrderStatus = 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type FuelType = 'gasoline' | 'diesel' | 'lpg' | 'methane' | 'hybrid' | 'electric'
export type CustomerType = 'private' | 'business'
export type ItemType = 'part' | 'labor' | 'service'
export type EmployeeRole = 'admin' | 'manager' | 'mechanic' | 'receptionist'
