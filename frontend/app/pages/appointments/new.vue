<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="text-h5 font-weight-bold">Nuovo Appuntamento</h1>
        <p class="text-body-2 text-medium-emphasis">Pianifica un nuovo appuntamento</p>
      </div>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">Indietro</v-btn>
    </div>

    <v-container class="pa-4">
      <v-card max-width="800">
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12">
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
                  v-model="formData.scheduled_date"
                  label="Data *"
                  type="date"
                  :rules="[v => !!v || 'Data richiesta']"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.scheduled_time"
                  label="Ora *"
                  type="time"
                  :rules="[v => !!v || 'Ora richiesta']"
                  prepend-inner-icon="mdi-clock"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="formData.service_type"
                  :items="serviceTypes"
                  label="Tipo di Servizio *"
                  :rules="[v => !!v || 'Servizio richiesto']"
                  prepend-inner-icon="mdi-wrench"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.notes"
                  label="Note"
                  rows="3"
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
                Crea Appuntamento
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
const { createAppointment } = useAppointments()
const { fetchCustomers } = useCustomers()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const error = ref('')
const customers = ref<any[]>([])

const formData = ref({
  customer_id: null,
  scheduled_date: '',
  scheduled_time: '',
  service_type: '',
  notes: ''
})

const serviceTypes = [
  'Tagliando',
  'Revisione',
  'Riparazione',
  'Cambio Gomme',
  'Diagnosi',
  'Carrozzeria',
  'Altro'
]

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
    const scheduled_at = `${formData.value.scheduled_date}T${formData.value.scheduled_time}:00`
    await createAppointment({
      customer_id: formData.value.customer_id,
      scheduled_at,
      service_type: formData.value.service_type,
      notes: formData.value.notes,
      status: 'scheduled'
    })
    router.push('/appointments')
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
