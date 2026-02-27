import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dyyaauathsftoashzhtm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eWFhdWF0aHNmdG9hc2h6aHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDA4NDYsImV4cCI6MjA4NTgxNjg0Nn0.-bpNIrjX87kTWm0SWd3kQ2MXkfoMNQgzYIsbC98Bk2U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface CarForSale {
    id: string
    brand: string
    model: string
    trim: string | null
    year: number
    price: number
    mileage: number
    fuel: string
    transmission: string
    body_type: string | null
    color: string | null
    interior_color: string | null
    power_cv: number | null
    displacement: number | null
    doors: number | null
    seats: number | null
    plate: string | null
    vin: string | null
    emissions_class: string | null
    fuel_consumption: string | null
    acceleration: string | null
    top_speed: string | null
    equipment: string[]
    description: string | null
    image_urls: string[]
    status: 'available' | 'reserved' | 'sold'
    featured: boolean
    created_at: string
    updated_at: string
}
