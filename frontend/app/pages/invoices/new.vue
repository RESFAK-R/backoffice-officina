<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="text-h5 font-weight-bold">Nuova Fattura</h1>
        <p class="text-body-2 text-medium-emphasis">Crea una nuova fattura</p>
      </div>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">Indietro</v-btn>
    </div>

    <v-container class="pa-4">
      <v-card max-width="900">
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
                  v-model.number="formData.tax_rate"
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
              <v-btn variant="text" @click="$router.back()">Annulla</v-btn>
              <v-btn type="submit" color="primary" :loading="loading" :disabled="!valid">
                Crea Fattura
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { createInvoice } = useInvoices()
const { fetchCustomers } = useCustomers()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const error = ref('')
const customers = ref<any[]>([])

const formData = ref({
  customer_id: null,
  invoice_number: '',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: '',
  subtotal: 0,
  tax_rate: 22,
  notes: ''
})

const total = computed(() => {
  return formData.value.subtotal * (1 + formData.value.tax_rate / 100)
})

onMounted(async () => {
  const data = await fetchCustomers()
  customers.value = data || []
})

const handleSubmit = async () => {
  if (!form.value) return
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  error.value = ''

  try {
    await createInvoice({
      customer_id: formData.value.customer_id,
      invoice_number: formData.value.invoice_number,
      issue_date: formData.value.issue_date,
      due_date: formData.value.due_date,
      subtotal: formData.value.subtotal,
      vat_rate: formData.value.tax_rate,
      vat_amount: formData.value.subtotal * (formData.value.tax_rate / 100),
      total_amount: total.value,
      notes: formData.value.notes,
      status: 'draft'
    })
    router.push('/invoices')
  } catch (e: any) {
    error.value = e.message || 'Errore nella creazione'
  } finally {
    loading.value = false
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
