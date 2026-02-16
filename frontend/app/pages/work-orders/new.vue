<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/work-orders" class="mb-2">
          Torna agli ordini
        </v-btn>
        <h1 class="page-title">{{ isEdit ? 'Modifica Ordine' : 'Nuovo Ordine di Lavoro' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Aggiorna i dati dell\'ordine' : 'Crea un nuovo ordine di lavoro' }}</p>
      </div>
    </div>

    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <v-row>
        <!-- Main Content -->
        <v-col cols="12" lg="8">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-car</v-icon>
              Veicolo e Cliente
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <!-- Vehicle Selection -->
                <v-col cols="12">
                  <v-autocomplete
                    v-model="formData.vehicle_id"
                    :items="vehiclesForSelect"
                    item-title="label"
                    item-value="id"
                    label="Veicolo *"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-car"
                    :loading="loadingVehicles"
                    @update:model-value="onVehicleChange"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #subtitle>
                          {{ item.raw.customer }}
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- Selected Customer Info -->
                <v-col cols="12" v-if="selectedVehicle">
                  <v-alert type="info" variant="tonal" density="compact">
                    <strong>Cliente:</strong> {{ selectedVehicle.customerName }}
                    <span v-if="selectedVehicle.phone" class="ml-4">
                      <v-icon size="small">mdi-phone</v-icon> {{ selectedVehicle.phone }}
                    </span>
                  </v-alert>
                </v-col>

                <!-- Entry Date -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.entry_date"
                    type="date"
                    label="Data Ingresso *"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-calendar"
                  />
                </v-col>

                <!-- Estimated Completion -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.estimated_completion"
                    type="date"
                    label="Data Prevista Consegna"
                    prepend-inner-icon="mdi-calendar-check"
                  />
                </v-col>

                <!-- Mileage at Entry -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="formData.entry_mileage"
                    type="number"
                    label="Chilometraggio Ingresso"
                    suffix="km"
                    prepend-inner-icon="mdi-speedometer"
                  />
                </v-col>

                <!-- Priority -->
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.priority"
                    :items="priorities"
                    item-title="title"
                    item-value="value"
                    label="Priorità"
                    prepend-inner-icon="mdi-flag"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-wrench</v-icon>
              Descrizione Problema
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <!-- Problem Description -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.problem_description"
                    label="Descrizione del problema *"
                    :rules="[rules.required]"
                    rows="4"
                    prepend-inner-icon="mdi-alert-circle-outline"
                    placeholder="Descrivi il problema segnalato dal cliente..."
                  />
                </v-col>

                <!-- Diagnosis -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.diagnosis"
                    label="Diagnosi"
                    rows="3"
                    prepend-inner-icon="mdi-stethoscope"
                    placeholder="Risultato della diagnosi..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <span><v-icon class="mr-2">mdi-format-list-bulleted</v-icon>Lavori e Ricambi</span>
              <v-btn variant="text" color="primary" @click="addWorkItem">
                <v-icon start>mdi-plus</v-icon>Aggiungi
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div v-if="workItems.length === 0" class="text-center pa-6 text-grey">
                <v-icon size="48" class="mb-2">mdi-package-variant</v-icon>
                <div>Nessun lavoro o ricambio aggiunto</div>
                <v-btn variant="text" color="primary" class="mt-2" @click="addWorkItem">
                  Aggiungi il primo
                </v-btn>
              </div>

              <div v-else>
                <v-card
                  v-for="(item, index) in workItems"
                  :key="index"
                  variant="outlined"
                  class="mb-3 pa-3"
                >
                  <div class="d-flex align-center justify-space-between mb-2">
                    <v-chip size="small" :color="item.item_type === 'labor' ? 'primary' : 'orange'" label>
                      {{ getItemTypeLabel(item.item_type) }}
                    </v-chip>
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="removeWorkItem(index)" />
                  </div>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.description"
                        label="Descrizione"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        v-model="item.item_type"
                        :items="itemTypes"
                        item-title="title"
                        item-value="value"
                        label="Tipo"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="6" sm="3">
                      <v-text-field
                        v-model.number="item.quantity"
                        type="number"
                        label="Quantità"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        min="1"
                      />
                    </v-col>
                    <v-col cols="6" sm="3">
                      <v-text-field
                        v-model.number="item.unit_price"
                        type="number"
                        label="Prezzo"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        prefix="€"
                        step="0.01"
                      />
                    </v-col>
                    <v-col cols="12" sm="2" class="d-flex align-center justify-end">
                      <span class="text-body-1 font-weight-bold">
                        {{ formatCurrency(item.quantity * item.unit_price) }}
                      </span>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Note Aggiuntive
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-textarea
                v-model="formData.internal_notes"
                label="Note interne (non visibili al cliente)"
                rows="2"
                prepend-inner-icon="mdi-lock"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar Summary -->
        <v-col cols="12" lg="4">
          <v-card class="sticky-card">
            <v-card-title>
              <v-icon class="mr-2">mdi-calculator</v-icon>
              Riepilogo Ordine
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="d-flex justify-space-between mb-2">
                <span>Manodopera:</span>
                <strong>{{ formatCurrency(subtotalLabor) }}</strong>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Ricambi:</span>
                <strong>{{ formatCurrency(subtotalParts) }}</strong>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between mb-2">
                <span>Subtotale:</span>
                <strong>{{ formatCurrency(subtotal) }}</strong>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>IVA (22%):</span>
                <strong>{{ formatCurrency(vatAmount) }}</strong>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between text-h5">
                <span>Totale:</span>
                <strong class="text-primary">{{ formatCurrency(totalAmount) }}</strong>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions class="flex-column pa-4">
              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="saving"
                :disabled="!valid"
              >
                {{ isEdit ? 'Salva Modifiche' : 'Crea Ordine' }}
              </v-btn>
              <v-btn
                v-if="!isEdit"
                block
                variant="outlined"
                class="mt-2"
                @click="saveAndPrint"
                :loading="saving"
                :disabled="!valid"
              >
                <v-icon start>mdi-printer</v-icon>
                Crea e Stampa
              </v-btn>
              <v-btn
                block
                variant="text"
                class="mt-2"
                to="/work-orders"
              >
                Annulla
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { WorkOrderInsert, WorkOrderUpdate } from '~/types/database.types'

const route = useRoute()
const router = useRouter()
const { createWorkOrder, updateWorkOrder, getWorkOrder } = useWorkOrders()
const { fetchVehicles } = useVehicles()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const form = ref()
const valid = ref(false)
const saving = ref(false)
const loadingVehicles = ref(true)
const vehicles = ref<any[]>([])
const isEdit = computed(() => !!route.query.edit)
const orderId = computed(() => route.query.edit as string)

const formData = ref({
  vehicle_id: '',
  entry_date: new Date().toISOString().split('T')[0],
  estimated_completion: null as string | null,
  entry_mileage: null as number | null,
  priority: 'normal',
  status: 'pending',
  problem_description: '',
  diagnosis: null as string | null,
  internal_notes: null as string | null
})

interface WorkItem {
  description: string
  item_type: string
  quantity: number
  unit_price: number
}

const workItems = ref<WorkItem[]>([])

// Validation
const rules = {
  required: (v: any) => !!v || 'Campo obbligatorio'
}

// Data
const priorities = [
  { title: 'Urgente', value: 'urgent' },
  { title: 'Alta', value: 'high' },
  { title: 'Normale', value: 'normal' },
  { title: 'Bassa', value: 'low' }
]

const itemTypes = [
  { title: 'Manodopera', value: 'labor' },
  { title: 'Ricambio', value: 'part' },
  { title: 'Materiale', value: 'material' },
  { title: 'Altro', value: 'other' }
]

const getItemTypeLabel = (value: string) => {
  const found = itemTypes.find(t => t.value === value)
  return found ? found.title : value
}

// Computed
const vehiclesForSelect = computed(() => {
  return vehicles.value.map(v => ({
    id: v.id,
    label: `${v.plate} - ${v.brand} ${v.model}`,
    customer: v.customers?.name || '',
    customerName: v.customers?.name || '',
    phone: v.customers?.phone || ''
  }))
})

const selectedVehicle = computed(() => {
  if (!formData.value.vehicle_id) return null
  return vehiclesForSelect.value.find(v => v.id === formData.value.vehicle_id)
})

const subtotalLabor = computed(() => {
  return workItems.value
    .filter(i => i.item_type === 'labor')
    .reduce((sum, i) => sum + (i.quantity * i.unit_price), 0)
})

const subtotalParts = computed(() => {
  return workItems.value
    .filter(i => i.item_type !== 'labor')
    .reduce((sum, i) => sum + (i.quantity * i.unit_price), 0)
})

const subtotal = computed(() => subtotalLabor.value + subtotalParts.value)
const vatAmount = computed(() => subtotal.value * 0.22)
const totalAmount = computed(() => subtotal.value + vatAmount.value)

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const addWorkItem = () => {
  workItems.value.push({
    description: '',
    item_type: 'labor',
    quantity: 1,
    unit_price: 0
  })
}

const removeWorkItem = (index: number) => {
  workItems.value.splice(index, 1)
}

const onVehicleChange = () => {
  // Could load vehicle mileage automatically
}

// Load data
onMounted(async () => {
  try {
    vehicles.value = await fetchVehicles() || []
    
    // Check for vehicle from query params
    if (route.query.vehicle) {
      formData.value.vehicle_id = route.query.vehicle as string
    }
    
    // Load order if editing
    if (isEdit.value && orderId.value) {
      const order = await getWorkOrder(orderId.value)
      if (order) {
        Object.assign(formData.value, {
          vehicle_id: order.vehicle_id,
          entry_date: order.entry_date,
          estimated_completion: order.estimated_completion,
          entry_mileage: order.entry_mileage,
          priority: order.priority,
          status: order.status,
          problem_description: order.problem_description,
          diagnosis: order.diagnosis,
          internal_notes: order.internal_notes
        })
        // Load work items if available
        if (order.work_order_items) {
          workItems.value = order.work_order_items.map(item => ({
            description: item.description,
            item_type: item.item_type,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
        }
      }
    }
  } catch (error) {
    showSnackbar('Errore nel caricamento dei dati', 'error')
  } finally {
    loadingVehicles.value = false
  }
})

// Submit form
const submitForm = async (print = false) => {
  if (!form.value) return
  
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const orderData = {
      ...formData.value,
      labor_total: subtotalLabor.value,
      parts_total: subtotalParts.value,
      subtotal: subtotal.value,
      vat_amount: vatAmount.value,
      total_amount: totalAmount.value
    }
    
    if (isEdit.value) {
      await updateWorkOrder(orderId.value, orderData as WorkOrderUpdate)

      // Update work items: delete existing, then re-insert
      const client = useSupabaseClient()
      await client
        .from('work_order_items')
        .delete()
        .eq('work_order_id', orderId.value)

      if (workItems.value.length > 0) {
        const itemsToInsert = workItems.value
          .filter(item => item.description.trim())
          .map(item => ({
            work_order_id: orderId.value,
            description: item.description,
            item_type: item.item_type,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
          }))

        if (itemsToInsert.length > 0) {
          await client
            .from('work_order_items')
            .insert(itemsToInsert)
        }
      }

      showSnackbar('Ordine aggiornato con successo', 'success')
      router.push(`/work-orders/${orderId.value}`)
    } else {
      const newOrder = await createWorkOrder(orderData as WorkOrderInsert)

      // Save work items
      if (workItems.value.length > 0) {
        const client = useSupabaseClient()
        const itemsToInsert = workItems.value
          .filter(item => item.description.trim())
          .map(item => ({
            work_order_id: newOrder.id,
            description: item.description,
            item_type: item.item_type,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
          }))

        if (itemsToInsert.length > 0) {
          const { error: itemsError } = await client
            .from('work_order_items')
            .insert(itemsToInsert)

          if (itemsError) {
            console.error('Error saving work items:', itemsError)
          }
        }
      }

      showSnackbar('Ordine creato con successo', 'success')
      if (print) {
        router.push({ path: `/work-orders/${newOrder.id}`, query: { print: '1' } })
      } else {
        router.push(`/work-orders/${newOrder.id}`)
      }
    }
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}

const saveAndPrint = () => submitForm(true)
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 80px;
}
</style>
