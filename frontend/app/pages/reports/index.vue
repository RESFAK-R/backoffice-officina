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
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 180px"
        />
        <v-btn variant="outlined" prepend-icon="mdi-download">
          Esporta Report
        </v-btn>
      </div>
    </div>

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
                  {{ Math.abs(stats.revenueChange) }}%
                </span>
                <span class="text-grey ml-1">vs mese prec.</span>
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
                  {{ Math.abs(stats.ordersChange) }}%
                </span>
                <span class="text-grey ml-1">vs mese prec.</span>
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
                  {{ Math.abs(stats.customersChange) }}%
                </span>
                <span class="text-grey ml-1">vs mese prec.</span>
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
            Servizi più richiesti
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
          <v-list>
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
          <v-timeline side="end" density="compact">
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
          <v-list>
            <v-list-item
              v-for="item in lowStockItems"
              :key="item.id"
              :to="`/inventory/${item.id}`"
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
                <v-btn size="small" variant="tonal" color="primary">
                  Ordina
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-card-text v-if="lowStockItems.length === 0" class="text-center text-grey">
            <v-icon size="48" class="mb-2">mdi-check-circle</v-icon>
            <div>Nessun avviso</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Refs for charts
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const servicesChartRef = ref<HTMLCanvasElement | null>(null)
const statusChartRef = ref<HTMLCanvasElement | null>(null)

let revenueChart: Chart | null = null
let servicesChart: Chart | null = null
let statusChart: Chart | null = null

// State
const selectedPeriod = ref('Questo Mese')

const periods = [
  'Oggi',
  'Questa Settimana',
  'Questo Mese',
  'Ultimo Trimestre',
  'Quest\'Anno'
]

// Mock data - in produzione questi dati verrebbero dal database
const stats = ref({
  revenue: 45250,
  revenueChange: 12.5,
  completedOrders: 87,
  ordersChange: 8.3,
  newCustomers: 14,
  customersChange: -2.1,
  avgWorkTime: 3.2
})

const topCustomers = ref([
  { id: '1', name: 'Auto Service SRL', orders: 15, revenue: 8500 },
  { id: '2', name: 'Mario Rossi', orders: 8, revenue: 3200 },
  { id: '3', name: 'Giulia Bianchi', orders: 6, revenue: 2800 },
  { id: '4', name: 'Transport Italia SpA', orders: 5, revenue: 4500 },
  { id: '5', name: 'Francesco Verdi', orders: 4, revenue: 1800 }
])

const recentActivity = ref([
  { id: 1, title: 'Ordine completato', description: 'OL-2026-00045 - Mario Rossi', time: '5 min fa', color: 'success' },
  { id: 2, title: 'Nuovo appuntamento', description: 'Domani 09:00 - Giulia Bianchi', time: '15 min fa', color: 'primary' },
  { id: 3, title: 'Fattura pagata', description: 'FT-2026-00032 - €450.00', time: '1 ora fa', color: 'success' },
  { id: 4, title: 'Nuovo cliente', description: 'Transport Italia SpA', time: '2 ore fa', color: 'info' },
  { id: 5, title: 'Ordine in attesa ricambi', description: 'OL-2026-00044', time: '3 ore fa', color: 'warning' }
])

const lowStockItems = ref([
  { id: '1', name: 'Olio Motore 5W30', quantity: 2, min_quantity: 10 },
  { id: '2', name: 'Filtro Aria Universale', quantity: 0, min_quantity: 5 },
  { id: '3', name: 'Pastiglie Freno Anteriori', quantity: 3, min_quantity: 8 }
])

// Methods
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

// Initialize charts
onMounted(() => {
  // Revenue Chart
  if (revenueChartRef.value) {
    revenueChart = new Chart(revenueChartRef.value, {
      type: 'line',
      data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Fatturato 2026',
            data: [32000, 38000, 42000, 35000, 48000, 45250, 0, 0, 0, 0, 0, 0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Fatturato 2025',
            data: [28000, 32000, 35000, 31000, 42000, 40000, 38000, 35000, 45000, 48000, 50000, 55000],
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
    servicesChart = new Chart(servicesChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['Tagliando', 'Riparazione Freni', 'Cambio Olio', 'Diagnosi', 'Altro'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
            '#94a3b8'
          ]
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
        labels: ['In Attesa', 'In Corso', 'Attesa Ricambi', 'Completati', 'Annullati'],
        datasets: [{
          label: 'Ordini',
          data: [8, 12, 3, 87, 2],
          backgroundColor: [
            '#fbbf24',
            '#3b82f6',
            '#8b5cf6',
            '#10b981',
            '#ef4444'
          ],
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
