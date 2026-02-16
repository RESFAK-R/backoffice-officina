<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="article, actions" />
    </div>

    <!-- Vehicle Detail -->
    <template v-else-if="vehicle">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/vehicles" class="mb-2">
            Torna ai veicoli
          </v-btn>
          <div class="d-flex align-center ga-3">
            <v-avatar color="primary" variant="tonal" size="56">
              <v-icon size="32">mdi-car</v-icon>
            </v-avatar>
            <div>
              <h1 class="page-title">{{ vehicle.brand }} {{ vehicle.model }}</h1>
              <p class="page-subtitle">
                <v-chip variant="outlined" class="font-weight-bold mr-2">
                  {{ vehicle.plate }}
                </v-chip>
                {{ vehicle.year || '' }} {{ vehicle.color ? '• ' + vehicle.color : '' }}
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-tag-arrow-right"
            @click="exportDialog = true"
          >
            Metti in Vendita
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-clipboard-plus"
            :to="`/work-orders/new?vehicle=${vehicle.id}`"
          >
            Nuovo Ordine
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            :to="`/vehicles/${vehicle.id}/edit`"
          >
            Modifica
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Vehicle Info Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-car-info</v-icon>
              Dati Veicolo
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Targa</div>
                  <div class="font-weight-bold text-h6">{{ vehicle.plate }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Marca / Modello</div>
                  <div class="font-weight-medium">{{ vehicle.brand }} {{ vehicle.model }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Anno</div>
                  <div class="font-weight-medium">{{ vehicle.year || '-' }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Colore</div>
                  <div class="font-weight-medium">{{ vehicle.color || '-' }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Alimentazione</div>
                  <v-chip v-if="vehicle.fuel_type" :color="getFuelColor(vehicle.fuel_type)" size="small" label>
                    {{ getFuelLabel(vehicle.fuel_type) }}
                  </v-chip>
                  <span v-else class="text-grey">-</span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Chilometraggio</div>
                  <div class="font-weight-medium">
                    {{ vehicle.mileage ? formatNumber(vehicle.mileage) + ' km' : '-' }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Technical Data Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-engine</v-icon>
              Dati Tecnici
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey mb-1">Numero di Telaio (VIN)</div>
                  <div class="font-weight-medium font-family-monospace">{{ vehicle.vin || '-' }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey mb-1">Codice Motore</div>
                  <div class="font-weight-medium">{{ vehicle.engine_code || '-' }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Cilindrata</div>
                  <div class="font-weight-medium">
                    {{ vehicle.displacement ? formatNumber(vehicle.displacement) + ' cc' : '-' }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Potenza</div>
                  <div class="font-weight-medium">
                    {{ vehicle.power_kw ? vehicle.power_kw + ' kW' : '-' }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Data Immatricolazione</div>
                  <div class="font-weight-medium">
                    {{ vehicle.registration_date ? formatDate(vehicle.registration_date) : '-' }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Notes Card -->
          <v-card v-if="vehicle.notes" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Note
            </v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-wrap;">{{ vehicle.notes }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" lg="4">
          <!-- Owner Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Proprietario
            </v-card-title>
            <v-divider />
            <v-card-text>
              <template v-if="vehicle.customers">
                <div class="d-flex align-center mb-3">
                  <v-avatar color="primary" variant="tonal" class="mr-3">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <NuxtLink :to="`/customers/${vehicle.customers.id}`" class="text-primary font-weight-medium text-h6">
                      {{ vehicle.customers.name }}
                    </NuxtLink>
                    <div v-if="vehicle.customers.email" class="text-caption text-grey">
                      {{ vehicle.customers.email }}
                    </div>
                  </div>
                </div>
                <div v-if="vehicle.customers.phone" class="d-flex align-center mb-2">
                  <v-icon size="small" class="mr-2" color="grey">mdi-phone</v-icon>
                  <a :href="`tel:${vehicle.customers.phone}`" class="text-body-2">{{ vehicle.customers.phone }}</a>
                </div>
                <v-btn 
                  block 
                  variant="outlined" 
                  color="primary" 
                  prepend-icon="mdi-eye" 
                  :to="`/customers/${vehicle.customers.id}`"
                  class="mt-3"
                >
                  Vedi Cliente
                </v-btn>
              </template>
              <div v-else class="text-grey text-center py-4">
                <v-icon size="48">mdi-account-question</v-icon>
                <p class="mt-2">Proprietario non trovato</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Deadlines Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-calendar-clock</v-icon>
              Scadenze
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="mb-4">
                <div class="text-caption text-grey mb-1">Scadenza Revisione</div>
                <template v-if="vehicle.mot_expiry">
                  <v-chip
                    :color="isExpired(vehicle.mot_expiry) ? 'error' : isExpiringSoon(vehicle.mot_expiry) ? 'warning' : 'success'"
                    label
                  >
                    <v-icon start size="small">mdi-clipboard-check</v-icon>
                    {{ formatDate(vehicle.mot_expiry) }}
                  </v-chip>
                  <div v-if="isExpired(vehicle.mot_expiry)" class="text-caption text-error mt-1">
                    <v-icon size="small">mdi-alert</v-icon> Revisione scaduta
                  </div>
                  <div v-else-if="isExpiringSoon(vehicle.mot_expiry)" class="text-caption text-warning mt-1">
                    <v-icon size="small">mdi-alert</v-icon> In scadenza nei prossimi 30 giorni
                  </div>
                </template>
                <span v-else class="text-grey">Non impostata</span>
              </div>
              <div>
                <div class="text-caption text-grey mb-1">Scadenza Assicurazione</div>
                <template v-if="vehicle.insurance_expiry">
                  <v-chip
                    :color="isExpired(vehicle.insurance_expiry) ? 'error' : isExpiringSoon(vehicle.insurance_expiry) ? 'warning' : 'success'"
                    label
                  >
                    <v-icon start size="small">mdi-shield-car</v-icon>
                    {{ formatDate(vehicle.insurance_expiry) }}
                  </v-chip>
                  <div v-if="isExpired(vehicle.insurance_expiry)" class="text-caption text-error mt-1">
                    <v-icon size="small">mdi-alert</v-icon> Assicurazione scaduta
                  </div>
                  <div v-else-if="isExpiringSoon(vehicle.insurance_expiry)" class="text-caption text-warning mt-1">
                    <v-icon size="small">mdi-alert</v-icon> In scadenza nei prossimi 30 giorni
                  </div>
                </template>
                <span v-else class="text-grey">Non impostata</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Quick Actions Card -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
              Azioni Rapide
            </v-card-title>
            <v-divider />
            <v-card-text class="d-flex flex-column ga-2">
              <v-btn 
                block 
                color="primary"
                prepend-icon="mdi-clipboard-plus"
                :to="`/work-orders/new?vehicle=${vehicle.id}`"
              >
                Crea Ordine di Lavoro
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                prepend-icon="mdi-calendar-plus"
                :to="`/appointments/new?vehicle=${vehicle.id}`"
              >
                Prenota Appuntamento
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                color="secondary"
                prepend-icon="mdi-tag-arrow-right"
                @click="exportDialog = true"
              >
                Metti in Vendita
              </v-btn>
              <v-btn 
                block 
                variant="outlined"
                color="error"
                prepend-icon="mdi-delete"
                @click="confirmDelete"
              >
                Elimina Veicolo
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Not Found State -->
    <v-card v-else class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-car-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Veicolo non trovato</h3>
      <p class="text-grey mb-4">Il veicolo richiesto non esiste o è stato eliminato.</p>
      <v-btn color="primary" to="/vehicles">
        Torna ai Veicoli
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
          <strong>{{ vehicle?.plate }} - {{ vehicle?.brand }} {{ vehicle?.model }}</strong>?
          <br><br>
          <span class="text-caption text-grey">Questa azione non può essere annullata.</span>
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

    <!-- Export to Sale Dialog -->
    <v-dialog v-model="exportDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="secondary" class="mr-2">mdi-tag-arrow-right</v-icon>
          Metti in Vendita
        </v-card-title>
        <v-card-text>
          <p class="mb-4">
            Stai per creare un annuncio di vendita per
            <strong>{{ vehicle?.brand }} {{ vehicle?.model }}</strong> ({{ vehicle?.plate }}).
          </p>
          <p class="mb-4">I dati del veicolo verranno pre-compilati nel modulo di vendita. Potrai poi completare l'annuncio con prezzo, foto e descrizione.</p>
          <v-alert type="info" variant="tonal" density="compact" class="mb-0">
            <strong>Dati che verranno copiati:</strong> marca, modello, anno, colore, carburante, cilindrata, potenza, km, targa, telaio
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="exportDialog = false">Annulla</v-btn>
          <v-btn color="secondary" variant="flat" prepend-icon="mdi-arrow-right" @click="exportToSale">
            Crea Annuncio
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types/database.types'

const route = useRoute()
const router = useRouter()
const { getVehicle, deleteVehicle } = useVehicles()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const vehicle = ref<any>(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const exportDialog = ref(false)

const vehicleId = computed(() => route.params.id as string)

// Load vehicle data
onMounted(async () => {
  try {
    vehicle.value = await getVehicle(vehicleId.value)
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
})

// Helper functions
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('it-IT').format(num)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
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

// Delete actions
const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteVehicleConfirm = async () => {
  if (!vehicle.value) return
  
  deleting.value = true
  try {
    await deleteVehicle(vehicle.value.id)
    showSnackbar('Veicolo eliminato con successo', 'success')
    router.push('/vehicles')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}

// Export to sale
const fuelMap: Record<string, string> = {
  gasoline: 'Benzina',
  diesel: 'Diesel',
  lpg: 'GPL',
  methane: 'Metano',
  hybrid: 'Ibrido',
  electric: 'Elettrico'
}

const exportToSale = () => {
  if (!vehicle.value) return
  const v = vehicle.value

  // Build query params with vehicle data mapped to car_for_sale fields
  const params = new URLSearchParams()
  if (v.brand) params.set('brand', v.brand)
  if (v.model) params.set('model', v.model)
  if (v.year) params.set('year', String(v.year))
  if (v.color) params.set('color', v.color)
  if (v.fuel_type) params.set('fuel', fuelMap[v.fuel_type] || v.fuel_type)
  if (v.mileage) params.set('mileage', String(v.mileage))
  if (v.displacement) params.set('displacement', String(v.displacement))
  if (v.power_kw) params.set('power_cv', String(Math.round(v.power_kw * 1.36)))
  if (v.plate) params.set('plate', v.plate)
  if (v.vin) params.set('vin', v.vin)

  exportDialog.value = false
  router.push(`/car-sales/new?${params.toString()}`)
}
</script>
