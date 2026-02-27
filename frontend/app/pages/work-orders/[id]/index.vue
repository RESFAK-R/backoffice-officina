<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="article, actions" />
    </div>

    <!-- Work Order Detail -->
    <template v-else-if="workOrder">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/work-orders" class="mb-2">
            Torna agli ordini
          </v-btn>
          <div class="d-flex align-center ga-3">
            <v-avatar :color="getStatusColor(workOrder.status)" variant="tonal" size="56">
              <v-icon size="32">mdi-clipboard-text</v-icon>
            </v-avatar>
            <div>
              <h1 class="page-title">{{ workOrder.order_number }}</h1>
              <p class="page-subtitle">
                <v-chip :color="getStatusColor(workOrder.status)" size="small" label class="mr-2">
                  {{ getStatusLabel(workOrder.status) }}
                </v-chip>
                <v-chip :color="getPriorityColor(workOrder.priority)" size="small" variant="outlined">
                  {{ getPriorityLabel(workOrder.priority) }}
                </v-chip>
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            v-if="workOrder.status !== 'completed' && workOrder.status !== 'cancelled'"
            color="success"
            variant="outlined"
            prepend-icon="mdi-check"
            @click="markCompleted"
          >
            Completa
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-printer"
            @click="printOrder"
          >
            Stampa
          </v-btn>
          <v-btn
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-account-wrench"
            @click="printMechanicBoard"
          >
            Scheda Meccanico
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            :to="`/work-orders/new?edit=${workOrder.id}`"
          >
            Modifica
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Vehicle & Customer Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-car</v-icon>
              Veicolo e Cliente
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-3">
                    <v-avatar color="primary" variant="tonal" size="48" class="mr-3">
                      <v-icon>mdi-car</v-icon>
                    </v-avatar>
                    <div>
                      <NuxtLink 
                        v-if="workOrder.vehicles" 
                        :to="`/vehicles/${workOrder.vehicles.id}`" 
                        class="text-primary font-weight-bold text-h6"
                      >
                        {{ workOrder.vehicles.plate }}
                      </NuxtLink>
                      <div class="text-body-2 text-grey">
                        {{ workOrder.vehicles?.brand }} {{ workOrder.vehicles?.model }}
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-3">
                    <v-avatar color="success" variant="tonal" size="48" class="mr-3">
                      <v-icon>mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <NuxtLink 
                        v-if="workOrder.vehicles?.customers" 
                        :to="`/customers/${workOrder.vehicles.customers.id}`" 
                        class="text-primary font-weight-medium text-h6"
                      >
                        {{ workOrder.vehicles.customers.name }}
                      </NuxtLink>
                      <div v-if="workOrder.vehicles?.customers?.phone" class="text-body-2 text-grey">
                        <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                        {{ workOrder.vehicles.customers.phone }}
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Order Info Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-information</v-icon>
              Dettagli Ordine
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Data Ingresso</div>
                  <div class="font-weight-medium">{{ formatDate(workOrder.entry_date) }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Data Prevista Riconsegna</div>
                  <div class="font-weight-medium">
                    {{ workOrder.estimated_completion ? formatDate(workOrder.estimated_completion) : '-' }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Km Ingresso</div>
                  <div class="font-weight-medium">
                    {{ workOrder.entry_mileage ? formatNumber(workOrder.entry_mileage) + ' km' : '-' }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Data Completamento</div>
                  <div class="font-weight-medium">
                    {{ workOrder.completion_date ? formatDate(workOrder.completion_date) : '-' }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Problem Description Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-alert-circle</v-icon>
              Problema Segnalato
            </v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-wrap;">
                {{ workOrder.problem_description || 'Nessuna descrizione fornita' }}
              </p>
            </v-card-text>
          </v-card>

          <!-- Diagnosis Card -->
          <v-card v-if="workOrder.diagnosis" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-stethoscope</v-icon>
              Diagnosi
            </v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-wrap;">{{ workOrder.diagnosis }}</p>
            </v-card-text>
          </v-card>

          <!-- Work Items Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-wrench</v-icon>
                Lavori e Ricambi
              </div>
              <v-chip color="primary" variant="tonal">
                {{ workOrder.work_order_items?.length || 0 }} voci
              </v-chip>
            </v-card-title>
            <v-divider />
            <v-card-text v-if="workOrder.work_order_items?.length">
              <v-table density="comfortable">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descrizione</th>
                    <th class="text-right">Qtà</th>
                    <th class="text-right">Prezzo Unit.</th>
                    <th class="text-right">Totale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in workOrder.work_order_items" :key="item.id">
                    <td>
                      <v-chip 
                        :color="item.item_type === 'labor' ? 'primary' : 'orange'" 
                        size="small" 
                        label
                      >
                        {{ item.item_type === 'labor' ? 'Manodopera' : 'Ricambio' }}
                      </v-chip>
                    </td>
                    <td>{{ item.description }}</td>
                    <td class="text-right">{{ item.quantity }}</td>
                    <td class="text-right">{{ formatCurrency(item.unit_price) }}</td>
                    <td class="text-right font-weight-medium">{{ formatCurrency(item.total_price) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
            <v-card-text v-else class="text-center text-grey py-8">
              <v-icon size="48">mdi-package-variant</v-icon>
              <p class="mt-2">Nessun lavoro o ricambio registrato</p>
            </v-card-text>
          </v-card>

          <!-- Internal Notes Card -->
          <v-card v-if="workOrder.internal_notes" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Note Interne
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-alert type="info" variant="tonal">
                <p class="text-body-1" style="white-space: pre-wrap;">{{ workOrder.internal_notes }}</p>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" lg="4">
          <!-- Totals Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-calculator</v-icon>
              Riepilogo Costi
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Manodopera</span>
                <span class="font-weight-medium">{{ formatCurrency(workOrder.labor_total || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Ricambi</span>
                <span class="font-weight-medium">{{ formatCurrency(workOrder.parts_total || 0) }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Subtotale</span>
                <span class="font-weight-medium">{{ formatCurrency(workOrder.subtotal || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">IVA</span>
                <span class="font-weight-medium">{{ formatCurrency(workOrder.vat_amount || 0) }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between">
                <span class="text-h6">Totale</span>
                <span class="text-h5 font-weight-bold text-primary">
                  {{ formatCurrency(workOrder.total_amount || 0) }}
                </span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Status Card -->
          <v-card class="mb-4 no-print">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-progress-check</v-icon>
              Stato Ordine
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-select
                v-model="selectedStatus"
                :items="statuses"
                item-title="title"
                item-value="value"
                label="Modifica Stato"
                density="compact"
                hide-details
                @update:model-value="updateStatus"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :color="getStatusColor(item.value)" size="small" class="mr-2">
                        {{ item.raw.icon }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-card-text>
          </v-card>

          <!-- Quick Actions Card -->
          <v-card class="no-print">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
              Azioni Rapide
            </v-card-title>
            <v-divider />
            <v-card-text class="d-flex flex-column ga-2">
              <v-btn 
                block 
                color="primary"
                variant="outlined"
                prepend-icon="mdi-file-document"
                :to="`/invoices/new?work_order=${workOrder.id}`"
              >
                Genera Fattura
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                prepend-icon="mdi-printer"
                @click="printOrder"
              >
                Stampa Ordine
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                prepend-icon="mdi-account-wrench"
                @click="printMechanicBoard"
              >
                Scheda Meccanico
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                color="error"
                prepend-icon="mdi-delete"
                @click="confirmDelete"
              >
                Elimina Ordine
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Not Found State -->
    <v-card v-else class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-clipboard-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Ordine non trovato</h3>
      <p class="text-grey mb-4">L'ordine richiesto non esiste o è stato eliminato.</p>
      <v-btn color="primary" to="/work-orders">
        Torna agli Ordini
      </v-btn>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Conferma Eliminazione
        </v-card-title>
        <v-card-text>
          Sei sicuro di voler eliminare l'ordine 
          <strong>{{ workOrder?.order_number }}</strong>?
          <br><br>
          <span class="text-caption text-grey">Questa azione non può essere annullata.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteOrderConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getWorkOrder, deleteWorkOrder, updateWorkOrderStatus } = useWorkOrders()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const workOrder = ref<any>(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const selectedStatus = ref('')

const workOrderId = computed(() => route.params.id as string)

const statuses = [
  { title: 'In Attesa', value: 'pending', icon: 'mdi-clock-outline' },
  { title: 'In Corso', value: 'in_progress', icon: 'mdi-progress-wrench' },
  { title: 'Attesa Ricambi', value: 'waiting_parts', icon: 'mdi-package-variant' },
  { title: 'Completato', value: 'completed', icon: 'mdi-check-circle' },
  { title: 'Annullato', value: 'cancelled', icon: 'mdi-close-circle' }
]

// Load work order data
onMounted(async () => {
  try {
    workOrder.value = await getWorkOrder(workOrderId.value)
    selectedStatus.value = workOrder.value?.status || 'pending'

    // Auto-print if redirected from "Crea e Stampa"
    if (route.query.print === '1') {
      setTimeout(() => {
        window.print()
        router.replace({ query: {} })
      }, 500)
    }
  } catch (error) {
    console.error('Error loading work order:', error)
  } finally {
    loading.value = false
  }
})

// Helper functions
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('it-IT').format(num)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount || 0)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    waiting_parts: 'deep-orange',
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

// Actions
const updateStatus = async (newStatus: string) => {
  if (!workOrder.value) return
  try {
    await updateWorkOrderStatus(workOrder.value.id, newStatus)
    workOrder.value.status = newStatus
    showSnackbar('Stato aggiornato con successo', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'aggiornamento', 'error')
    selectedStatus.value = workOrder.value.status
  }
}

const markCompleted = async () => {
  await updateStatus('completed')
}

const printOrder = () => {
  window.print()
}

const printMechanicBoard = () => {
  window.open(`/work-orders/${workOrder.value.id}/mechanic?auto=1`, '_blank')
}

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteOrderConfirm = async () => {
  if (!workOrder.value) return
  
  deleting.value = true
  try {
    await deleteWorkOrder(workOrder.value.id)
    showSnackbar('Ordine eliminato con successo', 'success')
    router.push('/work-orders')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
