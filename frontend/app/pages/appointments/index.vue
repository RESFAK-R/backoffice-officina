<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Appuntamenti</h1>
        <p class="page-subtitle">Gestisci la programmazione degli interventi</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openNewAppointment">
        Nuovo Appuntamento
      </v-btn>
    </div>

    <!-- View Toggle & Date Navigation -->
    <v-card class="mb-6">
      <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div class="d-flex align-center ga-2">
          <v-btn-toggle v-model="viewMode" mandatory density="compact">
            <v-btn value="day" prepend-icon="mdi-calendar-today">Giorno</v-btn>
            <v-btn value="week" prepend-icon="mdi-calendar-week">Settimana</v-btn>
            <v-btn value="list" prepend-icon="mdi-view-list">Lista</v-btn>
          </v-btn-toggle>
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn icon="mdi-chevron-left" variant="text" @click="previousPeriod" />
          <v-btn variant="outlined" @click="goToToday">Oggi</v-btn>
          <span class="text-h6 font-weight-medium mx-3">{{ currentPeriodLabel }}</span>
          <v-btn icon="mdi-chevron-right" variant="text" @click="nextPeriod" />
        </div>
      </v-card-text>
    </v-card>

    <!-- Day View -->
    <template v-if="viewMode === 'day'">
      <v-card>
        <v-card-title class="text-h6">
          {{ formatDateFull(currentDate) }}
        </v-card-title>
        <v-divider />
        
        <div class="day-schedule">
          <div 
            v-for="hour in workingHours" 
            :key="hour"
            class="hour-slot"
            @click="openNewAppointmentAt(hour)"
          >
            <div class="hour-label">{{ formatHour(hour) }}</div>
            <div class="hour-appointments">
              <div
                v-for="appointment in getAppointmentsForHour(hour)"
                :key="appointment.id"
                class="appointment-block"
                :class="appointment.status"
                :style="{ height: `${(appointment.duration_minutes / 60) * 60}px` }"
                @click.stop="openAppointment(appointment)"
              >
                <div class="font-weight-bold">{{ formatTime(appointment.scheduled_at) }}</div>
                <div>{{ appointment.customers?.name }}</div>
                <div class="text-caption">{{ appointment.service_type }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </template>

    <!-- Week View -->
    <template v-else-if="viewMode === 'week'">
      <v-card>
        <div class="week-grid">
          <div class="week-header">
            <div class="time-column"></div>
            <div 
              v-for="day in weekDays" 
              :key="day.date"
              class="day-column-header"
              :class="{ today: isToday(day.date) }"
            >
              <div class="text-caption">{{ day.dayName }}</div>
              <div class="text-h6">{{ day.dayNumber }}</div>
            </div>
          </div>
          
          <div class="week-body">
            <div class="time-column">
              <div v-for="hour in workingHours" :key="hour" class="hour-label-small">
                {{ formatHour(hour) }}
              </div>
            </div>
            
            <div 
              v-for="day in weekDays" 
              :key="day.date"
              class="day-column"
              :class="{ today: isToday(day.date) }"
            >
              <div
                v-for="appointment in getAppointmentsForDay(day.date)"
                :key="appointment.id"
                class="week-appointment"
                :class="appointment.status"
                :style="getAppointmentStyle(appointment)"
                @click="openAppointment(appointment)"
              >
                <div class="text-caption font-weight-bold">{{ formatTime(appointment.scheduled_at) }}</div>
                <div class="text-caption text-truncate">{{ appointment.customers?.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </template>

    <!-- List View -->
    <template v-else>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="appointments"
          :items-per-page="15"
          hover
          class="elevation-0"
        >
          <template #item.scheduled_at="{ item }">
            <div>
              <div class="font-weight-bold">{{ formatDateShort(item.scheduled_at) }}</div>
              <div class="text-caption text-grey">{{ formatTime(item.scheduled_at) }}</div>
            </div>
          </template>

          <template #item.customer="{ item }">
            <div class="d-flex align-center">
              <v-avatar color="primary" variant="tonal" size="36" class="mr-2">
                <v-icon size="small">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.customers?.name }}</div>
                <div class="text-caption text-grey">{{ item.customers?.phone }}</div>
              </div>
            </div>
          </template>

          <template #item.vehicle="{ item }">
            <div v-if="item.vehicles">
              {{ item.vehicles.plate }} - {{ item.vehicles.brand }} {{ item.vehicles.model }}
            </div>
            <span v-else class="text-grey">-</span>
          </template>

          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small" label>
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon="mdi-pencil" variant="text" size="small" @click="openAppointment(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(item)" />
          </template>
        </v-data-table>
      </v-card>
    </template>

    <!-- Appointment Dialog -->
    <v-dialog v-model="dialogOpen" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
          {{ editingAppointment?.id ? 'Modifica Appuntamento' : 'Nuovo Appuntamento' }}
        </v-card-title>
        <v-divider />
        
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Customer -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="appointmentForm.customer_id"
                  :items="customersForSelect"
                  item-title="name"
                  item-value="id"
                  label="Cliente *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <!-- Vehicle -->
              <v-col cols="12">
                <v-select
                  v-model="appointmentForm.vehicle_id"
                  :items="customerVehicles"
                  item-title="label"
                  item-value="id"
                  label="Veicolo"
                  prepend-inner-icon="mdi-car"
                  clearable
                />
              </v-col>

              <!-- Date & Time -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="appointmentDate"
                  type="date"
                  label="Data *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="appointmentTime"
                  type="time"
                  label="Ora *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-clock"
                />
              </v-col>

              <!-- Duration -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="appointmentForm.duration_minutes"
                  :items="durations"
                  label="Durata"
                  prepend-inner-icon="mdi-timer"
                />
              </v-col>

              <!-- Service Type -->
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="appointmentForm.service_type"
                  :items="serviceTypes"
                  label="Tipo Servizio *"
                  :rules="[v => !!v || 'Campo obbligatorio']"
                  prepend-inner-icon="mdi-wrench"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6" v-if="editingAppointment?.id">
                <v-select
                  v-model="appointmentForm.status"
                  :items="statuses"
                  item-title="title"
                  item-value="value"
                  label="Stato"
                  prepend-inner-icon="mdi-flag"
                />
              </v-col>

              <!-- Notes -->
              <v-col cols="12">
                <v-textarea
                  v-model="appointmentForm.notes"
                  label="Note"
                  rows="2"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn variant="text" @click="dialogOpen = false">Annulla</v-btn>
          <v-spacer />
          <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="saveAppointment">
            {{ editingAppointment?.id ? 'Aggiorna' : 'Crea' }} Appuntamento
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
          Sei sicuro di voler eliminare questo appuntamento?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteAppointmentConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { addDays, startOfWeek, format, isSameDay, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'

const { fetchAppointments, createAppointment, updateAppointment, deleteAppointment: deleteAppointmentApi } = useAppointments()
const { fetchCustomers } = useCustomers()
const { getVehiclesByCustomer } = useVehicles()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const viewMode = ref('week')
const currentDate = ref(new Date())
const appointments = ref<any[]>([])
const customers = ref<any[]>([])
const customerVehicles = ref<any[]>([])
const dialogOpen = ref(false)
const deleteDialog = ref(false)
const editingAppointment = ref<any>(null)
const appointmentToDelete = ref<any>(null)
const formValid = ref(false)
const saving = ref(false)
const deleting = ref(false)
const form = ref()

// Form data
const appointmentForm = ref({
  customer_id: '',
  vehicle_id: null as string | null,
  duration_minutes: 60,
  service_type: '',
  status: 'scheduled',
  notes: ''
})
const appointmentDate = ref('')
const appointmentTime = ref('')

// Constants
const workingHours = Array.from({ length: 10 }, (_, i) => 8 + i) // 8:00 - 17:00

const durations = [
  { title: '30 minuti', value: 30 },
  { title: '1 ora', value: 60 },
  { title: '1.5 ore', value: 90 },
  { title: '2 ore', value: 120 },
  { title: '3 ore', value: 180 },
  { title: '4 ore', value: 240 }
]

const serviceTypes = [
  'Tagliando',
  'Cambio Olio',
  'Revisione',
  'Diagnosi',
  'Riparazione Freni',
  'Cambio Gomme',
  'Manutenzione Ordinaria',
  'Manutenzione Straordinaria',
  'Carrozzeria',
  'Altro'
]

const statuses = [
  { title: 'Prenotato', value: 'scheduled' },
  { title: 'Confermato', value: 'confirmed' },
  { title: 'Arrivato', value: 'arrived' },
  { title: 'Completato', value: 'completed' },
  { title: 'Annullato', value: 'cancelled' },
  { title: 'Non Presentato', value: 'no_show' }
]

const headers = [
  { title: 'Data/Ora', key: 'scheduled_at', sortable: true },
  { title: 'Cliente', key: 'customer', sortable: false },
  { title: 'Veicolo', key: 'vehicle', sortable: false },
  { title: 'Servizio', key: 'service_type', sortable: true },
  { title: 'Durata', key: 'duration_minutes', sortable: true },
  { title: 'Stato', key: 'status', sortable: true },
  { title: 'Azioni', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'day') {
    return format(currentDate.value, 'EEEE d MMMM yyyy', { locale: it })
  } else {
    const start = startOfWeek(currentDate.value, { weekStartsOn: 1 })
    const end = addDays(start, 6)
    return `${format(start, 'd MMM', { locale: it })} - ${format(end, 'd MMM yyyy', { locale: it })}`
  }
})

const weekDays = computed(() => {
  const start = startOfWeek(currentDate.value, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i)
    return {
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE', { locale: it }),
      dayNumber: format(date, 'd')
    }
  })
})

const customersForSelect = computed(() => {
  return customers.value.map(c => ({
    id: c.id,
    name: c.name
  }))
})

// Watch customer selection to load vehicles
watch(() => appointmentForm.value.customer_id, async (customerId) => {
  if (customerId) {
    try {
      const vehicles = await getVehiclesByCustomer(customerId)
      customerVehicles.value = (vehicles || []).map(v => ({
        id: v.id,
        label: `${v.plate} - ${v.brand} ${v.model}`
      }))
    } catch (e) {
      customerVehicles.value = []
    }
  } else {
    customerVehicles.value = []
  }
})

// Load data
onMounted(async () => {
  try {
    const [appointmentsData, customersData] = await Promise.all([
      fetchAppointments(),
      fetchCustomers()
    ])
    appointments.value = appointmentsData || []
    customers.value = customersData || []
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

// Methods
const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`
const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm')
const formatDateShort = (dateStr: string) => format(new Date(dateStr), 'd MMM yyyy', { locale: it })
const formatDateFull = (date: Date) => format(date, 'EEEE d MMMM yyyy', { locale: it })
const isToday = (dateStr: string) => isSameDay(parseISO(dateStr), new Date())

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'primary',
    confirmed: 'info',
    arrived: 'warning',
    completed: 'success',
    cancelled: 'error',
    no_show: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    scheduled: 'Prenotato',
    confirmed: 'Confermato',
    arrived: 'Arrivato',
    completed: 'Completato',
    cancelled: 'Annullato',
    no_show: 'Non Presentato'
  }
  return labels[status] || status
}

const previousPeriod = () => {
  currentDate.value = addDays(currentDate.value, viewMode.value === 'day' ? -1 : -7)
}

const nextPeriod = () => {
  currentDate.value = addDays(currentDate.value, viewMode.value === 'day' ? 1 : 7)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const getAppointmentsForHour = (hour: number) => {
  const dateStr = format(currentDate.value, 'yyyy-MM-dd')
  return appointments.value.filter(a => {
    const apptDate = new Date(a.scheduled_at)
    return format(apptDate, 'yyyy-MM-dd') === dateStr && apptDate.getHours() === hour
  })
}

const getAppointmentsForDay = (dateStr: string) => {
  return appointments.value.filter(a => {
    const apptDate = new Date(a.scheduled_at)
    return format(apptDate, 'yyyy-MM-dd') === dateStr
  })
}

const getAppointmentStyle = (appointment: any) => {
  const date = new Date(appointment.scheduled_at)
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const top = ((hour - 8) * 60 + minutes) * (60 / 60) // 60px per hour
  const height = (appointment.duration_minutes / 60) * 60
  return {
    top: `${top}px`,
    height: `${height}px`
  }
}

const openNewAppointment = () => {
  editingAppointment.value = null
  Object.assign(appointmentForm.value, {
    customer_id: '',
    vehicle_id: null,
    duration_minutes: 60,
    service_type: '',
    status: 'scheduled',
    notes: ''
  })
  appointmentDate.value = format(new Date(), 'yyyy-MM-dd')
  appointmentTime.value = '09:00'
  dialogOpen.value = true
}

const openNewAppointmentAt = (hour: number) => {
  openNewAppointment()
  appointmentDate.value = format(currentDate.value, 'yyyy-MM-dd')
  appointmentTime.value = formatHour(hour)
}

const openAppointment = (appointment: any) => {
  editingAppointment.value = appointment
  Object.assign(appointmentForm.value, {
    customer_id: appointment.customer_id,
    vehicle_id: appointment.vehicle_id,
    duration_minutes: appointment.duration_minutes,
    service_type: appointment.service_type,
    status: appointment.status,
    notes: appointment.notes || ''
  })
  const date = new Date(appointment.scheduled_at)
  appointmentDate.value = format(date, 'yyyy-MM-dd')
  appointmentTime.value = format(date, 'HH:mm')
  dialogOpen.value = true
}

const saveAppointment = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const scheduled_at = `${appointmentDate.value}T${appointmentTime.value}:00`
    const data = {
      ...appointmentForm.value,
      scheduled_at
    }

    if (editingAppointment.value?.id) {
      const updated = await updateAppointment(editingAppointment.value.id, data)
      const index = appointments.value.findIndex(a => a.id === updated.id)
      if (index !== -1) {
        appointments.value[index] = updated
      }
      showSnackbar('Appuntamento aggiornato', 'success')
    } else {
      const created = await createAppointment(data)
      appointments.value.push(created)
      showSnackbar('Appuntamento creato', 'success')
    }
    dialogOpen.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (appointment: any) => {
  appointmentToDelete.value = appointment
  deleteDialog.value = true
}

const deleteAppointmentConfirm = async () => {
  if (!appointmentToDelete.value) return
  
  deleting.value = true
  try {
    await deleteAppointmentApi(appointmentToDelete.value.id)
    appointments.value = appointments.value.filter(a => a.id !== appointmentToDelete.value.id)
    showSnackbar('Appuntamento eliminato', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.day-schedule {
  position: relative;
}

.hour-slot {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  min-height: 60px;
  cursor: pointer;
  transition: background 0.2s;
}

.hour-slot:hover {
  background: #f8fafc;
}

.hour-label {
  width: 80px;
  padding: 8px 16px;
  color: #64748b;
  font-size: 0.875rem;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.hour-appointments {
  flex: 1;
  position: relative;
  padding: 4px;
}

.appointment-block {
  background: #dbeafe;
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.appointment-block:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.appointment-block.confirmed { background: #cffafe; border-color: #06b6d4; }
.appointment-block.arrived { background: #fef3c7; border-color: #f59e0b; }
.appointment-block.completed { background: #d1fae5; border-color: #10b981; }
.appointment-block.cancelled { background: #fee2e2; border-color: #ef4444; }

/* Week View */
.week-grid {
  overflow-x: auto;
}

.week-header {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.week-header .time-column {
  width: 60px;
  flex-shrink: 0;
}

.day-column-header {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  min-width: 100px;
}

.day-column-header.today {
  background: #eff6ff;
}

.week-body {
  display: flex;
  position: relative;
  height: 600px;
}

.week-body .time-column {
  width: 60px;
  flex-shrink: 0;
  border-right: 1px solid #e2e8f0;
}

.hour-label-small {
  height: 60px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.day-column {
  flex: 1;
  position: relative;
  min-width: 100px;
  border-right: 1px solid #e2e8f0;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 59px,
    #e2e8f0 59px,
    #e2e8f0 60px
  );
}

.day-column.today {
  background-color: rgba(239, 246, 255, 0.5);
}

.week-appointment {
  position: absolute;
  left: 2px;
  right: 2px;
  background: #dbeafe;
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
}

.week-appointment:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.week-appointment.confirmed { background: #cffafe; border-color: #06b6d4; }
.week-appointment.arrived { background: #fef3c7; border-color: #f59e0b; }
.week-appointment.completed { background: #d1fae5; border-color: #10b981; }
.week-appointment.cancelled { background: #fee2e2; border-color: #ef4444; }
</style>
