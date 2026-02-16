<template>
  <div class="page-container">
    <!-- Loading -->
    <div v-if="loading" class="pa-6">
      <v-skeleton-loader type="article, actions" />
    </div>

    <!-- Customer Detail -->
    <template v-else-if="customer">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/customers" class="mb-2">
            Torna ai clienti
          </v-btn>
          <div class="d-flex align-center ga-3">
            <v-avatar :color="customer.customer_type === 'business' ? 'blue' : 'primary'" variant="tonal" size="56">
              <v-icon size="32">{{ customer.customer_type === 'business' ? 'mdi-domain' : 'mdi-account' }}</v-icon>
            </v-avatar>
            <div>
              <h1 class="page-title">{{ customer.name }}</h1>
              <p class="page-subtitle">
                <v-chip :color="customer.customer_type === 'business' ? 'blue' : 'teal'" size="small" label class="mr-2">
                  {{ customer.customer_type === 'business' ? 'Azienda' : 'Privato' }}
                </v-chip>
                {{ customer.city ? customer.city : '' }}{{ customer.province ? ' (' + customer.province + ')' : '' }}
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            :to="`/customers/${customer.id}/edit`"
          >
            Modifica
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Dati Anagrafici -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-account-details</v-icon>
              Dati Anagrafici
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Nome</div>
                  <div class="font-weight-medium">{{ customer.name }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="text-caption text-grey mb-1">Tipo</div>
                  <v-chip :color="customer.customer_type === 'business' ? 'blue' : 'teal'" size="small" label>
                    {{ customer.customer_type === 'business' ? 'Azienda' : 'Privato' }}
                  </v-chip>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="customer.customer_type === 'private'">
                  <div class="text-caption text-grey mb-1">Codice Fiscale</div>
                  <div class="font-weight-medium font-family-monospace">{{ customer.fiscal_code || '-' }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="customer.customer_type === 'business'">
                  <div class="text-caption text-grey mb-1">Partita IVA</div>
                  <div class="font-weight-medium font-family-monospace">{{ customer.vat_number || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Contatti -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-contacts</v-icon>
              Contatti
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey mb-1">Email</div>
                  <div v-if="customer.email" class="d-flex align-center">
                    <v-icon size="small" class="mr-2" color="grey">mdi-email</v-icon>
                    <a :href="`mailto:${customer.email}`" class="text-primary">{{ customer.email }}</a>
                  </div>
                  <span v-else class="text-grey">-</span>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey mb-1">Telefono</div>
                  <div v-if="customer.phone" class="d-flex align-center">
                    <v-icon size="small" class="mr-2" color="grey">mdi-phone</v-icon>
                    <a :href="`tel:${customer.phone}`" class="text-primary">{{ customer.phone }}</a>
                  </div>
                  <span v-else class="text-grey">-</span>
                </v-col>
                <v-col cols="12" sm="6" v-if="customer.customer_type === 'business'">
                  <div class="text-caption text-grey mb-1">PEC</div>
                  <div v-if="customer.pec" class="d-flex align-center">
                    <v-icon size="small" class="mr-2" color="grey">mdi-email-seal</v-icon>
                    <a :href="`mailto:${customer.pec}`" class="text-primary">{{ customer.pec }}</a>
                  </div>
                  <span v-else class="text-grey">-</span>
                </v-col>
                <v-col cols="12" sm="6" v-if="customer.customer_type === 'business'">
                  <div class="text-caption text-grey mb-1">Codice SDI</div>
                  <div class="font-weight-medium font-family-monospace">{{ customer.sdi_code || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Indirizzo -->
          <v-card class="mb-4" v-if="customer.address || customer.city">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              Indirizzo
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="font-weight-medium" v-if="customer.address">{{ customer.address }}</div>
              <div class="text-body-2 mt-1" v-if="customer.city || customer.postal_code || customer.province">
                {{ customer.postal_code ? customer.postal_code + ' ' : '' }}{{ customer.city || '' }}{{ customer.province ? ' (' + customer.province + ')' : '' }}
              </div>
            </v-card-text>
          </v-card>

          <!-- Note -->
          <v-card class="mb-4" v-if="customer.notes">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Note
            </v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-wrap;">{{ customer.notes }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" lg="4">
          <!-- Veicoli Associati -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>
                <v-icon class="mr-2">mdi-car-multiple</v-icon>
                Veicoli
                <v-chip size="x-small" class="ml-2" variant="tonal">{{ customer.vehicles?.length || 0 }}</v-chip>
              </span>
              <v-btn
                size="small"
                variant="text"
                color="primary"
                prepend-icon="mdi-plus"
                :to="`/vehicles/new?customer=${customer.id}`"
              >
                Aggiungi
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list v-if="customer.vehicles?.length > 0" density="compact">
                <v-list-item
                  v-for="vehicle in customer.vehicles"
                  :key="vehicle.id"
                  :to="`/vehicles/${vehicle.id}`"
                  class="px-4"
                >
                  <template #prepend>
                    <v-avatar color="primary" variant="tonal" size="36" class="mr-3">
                      <v-icon size="20">mdi-car</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ vehicle.brand }} {{ vehicle.model }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ vehicle.plate }} • {{ vehicle.year || '' }}
                  </v-list-item-subtitle>
                  <template #append>
                    <v-icon size="small" color="grey">mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-center text-grey py-6 px-4">
                <v-icon size="40" class="mb-2">mdi-car-off</v-icon>
                <p>Nessun veicolo associato</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Azioni Rapide -->
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
                prepend-icon="mdi-pencil"
                :to="`/customers/${customer.id}/edit`"
              >
                Modifica Cliente
              </v-btn>
              <v-btn
                block
                variant="outlined"
                prepend-icon="mdi-car-plus"
                :to="`/vehicles/new?customer=${customer.id}`"
              >
                Aggiungi Veicolo
              </v-btn>
              <v-btn
                block
                variant="outlined"
                color="error"
                prepend-icon="mdi-delete"
                @click="confirmDelete"
              >
                Elimina Cliente
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Not Found -->
    <v-card v-else class="pa-12 text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Cliente non trovato</h3>
      <p class="text-grey mb-4">Il cliente richiesto non esiste o è stato eliminato.</p>
      <v-btn color="primary" to="/customers">
        Torna ai Clienti
      </v-btn>
    </v-card>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Conferma Eliminazione
        </v-card-title>
        <v-card-text>
          Sei sicuro di voler eliminare il cliente
          <strong>{{ customer?.name }}</strong>?
          <br><br>
          <v-alert v-if="customer?.vehicles?.length" type="warning" variant="tonal" density="compact" class="mb-0">
            Questo cliente ha {{ customer.vehicles.length }} veicolo/i associato/i.
          </v-alert>
          <span class="text-caption text-grey">Questa azione non può essere annullata.</span>
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
const route = useRoute()
const router = useRouter()
const { getCustomer, deleteCustomer } = useCustomers()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

const loading = ref(true)
const customer = ref<any>(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const customerId = computed(() => route.params.id as string)

onMounted(async () => {
  try {
    customer.value = await getCustomer(customerId.value)
  } catch (error) {
    console.error('Error loading customer:', error)
  } finally {
    loading.value = false
  }
})

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteCustomerConfirm = async () => {
  if (!customer.value) return

  deleting.value = true
  try {
    await deleteCustomer(customer.value.id)
    showSnackbar('Cliente eliminato con successo', 'success')
    router.push('/customers')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante l\'eliminazione', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
