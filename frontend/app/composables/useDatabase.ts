import type { Database } from '~/types/database.types'

// Composable per le operazioni sui clienti
export const useCustomers = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchCustomers = async () => {
        loading.value = true
        error.value = null
        try {
            const { data, error: err } = await client
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false })

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getCustomer = async (id: string) => {
        const { data, error: err } = await client
            .from('customers')
            .select('*, vehicles(*)')
            .eq('id', id)
            .single()

        if (err) throw err
        return data
    }

    const createCustomer = async (customer: any) => {
        const { data, error: err } = await client
            .from('customers')
            .insert(customer)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateCustomer = async (id: string, customer: any) => {
        const { data, error: err } = await client
            .from('customers')
            .update(customer)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteCustomer = async (id: string) => {
        const { error: err } = await client
            .from('customers')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    const searchCustomers = async (query: string) => {
        const { data, error: err } = await client
            .from('customers')
            .select('*')
            .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,fiscal_code.ilike.%${query}%`)
            .limit(20)

        if (err) throw err
        return data
    }

    return {
        loading,
        error,
        fetchCustomers,
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        searchCustomers
    }
}

// Composable per le operazioni sui veicoli
export const useVehicles = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchVehicles = async () => {
        loading.value = true
        error.value = null
        try {
            const { data, error: err } = await client
                .from('vehicles')
                .select('*, customers(id, name)')
                .order('created_at', { ascending: false })

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getVehicle = async (id: string) => {
        const { data, error: err } = await client
            .from('vehicles')
            .select('*, customers(*), work_orders(*)')
            .eq('id', id)
            .single()

        if (err) throw err
        return data
    }

    const createVehicle = async (vehicle: any) => {
        const { data, error: err } = await client
            .from('vehicles')
            .insert(vehicle)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateVehicle = async (id: string, vehicle: any) => {
        const { data, error: err } = await client
            .from('vehicles')
            .update(vehicle)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteVehicle = async (id: string) => {
        const { error: err } = await client
            .from('vehicles')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    const getVehiclesByCustomer = async (customerId: string) => {
        const { data, error: err } = await client
            .from('vehicles')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false })

        if (err) throw err
        return data
    }

    const searchVehicles = async (query: string) => {
        const { data, error: err } = await client
            .from('vehicles')
            .select('*, customers(id, name)')
            .or(`plate.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,vin.ilike.%${query}%`)
            .limit(20)

        if (err) throw err
        return data
    }

    return {
        loading,
        error,
        fetchVehicles,
        getVehicle,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        getVehiclesByCustomer,
        searchVehicles
    }
}

// Composable per le operazioni sugli ordini di lavoro
export const useWorkOrders = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchWorkOrders = async (filters?: {
        status?: string
        from_date?: string
        to_date?: string
    }) => {
        loading.value = true
        error.value = null
        try {
            let query = client
                .from('work_orders')
                .select(`
          *,
          vehicles(id, plate, brand, model, customers(id, name)),
          work_order_items(*)
        `)
                .order('created_at', { ascending: false })

            if (filters?.status) {
                query = query.eq('status', filters.status)
            }
            if (filters?.from_date) {
                query = query.gte('created_at', filters.from_date)
            }
            if (filters?.to_date) {
                query = query.lte('created_at', filters.to_date)
            }

            const { data, error: err } = await query

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getWorkOrder = async (id: string) => {
        const { data, error: err } = await client
            .from('work_orders')
            .select(`
        *,
        vehicles(*, customers(*)),
        work_order_items(*),
        invoices(*)
      `)
            .eq('id', id)
            .single()

        if (err) throw err
        return data
    }

    const createWorkOrder = async (workOrder: any) => {
        const { data, error: err } = await client
            .from('work_orders')
            .insert(workOrder)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateWorkOrder = async (id: string, workOrder: any) => {
        const { data, error: err } = await client
            .from('work_orders')
            .update(workOrder)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteWorkOrder = async (id: string) => {
        const { error: err } = await client
            .from('work_orders')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    const updateWorkOrderStatus = async (id: string, status: string) => {
        const { data, error: err } = await client
            .from('work_orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    return {
        loading,
        error,
        fetchWorkOrders,
        getWorkOrder,
        createWorkOrder,
        updateWorkOrder,
        deleteWorkOrder,
        updateWorkOrderStatus
    }
}

// Composable per le righe degli ordini di lavoro
export const useWorkOrderItems = () => {
    const client = useSupabaseClient()

    const addItem = async (item: any) => {
        const { data, error: err } = await client
            .from('work_order_items')
            .insert(item)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateItem = async (id: string, item: any) => {
        const { data, error: err } = await client
            .from('work_order_items')
            .update(item)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteItem = async (id: string) => {
        const { error: err } = await client
            .from('work_order_items')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    return {
        addItem,
        updateItem,
        deleteItem
    }
}

// Composable per le fatture
export const useInvoices = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchInvoices = async (filters?: {
        status?: string
        from_date?: string
        to_date?: string
    }) => {
        loading.value = true
        error.value = null
        try {
            let query = client
                .from('invoices')
                .select(`
          *,
          customers(id, name),
          work_orders(id, order_number)
        `)
                .order('created_at', { ascending: false })

            if (filters?.status) {
                query = query.eq('status', filters.status)
            }
            if (filters?.from_date) {
                query = query.gte('issue_date', filters.from_date)
            }
            if (filters?.to_date) {
                query = query.lte('issue_date', filters.to_date)
            }

            const { data, error: err } = await query

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getInvoice = async (id: string) => {
        const { data, error: err } = await client
            .from('invoices')
            .select(`
        *,
        customers(*),
        work_orders(*, vehicles(*), work_order_items(*))
      `)
            .eq('id', id)
            .single()

        if (err) throw err
        return data
    }

    const createInvoice = async (invoice: any) => {
        const { data, error: err } = await client
            .from('invoices')
            .insert(invoice)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateInvoice = async (id: string, invoice: any) => {
        const { data, error: err } = await client
            .from('invoices')
            .update(invoice)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const markAsPaid = async (id: string, paymentDate: string, paymentMethod: string) => {
        const { data, error: err } = await client
            .from('invoices')
            .update({
                status: 'paid',
                payment_date: paymentDate,
                payment_method: paymentMethod,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    return {
        loading,
        error,
        fetchInvoices,
        getInvoice,
        createInvoice,
        updateInvoice,
        markAsPaid
    }
}

// Composable per gli appuntamenti
export const useAppointments = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchAppointments = async (from_date?: string, to_date?: string) => {
        loading.value = true
        error.value = null
        try {
            let query = client
                .from('appointments')
                .select(`
          *,
          customers(id, name, phone),
          vehicles(id, plate, brand, model)
        `)
                .order('scheduled_at', { ascending: true })

            if (from_date) {
                query = query.gte('scheduled_at', from_date)
            }
            if (to_date) {
                query = query.lte('scheduled_at', to_date)
            }

            const { data, error: err } = await query

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const createAppointment = async (appointment: any) => {
        const { data, error: err } = await client
            .from('appointments')
            .insert(appointment)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateAppointment = async (id: string, appointment: any) => {
        const { data, error: err } = await client
            .from('appointments')
            .update(appointment)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteAppointment = async (id: string) => {
        const { error: err } = await client
            .from('appointments')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    return {
        loading,
        error,
        fetchAppointments,
        createAppointment,
        updateAppointment,
        deleteAppointment
    }
}

// Composable per l'inventario/magazzino
export const useInventory = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchInventory = async () => {
        loading.value = true
        error.value = null
        try {
            const { data, error: err } = await client
                .from('inventory')
                .select('*')
                .order('name', { ascending: true })

            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getLowStockItems = async () => {
        const { data, error: err } = await client
            .from('inventory')
            .select('*')

        if (err) throw err
        // Filter in JS because .lt() compares with values, not columns
        return data?.filter(item => item.quantity < item.min_quantity) || []
    }

    const updateStock = async (id: string, quantity: number) => {
        const { data, error: err } = await client
            .from('inventory')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const createItem = async (item: any) => {
        const { data, error: err } = await client
            .from('inventory')
            .insert(item)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateItem = async (id: string, item: any) => {
        const { data, error: err } = await client
            .from('inventory')
            .update(item)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteItem = async (id: string) => {
        const { error: err } = await client
            .from('inventory')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    return {
        loading,
        error,
        fetchInventory,
        getLowStockItems,
        updateStock,
        createItem,
        updateItem,
        deleteItem
    }
}

// Composable per la dashboard e statistiche
export const useDashboard = () => {
    const client = useSupabaseClient()
    const loading = ref(false)

    // Mock data for when Supabase is not configured
    const mockStats = {
        activeOrders: 12,
        todayAppointments: 4,
        monthlyRevenue: 15420,
        totalCustomers: 85,
        totalVehicles: 112,
        completedOrders: 45
    }

    const mockOrders = [
        { id: '1', order_number: 'WO-2024-001', status: 'in_progress', vehicles: { plate: 'AB123CD', brand: 'Fiat', model: 'Panda', customers: { name: 'Mario Rossi' } } },
        { id: '2', order_number: 'WO-2024-002', status: 'pending', vehicles: { plate: 'EF456GH', brand: 'Audi', model: 'A3', customers: { name: 'Luigi Verdi' } } }
    ]

    const getDashboardStats = async () => {
        loading.value = true
        try {
            const today = new Date().toISOString().split('T')[0]
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

            // Check if client is initialized
            if (!client || (client as any).error) {
                console.warn('Supabase not configured, using mock data')
                return mockStats
            }

            // Ordini attivi
            const { count: activeOrders } = await client
                .from('work_orders')
                .select('*', { count: 'exact', head: true })
                .in('status', ['pending', 'in_progress', 'waiting_parts'])

            // Appuntamenti oggi
            const { count: todayAppointments } = await client
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .gte('scheduled_at', today)
                .lt('scheduled_at', new Date(new Date(today).getTime() + 86400000).toISOString())

            // Fatturato del mese
            const { data: monthlyRevenue } = await client
                .from('invoices')
                .select('total_amount')
                .eq('status', 'paid')
                .gte('payment_date', startOfMonth)

            const revenue = monthlyRevenue?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

            // Clienti totali
            const { count: totalCustomers } = await client
                .from('customers')
                .select('*', { count: 'exact', head: true })

            // Veicoli totali
            const { count: totalVehicles } = await client
                .from('vehicles')
                .select('*', { count: 'exact', head: true })

            // Ordini completati questo mese
            const { count: completedOrders } = await client
                .from('work_orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'completed')
                .gte('updated_at', startOfMonth)

            return {
                activeOrders: activeOrders || 0,
                todayAppointments: todayAppointments || 0,
                monthlyRevenue: revenue,
                totalCustomers: totalCustomers || 0,
                totalVehicles: totalVehicles || 0,
                completedOrders: completedOrders || 0
            }
        } catch (e) {
            console.error('Database error, falling back to mock data:', e)
            return mockStats
        } finally {
            loading.value = false
        }
    }

    const getRecentWorkOrders = async (limit = 5) => {
        try {
            if (!client || (client as any).error) return mockOrders
            const { data, error } = await client
                .from('work_orders')
                .select(`
            *,
            vehicles(plate, brand, model, customers(name))
          `)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data
        } catch (e) {
            return mockOrders
        }
    }

    const getUpcomingAppointments = async (limit = 5) => {
        try {
            if (!client || (client as any).error) return []
            const { data, error } = await client
                .from('appointments')
                .select(`
            *,
            customers(name, phone),
            vehicles(plate, brand, model)
          `)
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true })
                .limit(limit)

            if (error) throw error
            return data
        } catch (e) {
            return []
        }
    }

    return {
        loading,
        getDashboardStats,
        getRecentWorkOrders,
        getUpcomingAppointments
    }
}

// Composable per le operazioni sulle auto in vendita
export const useCarsForSale = () => {
    const client = useSupabaseClient()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchCars = async (filters?: { status?: string; search?: string }) => {
        loading.value = true
        error.value = null
        try {
            let query = client
                .from('cars_for_sale')
                .select('*')
                .order('created_at', { ascending: false })

            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }

            if (filters?.search) {
                query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,trim.ilike.%${filters.search}%`)
            }

            const { data, error: err } = await query
            if (err) throw err
            return data
        } catch (e: any) {
            error.value = e.message
            return []
        } finally {
            loading.value = false
        }
    }

    const getCar = async (id: string) => {
        const { data, error: err } = await client
            .from('cars_for_sale')
            .select('*')
            .eq('id', id)
            .single()

        if (err) throw err
        return data
    }

    const createCar = async (carData: any) => {
        const { data, error: err } = await client
            .from('cars_for_sale')
            .insert(carData)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateCar = async (id: string, carData: any) => {
        const { data, error: err } = await client
            .from('cars_for_sale')
            .update(carData)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteCar = async (id: string) => {
        const { error: err } = await client
            .from('cars_for_sale')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    const updateCarStatus = async (id: string, status: string) => {
        return updateCar(id, { status })
    }

    const uploadCarImage = async (carId: string, file: File) => {
        const fileExt = file.name.split('.').pop()
        const uniqueName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${carId}/${uniqueName}`

        const { data, error: err } = await client.storage
            .from('car-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (err) throw err

        const { data: urlData } = client.storage
            .from('car-images')
            .getPublicUrl(data.path)

        return urlData.publicUrl
    }

    const deleteCarImage = async (imageUrl: string) => {
        // Extract path from the public URL
        const match = imageUrl.match(/car-images\/(.+)$/)
        if (!match) return

        const filePath = match[1]
        const { error: err } = await client.storage
            .from('car-images')
            .remove([filePath])

        if (err) throw err
    }

    return {
        loading,
        error,
        fetchCars,
        getCar,
        createCar,
        updateCar,
        deleteCar,
        updateCarStatus,
        uploadCarImage,
        deleteCarImage
    }
}
