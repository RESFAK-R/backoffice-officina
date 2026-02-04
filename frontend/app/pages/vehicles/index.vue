<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Veicoli</h1>
        <p class="page-subtitle">Gestisci il parco veicoli dei tuoi clienti</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/vehicles/new">
        Nuovo Veicolo
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6" lg="4">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              placeholder="Cerca per targa, marca, modello, telaio..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3" lg="2">
            <v-select
              v-model="filterFuel"
              density="compact"
              variant="outlined"
              :items="fuelTypes"
              item-title="title"
              item-value="value"
              label="Alimentazione"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3" lg="2">
            <v-select
              v-model="filterBrand"
              density="compact"
              variant="outlined"
              :items="availableBrands"
              label="Marca"
              hide-details
              clearable
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
        :items="filteredVehicles"
        :search="search"
        :items-per-page="10"
        hover
        class="elevation-0"
      >
        <template #item.vehicle="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" variant="tonal" size="48" class="mr-3">
              <v-icon>mdi-car</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.brand }} {{ item.model }}</div>
              <div class="text-caption text-grey">
                {{ item.year || '-' }} • {{ item.color || '-' }}
              </div>
            </div>
          </div>
        </template>

        <template #item.plate="{ item }">
          <v-chip variant="outlined" class="font-weight-bold">
            {{ item.plate }}
          </v-chip>
        </template>

        <template #item.customer="{ item }">
          <NuxtLink :to="`/customers/${item.customers?.id}`" class="text-primary font-weight-medium">
            {{ item.customers?.name || '-' }}
          </NuxtLink>
        </template>

        <template #item.fuel_type="{ item }">
          <v-chip v-if="item.fuel_type" :color="getFuelColor(item.fuel_type)" size="small" label>
            {{ getFuelLabel(item.fuel_type) }}
          </v-chip>
          <span v-else class="text-grey">-</span>
        </template>

        <template #item.mileage="{ item }">
          <span v-if="item.mileage">{{ formatNumber(item.mileage) }} km</span>
          <span v-else class="text-grey">-</span>
        </template>

        <template #item.mot_expiry="{ item }">
          <div v-if="item.mot_expiry">
            <v-chip 
              :color="isExpiringSoon(item.mot_expiry) ? 'warning' : isExpired(item.mot_expiry) ? 'error' : 'success'"
              size="small"
              label
            >
              {{ formatDate(item.mot_expiry) }}
            </v-chip>
          </div>
          <span v-else class="text-grey">-</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/vehicles/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" :to="`/vehicles/${item.id}/edit`" />
          <v-btn icon="mdi-clipboard-plus" variant="text" size="small" color="primary" :to="`/work-orders/new?vehicle=${item.id}`" title="Nuovo Ordine" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Empty State -->
    <v-card v-if="!loading && filteredVehicles.length === 0" class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-car-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Nessun veicolo trovato</h3>
      <p class="text-grey mb-4">
        {{ search ? 'Prova a modificare i criteri di ricerca' : 'Inizia aggiungendo il primo veicolo' }}
      </p>
      <v-btn v-if="!search" color="primary" prepend-icon="mdi-plus" to="/vehicles/new">
        Aggiungi Veicolo
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
          Sei sicuro di voler eliminare il veicolo 
          <strong>{{ vehicleToDelete?.plate }} - {{ vehicleToDelete?.brand }} {{ vehicleToDelete?.model }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteVehicleConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types/database.types'

const { fetchVehicles, deleteVehicle } = useVehicles()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const vehicles = ref<any[]>([])
const search = ref('')
const filterFuel = ref<string | null>(null)
const filterBrand = ref<string | null>(null)
const deleteDialog = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)
const deleting = ref(false)

// Data
const fuelTypes = [
  { title: 'Benzina', value: 'gasoline' },
  { title: 'Diesel', value: 'diesel' },
  { title: 'GPL', value: 'lpg' },
  { title: 'Metano', value: 'methane' },
  { title: 'Ibrido', value: 'hybrid' },
  { title: 'Elettrico', value: 'electric' }
]

const headers = [
  { title: 'Veicolo', key: 'vehicle', sortable: false },
  { title: 'Targa', key: 'plate', sortable: true },
  { title: 'Proprietario', key: 'customer', sortable: false },
  { title: 'Alimentazione', key: 'fuel_type', sortable: true },
  { title: 'Chilometraggio', key: 'mileage', sortable: true },
  { title: 'Scadenza Revisione', key: 'mot_expiry', sortable: true },
  { title: 'Azioni', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const availableBrands = computed(() => {
  const brands = [...new Set(vehicles.value.map(v => v.brand).filter(Boolean))]
  return brands.sort()
})

const filteredVehicles = computed(() => {
  let result = vehicles.value
  
  if (filterFuel.value) {
    result = result.filter(v => v.fuel_type === filterFuel.value)
  }
  
  if (filterBrand.value) {
    result = result.filter(v => v.brand === filterBrand.value)
  }
  
  return result
})

// Load data
onMounted(async () => {
  try {
    vehicles.value = await fetchVehicles() || []
  } catch (error) {
    console.error('Error loading vehicles:', error)
  } finally {
    loading.value = false
  }
})

// Methods
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('it-IT').format(num)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const isExpired = (dateStr: string) => {
  return new Date(dateStr) < new Date()
}

const isExpiringSoon = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntil > 0 && daysUntil <= 30
}

const getFuelColor = (fuel: string) => {
  const colors: Record<string, string> = {
    gasoline: 'orange',
    diesel: 'brown',
    lpg: 'purple',
    methane: 'teal',
    hybrid: 'blue',
    electric: 'green'
  }
  return colors[fuel] || 'grey'
}

const getFuelLabel = (fuel: string) => {
  const labels: Record<string, string> = {
    gasoline: 'Benzina',
    diesel: 'Diesel',
    lpg: 'GPL',
    methane: 'Metano',
    hybrid: 'Ibrido',
    electric: 'Elettrico'
  }
  return labels[fuel] || fuel
}

const confirmDelete = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle
  deleteDialog.value = true
}

const deleteVehicleConfirm = async () => {
  if (!vehicleToDelete.value) return
  
  deleting.value = true
  try {
    await deleteVehicle(vehicleToDelete.value.id)
    vehicles.value = vehicles.value.filter(v => v.id !== vehicleToDelete.value!.id)
    showSnackbar('Veicolo eliminato con successo', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
