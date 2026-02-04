<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/vehicles" class="mb-2">
          Torna ai veicoli
        </v-btn>
        <h1 class="page-title">{{ isEdit ? 'Modifica Veicolo' : 'Nuovo Veicolo' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Aggiorna i dati del veicolo' : 'Inserisci i dati del nuovo veicolo' }}</p>
      </div>
    </div>

    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <v-card-text>
          <v-row>
            <!-- Customer Selection -->
            <v-col cols="12">
              <v-autocomplete
                v-model="formData.customer_id"
                :items="customers"
                item-title="name"
                item-value="id"
                label="Proprietario *"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account"
                :loading="loadingCustomers"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Dati Veicolo</h3>
            </v-col>

            <!-- Plate -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.plate"
                label="Targa *"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-card-text"
                @input="formData.plate = formData.plate?.toUpperCase()"
              />
            </v-col>

            <!-- Brand -->
            <v-col cols="12" md="4">
              <v-combobox
                v-model="formData.brand"
                :items="carBrands"
                label="Marca *"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-factory"
              />
            </v-col>

            <!-- Model -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.model"
                label="Modello *"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-car"
              />
            </v-col>

            <!-- Year -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="formData.year"
                type="number"
                label="Anno"
                :min="1900"
                :max="new Date().getFullYear() + 1"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <!-- Color -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formData.color"
                label="Colore"
                prepend-inner-icon="mdi-palette"
              />
            </v-col>

            <!-- Fuel Type -->
            <v-col cols="12" md="3">
              <v-select
                v-model="formData.fuel_type"
                :items="fuelTypes"
                item-title="title"
                item-value="value"
                label="Alimentazione"
                prepend-inner-icon="mdi-gas-station"
              />
            </v-col>

            <!-- Mileage -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="formData.mileage"
                type="number"
                label="Chilometraggio"
                suffix="km"
                prepend-inner-icon="mdi-speedometer"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Dati Tecnici</h3>
            </v-col>

            <!-- VIN -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.vin"
                label="Numero di Telaio (VIN)"
                prepend-inner-icon="mdi-identifier"
                counter="17"
                maxlength="17"
              />
            </v-col>

            <!-- Engine Code -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.engine_code"
                label="Codice Motore"
                prepend-inner-icon="mdi-engine"
              />
            </v-col>

            <!-- Displacement -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="formData.displacement"
                type="number"
                label="Cilindrata"
                suffix="cc"
                prepend-inner-icon="mdi-piston"
              />
            </v-col>

            <!-- Power -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="formData.power_kw"
                type="number"
                label="Potenza"
                suffix="kW"
                prepend-inner-icon="mdi-flash"
              />
            </v-col>

            <!-- Registration Date -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.registration_date"
                type="date"
                label="Data Immatricolazione"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Scadenze</h3>
            </v-col>

            <!-- MOT Expiry -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.mot_expiry"
                type="date"
                label="Scadenza Revisione"
                prepend-inner-icon="mdi-clipboard-check"
              />
            </v-col>

            <!-- Insurance Expiry -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.insurance_expiry"
                type="date"
                label="Scadenza Assicurazione"
                prepend-inner-icon="mdi-shield-car"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Note</h3>
            </v-col>

            <!-- Notes -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.notes"
                label="Note aggiuntive"
                rows="3"
                prepend-inner-icon="mdi-note-text"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" to="/vehicles">Annulla</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :loading="saving"
            :disabled="!valid"
            size="large"
          >
            {{ isEdit ? 'Salva Modifiche' : 'Crea Veicolo' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { VehicleInsert, VehicleUpdate } from '~/types/database.types'

const route = useRoute()
const router = useRouter()
const { createVehicle, updateVehicle, getVehicle } = useVehicles()
const { fetchCustomers } = useCustomers()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const form = ref()
const valid = ref(false)
const saving = ref(false)
const loadingCustomers = ref(true)
const customers = ref<any[]>([])
const isEdit = computed(() => route.params.id && !route.path.endsWith('/new'))
const vehicleId = computed(() => route.params.id as string)

const formData = ref<VehicleInsert>({
  customer_id: '',
  plate: '',
  brand: '',
  model: '',
  year: null,
  vin: null,
  engine_code: null,
  fuel_type: null,
  displacement: null,
  power_kw: null,
  color: null,
  mileage: null,
  registration_date: null,
  mot_expiry: null,
  insurance_expiry: null,
  notes: null
})

// Validation rules
const rules = {
  required: (v: any) => !!v || 'Campo obbligatorio'
}

// Data
const fuelTypes = [
  { title: 'Benzina', value: 'gasoline' },
  { title: 'Diesel', value: 'diesel' },
  { title: 'GPL', value: 'lpg' },
  { title: 'Metano', value: 'methane' },
  { title: 'Ibrido', value: 'hybrid' },
  { title: 'Elettrico', value: 'electric' }
]

const carBrands = [
  'Alfa Romeo', 'Audi', 'BMW', 'Chevrolet', 'Citroen', 'Dacia', 'Fiat', 'Ford', 
  'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 'Lancia', 'Land Rover', 'Lexus', 
  'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 
  'Porsche', 'Renault', 'Seat', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 
  'Toyota', 'Volkswagen', 'Volvo'
]

// Load data
onMounted(async () => {
  try {
    // Load customers
    customers.value = await fetchCustomers() || []
    
    // Load vehicle if editing
    if (isEdit.value && vehicleId.value) {
      const vehicle = await getVehicle(vehicleId.value)
      if (vehicle) {
        formData.value = { ...vehicle }
      }
    }

    // Check for customer from query params
    if (route.query.customer) {
      formData.value.customer_id = route.query.customer as string
    }
  } catch (error) {
    showSnackbar('Errore nel caricamento dei dati', 'error')
  } finally {
    loadingCustomers.value = false
  }
})

// Submit form
const submitForm = async () => {
  if (!form.value) return
  
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await updateVehicle(vehicleId.value, formData.value as VehicleUpdate)
      showSnackbar('Veicolo aggiornato con successo', 'success')
    } else {
      const newVehicle = await createVehicle(formData.value)
      showSnackbar('Veicolo creato con successo', 'success')
      router.push(`/vehicles/${newVehicle.id}`)
      return
    }
    router.push('/vehicles')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}
</script>
