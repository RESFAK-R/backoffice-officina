<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="article, actions" />
    </div>

    <template v-else-if="invoice">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/invoices/${invoiceId}`" class="mb-2">
            Torna al dettaglio
          </v-btn>
          <h1 class="page-title">Modifica Fattura {{ invoice.invoice_number }}</h1>
          <p class="page-subtitle">Aggiorna i dati della fattura</p>
        </div>
      </div>

      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.customer_id"
                  :items="customers"
                  item-title="name"
                  item-value="id"
                  label="Cliente *"
                  :rules="[v => !!v || 'Cliente richiesto']"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.invoice_number"
                  label="Numero Fattura *"
                  :rules="[v => !!v || 'Numero richiesto']"
                  prepend-inner-icon="mdi-file-document"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.issue_date"
                  label="Data Emissione *"
                  type="date"
                  :rules="[v => !!v || 'Data richiesta']"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.due_date"
                  label="Scadenza *"
                  type="date"
                  :rules="[v => !!v || 'Scadenza richiesta']"
                  prepend-inner-icon="mdi-calendar-clock"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.subtotal"
                  label="Imponibile (€) *"
                  type="number"
                  :rules="[v => v > 0 || 'Importo richiesto']"
                  prepend-inner-icon="mdi-currency-eur"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model.number="formData.vat_rate"
                  :items="[22, 10, 4, 0]"
                  label="IVA %"
                  prepend-inner-icon="mdi-percent"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="total.toFixed(2)"
                  label="Totale (€)"
                  readonly
                  prepend-inner-icon="mdi-calculator"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status"
                  :items="statuses"
                  item-title="title"
                  item-value="value"
                  label="Stato"
                  prepend-inner-icon="mdi-tag"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.payment_method"
                  :items="paymentMethods"
                  label="Metodo di Pagamento"
                  prepend-inner-icon="mdi-credit-card"
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.notes"
                  label="Note"
                  rows="2"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>

            <v-alert v-if="error" type="error" class="mt-4" closable @click:close="error = ''">
              {{ error }}
            </v-alert>

            <div class="d-flex justify-end gap-2 mt-6">
              <v-btn variant="text" :to="`/invoices/${invoiceId}`">Annulla</v-btn>
              <v-btn type="submit" color="primary" :loading="saving" :disabled="!valid">
                Salva Modifiche
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
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
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getInvoice, updateInvoice } = useInvoices()
const { fetchCustomers } = useCustomers()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const form = ref()
const valid = ref(false)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const invoice = ref<any>(null)
const customers = ref<any[]>([])

const invoiceId = computed(() => route.params.id as string)

const statuses = [
  { title: 'Bozza', value: 'draft' },
  { title: 'Inviata', value: 'sent' },
  { title: 'Pagata', value: 'paid' },
  { title: 'Scaduta', value: 'overdue' },
  { title: 'Annullata', value: 'cancelled' }
]

const paymentMethods = ['Contanti', 'Bonifico', 'Carta di Credito', 'Assegno', 'POS', 'PayPal']

const formData = ref({
  customer_id: null as string | null,
  invoice_number: '',
  issue_date: '',
  due_date: '',
  subtotal: 0,
  vat_rate: 22,
  status: 'draft',
  payment_method: null as string | null,
  notes: ''
})

const total = computed(() => {
  return formData.value.subtotal * (1 + formData.value.vat_rate / 100)
})

// Load data
onMounted(async () => {
  try {
    const [invoiceData, customerData] = await Promise.all([
      getInvoice(invoiceId.value),
      fetchCustomers()
    ])

    invoice.value = invoiceData
    customers.value = customerData || []

    if (invoiceData) {
      formData.value = {
        customer_id: invoiceData.customer_id,
        invoice_number: invoiceData.invoice_number,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        subtotal: invoiceData.subtotal || 0,
        vat_rate: invoiceData.vat_rate || 22,
        status: invoiceData.status,
        payment_method: invoiceData.payment_method,
        notes: invoiceData.notes || ''
      }
    }
  } catch (err) {
    console.error('Error loading invoice:', err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value) return
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  saving.value = true
  error.value = ''

  try {
    await updateInvoice(invoiceId.value, {
      customer_id: formData.value.customer_id,
      invoice_number: formData.value.invoice_number,
      issue_date: formData.value.issue_date,
      due_date: formData.value.due_date,
      subtotal: formData.value.subtotal,
      vat_rate: formData.value.vat_rate,
      vat_amount: formData.value.subtotal * (formData.value.vat_rate / 100),
      total_amount: total.value,
      status: formData.value.status,
      payment_method: formData.value.payment_method,
      notes: formData.value.notes
    })
    showSnackbar('Fattura aggiornata con successo', 'success')
    router.push(`/invoices/${invoiceId.value}`)
  } catch (e: any) {
    error.value = e.message || 'Errore durante il salvataggio'
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e4e4e7;
}
</style>
