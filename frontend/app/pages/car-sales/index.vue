<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Auto in Vendita</h1>
        <p class="page-subtitle">Gestisci le auto in vendita sul sito vetrina</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn color="primary" prepend-icon="mdi-plus" to="/car-sales/new">
          Nuova Auto
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              placeholder="Cerca marca, modello, allestimento..."
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              hide-details
              density="compact"
              clearable
              @update:model-value="loadCars"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              item-title="title"
              item-value="value"
              label="Stato"
              variant="solo-filled"
              flat
              hide-details
              density="compact"
              @update:model-value="loadCars"
            />
          </v-col>
          <v-col cols="6" md="2" class="d-flex align-center">
            <v-chip size="small" color="primary" variant="tonal">
              {{ cars.length }} auto
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="table" />
    </div>

    <!-- Table -->
    <v-card v-else>
      <v-table density="comfortable" hover>
        <thead>
          <tr>
            <th>Auto</th>
            <th>Allestimento</th>
            <th class="text-right">Prezzo</th>
            <th class="text-right">Km</th>
            <th>Carburante</th>
            <th>Stato</th>
            <th class="text-center">In Evidenza</th>
            <th class="text-right">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cars.length === 0">
            <td colspan="8" class="text-center pa-8">
              <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-car-off</v-icon>
              <div class="text-grey">Nessuna auto in vendita trovata</div>
              <v-btn variant="text" color="primary" class="mt-2" to="/car-sales/new">
                Aggiungi la prima auto
              </v-btn>
            </td>
          </tr>
          <tr
            v-for="car in cars"
            :key="car.id"
            class="cursor-pointer"
            @click="$router.push(`/car-sales/${car.id}`)"
          >
            <td>
              <div class="d-flex align-center py-2">
                <v-avatar
                  v-if="car.image_urls?.[0]"
                  size="48"
                  rounded="lg"
                  class="mr-3"
                >
                  <v-img :src="car.image_urls[0]" cover />
                </v-avatar>
                <v-avatar
                  v-else
                  size="48"
                  rounded="lg"
                  color="grey-lighten-3"
                  class="mr-3"
                >
                  <v-icon>mdi-car</v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ car.brand }} {{ car.model }}</div>
                  <div class="text-caption text-grey">{{ car.year }} · {{ car.power_cv }} CV</div>
                </div>
              </div>
            </td>
            <td>
              <span class="text-body-2">{{ car.trim || '-' }}</span>
            </td>
            <td class="text-right">
              <span class="font-weight-bold text-primary">{{ formatCurrency(car.price) }}</span>
            </td>
            <td class="text-right">
              {{ car.mileage?.toLocaleString('it-IT') || '0' }} km
            </td>
            <td>
              <v-chip size="small" :color="getFuelColor(car.fuel)" variant="tonal" label>
                {{ car.fuel }}
              </v-chip>
            </td>
            <td>
              <v-chip size="small" :color="getStatusColor(car.status)" label>
                {{ getStatusLabel(car.status) }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-icon v-if="car.featured" color="amber" size="small">mdi-star</v-icon>
              <v-icon v-else color="grey-lighten-2" size="small">mdi-star-outline</v-icon>
            </td>
            <td class="text-right" @click.stop>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
                </template>
                <v-list density="compact" width="160">
                  <v-list-item
                    prepend-icon="mdi-eye"
                    title="Dettaglio"
                    :to="`/car-sales/${car.id}`"
                  />
                  <v-list-item
                    prepend-icon="mdi-pencil"
                    title="Modifica"
                    :to="`/car-sales/new?edit=${car.id}`"
                  />
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-delete"
                    title="Elimina"
                    class="text-error"
                    @click="confirmDeleteCar(car)"
                  />
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Conferma Eliminazione
        </v-card-title>
        <v-card-text>
          Sei sicuro di voler eliminare
          <strong>{{ carToDelete?.brand }} {{ carToDelete?.model }}</strong>?
          <br><br>
          <span class="text-caption text-grey">Questa azione non può essere annullata.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteCarConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const { fetchCars, deleteCar } = useCarsForSale()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

const loading = ref(true)
const cars = ref<any[]>([])
const search = ref('')
const statusFilter = ref('all')
const deleteDialog = ref(false)
const deleting = ref(false)
const carToDelete = ref<any>(null)

const statusOptions = [
  { title: 'Tutti', value: 'all' },
  { title: 'Disponibili', value: 'available' },
  { title: 'Prenotate', value: 'reserved' },
  { title: 'Vendute', value: 'sold' }
]

const loadCars = async () => {
  loading.value = true
  cars.value = await fetchCars({
    status: statusFilter.value,
    search: search.value || undefined
  }) || []
  loading.value = false
}

onMounted(loadCars)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

const getStatusColor = (s: string) => {
  return { available: 'success', reserved: 'warning', sold: 'grey' }[s] || 'grey'
}

const getStatusLabel = (s: string) => {
  return { available: 'Disponibile', reserved: 'Prenotata', sold: 'Venduta' }[s] || s
}

const getFuelColor = (f: string) => {
  const colors: Record<string, string> = {
    'Benzina': 'orange', 'Diesel': 'blue-grey', 'GPL': 'cyan',
    'Metano': 'teal', 'Ibrido': 'green', 'Ibrido Plug-in': 'light-green', 'Elettrico': 'blue'
  }
  return colors[f] || 'grey'
}

const confirmDeleteCar = (car: any) => {
  carToDelete.value = car
  deleteDialog.value = true
}

const deleteCarConfirm = async () => {
  if (!carToDelete.value) return
  deleting.value = true
  try {
    await deleteCar(carToDelete.value.id)
    showSnackbar('Auto eliminata con successo', 'success')
    deleteDialog.value = false
    await loadCars()
  } catch (e: any) {
    showSnackbar(e.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
