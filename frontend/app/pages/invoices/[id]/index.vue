<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="article, actions" />
    </div>

    <!-- Invoice Detail -->
    <template v-else-if="invoice">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/invoices" class="mb-2">
            Torna alle fatture
          </v-btn>
          <div class="d-flex align-center ga-3">
            <v-avatar :color="getStatusColor(invoice.status)" variant="tonal" size="56">
              <v-icon size="32">mdi-file-document</v-icon>
            </v-avatar>
            <div>
              <h1 class="page-title">{{ invoice.invoice_number }}</h1>
              <p class="page-subtitle">
                <v-chip :color="getStatusColor(invoice.status)" size="small" label class="mr-2">
                  {{ getStatusLabel(invoice.status) }}
                </v-chip>
                <span class="text-medium-emphasis">
                  Emessa il {{ formatDate(invoice.issue_date) }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            v-if="invoice.status === 'sent' || invoice.status === 'overdue'"
            color="success"
            variant="outlined"
            prepend-icon="mdi-cash-check"
            @click="openPaymentDialog"
          >
            Registra Pagamento
          </v-btn>
          <v-btn
            v-if="invoice.status === 'draft'"
            color="primary"
            variant="outlined"
            prepend-icon="mdi-send"
            @click="sendInvoice"
          >
            Invia
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-printer"
            @click="printInvoice"
          >
            Stampa
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            :to="`/invoices/${invoice.id}/edit`"
          >
            Modifica
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Customer Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Cliente
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="primary" variant="tonal" size="48" class="mr-3">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <div>
                  <NuxtLink
                    v-if="invoice.customers"
                    :to="`/customers/${invoice.customers.id}`"
                    class="text-primary font-weight-bold text-h6"
                  >
                    {{ invoice.customers.name }}
                  </NuxtLink>
                  <div v-if="invoice.customers?.phone" class="text-body-2 text-grey">
                    <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                    {{ invoice.customers.phone }}
                  </div>
                  <div v-if="invoice.customers?.email" class="text-body-2 text-grey">
                    <v-icon size="small" class="mr-1">mdi-email</v-icon>
                    {{ invoice.customers.email }}
                  </div>
                </div>
              </div>

              <!-- Additional customer details -->
              <v-row class="mt-3" v-if="invoice.customers">
                <v-col cols="12" sm="6" v-if="invoice.customers.fiscal_code">
                  <div class="text-caption text-grey mb-1">Codice Fiscale</div>
                  <div class="font-weight-medium">{{ invoice.customers.fiscal_code }}</div>
                </v-col>
                <v-col cols="12" sm="6" v-if="invoice.customers.vat_number">
                  <div class="text-caption text-grey mb-1">Partita IVA</div>
                  <div class="font-weight-medium">{{ invoice.customers.vat_number }}</div>
                </v-col>
                <v-col cols="12" sm="6" v-if="invoice.customers.pec">
                  <div class="text-caption text-grey mb-1">PEC</div>
                  <div class="font-weight-medium">{{ invoice.customers.pec }}</div>
                </v-col>
                <v-col cols="12" sm="6" v-if="invoice.customers.sdi_code">
                  <div class="text-caption text-grey mb-1">Codice SDI</div>
                  <div class="font-weight-medium">{{ invoice.customers.sdi_code }}</div>
                </v-col>
                <v-col cols="12" v-if="invoice.customers.address">
                  <div class="text-caption text-grey mb-1">Indirizzo</div>
                  <div class="font-weight-medium">
                    {{ invoice.customers.address }}
                    <span v-if="invoice.customers.city">, {{ invoice.customers.city }}</span>
                    <span v-if="invoice.customers.postal_code"> ({{ invoice.customers.postal_code }})</span>
                    <span v-if="invoice.customers.province"> {{ invoice.customers.province }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Work Order Card -->
          <v-card v-if="invoice.work_orders" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Ordine di Lavoro Collegato
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="warning" variant="tonal" size="48" class="mr-3">
                  <v-icon>mdi-clipboard-text</v-icon>
                </v-avatar>
                <div>
                  <NuxtLink
                    :to="`/work-orders/${invoice.work_orders.id}`"
                    class="text-primary font-weight-bold text-h6"
                  >
                    {{ invoice.work_orders.order_number }}
                  </NuxtLink>
                  <div v-if="invoice.work_orders.vehicles" class="text-body-2 text-grey">
                    <v-icon size="small" class="mr-1">mdi-car</v-icon>
                    {{ invoice.work_orders.vehicles.plate }} — {{ invoice.work_orders.vehicles.brand }} {{ invoice.work_orders.vehicles.model }}
                  </div>
                </div>
              </div>

              <!-- Work order items table -->
              <v-table v-if="invoice.work_orders.work_order_items?.length" density="comfortable" class="mt-4">
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
                  <tr v-for="item in invoice.work_orders.work_order_items" :key="item.id">
                    <td>
                      <v-chip
                        :color="item.item_type === 'labor' ? 'primary' : item.item_type === 'service' ? 'info' : 'orange'"
                        size="small"
                        label
                      >
                        {{ getItemTypeLabel(item.item_type) }}
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
          </v-card>

          <!-- Invoice Details Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-information</v-icon>
              Dettagli Fattura
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Data Emissione</div>
                  <div class="font-weight-medium">{{ formatDate(invoice.issue_date) }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Scadenza</div>
                  <div class="font-weight-medium">
                    <v-chip
                      v-if="invoice.status !== 'paid' && invoice.status !== 'cancelled'"
                      :color="getDueDateColor()"
                      size="small"
                      label
                    >
                      {{ formatDate(invoice.due_date) }}
                    </v-chip>
                    <span v-else>{{ formatDate(invoice.due_date) }}</span>
                  </div>
                  <div v-if="invoice.status !== 'paid' && isOverdue" class="text-caption text-error mt-1">
                    {{ daysOverdue }} giorni in ritardo
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Data Pagamento</div>
                  <div class="font-weight-medium">
                    {{ invoice.payment_date ? formatDate(invoice.payment_date) : '-' }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="text-caption text-grey mb-1">Metodo di Pagamento</div>
                  <div class="font-weight-medium">
                    {{ invoice.payment_method || '-' }}
                  </div>
                </v-col>
              </v-row>

              <!-- SDI Info -->
              <v-row v-if="invoice.sdi_status || invoice.sdi_id" class="mt-2">
                <v-col cols="12" sm="6" v-if="invoice.sdi_id">
                  <div class="text-caption text-grey mb-1">ID SDI</div>
                  <div class="font-weight-medium">{{ invoice.sdi_id }}</div>
                </v-col>
                <v-col cols="12" sm="6" v-if="invoice.sdi_status">
                  <div class="text-caption text-grey mb-1">Stato SDI</div>
                  <div class="font-weight-medium">{{ invoice.sdi_status }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Notes Card -->
          <v-card v-if="invoice.notes" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Note
            </v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-wrap;">{{ invoice.notes }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" lg="4">
          <!-- Cost Summary Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-calculator</v-icon>
              Riepilogo Importi
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Imponibile</span>
                <span class="font-weight-medium">{{ formatCurrency(invoice.subtotal || 0) }}</span>
              </div>
              <div v-if="invoice.discount_amount" class="d-flex justify-space-between mb-2">
                <span class="text-grey">Sconto</span>
                <span class="font-weight-medium text-error">-{{ formatCurrency(invoice.discount_amount) }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">IVA ({{ invoice.vat_rate || 22 }}%)</span>
                <span class="font-weight-medium">{{ formatCurrency(invoice.vat_amount || 0) }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between">
                <span class="text-h6">Totale</span>
                <span class="text-h5 font-weight-bold text-primary">
                  {{ formatCurrency(invoice.total_amount || 0) }}
                </span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Status Card -->
          <v-card class="mb-4 no-print">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-progress-check</v-icon>
              Stato Fattura
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
          <v-card class="mb-4 no-print">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
              Azioni Rapide
            </v-card-title>
            <v-divider />
            <v-card-text class="d-flex flex-column ga-2">
              <v-btn
                block
                variant="outlined"
                prepend-icon="mdi-printer"
                @click="printInvoice"
              >
                Stampa Fattura
              </v-btn>
              <v-btn
                block
                variant="outlined"
                prepend-icon="mdi-content-duplicate"
                @click="duplicateInvoice"
              >
                Duplica Fattura
              </v-btn>
              <v-btn
                v-if="invoice.status !== 'cancelled'"
                block
                variant="outlined"
                color="warning"
                prepend-icon="mdi-close-circle"
                @click="cancelInvoice"
              >
                Annulla Fattura
              </v-btn>
              <v-btn
                block
                variant="outlined"
                color="error"
                prepend-icon="mdi-delete"
                @click="confirmDelete"
              >
                Elimina Fattura
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Timestamps Card -->
          <v-card class="no-print">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-clock-outline</v-icon>
              Cronologia
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption text-grey">Creata</span>
                <span class="text-caption">{{ formatDateTime(invoice.created_at) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption text-grey">Ultimo aggiornamento</span>
                <span class="text-caption">{{ formatDateTime(invoice.updated_at) }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Not Found State -->
    <v-card v-else class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-file-document-remove</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Fattura non trovata</h3>
      <p class="text-grey mb-4">La fattura richiesta non esiste o è stata eliminata.</p>
      <v-btn color="primary" to="/invoices">
        Torna alle Fatture
      </v-btn>
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
              {{ formatCurrency(invoice?.total_amount || 0) }}
            </div>
            <div class="text-grey">{{ invoice?.invoice_number }}</div>
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
          Sei sicuro di voler eliminare la fattura
          <strong>{{ invoice?.invoice_number }}</strong>?
          <br><br>
          <span class="text-caption text-grey">Questa azione non può essere annullata.</span>
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
const route = useRoute()
const router = useRouter()
const { getInvoice, updateInvoice, markAsPaid, deleteInvoice } = useInvoices()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const invoice = ref<any>(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const selectedStatus = ref('')
const paymentDialog = ref(false)
const paymentDate = ref(new Date().toISOString().split('T')[0])
const paymentMethod = ref('Bonifico')
const processingPayment = ref(false)

const invoiceId = computed(() => route.params.id as string)

const paymentMethods = ['Contanti', 'Bonifico', 'Carta di Credito', 'Assegno', 'POS', 'PayPal']

const statuses = [
  { title: 'Bozza', value: 'draft', icon: 'mdi-file-edit-outline' },
  { title: 'Inviata', value: 'sent', icon: 'mdi-send' },
  { title: 'Pagata', value: 'paid', icon: 'mdi-check-circle' },
  { title: 'Scaduta', value: 'overdue', icon: 'mdi-alert' },
  { title: 'Annullata', value: 'cancelled', icon: 'mdi-close-circle' }
]

// Computed
const isOverdue = computed(() => {
  if (!invoice.value?.due_date) return false
  return new Date(invoice.value.due_date) < new Date()
})

const daysOverdue = computed(() => {
  if (!invoice.value?.due_date) return 0
  const diff = new Date().getTime() - new Date(invoice.value.due_date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

// Load data
onMounted(async () => {
  try {
    invoice.value = await getInvoice(invoiceId.value)
    selectedStatus.value = invoice.value?.status || 'draft'
  } catch (error) {
    console.error('Error loading invoice:', error)
  } finally {
    loading.value = false
  }
})

// Helper functions
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateStr))
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateStr))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount || 0)
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

const getItemTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    labor: 'Manodopera',
    part: 'Ricambio',
    service: 'Servizio'
  }
  return labels[type] || type
}

const getDueDateColor = () => {
  if (!invoice.value) return 'grey'
  if (invoice.value.status === 'paid') return 'success'
  if (invoice.value.status === 'cancelled') return 'grey'
  if (isOverdue.value) return 'error'

  const daysUntil = Math.ceil((new Date(invoice.value.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntil <= 7) return 'warning'
  return 'grey'
}

// Actions
const updateStatus = async (newStatus: string) => {
  if (!invoice.value) return
  try {
    await updateInvoice(invoice.value.id, { status: newStatus })
    invoice.value.status = newStatus
    showSnackbar('Stato aggiornato con successo', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'aggiornamento', 'error')
    selectedStatus.value = invoice.value.status
  }
}

const openPaymentDialog = () => {
  paymentDate.value = new Date().toISOString().split('T')[0]
  paymentMethod.value = 'Bonifico'
  paymentDialog.value = true
}

const confirmPayment = async () => {
  if (!invoice.value) return

  processingPayment.value = true
  try {
    await markAsPaid(invoice.value.id, paymentDate.value, paymentMethod.value)
    invoice.value.status = 'paid'
    invoice.value.payment_date = paymentDate.value
    invoice.value.payment_method = paymentMethod.value
    selectedStatus.value = 'paid'
    showSnackbar('Pagamento registrato con successo', 'success')
    paymentDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante la registrazione', 'error')
  } finally {
    processingPayment.value = false
  }
}

const sendInvoice = async () => {
  if (!invoice.value) return
  try {
    await updateInvoice(invoice.value.id, { status: 'sent' })
    invoice.value.status = 'sent'
    selectedStatus.value = 'sent'
    showSnackbar('Fattura inviata', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'invio', 'error')
  }
}

const cancelInvoice = async () => {
  if (!invoice.value) return
  try {
    await updateInvoice(invoice.value.id, { status: 'cancelled' })
    invoice.value.status = 'cancelled'
    selectedStatus.value = 'cancelled'
    showSnackbar('Fattura annullata', 'success')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'annullamento', 'error')
  }
}

const duplicateInvoice = () => {
  showSnackbar('Funzionalità in arrivo', 'info')
}

const printInvoice = () => {
  window.print()
}

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteInvoiceConfirm = async () => {
  if (!invoice.value) return

  deleting.value = true
  try {
    await deleteInvoice(invoice.value.id)
    showSnackbar('Fattura eliminata con successo', 'success')
    router.push('/invoices')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
