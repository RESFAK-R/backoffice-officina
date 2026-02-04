<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Magazzino</h1>
        <p class="page-subtitle">Gestisci ricambi, materiali e prodotti</p>
      </div>
      <div class="d-flex ga-3">
        <v-btn variant="outlined" prepend-icon="mdi-alert" color="warning" v-if="lowStockCount > 0" @click="filterLowStock = !filterLowStock">
          {{ lowStockCount }} sotto scorta
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openNewItem">
          Nuovo Articolo
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="border-b" flat>
      <v-card-text class="py-2 px-4">
        <v-row align="center" no-gutters class="ga-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              density="compact"
              variant="solo"
              flat
              placeholder="Cerca per nome, SKU, codice OEM..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
              class="border"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterCategory"
              density="compact"
              variant="solo"
              flat
              :items="categories"
              label="Categoria"
              hide-details
              clearable
              class="border"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterBrand"
              density="compact"
              variant="solo"
              flat
              :items="brands"
              label="Marca"
              hide-details
              clearable
              class="border"
            />
          </v-col>
          <v-col cols="auto">
            <v-switch 
              v-model="filterLowStock"
              label="Solo sotto scorta"
              hide-details
              color="warning"
              density="compact"
            />
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
        :items="filteredItems"
        :search="search"
        :items-per-page="15"
        hover
        class="elevation-0"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
              <v-icon>mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.sku }}</div>
            </div>
          </div>
        </template>

        <template #item.category="{ item }">
          <v-chip size="small" variant="outlined">{{ item.category }}</v-chip>
        </template>

        <template #item.quantity="{ item }">
          <div class="d-flex align-center ga-2">
            <v-chip 
              :color="item.quantity <= item.min_quantity ? 'error' : item.quantity <= item.min_quantity * 1.5 ? 'warning' : 'success'"
              size="small"
              label
            >
              {{ item.quantity }} {{ item.unit }}
            </v-chip>
            <span class="text-caption text-grey">min: {{ item.min_quantity }}</span>
          </div>
        </template>

        <template #item.purchase_price="{ item }">
          <span class="text-grey">{{ formatCurrency(item.purchase_price) }}</span>
        </template>

        <template #item.selling_price="{ item }">
          <span class="font-weight-bold">{{ formatCurrency(item.selling_price) }}</span>
        </template>

        <template #item.margin="{ item }">
          <v-chip 
            :color="getMarginPercentage(item) > 30 ? 'success' : getMarginPercentage(item) > 15 ? 'warning' : 'error'"
            size="small"
            label
          >
            {{ getMarginPercentage(item).toFixed(0) }}%
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-plus-minus" variant="text" size="small" @click="openStockDialog(item)" title="Aggiorna Quantità" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditItem(item)" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Empty State -->
    <v-card v-if="!loading && filteredItems.length === 0" class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-package-variant-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Nessun articolo trovato</h3>
      <p class="text-grey mb-4">
        {{ search ? 'Prova a modificare i criteri di ricerca' : 'Inizia aggiungendo il primo articolo al magazzino' }}
      </p>
      <v-btn v-if="!search" color="primary" prepend-icon="mdi-plus" @click="openNewItem">
        Aggiungi Articolo
      </v-btn>
    </v-card>

    <!-- Item Dialog -->
    <v-dialog v-model="itemDialog" max-width="700">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-package-variant</v-icon>
          {{ editingItem?.id ? 'Modifica Articolo' : 'Nuovo Articolo' }}
        </v-card-title>
        <v-divider />
        
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Name -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="itemForm.name"
                  label="Nome Articolo *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-package-variant"
                />
              </v-col>

              <!-- SKU -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="itemForm.sku"
                  label="SKU"
                  prepend-inner-icon="mdi-identifier"
                  hint="Se vuoto, verrà generato automaticamente"
                />
              </v-col>

              <!-- Category -->
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="itemForm.category"
                  :items="categories"
                  label="Categoria *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-tag"
                />
              </v-col>

              <!-- Brand -->
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="itemForm.brand"
                  :items="brands"
                  label="Marca"
                  prepend-inner-icon="mdi-factory"
                />
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="itemForm.description"
                  label="Descrizione"
                  rows="2"
                  prepend-inner-icon="mdi-text"
                />
              </v-col>

              <v-col cols="12">
                <v-divider class="my-2" />
                <h4 class="text-subtitle-1 font-weight-bold mb-3">Scorte e Prezzi</h4>
              </v-col>

              <!-- Quantity -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="itemForm.quantity"
                  type="number"
                  label="Quantità"
                  min="0"
                  prepend-inner-icon="mdi-numeric"
                />
              </v-col>

              <!-- Min Quantity -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="itemForm.min_quantity"
                  type="number"
                  label="Scorta Minima"
                  min="0"
                  prepend-inner-icon="mdi-alert"
                />
              </v-col>

              <!-- Unit -->
              <v-col cols="12" md="4">
                <v-select
                  v-model="itemForm.unit"
                  :items="units"
                  label="Unità"
                  prepend-inner-icon="mdi-ruler"
                />
              </v-col>

              <!-- Purchase Price -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="itemForm.purchase_price"
                  type="number"
                  label="Prezzo Acquisto €"
                  min="0"
                  step="0.01"
                  prepend-inner-icon="mdi-currency-eur"
                />
              </v-col>

              <!-- Selling Price -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="itemForm.selling_price"
                  type="number"
                  label="Prezzo Vendita €"
                  min="0"
                  step="0.01"
                  prepend-inner-icon="mdi-currency-eur"
                />
              </v-col>

              <v-col cols="12">
                <v-divider class="my-2" />
                <h4 class="text-subtitle-1 font-weight-bold mb-3">Informazioni Aggiuntive</h4>
              </v-col>

              <!-- Location -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="itemForm.location"
                  label="Posizione in Magazzino"
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>

              <!-- Barcode -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="itemForm.barcode"
                  label="Codice a Barre"
                  prepend-inner-icon="mdi-barcode"
                />
              </v-col>

              <!-- Supplier -->
              <v-col cols="12">
                <v-text-field
                  v-model="itemForm.supplier"
                  label="Fornitore"
                  prepend-inner-icon="mdi-truck"
                />
              </v-col>

              <!-- Compatible Vehicles -->
              <v-col cols="12">
                <v-textarea
                  v-model="itemForm.compatible_vehicles"
                  label="Veicoli Compatibili"
                  rows="2"
                  prepend-inner-icon="mdi-car"
                  hint="Es: Fiat 500 2015-2020, VW Golf VII"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn variant="text" @click="itemDialog = false">Annulla</v-btn>
          <v-spacer />
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveItem">
            {{ editingItem?.id ? 'Aggiorna' : 'Crea' }} Articolo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Stock Update Dialog -->
    <v-dialog v-model="stockDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-plus-minus</v-icon>
          Aggiorna Quantità
        </v-card-title>
        <v-divider />
        
        <v-card-text>
          <div class="text-center mb-4">
            <div class="text-h4 font-weight-bold">{{ stockItem?.quantity || 0 }}</div>
            <div class="text-grey">Quantità attuale</div>
          </div>

          <v-text-field
            v-model.number="stockChange"
            type="number"
            label="Modifica Quantità"
            hint="Usa numeri negativi per ridurre"
            persistent-hint
            prepend-inner-icon="mdi-plus-minus"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn variant="text" @click="stockDialog = false">Annulla</v-btn>
          <v-spacer />
          <v-btn color="primary" :loading="updatingStock" @click="updateStockConfirm">
            Aggiorna
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
          Sei sicuro di voler eliminare <strong>{{ itemToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteItemConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/types/database.types'

const { fetchInventory, createItem, updateItem, deleteItem, updateStock } = useInventory()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const inventory = ref<any[]>([])
const search = ref('')
const filterCategory = ref<string | null>(null)
const filterBrand = ref<string | null>(null)
const filterLowStock = ref(false)
const itemDialog = ref(false)
const stockDialog = ref(false)
const deleteDialog = ref(false)
const editingItem = ref<any>(null)
const stockItem = ref<any>(null)
const stockChange = ref(0)
const itemToDelete = ref<any>(null)
const formValid = ref(false)
const saving = ref(false)
const updatingStock = ref(false)
const deleting = ref(false)
const form = ref()

// Form data
const itemForm = ref({
  name: '',
  sku: '',
  description: '',
  category: '',
  brand: '',
  quantity: 0,
  min_quantity: 5,
  unit: 'pz',
  purchase_price: 0,
  selling_price: 0,
  location: '',
  barcode: '',
  supplier: '',
  compatible_vehicles: ''
})

const units = ['pz', 'kg', 'l', 'ml', 'm', 'cm', 'set', 'coppia']

const headers = [
  { title: 'Articolo', key: 'name', sortable: true },
  { title: 'Categoria', key: 'category', sortable: true },
  { title: 'Quantità', key: 'quantity', sortable: true },
  { title: 'Prezzo Acquisto', key: 'purchase_price', sortable: true },
  { title: 'Prezzo Vendita', key: 'selling_price', sortable: true },
  { title: 'Margine', key: 'margin', sortable: false },
  { title: 'Posizione', key: 'location', sortable: true },
  { title: 'Azioni', key: 'actions', sortable: false, align: 'end' as const }
]

// Computed
const categories = computed(() => {
  return [...new Set(inventory.value.map(i => i.category).filter(Boolean))].sort()
})

const brands = computed(() => {
  return [...new Set(inventory.value.map(i => i.brand).filter(Boolean))].sort()
})

const lowStockCount = computed(() => {
  return inventory.value.filter(i => i.quantity <= i.min_quantity).length
})

const filteredItems = computed(() => {
  let result = inventory.value
  
  if (filterCategory.value) {
    result = result.filter(i => i.category === filterCategory.value)
  }
  
  if (filterBrand.value) {
    result = result.filter(i => i.brand === filterBrand.value)
  }
  
  if (filterLowStock.value) {
    result = result.filter(i => i.quantity <= i.min_quantity)
  }
  
  return result
})

// Load data
onMounted(async () => {
  try {
    inventory.value = await fetchInventory() || []
  } catch (error) {
    console.error('Error loading inventory:', error)
  } finally {
    loading.value = false
  }
})

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getMarginPercentage = (item: any) => {
  if (!item.purchase_price || item.purchase_price === 0) return 0
  return ((item.selling_price - item.purchase_price) / item.purchase_price) * 100
}

const openNewItem = () => {
  editingItem.value = null
  Object.assign(itemForm.value, {
    name: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    quantity: 0,
    min_quantity: 5,
    unit: 'pz',
    purchase_price: 0,
    selling_price: 0,
    location: '',
    barcode: '',
    supplier: '',
    compatible_vehicles: ''
  })
  itemDialog.value = true
}

const openEditItem = (item: any) => {
  editingItem.value = item
  Object.assign(itemForm.value, {
    name: item.name,
    sku: item.sku || '',
    description: item.description || '',
    category: item.category,
    brand: item.brand || '',
    quantity: item.quantity,
    min_quantity: item.min_quantity,
    unit: item.unit,
    purchase_price: item.purchase_price,
    selling_price: item.selling_price,
    location: item.location || '',
    barcode: item.barcode || '',
    supplier: item.supplier || '',
    compatible_vehicles: item.compatible_vehicles || ''
  })
  itemDialog.value = true
}

const saveItem = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editingItem.value?.id) {
      const updated = await updateItem(editingItem.value.id, itemForm.value)
      const index = inventory.value.findIndex(i => i.id === updated.id)
      if (index !== -1) {
        inventory.value[index] = updated
      }
      showSnackbar('Articolo aggiornato', 'success')
    } else {
      const created = await createItem(itemForm.value)
      inventory.value.push(created)
      showSnackbar('Articolo creato', 'success')
    }
    itemDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}

const openStockDialog = (item: any) => {
  stockItem.value = item
  stockChange.value = 0
  stockDialog.value = true
}

const updateStockConfirm = async () => {
  if (!stockItem.value) return
  
  updatingStock.value = true
  try {
    const newQuantity = stockItem.value.quantity + stockChange.value
    await updateStock(stockItem.value.id, newQuantity)
    stockItem.value.quantity = newQuantity
    showSnackbar('Quantità aggiornata', 'success')
    stockDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'aggiornamento', 'error')
  } finally {
    updatingStock.value = false
  }
}

const confirmDelete = (item: any) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

const deleteItemConfirm = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true
  try {
    await deleteItem(itemToDelete.value.id)
    inventory.value = inventory.value.filter(i => i.id !== itemToDelete.value.id)
    showSnackbar('Articolo eliminato', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
