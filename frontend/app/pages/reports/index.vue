<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Report & Analytics</h1>
        <p class="page-subtitle">Analisi delle performance dell'officina</p>
      </div>
      <div class="d-flex ga-3">
        <v-select
          v-model="selectedPeriod"
          :items="periods"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 180px"
          @update:model-value="loadAllData"
        />
        <v-btn variant="outlined" prepend-icon="mdi-download">
          Esporta Report
        </v-btn>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="card, card, card, card" />
    </div>

    <template v-else>
      <!-- Summary Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey text-uppercase">Fatturato</div>
                <div class="text-h4 font-weight-bold mt-1">{{ formatCurrency(stats.revenue) }}</div>
                <div class="d-flex align-center mt-2">
                  <v-icon :color="stats.revenueChange >= 0 ? 'success' : 'error'" size="small">
                    {{ stats.revenueChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span :class="stats.revenueChange >= 0 ? 'text-success' : 'text-error'" class="ml-1">
                    {{ Math.abs(stats.revenueChange).toFixed(1) }}%
                  </span>
                  <span class="text-grey ml-1">vs periodo prec.</span>
                </div>
              </div>
              <v-avatar color="primary" variant="tonal" size="56">
                <v-icon size="28">mdi-currency-eur</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey text-uppercase">Ordini Completati</div>
                <div class="text-h4 font-weight-bold mt-1">{{ stats.completedOrders }}</div>
                <div class="d-flex align-center mt-2">
                  <v-icon :color="stats.ordersChange >= 0 ? 'success' : 'error'" size="small">
                    {{ stats.ordersChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span :class="stats.ordersChange >= 0 ? 'text-success' : 'text-error'" class="ml-1">
                    {{ Math.abs(stats.ordersChange).toFixed(1) }}%
                  </span>
                  <span class="text-grey ml-1">vs periodo prec.</span>
                </div>
              </div>
              <v-avatar color="success" variant="tonal" size="56">
                <v-icon size="28">mdi-clipboard-check</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey text-uppercase">Nuovi Clienti</div>
                <div class="text-h4 font-weight-bold mt-1">{{ stats.newCustomers }}</div>
                <div class="d-flex align-center mt-2">
                  <v-icon :color="stats.customersChange >= 0 ? 'success' : 'error'" size="small">
                    {{ stats.customersChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span :class="stats.customersChange >= 0 ? 'text-success' : 'text-error'" class="ml-1">
                    {{ Math.abs(stats.customersChange).toFixed(1) }}%
                  </span>
                  <span class="text-grey ml-1">vs periodo prec.</span>
                </div>
              </div>
              <v-avatar color="info" variant="tonal" size="56">
                <v-icon size="28">mdi-account-plus</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey text-uppercase">Tempo Medio Lavoro</div>
                <div class="text-h4 font-weight-bold mt-1">{{ stats.avgWorkTime }}h</div>
                <div class="d-flex align-center mt-2">
                  <span class="text-grey">Target: 4h</span>
                </div>
              </div>
              <v-avatar color="warning" variant="tonal" size="56">
                <v-icon size="28">mdi-clock-outline</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Revenue Chart -->
        <v-col cols="12" lg="8">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
              Andamento Fatturato
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="chart-container">
                <canvas ref="revenueChartRef"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Services Breakdown -->
        <v-col cols="12" lg="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
              Tipologia Lavori
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="chart-container-small">
                <canvas ref="servicesChartRef"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <!-- Work Orders by Status -->
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
              Ordini per Stato
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="chart-container-small">
                <canvas ref="statusChartRef"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Top Customers -->
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-account-star</v-icon>
              Top Clienti
            </v-card-title>
            <v-divider />
            <v-list v-if="topCustomers.length">
              <v-list-item
                v-for="(customer, i) in topCustomers"
                :key="customer.id"
                :to="`/customers/${customer.id}`"
              >
                <template #prepend>
                  <v-avatar :color="getAvatarColor(i)" size="40" class="mr-3">
                    <span class="text-white font-weight-bold">{{ i + 1 }}</span>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ customer.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ customer.orders }} ordini
                </v-list-item-subtitle>

                <template #append>
                  <span class="font-weight-bold text-primary">{{ formatCurrency(customer.revenue) }}</span>
                </template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center text-grey py-8">
              <v-icon size="48" class="mb-2">mdi-account-off</v-icon>
              <div>Nessun dato disponibile</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <!-- Recent Activity -->
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-history</v-icon>
              Attività Recente
            </v-card-title>
            <v-divider />
            <v-timeline v-if="recentActivity.length" side="end" density="compact">
              <v-timeline-item
                v-for="activity in recentActivity"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div class="d-flex justify-space-between align-center flex-wrap">
                  <div>
                    <div class="font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey">{{ activity.description }}</div>
                  </div>
                  <div class="text-caption text-grey">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
            <v-card-text v-else class="text-center text-grey py-8">
              <v-icon size="48" class="mb-2">mdi-clock-outline</v-icon>
              <div>Nessuna attività recente</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Inventory Alerts -->
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-alert-circle</v-icon>
              Avvisi Magazzino
            </v-card-title>
            <v-divider />
            <v-list v-if="lowStockItems.length">
              <v-list-item
                v-for="item in lowStockItems"
                :key="item.id"
              >
                <template #prepend>
                  <v-icon :color="item.quantity === 0 ? 'error' : 'warning'">
                    {{ item.quantity === 0 ? 'mdi-alert-circle' : 'mdi-alert' }}
                  </v-icon>
                </template>

                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.quantity === 0 ? 'Esaurito' : `${item.quantity} rimanenti (min: ${item.min_quantity})` }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip size="small" :color="item.quantity === 0 ? 'error' : 'warning'" variant="tonal">
                    {{ item.quantity === 0 ? 'Esaurito' : 'Scorta bassa' }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center text-grey py-8">
              <v-icon size="48" class="mb-2" color="success">mdi-check-circle</v-icon>
              <div>Nessun avviso — scorte OK</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const client = useSupabaseClient()

// Refs for charts
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const servicesChartRef = ref<HTMLCanvasElement | null>(null)
const statusChartRef = ref<HTMLCanvasElement | null>(null)

let revenueChart: Chart | null = null
let servicesChart: Chart | null = null
let statusChart: Chart | null = null

// State
const loading = ref(true)
const selectedPeriod = ref('this_month')

const periods = [
  { title: 'Oggi', value: 'today' },
  { title: 'Questa Settimana', value: 'this_week' },
  { title: 'Questo Mese', value: 'this_month' },
  { title: 'Ultimo Trimestre', value: 'last_quarter' },
  { title: 'Quest\'Anno', value: 'this_year' }
]

const stats = ref({
  revenue: 0,
  revenueChange: 0,
  completedOrders: 0,
  ordersChange: 0,
  newCustomers: 0,
  customersChange: 0,
  avgWorkTime: 0
})

const topCustomers = ref<any[]>([])
const recentActivity = ref<any[]>([])
const lowStockItems = ref<any[]>([])

// Store chart data for rebuilding
const monthlyRevenueData = ref<number[]>(new Array(12).fill(0))
const prevYearRevenueData = ref<number[]>(new Array(12).fill(0))
const servicesData = ref<{ labels: string[], data: number[] }>({ labels: [], data: [] })
const statusData = ref<{ labels: string[], data: number[], colors: string[] }>({ labels: [], data: [], colors: [] })

// Helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

const getAvatarColor = (index: number) => {
  const colors = ['primary', 'success', 'warning', 'info', 'purple']
  return colors[index % colors.length]
}

const getDateRange = () => {
  const now = new Date()
  let from: Date
  let prevFrom: Date
  let prevTo: Date

  switch (selectedPeriod.value) {
    case 'today':
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      prevFrom = new Date(from.getTime() - 86400000)
      prevTo = new Date(from.getTime())
      break
    case 'this_week':
      const dayOfWeek = now.getDay() || 7
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1)
      prevFrom = new Date(from.getTime() - 7 * 86400000)
      prevTo = new Date(from.getTime())
      break
    case 'this_month':
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      prevFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      prevTo = new Date(now.getFullYear(), now.getMonth(), 0)
      break
    case 'last_quarter':
      from = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      prevFrom = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      prevTo = new Date(now.getFullYear(), now.getMonth() - 3, 0)
      break
    case 'this_year':
      from = new Date(now.getFullYear(), 0, 1)
      prevFrom = new Date(now.getFullYear() - 1, 0, 1)
      prevTo = new Date(now.getFullYear() - 1, 11, 31)
      break
    default:
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      prevFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      prevTo = new Date(now.getFullYear(), now.getMonth(), 0)
  }

  return {
    from: from.toISOString(),
    to: now.toISOString(),
    prevFrom: prevFrom.toISOString(),
    prevTo: prevTo.toISOString()
  }
}

const calcChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

const timeAgo = (dateStr: string): string => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Adesso'
  if (diffMin < 60) return `${diffMin} min fa`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'ora' : 'ore'} fa`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ${diffDays === 1 ? 'giorno' : 'giorni'} fa`
}

// Data loading functions
const loadStats = async () => {
  const range = getDateRange()

  try {
    // Current period revenue
    const { data: currentInvoices } = await client
      .from('invoices')
      .select('total_amount')
      .eq('status', 'paid')
      .gte('payment_date', range.from.split('T')[0])

    const currentRevenue = currentInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

    // Previous period revenue
    const { data: prevInvoices } = await client
      .from('invoices')
      .select('total_amount')
      .eq('status', 'paid')
      .gte('payment_date', range.prevFrom.split('T')[0])
      .lte('payment_date', range.prevTo.split('T')[0])

    const prevRevenue = prevInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

    // Current period completed orders
    const { count: currentOrders } = await client
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', range.from)

    // Previous period completed orders
    const { count: prevOrders } = await client
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', range.prevFrom)
      .lte('updated_at', range.prevTo)

    // Current period new customers
    const { count: currentCustomers } = await client
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', range.from)

    // Previous period new customers
    const { count: prevCustomers } = await client
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', range.prevFrom)
      .lte('created_at', range.prevTo)

    // Average work time (labor_hours from completed orders)
    const { data: workHours } = await client
      .from('work_orders')
      .select('labor_hours')
      .eq('status', 'completed')
      .gte('updated_at', range.from)

    const avgHours = workHours?.length
      ? workHours.reduce((sum, wo) => sum + (wo.labor_hours || 0), 0) / workHours.length
      : 0

    stats.value = {
      revenue: currentRevenue,
      revenueChange: calcChange(currentRevenue, prevRevenue),
      completedOrders: currentOrders || 0,
      ordersChange: calcChange(currentOrders || 0, prevOrders || 0),
      newCustomers: currentCustomers || 0,
      customersChange: calcChange(currentCustomers || 0, prevCustomers || 0),
      avgWorkTime: Math.round(avgHours * 10) / 10
    }
  } catch (e) {
    console.error('Error loading stats:', e)
  }
}

const loadRevenueChart = async () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const prevYear = currentYear - 1

  try {
    // Current year invoices
    const { data: currentYearInvoices } = await client
      .from('invoices')
      .select('total_amount, payment_date')
      .eq('status', 'paid')
      .gte('payment_date', `${currentYear}-01-01`)
      .lte('payment_date', `${currentYear}-12-31`)

    // Previous year invoices
    const { data: prevYearInvoices } = await client
      .from('invoices')
      .select('total_amount, payment_date')
      .eq('status', 'paid')
      .gte('payment_date', `${prevYear}-01-01`)
      .lte('payment_date', `${prevYear}-12-31`)

    // Group by month
    const currentMonthly = new Array(12).fill(0)
    const prevMonthly = new Array(12).fill(0)

    currentYearInvoices?.forEach(inv => {
      if (inv.payment_date) {
        const month = new Date(inv.payment_date).getMonth()
        currentMonthly[month] += inv.total_amount || 0
      }
    })

    prevYearInvoices?.forEach(inv => {
      if (inv.payment_date) {
        const month = new Date(inv.payment_date).getMonth()
        prevMonthly[month] += inv.total_amount || 0
      }
    })

    monthlyRevenueData.value = currentMonthly
    prevYearRevenueData.value = prevMonthly
  } catch (e) {
    console.error('Error loading revenue chart:', e)
  }
}

const loadServicesChart = async () => {
  try {
    const { data: items } = await client
      .from('work_order_items')
      .select('item_type, description')

    if (!items?.length) {
      servicesData.value = { labels: ['Nessun dato'], data: [1] }
      return
    }

    // Count by item_type
    const typeCounts: Record<string, number> = {}
    const typeLabels: Record<string, string> = {
      labor: 'Manodopera',
      part: 'Ricambi',
      service: 'Servizi'
    }

    items.forEach(item => {
      const label = typeLabels[item.item_type] || item.item_type
      typeCounts[label] = (typeCounts[label] || 0) + 1
    })

    servicesData.value = {
      labels: Object.keys(typeCounts),
      data: Object.values(typeCounts)
    }
  } catch (e) {
    console.error('Error loading services chart:', e)
  }
}

const loadStatusChart = async () => {
  try {
    const { data: orders } = await client
      .from('work_orders')
      .select('status')

    const statusLabels: Record<string, string> = {
      pending: 'In Attesa',
      in_progress: 'In Corso',
      waiting_parts: 'Attesa Ricambi',
      completed: 'Completati',
      cancelled: 'Annullati'
    }

    const statusColors: Record<string, string> = {
      pending: '#fbbf24',
      in_progress: '#3b82f6',
      waiting_parts: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444'
    }

    const counts: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      waiting_parts: 0,
      completed: 0,
      cancelled: 0
    }

    orders?.forEach(o => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++
      }
    })

    statusData.value = {
      labels: Object.keys(counts).map(k => statusLabels[k] || k),
      data: Object.values(counts),
      colors: Object.keys(counts).map(k => statusColors[k] || '#94a3b8')
    }
  } catch (e) {
    console.error('Error loading status chart:', e)
  }
}

const loadTopCustomers = async () => {
  try {
    const { data: invoices } = await client
      .from('invoices')
      .select('total_amount, customer_id, customers(id, name)')
      .eq('status', 'paid')

    if (!invoices?.length) {
      topCustomers.value = []
      return
    }

    // Aggregate per customer
    const customerMap: Record<string, { id: string, name: string, revenue: number, orders: number }> = {}

    invoices.forEach(inv => {
      const cust = inv.customers as any
      if (!cust) return
      const id = cust.id
      if (!customerMap[id]) {
        customerMap[id] = { id, name: cust.name, revenue: 0, orders: 0 }
      }
      customerMap[id].revenue += inv.total_amount || 0
      customerMap[id].orders++
    })

    topCustomers.value = Object.values(customerMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  } catch (e) {
    console.error('Error loading top customers:', e)
  }
}

const loadRecentActivity = async () => {
  try {
    const activities: any[] = []

    // Recent work orders
    const { data: recentOrders } = await client
      .from('work_orders')
      .select('id, order_number, status, updated_at, vehicles(plate, customers(name))')
      .order('updated_at', { ascending: false })
      .limit(5)

    recentOrders?.forEach(wo => {
      const vehicle = wo.vehicles as any
      const customerName = vehicle?.customers?.name || ''
      const statusLabels: Record<string, string> = {
        pending: 'Ordine in attesa',
        in_progress: 'Ordine in corso',
        waiting_parts: 'Ordine in attesa ricambi',
        completed: 'Ordine completato',
        cancelled: 'Ordine annullato'
      }
      const statusColors: Record<string, string> = {
        pending: 'warning',
        in_progress: 'primary',
        waiting_parts: 'purple',
        completed: 'success',
        cancelled: 'error'
      }
      activities.push({
        id: `wo-${wo.id}`,
        title: statusLabels[wo.status] || 'Ordine aggiornato',
        description: `${wo.order_number}${customerName ? ' - ' + customerName : ''}`,
        time: timeAgo(wo.updated_at),
        color: statusColors[wo.status] || 'grey',
        date: wo.updated_at
      })
    })

    // Recent invoices
    const { data: recentInvoices } = await client
      .from('invoices')
      .select('id, invoice_number, status, total_amount, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)

    recentInvoices?.forEach(inv => {
      const statusLabels: Record<string, string> = {
        draft: 'Fattura creata',
        sent: 'Fattura inviata',
        paid: 'Fattura pagata',
        overdue: 'Fattura scaduta',
        cancelled: 'Fattura annullata'
      }
      const statusColors: Record<string, string> = {
        draft: 'grey',
        sent: 'primary',
        paid: 'success',
        overdue: 'error',
        cancelled: 'grey'
      }
      activities.push({
        id: `inv-${inv.id}`,
        title: statusLabels[inv.status] || 'Fattura aggiornata',
        description: `${inv.invoice_number} - €${(inv.total_amount || 0).toFixed(2)}`,
        time: timeAgo(inv.updated_at),
        color: statusColors[inv.status] || 'grey',
        date: inv.updated_at
      })
    })

    // Recent customers
    const { data: recentCustomerData } = await client
      .from('customers')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(3)

    recentCustomerData?.forEach(c => {
      activities.push({
        id: `cust-${c.id}`,
        title: 'Nuovo cliente',
        description: c.name,
        time: timeAgo(c.created_at),
        color: 'info',
        date: c.created_at
      })
    })

    // Sort by date and take top 8
    recentActivity.value = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
  } catch (e) {
    console.error('Error loading recent activity:', e)
  }
}

const loadLowStockItems = async () => {
  try {
    const { data: items } = await client
      .from('inventory')
      .select('id, name, quantity, min_quantity')

    lowStockItems.value = (items || [])
      .filter(item => item.quantity <= item.min_quantity)
      .sort((a, b) => a.quantity - b.quantity)
  } catch (e) {
    console.error('Error loading low stock items:', e)
  }
}

// Build/rebuild charts
const buildCharts = () => {
  // Destroy existing
  revenueChart?.destroy()
  servicesChart?.destroy()
  statusChart?.destroy()

  const currentYear = new Date().getFullYear()

  // Revenue Chart
  if (revenueChartRef.value) {
    revenueChart = new Chart(revenueChartRef.value, {
      type: 'line',
      data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        datasets: [
          {
            label: `Fatturato ${currentYear}`,
            data: monthlyRevenueData.value,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: `Fatturato ${currentYear - 1}`,
            data: prevYearRevenueData.value,
            borderColor: '#94a3b8',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '€' + (Number(value) / 1000) + 'k'
            }
          }
        }
      }
    })
  }

  // Services Chart
  if (servicesChartRef.value) {
    const sColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#94a3b8', '#ef4444', '#06b6d4']
    servicesChart = new Chart(servicesChartRef.value, {
      type: 'doughnut',
      data: {
        labels: servicesData.value.labels,
        datasets: [{
          data: servicesData.value.data,
          backgroundColor: sColors.slice(0, servicesData.value.labels.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }

  // Status Chart
  if (statusChartRef.value) {
    statusChart = new Chart(statusChartRef.value, {
      type: 'bar',
      data: {
        labels: statusData.value.labels,
        datasets: [{
          label: 'Ordini',
          data: statusData.value.data,
          backgroundColor: statusData.value.colors,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}

// Load all data
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadRevenueChart(),
      loadServicesChart(),
      loadStatusChart(),
      loadTopCustomers(),
      loadRecentActivity(),
      loadLowStockItems()
    ])
  } catch (e) {
    console.error('Error loading report data:', e)
  } finally {
    loading.value = false
    // Charts need the DOM, wait a tick
    await nextTick()
    buildCharts()
  }
}

onMounted(() => {
  loadAllData()
})

// Cleanup charts
onUnmounted(() => {
  revenueChart?.destroy()
  servicesChart?.destroy()
  statusChart?.destroy()
})
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}

.chart-container-small {
  height: 250px;
  position: relative;
}
</style>
