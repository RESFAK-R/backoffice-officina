<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Ordini di Lavoro</h1>
        <p class="page-subtitle">Gestisci tutti gli ordini di riparazione e manutenzione</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/work-orders/new">
        Nuovo Ordine
      </v-btn>
    </div>

    <!-- Status Tabs -->
    <v-card class="mb-6">
      <v-tabs v-model="activeTab" color="primary" show-arrows>
        <v-tab value="all">
          <v-badge :content="statusCounts.all" color="grey" inline>
            Tutti
          </v-badge>
        </v-tab>
        <v-tab value="pending">
          <v-badge :content="statusCounts.pending" color="warning" inline>
            In Attesa
          </v-badge>
        </v-tab>
        <v-tab value="in_progress">
          <v-badge :content="statusCounts.in_progress" color="primary" inline>
            In Corso
          </v-badge>
        </v-tab>
        <v-tab value="waiting_parts">
          <v-badge :content="statusCounts.waiting_parts" color="purple" inline>
            Attesa Ricambi
          </v-badge>
        </v-tab>
        <v-tab value="completed">
          <v-badge :content="statusCounts.completed" color="success" inline>
            Completati
          </v-badge>
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              placeholder="Cerca ordine, targa, cliente..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterPriority"
              density="compact"
              variant="outlined"
              :items="priorities"
              label="Priorità"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="filterDateFrom"
              type="date"
              density="compact"
              variant="outlined"
              label="Dal"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="filterDateTo"
              type="date"
              density="compact"
              variant="outlined"
              label="Al"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <template v-if="loading">
      <v-row>
        <v-col v-for="i in 6" :key="i" cols="12" md="6" lg="4">
          <v-card class="pa-4">
            <v-skeleton-loader type="article, actions" />
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Work Orders Grid -->
    <v-row v-else>
      <v-col v-for="order in filteredOrders" :key="order.id" cols="12" md="6" lg="4">
        <v-card hover class="work-order-card">
          <div class="card-status-bar" :class="order.status"></div>
          
          <v-card-title class="d-flex align-center justify-space-between pb-0">
            <span class="text-subtitle-1 font-weight-bold">{{ order.order_number }}</span>
            <v-chip :color="getPriorityColor(order.priority)" size="small" variant="flat">
              {{ getPriorityLabel(order.priority) }}
            </v-chip>
          </v-card-title>

          <v-card-subtitle>
            <v-chip :color="getStatusColor(order.status)" size="small" label class="mt-2">
              {{ getStatusLabel(order.status) }}
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            <!-- Vehicle Info -->
            <div class="d-flex align-center mb-3">
              <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                <v-icon>mdi-car</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ order.vehicles?.plate }}</div>
                <div class="text-caption text-grey">
                  {{ order.vehicles?.brand }} {{ order.vehicles?.model }}
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="d-flex align-center mb-3">
              <v-avatar color="success" variant="tonal" size="40" class="mr-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ order.vehicles?.customers?.name || '-' }}</div>
                <div class="text-caption text-grey">Cliente</div>
              </div>
            </div>

            <!-- Problem Description -->
            <div class="problem-description text-body-2 text-grey-darken-1 mb-3">
              {{ truncate(order.problem_description, 100) }}
            </div>

            <!-- Dates -->
            <v-row no-gutters class="text-caption text-grey">
              <v-col cols="6">
                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                Ingresso: {{ formatDate(order.entry_date) }}
              </v-col>
              <v-col cols="6" v-if="order.estimated_completion">
                <v-icon size="small" class="mr-1">mdi-calendar-check</v-icon>
                Prev: {{ formatDate(order.estimated_completion) }}
              </v-col>
            </v-row>

            <!-- Total Amount -->
            <div v-if="order.total_amount > 0" class="mt-3 text-right">
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(order.total_amount) }}
              </span>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn size="small" variant="text" :to="`/work-orders/${order.id}`">
              <v-icon start>mdi-eye</v-icon>
              Dettagli
            </v-btn>
            <v-spacer />
            
            <!-- Quick Status Change -->
            <v-menu v-if="order.status !== 'completed' && order.status !== 'cancelled'">
              <template #activator="{ props }">
                <v-btn size="small" variant="tonal" color="primary" v-bind="props">
                  <v-icon start>mdi-check-circle</v-icon>
                  Stato
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="status in availableStatuses(order.status)"
                  :key="status.value"
                  @click="updateStatus(order, status.value)"
                >
                  <template #prepend>
                    <v-icon :color="getStatusColor(status.value)" size="small">{{ status.icon }}</v-icon>
                  </template>
                  <v-list-item-title>{{ status.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!loading && filteredOrders.length === 0" class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Nessun ordine trovato</h3>
      <p class="text-grey mb-4">
        {{ search ? 'Prova a modificare i criteri di ricerca' : 'Inizia creando un nuovo ordine di lavoro' }}
      </p>
      <v-btn v-if="!search" color="primary" prepend-icon="mdi-plus" to="/work-orders/new">
        Nuovo Ordine
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { fetchWorkOrders, updateWorkOrderStatus } = useWorkOrders()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const workOrders = ref<any[]>([])
const search = ref('')
const activeTab = ref('all')
const filterPriority = ref<string | null>(null)
const filterDateFrom = ref('')
const filterDateTo = ref('')

// Data
const priorities = [
  { title: 'Urgente', value: 'urgent' },
  { title: 'Alta', value: 'high' },
  { title: 'Normale', value: 'normal' },
  { title: 'Bassa', value: 'low' }
]

const allStatuses = [
  { title: 'In Attesa', value: 'pending', icon: 'mdi-clock-outline' },
  { title: 'In Corso', value: 'in_progress', icon: 'mdi-progress-wrench' },
  { title: 'Attesa Ricambi', value: 'waiting_parts', icon: 'mdi-package-variant' },
  { title: 'Completato', value: 'completed', icon: 'mdi-check-circle' },
  { title: 'Annullato', value: 'cancelled', icon: 'mdi-close-circle' }
]

// Computed
const statusCounts = computed(() => {
  const counts: Record<string, number> = {
    all: workOrders.value.length,
    pending: 0,
    in_progress: 0,
    waiting_parts: 0,
    completed: 0
  }
  
  workOrders.value.forEach(order => {
    if (counts[order.status] !== undefined) {
      counts[order.status]++
    }
  })
  
  return counts
})

const filteredOrders = computed(() => {
  let result = workOrders.value
  
  // Filter by tab
  if (activeTab.value !== 'all') {
    result = result.filter(o => o.status === activeTab.value)
  }
  
  // Filter by priority
  if (filterPriority.value) {
    result = result.filter(o => o.priority === filterPriority.value)
  }
  
  // Filter by search
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(o => 
      o.order_number?.toLowerCase().includes(query) ||
      o.vehicles?.plate?.toLowerCase().includes(query) ||
      o.vehicles?.customers?.name?.toLowerCase().includes(query) ||
      o.problem_description?.toLowerCase().includes(query)
    )
  }
  
  // Filter by date range
  if (filterDateFrom.value) {
    result = result.filter(o => o.entry_date >= filterDateFrom.value)
  }
  if (filterDateTo.value) {
    result = result.filter(o => o.entry_date <= filterDateTo.value)
  }
  
  return result
})

// Load data
onMounted(async () => {
  try {
    workOrders.value = await fetchWorkOrders() || []
  } catch (error) {
    console.error('Error loading work orders:', error)
  } finally {
    loading.value = false
  }
})

// Methods
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short'
  }).format(date)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
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

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    urgent: 'error',
    high: 'orange',
    normal: 'grey',
    low: 'grey-lighten-1'
  }
  return colors[priority] || 'grey'
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    urgent: 'Urgente',
    high: 'Alta',
    normal: 'Normale',
    low: 'Bassa'
  }
  return labels[priority] || priority
}

const availableStatuses = (currentStatus: string) => {
  // Define which statuses can transition to which
  const transitions: Record<string, string[]> = {
    pending: ['in_progress', 'cancelled'],
    in_progress: ['waiting_parts', 'completed', 'cancelled'],
    waiting_parts: ['in_progress', 'completed', 'cancelled']
  }
  
  const available = transitions[currentStatus] || []
  return allStatuses.filter(s => available.includes(s.value))
}

const updateStatus = async (order: any, newStatus: string) => {
  try {
    await updateWorkOrderStatus(order.id, newStatus)
    order.status = newStatus
    showSnackbar('Stato aggiornato con successo', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'aggiornamento', 'error')
  }
}
</script>

<style scoped>
.work-order-card {
  position: relative;
  overflow: visible;
  transition: transform 0.2s, box-shadow 0.2s;
}

.work-order-card:hover {
  transform: translateY(-4px);
}

.card-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 4px 4px 0 0;
}

.card-status-bar.pending { background: #fbbf24; }
.card-status-bar.in_progress { background: #3b82f6; }
.card-status-bar.waiting_parts { background: #8b5cf6; }
.card-status-bar.completed { background: #10b981; }
.card-status-bar.cancelled { background: #ef4444; }

.problem-description {
  line-height: 1.4;
}
</style>
