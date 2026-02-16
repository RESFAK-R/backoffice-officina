<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-h5 font-weight-bold">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis">Panoramica della tua officina</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="$router.push('/work-orders/new')">
          Nuovo Ordine
        </v-btn>
      </div>
    </div>

    <!-- Stats Grid -->
    <v-row class="ma-0 pa-4">
      <v-col v-for="stat in statsCards" :key="stat.label" cols="12" sm="6" lg="3">
        <v-card class="stat-card" :class="stat.colorClass">
          <v-card-text class="d-flex align-center">
            <v-avatar :color="stat.color" variant="tonal" size="48" class="mr-4">
              <v-icon size="24">{{ stat.icon }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <div class="px-4 pb-4">
      <v-card>
        <v-card-title class="text-body-1 font-weight-bold py-3">
          <v-icon class="mr-2" size="20">mdi-lightning-bolt</v-icon>
          Azioni Rapide
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="quick-actions-grid">
            <NuxtLink v-for="action in quickActions" :key="action.to" :to="action.to" class="quick-action">
              <v-icon size="24" class="mb-1" color="primary">{{ action.icon }}</v-icon>
              <span class="text-caption font-weight-medium">{{ action.label }}</span>
            </NuxtLink>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Content Row -->
    <v-row class="ma-0 px-4 pb-4">
      <!-- Recent Orders -->
      <v-col cols="12" lg="7">
        <v-card class="h-100">
          <v-card-title class="d-flex align-center justify-space-between py-3">
            <span class="text-body-1 font-weight-bold">
              <v-icon class="mr-2" size="20">mdi-clipboard-list</v-icon>
              Ordini Recenti
            </span>
            <v-btn variant="text" size="x-small" color="primary" to="/work-orders">
              Vedi tutti
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list v-if="recentOrders.length" lines="two">
            <v-list-item
              v-for="order in recentOrders"
              :key="order.id"
              :to="`/work-orders/${order.id}`"
            >
              <template #prepend>
                <v-avatar color="primary" variant="tonal" size="40">
                  <v-icon size="20">mdi-car</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ order.order_number }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ order.vehicles?.plate }} · {{ order.vehicles?.brand }}
              </v-list-item-subtitle>
              <template #append>
                <v-chip :color="getStatusColor(order.status)" size="x-small" label>
                  {{ getStatusLabel(order.status) }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center py-8 text-medium-emphasis">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
            <p>Nessun ordine recente</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Appointments -->
      <v-col cols="12" lg="5">
        <v-card class="h-100">
          <v-card-title class="d-flex align-center justify-space-between py-3">
            <span class="text-body-1 font-weight-bold">
              <v-icon class="mr-2" size="20">mdi-calendar</v-icon>
              Appuntamenti Oggi
            </span>
            <v-btn variant="text" size="x-small" color="primary" to="/appointments">
              Tutti
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list v-if="upcomingAppointments.length" lines="two">
            <v-list-item v-for="apt in upcomingAppointments" :key="apt.id">
              <template #prepend>
                <div class="text-center mr-3" style="min-width: 48px;">
                  <div class="text-caption text-medium-emphasis">{{ formatDate(apt.scheduled_at) }}</div>
                  <div class="text-body-2 font-weight-bold text-primary">{{ formatTime(apt.scheduled_at) }}</div>
                </div>
              </template>
              <v-list-item-title class="font-weight-medium">{{ apt.customers?.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ apt.service_type }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center py-8 text-medium-emphasis">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-calendar-blank</v-icon>
            <p>Nessun appuntamento</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Stats -->
    <v-row class="ma-0 px-4 pb-4">
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-text class="d-flex align-center">
            <v-avatar color="info" variant="tonal" size="44" class="mr-3">
              <v-icon>mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ stats.totalCustomers }}</div>
              <div class="text-caption text-medium-emphasis">Clienti Totali</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-text class="d-flex align-center">
            <v-avatar color="success" variant="tonal" size="44" class="mr-3">
              <v-icon>mdi-car-multiple</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ stats.totalVehicles }}</div>
              <div class="text-caption text-medium-emphasis">Veicoli</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-text class="d-flex align-center">
            <v-avatar color="warning" variant="tonal" size="44" class="mr-3">
              <v-icon>mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ lowStockItems.length }}</div>
              <div class="text-caption text-medium-emphasis">Sotto Scorta</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { getDashboardStats, getRecentWorkOrders, getUpcomingAppointments } = useDashboard()
const { getLowStockItems } = useInventory()

const stats = ref({
  activeOrders: 0,
  completedOrders: 0,
  todayAppointments: 0,
  monthlyRevenue: 0,
  totalCustomers: 0,
  totalVehicles: 0
})

const recentOrders = ref<any[]>([])
const upcomingAppointments = ref<any[]>([])
const lowStockItems = ref<any[]>([])

const statsCards = computed(() => [
  { icon: 'mdi-clipboard-clock', value: stats.value.activeOrders, label: 'Ordini Attivi', color: 'primary', colorClass: '' },
  { icon: 'mdi-check-circle', value: stats.value.completedOrders, label: 'Completati', color: 'success', colorClass: '' },
  { icon: 'mdi-calendar-today', value: stats.value.todayAppointments, label: 'Appuntamenti', color: 'info', colorClass: '' },
  { icon: 'mdi-currency-eur', value: formatCurrency(stats.value.monthlyRevenue), label: 'Fatturato Mese', color: 'warning', colorClass: '' }
])

const quickActions = [
  { to: '/customers/new', icon: 'mdi-account-plus', label: 'Cliente' },
  { to: '/vehicles/new', icon: 'mdi-car', label: 'Veicolo' },
  { to: '/work-orders/new', icon: 'mdi-clipboard-plus', label: 'Ordine' },
  { to: '/appointments/new', icon: 'mdi-calendar-plus', label: 'Appuntamento' },
  { to: '/invoices/new', icon: 'mdi-file-plus', label: 'Fattura' },
  { to: '/inventory/new', icon: 'mdi-package-variant-plus', label: 'Articolo' }
]

onMounted(async () => {
  try {
    const [dashStats, orders, appointments, lowStock] = await Promise.all([
      getDashboardStats(),
      getRecentWorkOrders(5),
      getUpcomingAppointments(5),
      getLowStockItems()
    ])
    stats.value = dashStats
    recentOrders.value = orders || []
    upcomingAppointments.value = appointments || []
    lowStockItems.value = lowStock || []
  } catch (e) {
    console.error('Dashboard load error:', e)
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

const formatDate = (dateStr: string) => new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short' }).format(new Date(dateStr))
const formatTime = (dateStr: string) => new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr))

const getStatusColor = (status: string) => ({ pending: 'warning', in_progress: 'primary', completed: 'success', cancelled: 'error' }[status] || 'grey')
const getStatusLabel = (status: string) => ({ pending: 'Attesa', in_progress: 'In Corso', completed: 'Completato', cancelled: 'Annullato' }[status] || status)
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  background: white;
  border-bottom: 1px solid #e4e4e7;
}

.stat-card {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 8px;
  background: #fafafa;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f4f4f5;
    transform: translateY(-2px);
  }
}
</style>
