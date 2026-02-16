<template>
  <div class="page-container">
    <!-- Loading -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="card" class="mb-4" />
      <v-skeleton-loader type="card" />
    </div>

    <template v-else-if="car">
      <!-- Header -->
      <div class="page-header">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" to="/car-sales" />
          <div>
            <h1 class="page-title">{{ car.brand }} {{ car.model }}</h1>
            <p class="page-subtitle">{{ car.trim || '' }} · {{ car.year }}</p>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-pencil"
            :to="`/car-sales/new?edit=${car.id}`"
          >
            Modifica
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Image -->
          <v-card class="mb-4">
            <div v-if="car.image_urls?.length" class="position-relative">
              <v-carousel height="400" show-arrows hide-delimiters v-if="car.image_urls.length > 1">
                <v-carousel-item v-for="(img, i) in car.image_urls" :key="i">
                  <v-img :src="img" height="400" cover />
                </v-carousel-item>
              </v-carousel>
              <v-img v-else :src="car.image_urls[0]" height="400" cover />
            </div>
            <div v-else class="bg-grey-lighten-3 d-flex align-center justify-center" style="height: 300px">
              <v-icon size="80" color="grey-lighten-1">mdi-car</v-icon>
            </div>
          </v-card>

          <!-- Dettagli Veicolo -->
          <v-card class="mb-4">
            <v-card-title><v-icon class="mr-2">mdi-car-info</v-icon>Dettagli Veicolo</v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="6" md="4" v-for="field in vehicleFields" :key="field.label">
                  <div class="text-caption text-grey mb-1">{{ field.label }}</div>
                  <div class="font-weight-medium">{{ field.value || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Specifiche Tecniche -->
          <v-card class="mb-4">
            <v-card-title><v-icon class="mr-2">mdi-speedometer</v-icon>Specifiche Tecniche</v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="6" md="3" v-for="field in techFields" :key="field.label">
                  <div class="text-caption text-grey mb-1">{{ field.label }}</div>
                  <div class="font-weight-medium">{{ field.value || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dotazioni -->
          <v-card class="mb-4" v-if="car.equipment?.length">
            <v-card-title><v-icon class="mr-2">mdi-format-list-checks</v-icon>Dotazioni</v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6" v-for="(item, idx) in car.equipment" :key="idx">
                  <div class="d-flex align-center py-1">
                    <v-icon size="small" color="success" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ item }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Descrizione -->
          <v-card v-if="car.description" class="mb-4">
            <v-card-title><v-icon class="mr-2">mdi-text</v-icon>Descrizione</v-card-title>
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-line">{{ car.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Prezzo e Status -->
          <v-card class="mb-4">
            <v-card-text>
              <div class="text-h4 font-weight-bold text-primary mb-4">
                {{ formatCurrency(car.price) }}
              </div>
              <v-chip :color="getStatusColor(car.status)" label size="large" class="mb-4">
                {{ getStatusLabel(car.status) }}
              </v-chip>
              <div v-if="car.featured" class="d-flex align-center text-amber mb-3">
                <v-icon color="amber" class="mr-1">mdi-star</v-icon>
                <span class="text-body-2 font-weight-medium">In Evidenza sul sito</span>
              </div>
              <v-divider class="my-3" />
              <div class="text-caption text-grey">
                Pubblicata il {{ formatDate(car.created_at) }}
              </div>
              <div class="text-caption text-grey" v-if="car.updated_at !== car.created_at">
                Ultima modifica il {{ formatDate(car.updated_at) }}
              </div>
            </v-card-text>
          </v-card>

          <!-- Azioni Rapide -->
          <v-card class="mb-4">
            <v-card-title><v-icon class="mr-2">mdi-lightning-bolt</v-icon>Azioni Rapide</v-card-title>
            <v-card-text>
              <div class="d-flex flex-column ga-2">
                <v-btn
                  v-if="car.status === 'available'"
                  color="warning"
                  variant="outlined"
                  block
                  prepend-icon="mdi-bookmark"
                  @click="changeStatus('reserved')"
                  :loading="changingStatus"
                >
                  Segna come Prenotata
                </v-btn>
                <v-btn
                  v-if="car.status === 'available' || car.status === 'reserved'"
                  color="success"
                  variant="outlined"
                  block
                  prepend-icon="mdi-check-circle"
                  @click="changeStatus('sold')"
                  :loading="changingStatus"
                >
                  Segna come Venduta
                </v-btn>
                <v-btn
                  v-if="car.status !== 'available'"
                  color="primary"
                  variant="outlined"
                  block
                  prepend-icon="mdi-refresh"
                  @click="changeStatus('available')"
                  :loading="changingStatus"
                >
                  Rimetti in Vendita
                </v-btn>
                <v-divider class="my-1" />
                <v-btn
                  color="primary"
                  variant="outlined"
                  block
                  prepend-icon="mdi-pencil"
                  :to="`/car-sales/new?edit=${car.id}`"
                >
                  Modifica
                </v-btn>
                <v-btn
                  color="error"
                  variant="text"
                  block
                  prepend-icon="mdi-delete"
                  @click="deleteDialog = true"
                >
                  Elimina
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Conferma Eliminazione
        </v-card-title>
        <v-card-text>
          Sei sicuro di voler eliminare <strong>{{ car?.brand }} {{ car?.model }}</strong>?
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
const route = useRoute()
const router = useRouter()
const { getCar, updateCarStatus, deleteCar } = useCarsForSale()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

const loading = ref(true)
const car = ref<any>(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const changingStatus = ref(false)
const carId = route.params.id as string

onMounted(async () => {
  try {
    car.value = await getCar(carId)
  } catch (e: any) {
    showSnackbar('Auto non trovata', 'error')
    router.push('/car-sales')
  } finally {
    loading.value = false
  }
})

const vehicleFields = computed(() => {
  if (!car.value) return []
  return [
    { label: 'Marca', value: car.value.brand },
    { label: 'Modello', value: car.value.model },
    { label: 'Allestimento', value: car.value.trim },
    { label: 'Anno', value: car.value.year },
    { label: 'Colore', value: car.value.color },
    { label: 'Interni', value: car.value.interior_color },
    { label: 'Carrozzeria', value: car.value.body_type },
    { label: 'Targa', value: car.value.plate },
    { label: 'Telaio VIN', value: car.value.vin },
    { label: 'Chilometri', value: car.value.mileage ? `${car.value.mileage.toLocaleString('it-IT')} km` : null },
    { label: 'Carburante', value: car.value.fuel },
    { label: 'Cambio', value: car.value.transmission }
  ]
})

const techFields = computed(() => {
  if (!car.value) return []
  return [
    { label: 'Potenza', value: car.value.power_cv ? `${car.value.power_cv} CV` : null },
    { label: 'Cilindrata', value: car.value.displacement ? `${car.value.displacement} cc` : null },
    { label: 'Porte', value: car.value.doors },
    { label: 'Posti', value: car.value.seats },
    { label: 'Emissioni', value: car.value.emissions_class },
    { label: 'Consumo', value: car.value.fuel_consumption },
    { label: '0-100 km/h', value: car.value.acceleration },
    { label: 'Velocità Max', value: car.value.top_speed }
  ]
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const getStatusColor = (s: string) => {
  return { available: 'success', reserved: 'warning', sold: 'grey' }[s] || 'grey'
}

const getStatusLabel = (s: string) => {
  return { available: 'Disponibile', reserved: 'Prenotata', sold: 'Venduta' }[s] || s
}

const changeStatus = async (status: string) => {
  changingStatus.value = true
  try {
    car.value = await updateCarStatus(carId, status)
    showSnackbar(`Stato aggiornato a "${getStatusLabel(status)}"`, 'success')
  } catch (e: any) {
    showSnackbar(e.message || 'Errore', 'error')
  } finally {
    changingStatus.value = false
  }
}

const deleteCarConfirm = async () => {
  deleting.value = true
  try {
    await deleteCar(carId)
    showSnackbar('Auto eliminata', 'success')
    router.push('/car-sales')
  } catch (e: any) {
    showSnackbar(e.message || 'Errore', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
