<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Fatture</h1>
        <p class="page-subtitle">Gestisci la fatturazione e i pagamenti</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/invoices/new">
        Nuova Fattura
      </v-btn>
    </div>

    <!-- Status Summary Cards -->
    <div class="stats-grid mb-6">
      <div class="stat-card" @click="filterStatus = null">
        <div class="stat-icon"><v-icon>mdi-file-document-multiple</v-icon></div>
        <div class="stat-value">{{ statusCounts.all }}</div>
        <div class="stat-label">Totale Fatture</div>
      </div>
      <div class="stat-card warning" @click="filterStatus = 'sent'">
        <div class="stat-icon"><v-icon>mdi-send</v-icon></div>
        <div class="stat-value">{{ formatCurrency(pendingAmount) }}</div>
        <div class="stat-label">Da Incassare</div>
      </div>
      <div class="stat-card error" @click="filterStatus = 'overdue'">
        <div class="stat-icon"><v-icon>mdi-alert</v-icon></div>
        <div class="stat-value">{{ statusCounts.overdue }}</div>
        <div class="stat-label">Scadute</div>
      </div>
      <div class="stat-card success" @click="filterStatus = 'paid'">
        <div class="stat-icon"><v-icon>mdi-check-circle</v-icon></div>
        <div class="stat-value">{{ formatCurrency(paidAmount) }}</div>
        <div class="stat-label">Incassato (mese)</div>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              placeholder="Cerca numero fattura, cliente..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterStatus"
              density="compact"
              variant="outlined"
              :items="statuses"
              item-title="title"
              item-value="value"
              label="Stato"
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
          <v-col cols="auto">
            <v-btn variant="outlined" prepend-icon="mdi-download" @click="exportInvoices">
              Esporta
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <v-card v-if="loading" class="pa-6">
      <v-skeleton-loader type="table-heading, table-row-divider@5, table-tfoot" />
    </v-card>

    <!-- Data Table -->
    <v-card v-else>
      <v-data-table
        :headers="headers"
        :items="filteredInvoices"
        :search="search"
        :items-per-page="10"
        hover
        class="elevation-0"
      >
        <template #item.invoice_number="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar :color="getStatusColorAvatar(item.status)" variant="tonal" size="40" class="mr-3">
              <v-icon>mdi-file-document</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.invoice_number }}</div>
              <div class="text-caption text-grey">{{ formatDate(item.issue_date) }}</div>
            </div>
          </div>
        </template>

        <template #item.customer="{ item }">
          <NuxtLink :to="`/customers/${item.customers?.id}`" class="text-primary font-weight-medium">
            {{ item.customers?.name || '-' }}
          </NuxtLink>
        </template>

        <template #item.work_order="{ item }">
          <NuxtLink v-if="item.work_orders" :to="`/work-orders/${item.work_orders.id}`" class="text-primary">
            {{ item.work_orders.order_number }}
          </NuxtLink>
          <span v-else class="text-grey">-</span>
        </template>

        <template #item.total_amount="{ item }">
          <span class="font-weight-bold text-h6">{{ formatCurrency(item.total_amount) }}</span>
        </template>

        <template #item.due_date="{ item }">
          <div>
            <v-chip 
              :color="getDueDateColor(item)"
              size="small"
              label
            >
              {{ formatDate(item.due_date) }}
            </v-chip>
            <div v-if="item.status !== 'paid' && isOverdue(item.due_date)" class="text-caption text-error">
              {{ getDaysOverdue(item.due_date) }} giorni in ritardo
            </div>
          </div>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" label>
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/invoices/${item.id}`" />
          <v-btn 
            v-if="item.status === 'sent' || item.status === 'overdue'"
            icon="mdi-cash-check" 
            variant="text" 
            size="small" 
            color="success"
            @click="openPaymentDialog(item)"
            title="Registra Pagamento"
          />
          <v-btn icon="mdi-printer" variant="text" size="small" @click="printInvoice(item)" />
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
            </template>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-pencil" title="Modifica" :to="`/invoices/${item.id}/edit`" />
              <v-list-item 
                v-if="item.status === 'draft'"
                prepend-icon="mdi-send" 
                title="Invia" 
                @click="sendInvoice(item)" 
              />
              <v-list-item prepend-icon="mdi-content-duplicate" title="Duplica" @click="duplicateInvoice(item)" />
              <v-divider />
              <v-list-item 
                v-if="item.status !== 'cancelled'"
                prepend-icon="mdi-close-circle" 
                title="Annulla" 
                @click="cancelInvoice(item)" 
              />
              <v-list-item prepend-icon="mdi-delete" title="Elimina" @click="confirmDelete(item)" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <!-- Payment Dialog -->
    <v-dialog v-model="paymentDialog" max-width="450">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="success">mdi-cash-check</v-icon>
          Registra Pagamento
        </v-card-title>
        <v-divider />
        
        <v-card-text>
          <div class="text-center mb-4">
            <div class="text-h4 font-weight-bold text-success">
              {{ formatCurrency(paymentInvoice?.total_amount || 0) }}
            </div>
            <div class="text-grey">{{ paymentInvoice?.invoice_number }}</div>
          </div>

          <v-text-field
            v-model="paymentDate"
            type="date"
            label="Data Pagamento"
            prepend-inner-icon="mdi-calendar"
          />

          <v-select
            v-model="paymentMethod"
            :items="paymentMethods"
            label="Metodo di Pagamento"
            prepend-inner-icon="mdi-credit-card"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn variant="text" @click="paymentDialog = false">Annulla</v-btn>
          <v-spacer />
          <v-btn color="success" :loading="processingPayment" @click="confirmPayment">
            Conferma Pagamento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Conferma Eliminazione
        </v-card-title>
        <v-card-text>
          Sei sicuro di voler eliminare la fattura <strong>{{ invoiceToDelete?.invoice_number }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteInvoiceConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types/database.types'

const { fetchInvoices, updateInvoice, markAsPaid } = useInvoices()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const invoices = ref<any[]>([])
const search = ref('')
const filterStatus = ref<string | null>(null)
const filterDateFrom = ref('')
const filterDateTo = ref('')
const paymentDialog = ref(false)
const paymentInvoice = ref<any>(null)
const paymentDate = ref(new Date().toISOString().split('T')[0])
const paymentMethod = ref('Bonifico')
const processingPayment = ref(false)
const deleteDialog = ref(false)
const invoiceToDelete = ref<any>(null)
const deleting = ref(false)

// Constants
const statuses = [
  { title: 'Bozza', value: 'draft' },
  { title: 'Inviata', value: 'sent' },
  { title: 'Pagata', value: 'paid' },
  { title: 'Scaduta', value: 'overdue' },
  { title: 'Annullata', value: 'cancelled' }
]

const paymentMethods = ['Contanti', 'Bonifico', 'Carta di Credito', 'Assegno', 'POS', 'PayPal']

const headers = [
  { title: 'Fattura', key: 'invoice_number', sortable: true },
  { title: 'Cliente', key: 'customer', sortable: false },
  { title: 'Ordine', key: 'work_order', sortable: false },
  { title: 'Importo', key: 'total_amount', sortable: true },
  { title: 'Scadenza', key: 'due_date', sortable: true },
  { title: 'Stato', key: 'status', sortable: true },
  { title: 'Azioni', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const statusCounts = computed(() => {
  const counts: Record<string, number> = {
    all: invoices.value.length,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0
  }
  
  invoices.value.forEach(inv => {
    if (counts[inv.status] !== undefined) {
      counts[inv.status]++
    }
  })
  
  return counts
})

const pendingAmount = computed(() => {
  return invoices.value
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
})

const paidAmount = computed(() => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  return invoices.value
    .filter(inv => inv.status === 'paid' && inv.payment_date >= startOfMonth)
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
})

const filteredInvoices = computed(() => {
  let result = invoices.value
  
  if (filterStatus.value) {
    result = result.filter(inv => inv.status === filterStatus.value)
  }
  
  if (filterDateFrom.value) {
    result = result.filter(inv => inv.issue_date >= filterDateFrom.value)
  }
  
  if (filterDateTo.value) {
    result = result.filter(inv => inv.issue_date <= filterDateTo.value)
  }
  
  return result
})

// Load data
onMounted(async () => {
  try {
    invoices.value = await fetchInvoices() || []
  } catch (error) {
    console.error('Error loading invoices:', error)
  } finally {
    loading.value = false
  }
})

// Methods
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateStr))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const getDaysOverdue = (dueDate: string) => {
  const diff = new Date().getTime() - new Date(dueDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'grey',
    sent: 'primary',
    paid: 'success',
    overdue: 'error',
    cancelled: 'grey-darken-1'
  }
  return colors[status] || 'grey'
}

const getStatusColorAvatar = (status: string) => {
  return getStatusColor(status)
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Bozza',
    sent: 'Inviata',
    paid: 'Pagata',
    overdue: 'Scaduta',
    cancelled: 'Annullata'
  }
  return labels[status] || status
}

const getDueDateColor = (invoice: any) => {
  if (invoice.status === 'paid') return 'success'
  if (invoice.status === 'cancelled') return 'grey'
  if (isOverdue(invoice.due_date)) return 'error'
  
  const daysUntil = Math.ceil((new Date(invoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntil <= 7) return 'warning'
  return 'grey'
}

const openPaymentDialog = (invoice: any) => {
  paymentInvoice.value = invoice
  paymentDate.value = new Date().toISOString().split('T')[0]
  paymentMethod.value = 'Bonifico'
  paymentDialog.value = true
}

const confirmPayment = async () => {
  if (!paymentInvoice.value) return
  
  processingPayment.value = true
  try {
    await markAsPaid(paymentInvoice.value.id, paymentDate.value, paymentMethod.value)
    paymentInvoice.value.status = 'paid'
    paymentInvoice.value.payment_date = paymentDate.value
    paymentInvoice.value.payment_method = paymentMethod.value
    showSnackbar('Pagamento registrato con successo', 'success')
    paymentDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante la registrazione', 'error')
  } finally {
    processingPayment.value = false
  }
}

const sendInvoice = async (invoice: any) => {
  try {
    await updateInvoice(invoice.id, { status: 'sent' })
    invoice.status = 'sent'
    showSnackbar('Fattura inviata', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'invio', 'error')
  }
}

const cancelInvoice = async (invoice: any) => {
  try {
    await updateInvoice(invoice.id, { status: 'cancelled' })
    invoice.status = 'cancelled'
    showSnackbar('Fattura annullata', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'annullamento', 'error')
  }
}

const duplicateInvoice = (invoice: any) => {
  // Navigate to new invoice with pre-filled data
  // This would need to be implemented with query params or a store
  showSnackbar('Funzionalità in arrivo', 'info')
}

const printInvoice = (invoice: any) => {
  // Open print preview
  window.open(`/invoices/${invoice.id}/print`, '_blank')
}

const exportInvoices = () => {
  // Export to CSV or PDF
  showSnackbar('Esportazione in corso...', 'info')
}

const confirmDelete = (invoice: any) => {
  invoiceToDelete.value = invoice
  deleteDialog.value = true
}

const deleteInvoiceConfirm = async () => {
  if (!invoiceToDelete.value) return
  
  deleting.value = true
  try {
    // In real app, you'd call the delete API
    invoices.value = invoices.value.filter(i => i.id !== invoiceToDelete.value.id)
    showSnackbar('Fattura eliminata', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
