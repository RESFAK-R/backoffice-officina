<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ isEditing ? 'Modifica Auto' : 'Nuova Auto in Vendita' }}</h1>
        <p class="page-subtitle">{{ isEditing ? 'Aggiorna i dettagli dell\'auto' : 'Inserisci una nuova auto nel catalogo vendita' }}</p>
      </div>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/car-sales">
        Torna alla Lista
      </v-btn>
    </div>

    <v-form ref="form" @submit.prevent="submitForm">
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Informazioni Veicolo -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-car</v-icon>
              Informazioni Veicolo
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.brand"
                    label="Marca *"
                    :rules="[v => !!v || 'Campo obbligatorio']"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.model"
                    label="Modello *"
                    :rules="[v => !!v || 'Campo obbligatorio']"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.trim"
                    label="Allestimento"
                    placeholder="es. S Line, GTI, Veloce..."
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formData.year"
                    label="Anno *"
                    type="number"
                    :rules="[v => !!v || 'Campo obbligatorio']"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.color"
                    label="Colore esterno"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.interior_color"
                    label="Colore interni"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-select
                    v-model="formData.body_type"
                    :items="bodyTypes"
                    label="Carrozzeria"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.plate"
                    label="Targa"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.vin"
                    label="Telaio (VIN)"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dati Tecnici -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-engine</v-icon>
              Dati Tecnici
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="6" md="3">
                  <v-select
                    v-model="formData.fuel"
                    :items="fuelTypes"
                    label="Carburante *"
                    :rules="[v => !!v || 'Campo obbligatorio']"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-select
                    v-model="formData.transmission"
                    :items="transmissions"
                    label="Cambio"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formData.power_cv"
                    label="Potenza (CV)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formData.displacement"
                    label="Cilindrata (cc)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formData.doors"
                    label="Porte"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formData.seats"
                    label="Posti"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Specifiche Prestazionali -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-speedometer</v-icon>
              Specifiche Prestazionali
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.emissions_class"
                    label="Classe Emissioni"
                    placeholder="es. Euro 6d"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.fuel_consumption"
                    label="Consumo"
                    placeholder="es. 5.2 L/100km"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.acceleration"
                    label="0-100 km/h"
                    placeholder="es. 7.1 s"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.top_speed"
                    label="Velocità Max"
                    placeholder="es. 240 km/h"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dotazioni -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <span><v-icon class="mr-2">mdi-format-list-checks</v-icon>Dotazioni</span>
              <v-btn variant="text" color="primary" size="small" @click="addEquipmentItem">
                <v-icon start>mdi-plus</v-icon>Aggiungi
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="equipmentItems.length === 0" class="text-center text-grey pa-4">
                <v-icon size="32" class="mb-2">mdi-playlist-plus</v-icon>
                <div>Nessuna dotazione aggiunta. Clicca "Aggiungi" per iniziare.</div>
              </div>
              <v-row v-for="(item, idx) in equipmentItems" :key="idx" dense class="mb-1">
                <v-col cols="11">
                  <v-text-field
                    v-model="equipmentItems[idx]"
                    :placeholder="`Dotazione ${idx + 1}`"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="1" class="d-flex align-center">
                  <v-btn icon="mdi-close" variant="text" size="x-small" color="error" @click="removeEquipmentItem(idx)" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Descrizione -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-text</v-icon>
              Descrizione
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="formData.description"
                rows="4"
                placeholder="Descrivi l'auto: condizioni, storia, garanzia..."
                variant="outlined"
                density="compact"
              />
            </v-card-text>
          </v-card>

          <!-- Immagini Upload -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-image-multiple</v-icon>
              Foto Auto
            </v-card-title>
            <v-card-text>
              <!-- Dropzone -->
              <div
                class="upload-dropzone"
                :class="{ 'dropzone-active': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="d-none"
                  @change="handleFileSelect"
                />
                <v-icon size="48" :color="isDragging ? 'primary' : 'grey-lighten-1'" class="mb-2">
                  mdi-cloud-upload
                </v-icon>
                <div class="text-body-1 font-weight-medium">
                  {{ isDragging ? 'Rilascia qui le foto' : 'Trascina le foto qui' }}
                </div>
                <div class="text-caption text-grey mt-1">
                  oppure clicca per selezionare • JPG, PNG, WebP • Max 5MB per foto
                </div>
              </div>

              <!-- Upload Progress -->
              <div v-if="uploading" class="mt-4">
                <v-progress-linear
                  :model-value="uploadProgress"
                  color="primary"
                  height="8"
                  rounded
                />
                <div class="text-caption text-grey mt-1 text-center">
                  Caricamento {{ uploadCurrent }} di {{ uploadTotal }}...
                </div>
              </div>

              <!-- Image Gallery -->
              <div v-if="imageUrls.length > 0" class="image-gallery mt-4">
                <draggable
                  v-model="imageUrls"
                  item-key="url"
                  class="image-grid"
                  ghost-class="ghost"
                >
                  <template #item="{ element: url, index }">
                    <div class="image-item" :class="{ 'image-primary': index === 0 }">
                      <v-img :src="url" aspect-ratio="1" cover class="rounded-lg">
                        <template #placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular indeterminate color="grey" />
                          </div>
                        </template>
                      </v-img>
                      <div class="image-overlay">
                        <v-chip v-if="index === 0" size="x-small" color="primary" class="image-badge">
                          Principale
                        </v-chip>
                        <v-btn
                          icon="mdi-delete"
                          size="x-small"
                          color="error"
                          variant="flat"
                          class="image-delete"
                          @click.stop="removeImage(index)"
                          :loading="deletingIndex === index"
                        />
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="text-caption text-grey mt-2">
                  <v-icon size="14">mdi-cursor-move</v-icon>
                  Trascina per riordinare • La prima immagine sarà quella di copertina
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Dati Vendita -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-currency-eur</v-icon>
              Dati Vendita
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="formData.price"
                label="Prezzo di Vendita (€) *"
                type="number"
                :rules="[v => !!v || 'Campo obbligatorio']"
                variant="outlined"
                density="compact"
                prefix="€"
              />
              <v-text-field
                v-model.number="formData.mileage"
                label="Chilometraggio (km)"
                type="number"
                variant="outlined"
                density="compact"
                suffix="km"
              />
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Stato"
                variant="outlined"
                density="compact"
              />
              <v-switch
                v-model="formData.featured"
                label="In Evidenza"
                color="amber"
                density="compact"
                hide-details
                class="mt-2"
              />
              <p class="text-caption text-grey mt-1 ml-12">Mostra nella homepage del sito vetrina</p>
            </v-card-text>
          </v-card>

          <!-- Anteprima Card -->
          <v-card class="mb-4" v-if="formData.brand || formData.model">
            <v-card-title>
              <v-icon class="mr-2">mdi-eye</v-icon>
              Anteprima
            </v-card-title>
            <v-card-text class="pa-0">
              <div class="preview-card">
                <div class="preview-image bg-grey-lighten-3">
                  <v-img v-if="imageUrls[0]" :src="imageUrls[0]" height="160" cover />
                  <div v-else class="d-flex align-center justify-center" style="height: 160px">
                    <v-icon size="48" color="grey-lighten-1">mdi-car</v-icon>
                  </div>
                  <v-chip v-if="formData.featured" color="amber" size="x-small" class="preview-badge">
                    In Evidenza
                  </v-chip>
                </div>
                <div class="pa-4">
                  <div class="font-weight-bold text-body-1">{{ formData.brand }} {{ formData.model }}</div>
                  <div class="text-caption text-grey" v-if="formData.trim">{{ formData.trim }}</div>
                  <div class="text-h6 text-primary font-weight-bold mt-1" v-if="formData.price">
                    {{ formatCurrency(formData.price) }}
                  </div>
                  <div class="d-flex ga-2 mt-2 flex-wrap">
                    <v-chip v-if="formData.year" size="x-small" variant="tonal">{{ formData.year }}</v-chip>
                    <v-chip v-if="formData.fuel" size="x-small" variant="tonal">{{ formData.fuel }}</v-chip>
                    <v-chip v-if="formData.power_cv" size="x-small" variant="tonal">{{ formData.power_cv }} CV</v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Actions -->
          <v-card>
            <v-card-text>
              <v-btn color="primary" block type="submit" :loading="saving" prepend-icon="mdi-content-save" size="large">
                {{ isEditing ? 'Salva Modifiche' : 'Pubblica Auto' }}
              </v-btn>
              <v-btn variant="outlined" block class="mt-2" to="/car-sales">
                Annulla
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

const route = useRoute()
const router = useRouter()
const { getCar, createCar, updateCar, uploadCarImage, deleteCarImage } = useCarsForSale()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

const form = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadCurrent = ref(0)
const uploadTotal = ref(0)
const isDragging = ref(false)
const deletingIndex = ref<number | null>(null)
const editId = computed(() => route.query.edit as string | undefined)
const isEditing = computed(() => !!editId.value)

// We use a temporary ID for new cars that haven't been saved yet
const tempCarId = ref(crypto.randomUUID())

const formData = ref({
  brand: '',
  model: '',
  trim: '',
  year: new Date().getFullYear(),
  price: null as number | null,
  mileage: 0,
  fuel: 'Benzina',
  transmission: 'Manuale',
  body_type: 'Berlina',
  color: '',
  interior_color: '',
  power_cv: null as number | null,
  displacement: null as number | null,
  doors: 5,
  seats: 5,
  plate: '',
  vin: '',
  emissions_class: '',
  fuel_consumption: '',
  acceleration: '',
  top_speed: '',
  description: '',
  status: 'available',
  featured: false
})

const equipmentItems = ref<string[]>([])
const imageUrls = ref<string[]>([])

const fuelTypes = ['Benzina', 'Diesel', 'GPL', 'Metano', 'Ibrido', 'Ibrido Plug-in', 'Elettrico']
const transmissions = ['Manuale', 'Automatica']
const bodyTypes = ['Berlina', 'Station Wagon', 'SUV', 'Coupé', 'Cabrio', 'Monovolume', 'Citycar', 'Furgone', 'Altro']
const statusOptions = [
  { title: 'Disponibile', value: 'available' },
  { title: 'Prenotata', value: 'reserved' },
  { title: 'Venduta', value: 'sold' }
]

// Load existing data in edit mode OR pre-fill from vehicle export
onMounted(async () => {
  if (editId.value) {
    try {
      const car = await getCar(editId.value)
      if (car) {
        tempCarId.value = car.id
        formData.value = {
          brand: car.brand || '',
          model: car.model || '',
          trim: car.trim || '',
          year: car.year || new Date().getFullYear(),
          price: car.price || null,
          mileage: car.mileage || 0,
          fuel: car.fuel || 'Benzina',
          transmission: car.transmission || 'Manuale',
          body_type: car.body_type || 'Berlina',
          color: car.color || '',
          interior_color: car.interior_color || '',
          power_cv: car.power_cv || null,
          displacement: car.displacement || null,
          doors: car.doors || 5,
          seats: car.seats || 5,
          plate: car.plate || '',
          vin: car.vin || '',
          emissions_class: car.emissions_class || '',
          fuel_consumption: car.fuel_consumption || '',
          acceleration: car.acceleration || '',
          top_speed: car.top_speed || '',
          description: car.description || '',
          status: car.status || 'available',
          featured: car.featured || false
        }
        equipmentItems.value = car.equipment || []
        imageUrls.value = car.image_urls || []
      }
    } catch (e) {
      showSnackbar('Errore nel caricamento dell\'auto', 'error')
      router.push('/car-sales')
    }
  } else {
    // Pre-fill from query params (vehicle export)
    const q = route.query
    if (q.brand) formData.value.brand = q.brand as string
    if (q.model) formData.value.model = q.model as string
    if (q.year) formData.value.year = Number(q.year)
    if (q.color) formData.value.color = q.color as string
    if (q.fuel) formData.value.fuel = q.fuel as string
    if (q.mileage) formData.value.mileage = Number(q.mileage)
    if (q.displacement) formData.value.displacement = Number(q.displacement)
    if (q.power_cv) formData.value.power_cv = Number(q.power_cv)
    if (q.plate) formData.value.plate = q.plate as string
    if (q.vin) formData.value.vin = q.vin as string
  }
})

// Equipment
const addEquipmentItem = () => { equipmentItems.value.push('') }
const removeEquipmentItem = (idx: number) => { equipmentItems.value.splice(idx, 1) }

// File Upload
const triggerFileInput = () => { fileInput.value?.click() }

const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) uploadFiles(Array.from(files))
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) uploadFiles(Array.from(files))
}

const uploadFiles = async (files: File[]) => {
  const validFiles = files.filter(f => {
    if (!f.type.startsWith('image/')) {
      showSnackbar(`${f.name} non è un'immagine valida`, 'warning')
      return false
    }
    if (f.size > 5 * 1024 * 1024) {
      showSnackbar(`${f.name} supera il limite di 5MB`, 'warning')
      return false
    }
    return true
  })

  if (validFiles.length === 0) return

  uploading.value = true
  uploadTotal.value = validFiles.length
  uploadCurrent.value = 0
  uploadProgress.value = 0

  const carId = editId.value || tempCarId.value

  for (const file of validFiles) {
    try {
      uploadCurrent.value++
      uploadProgress.value = (uploadCurrent.value / uploadTotal.value) * 100
      const publicUrl = await uploadCarImage(carId, file)
      imageUrls.value.push(publicUrl)
    } catch (err: any) {
      showSnackbar(`Errore upload ${file.name}: ${err.message}`, 'error')
    }
  }

  uploading.value = false
  // Reset file input
  if (fileInput.value) fileInput.value.value = ''
}

const removeImage = async (idx: number) => {
  const url = imageUrls.value[idx]
  deletingIndex.value = idx
  try {
    await deleteCarImage(url)
    imageUrls.value.splice(idx, 1)
  } catch (err: any) {
    showSnackbar(`Errore eliminazione: ${err.message}`, 'error')
  } finally {
    deletingIndex.value = null
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

const submitForm = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload = {
      ...formData.value,
      equipment: equipmentItems.value.filter(item => item.trim() !== ''),
      image_urls: imageUrls.value
    }

    if (isEditing.value) {
      await updateCar(editId.value!, payload)
      showSnackbar('Auto aggiornata con successo', 'success')
    } else {
      await createCar(payload)
      showSnackbar('Auto pubblicata con successo', 'success')
    }

    router.push('/car-sales')
  } catch (e: any) {
    showSnackbar(e.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.upload-dropzone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(var(--v-theme-on-surface), 0.02);
}
.upload-dropzone:hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.04);
}
.dropzone-active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.01);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: grab;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.image-item:active {
  cursor: grabbing;
}
.image-primary {
  border-color: rgb(var(--v-theme-primary));
}
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}
.image-item:hover .image-overlay {
  opacity: 1;
}
.image-badge {
  font-size: 10px;
}
.image-delete {
  align-self: flex-start;
}
.ghost {
  opacity: 0.4;
}

.preview-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
.preview-image {
  position: relative;
}
.preview-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
