<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Clienti</h1>
        <p class="page-subtitle">Gestisci l'anagrafica dei tuoi clienti</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/customers/new">
        Nuovo Cliente
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
              placeholder="Cerca per nome, email, telefono..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3" lg="2">
            <v-select
              v-model="filterType"
              density="compact"
              variant="outlined"
              :items="customerTypes"
              label="Tipo"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="auto">
            <v-btn-toggle v-model="viewMode" mandatory density="compact">
              <v-btn icon="mdi-view-list" value="list" />
              <v-btn icon="mdi-view-grid" value="grid" />
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <v-card v-if="loading" class="pa-6">
      <v-skeleton-loader type="table-heading, table-row-divider@5, table-tfoot" />
    </v-card>

    <!-- Data Table View -->
    <v-card v-else-if="viewMode === 'list'">
      <v-data-table
        :headers="headers"
        :items="filteredCustomers"
        :search="search"
        :items-per-page="10"
        hover
        class="elevation-0"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar :color="item.customer_type === 'business' ? 'primary' : 'success'" size="40" class="mr-3">
              <v-icon color="white">{{ item.customer_type === 'business' ? 'mdi-domain' : 'mdi-account' }}</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.fiscal_code || item.vat_number || '-' }}</div>
            </div>
          </div>
        </template>

        <template #item.contact="{ item }">
          <div>
            <div v-if="item.email" class="d-flex align-center mb-1">
              <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
              <a :href="`mailto:${item.email}`" class="text-primary">{{ item.email }}</a>
            </div>
            <div v-if="item.phone" class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-phone-outline</v-icon>
              <a :href="`tel:${item.phone}`" class="text-primary">{{ item.phone }}</a>
            </div>
          </div>
        </template>

        <template #item.address="{ item }">
          <div v-if="item.city">
            {{ item.city }}<span v-if="item.province"> ({{ item.province }})</span>
          </div>
          <div v-else class="text-grey">-</div>
        </template>

        <template #item.customer_type="{ item }">
          <v-chip :color="item.customer_type === 'business' ? 'primary' : 'success'" size="small" label>
            {{ item.customer_type === 'business' ? 'Azienda' : 'Privato' }}
          </v-chip>
        </template>

        <template #item.vehicles_count="{ item }">
          <v-chip size="small" variant="outlined">
            {{ item.vehicles?.length || 0 }} veicoli
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/customers/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" :to="`/customers/${item.id}/edit`" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Grid View -->
    <v-row v-else>
      <v-col v-for="customer in filteredCustomers" :key="customer.id" cols="12" sm="6" md="4" lg="3">
        <v-card hover class="customer-card" :to="`/customers/${customer.id}`">
          <v-card-text class="text-center pt-6">
            <v-avatar :color="customer.customer_type === 'business' ? 'primary' : 'success'" size="64" class="mb-3">
              <v-icon size="32" color="white">{{ customer.customer_type === 'business' ? 'mdi-domain' : 'mdi-account' }}</v-icon>
            </v-avatar>
            <h3 class="text-h6 mb-1">{{ customer.name }}</h3>
            <p class="text-grey mb-2">{{ customer.email || '-' }}</p>
            <v-chip :color="customer.customer_type === 'business' ? 'primary' : 'success'" size="small" label>
              {{ customer.customer_type === 'business' ? 'Azienda' : 'Privato' }}
            </v-chip>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn size="small" variant="text" prepend-icon="mdi-car">
              {{ customer.vehicles?.length || 0 }} Veicoli
            </v-btn>
            <v-spacer />
            <v-btn size="small" variant="text" color="error" icon="mdi-delete" @click.prevent="confirmDelete(customer)" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!loading && filteredCustomers.length === 0" class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Nessun cliente trovato</h3>
      <p class="text-grey mb-4">
        {{ search ? 'Prova a modificare i criteri di ricerca' : 'Inizia aggiungendo il tuo primo cliente' }}
      </p>
      <v-btn v-if="!search" color="primary" prepend-icon="mdi-plus" to="/customers/new">
        Aggiungi Cliente
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
          Sei sicuro di voler eliminare il cliente <strong>{{ customerToDelete?.name }}</strong>?
          <br><br>
          <v-alert type="warning" variant="tonal" density="compact">
            Questa azione eliminerà anche tutti i veicoli associati.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteCustomerConfirm">
            Elimina
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/types/database.types'

const { fetchCustomers, deleteCustomer } = useCustomers()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const loading = ref(true)
const customers = ref<Customer[]>([])
const search = ref('')
const filterType = ref<string | null>(null)
const viewMode = ref('list')
const deleteDialog = ref(false)
const customerToDelete = ref<Customer | null>(null)
const deleting = ref(false)

// Data
const customerTypes = [
  { title: 'Tutti', value: null },
  { title: 'Privato', value: 'private' },
  { title: 'Azienda', value: 'business' }
]

const headers = [
  { title: 'Cliente', key: 'name', sortable: true },
  { title: 'Contatti', key: 'contact', sortable: false },
  { title: 'Località', key: 'address', sortable: true },
  { title: 'Tipo', key: 'customer_type', sortable: true },
  { title: 'Veicoli', key: 'vehicles_count', sortable: false },
  { title: 'Azioni', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const filteredCustomers = computed(() => {
  let result = customers.value
  
  if (filterType.value) {
    result = result.filter(c => c.customer_type === filterType.value)
  }
  
  return result
})

// Load data
onMounted(async () => {
  try {
    customers.value = await fetchCustomers() || []
  } catch (error) {
    console.error('Error loading customers:', error)
  } finally {
    loading.value = false
  }
})

// Methods
const confirmDelete = (customer: Customer) => {
  customerToDelete.value = customer
  deleteDialog.value = true
}

const deleteCustomerConfirm = async () => {
  if (!customerToDelete.value) return
  
  deleting.value = true
  try {
    await deleteCustomer(customerToDelete.value.id)
    customers.value = customers.value.filter(c => c.id !== customerToDelete.value!.id)
    showSnackbar('Cliente eliminato con successo', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.customer-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.customer-card:hover {
  transform: translateY(-4px);
}
</style>
