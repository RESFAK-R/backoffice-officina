<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header animate-fadeIn">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Benvenuto! Ecco una panoramica della tua officina</p>
      </div>
      <div class="d-flex ga-3">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="navigateTo('/work-orders/new')">
          Nuovo Ordine
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-calendar-plus" @click="navigateTo('/appointments/new')">
          Nuovo Appuntamento
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card animate-fadeIn" style="animation-delay: 0.1s">
        <div class="stat-icon">
          <v-icon>mdi-clipboard-text-clock</v-icon>
        </div>
        <div class="stat-value">{{ stats.activeOrders }}</div>
        <div class="stat-label">Ordini Attivi</div>
      </div>

      <div class="stat-card success animate-fadeIn" style="animation-delay: 0.2s">
        <div class="stat-icon">
          <v-icon>mdi-check-circle</v-icon>
        </div>
        <div class="stat-value">{{ stats.completedOrders }}</div>
        <div class="stat-label">Completati (mese)</div>
      </div>

      <div class="stat-card info animate-fadeIn" style="animation-delay: 0.3s">
        <div class="stat-icon">
          <v-icon>mdi-calendar-today</v-icon>
        </div>
        <div class="stat-value">{{ stats.todayAppointments }}</div>
        <div class="stat-label">Appuntamenti Oggi</div>
      </div>

      <div class="stat-card warning animate-fadeIn" style="animation-delay: 0.4s">
        <div class="stat-icon">
          <v-icon>mdi-currency-eur</v-icon>
        </div>
        <div class="stat-value">{{ formatCurrency(stats.monthlyRevenue) }}</div>
        <div class="stat-label">Fatturato Mese</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <v-card class="mb-6 animate-fadeIn" style="animation-delay: 0.5s">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-rocket-launch</v-icon>
        Azioni Rapide
      </v-card-title>
      <v-card-text>
        <div class="quick-actions">
          <NuxtLink to="/customers/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-account-plus</v-icon>
            <span class="quick-action-label">Nuovo Cliente</span>
          </NuxtLink>
          <NuxtLink to="/vehicles/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-car-plus</v-icon>
            <span class="quick-action-label">Nuovo Veicolo</span>
          </NuxtLink>
          <NuxtLink to="/work-orders/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-clipboard-plus</v-icon>
            <span class="quick-action-label">Nuovo Ordine</span>
          </NuxtLink>
          <NuxtLink to="/appointments/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-calendar-plus</v-icon>
            <span class="quick-action-label">Nuovo Appuntamento</span>
          </NuxtLink>
          <NuxtLink to="/invoices/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-file-plus</v-icon>
            <span class="quick-action-label">Nuova Fattura</span>
          </NuxtLink>
          <NuxtLink to="/inventory/new" class="quick-action-btn">
            <v-icon size="32" class="quick-action-icon">mdi-package-variant-plus</v-icon>
            <span class="quick-action-label">Nuovo Articolo</span>
          </NuxtLink>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Recent Work Orders -->
      <v-col cols="12" lg="7">
        <v-card class="animate-fadeIn" style="animation-delay: 0.6s">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>
              <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
              Ordini Recenti
            </span>
            <v-btn variant="text" color="primary" size="small" to="/work-orders">
              Vedi tutti
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list v-if="recentOrders.length > 0">
            <v-list-item
              v-for="order in recentOrders"
              :key="order.id"
              :to="`/work-orders/${order.id}`"
              class="py-3"
            >
              <template #prepend>
                <v-avatar color="primary" variant="tonal" size="48">
                  <v-icon>mdi-car</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ order.order_number }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ order.vehicles?.plate }} - {{ order.vehicles?.brand }} {{ order.vehicles?.model }}
                <br>
                <span class="text-grey-darken-1">{{ order.vehicles?.customers?.name }}</span>
              </v-list-item-subtitle>

              <template #append>
                <v-chip
                  :color="getStatusColor(order.status)"
                  size="small"
                  label
                >
                  {{ getStatusLabel(order.status) }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
            <p class="text-grey mt-2">Nessun ordine recente</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Upcoming Appointments -->
      <v-col cols="12" lg="5">
        <v-card class="animate-fadeIn" style="animation-delay: 0.7s">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>
              <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
              Prossimi Appuntamenti
            </span>
            <v-btn variant="text" color="primary" size="small" to="/appointments">
              Vedi tutti
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list v-if="upcomingAppointments.length > 0">
            <v-list-item
              v-for="appointment in upcomingAppointments"
              :key="appointment.id"
              class="py-3"
            >
              <template #prepend>
                <div class="appointment-time text-center mr-3">
                  <div class="text-caption text-grey">{{ formatDate(appointment.scheduled_at) }}</div>
                  <div class="text-h6 font-weight-bold text-primary">{{ formatTime(appointment.scheduled_at) }}</div>
                </div>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ appointment.customers?.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ appointment.service_type }}
                <span v-if="appointment.vehicles" class="text-grey-darken-1">
                  • {{ appointment.vehicles.plate }}
                </span>
              </v-list-item-subtitle>

              <template #append>
                <v-chip
                  :color="getAppointmentStatusColor(appointment.status)"
                  size="small"
                  label
                >
                  {{ appointment.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-calendar-blank</v-icon>
            <p class="text-grey mt-2">Nessun appuntamento in programma</p>
          </v-card-text>
        </v-card>

        <!-- Low Stock Alert -->
        <v-card class="mt-6 animate-fadeIn" style="animation-delay: 0.8s" v-if="lowStockItems.length > 0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
            <span class="text-error">Scorte Basse</span>
          </v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item
              v-for="item in lowStockItems"
              :key="item.id"
              :to="`/inventory/${item.id}`"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.quantity }} / {{ item.min_quantity }} min
              </v-list-item-subtitle>
              <template #append>
                <v-chip color="error" size="small">{{ item.quantity }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn color="error" variant="text" block to="/inventory?filter=low-stock">
              Gestisci Scorte
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Stats Row -->
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card class="animate-fadeIn" style="animation-delay: 0.9s">
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="primary" variant="tonal" size="56" class="mr-4">
              <v-icon size="28">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.totalCustomers }}</div>
              <div class="text-grey">Clienti Totali</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="animate-fadeIn" style="animation-delay: 1.0s">
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="success" variant="tonal" size="56" class="mr-4">
              <v-icon size="28">mdi-car-multiple</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.totalVehicles }}</div>
              <div class="text-grey">Veicoli Registrati</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="animate-fadeIn" style="animation-delay: 1.1s">
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="warning" variant="tonal" size="56" class="mr-4">
              <v-icon size="28">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ lowStockItems.length }}</div>
              <div class="text-grey">Articoli Sotto Scorta</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { getDashboardStats, getRecentWorkOrders, getUpcomingAppointments } = useDashboard()
const { getLowStockItems } = useInventory()

// State
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

// Load data
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
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
})

// Helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short'
  }).format(date)
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    waiting_parts: 'purple',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'In Attesa',
    in_progress: 'In Corso',
    waiting_parts: 'Attesa Ricambi',
    completed: 'Completato',
    cancelled: 'Annullato'
  }
  return labels[status] || status
}

const getAppointmentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'primary',
    confirmed: 'info',
    arrived: 'warning',
    completed: 'success',
    cancelled: 'error',
    no_show: 'grey'
  }
  return colors[status] || 'grey'
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.appointment-time {
  min-width: 60px;
}
</style>
