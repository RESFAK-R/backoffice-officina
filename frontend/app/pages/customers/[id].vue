<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/customers" class="mb-2">
          Torna ai clienti
        </v-btn>
        <h1 class="page-title">{{ isEdit ? 'Modifica Cliente' : 'Nuovo Cliente' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Aggiorna i dati del cliente' : 'Inserisci i dati del nuovo cliente' }}</p>
      </div>
    </div>

    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <v-card-text>
          <v-row>
            <!-- Customer Type -->
            <v-col cols="12">
              <v-radio-group v-model="formData.customer_type" inline>
                <v-radio label="Privato" value="private" />
                <v-radio label="Azienda" value="business" />
              </v-radio-group>
            </v-col>

            <!-- Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name"
                :label="formData.customer_type === 'business' ? 'Ragione Sociale *' : 'Nome e Cognome *'"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account"
              />
            </v-col>

            <!-- Fiscal Code / VAT -->
            <v-col cols="12" md="6">
              <v-text-field
                v-if="formData.customer_type === 'private'"
                v-model="formData.fiscal_code"
                label="Codice Fiscale"
                prepend-inner-icon="mdi-card-account-details"
                :rules="[rules.fiscalCode]"
                counter="16"
                maxlength="16"
              />
              <v-text-field
                v-else
                v-model="formData.vat_number"
                label="Partita IVA *"
                prepend-inner-icon="mdi-numeric"
                :rules="[rules.required, rules.vatNumber]"
                counter="11"
                maxlength="11"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Contatti</h3>
            </v-col>

            <!-- Email -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                :rules="[rules.email]"
              />
            </v-col>

            <!-- Phone -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.phone"
                label="Telefono"
                prepend-inner-icon="mdi-phone"
              />
            </v-col>

            <!-- PEC (for business) -->
            <v-col cols="12" md="6" v-if="formData.customer_type === 'business'">
              <v-text-field
                v-model="formData.pec"
                label="PEC"
                type="email"
                prepend-inner-icon="mdi-email-seal"
                :rules="[rules.email]"
              />
            </v-col>

            <!-- SDI Code (for business) -->
            <v-col cols="12" md="6" v-if="formData.customer_type === 'business'">
              <v-text-field
                v-model="formData.sdi_code"
                label="Codice SDI"
                prepend-inner-icon="mdi-identifier"
                counter="7"
                maxlength="7"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-2" />
              <h3 class="text-h6 mb-4">Indirizzo</h3>
            </v-col>

            <!-- Address -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.address"
                label="Indirizzo"
                prepend-inner-icon="mdi-map-marker"
              />
            </v-col>

            <!-- City -->
            <v-col cols="12" md="5">
              <v-text-field
                v-model="formData.city"
                label="Città"
                prepend-inner-icon="mdi-city"
              />
            </v-col>

            <!-- Province -->
            <v-col cols="12" md="3">
              <v-select
                v-model="formData.province"
                label="Provincia"
                :items="provinces"
                prepend-inner-icon="mdi-map"
              />
            </v-col>

            <!-- Postal Code -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.postal_code"
                label="CAP"
                prepend-inner-icon="mdi-mailbox"
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
          <v-btn variant="text" to="/customers">Annulla</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :loading="saving"
            :disabled="!valid"
            size="large"
          >
            {{ isEdit ? 'Salva Modifiche' : 'Crea Cliente' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { CustomerInsert, CustomerUpdate } from '~/types/database.types'

const route = useRoute()
const router = useRouter()
const { createCustomer, updateCustomer, getCustomer } = useCustomers()
const showSnackbar = inject('showSnackbar') as (msg: string, color?: string) => void

// State
const form = ref()
const valid = ref(false)
const saving = ref(false)
const isEdit = computed(() => route.path.endsWith('/edit'))
const customerId = computed(() => route.params.id as string)

const formData = ref<CustomerInsert>({
  name: '',
  email: null,
  phone: null,
  address: null,
  city: null,
  postal_code: null,
  province: null,
  country: 'Italia',
  fiscal_code: null,
  vat_number: null,
  pec: null,
  sdi_code: null,
  notes: null,
  customer_type: 'private'
})

// Validation rules
const rules = {
  required: (v: any) => !!v || 'Campo obbligatorio',
  email: (v: string) => !v || /.+@.+\..+/.test(v) || 'Email non valida',
  fiscalCode: (v: string) => !v || /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(v) || 'Codice fiscale non valido',
  vatNumber: (v: string) => !v || /^[0-9]{11}$/.test(v) || 'Partita IVA non valida'
}

// Italian provinces
const provinces = [
  'AG', 'AL', 'AN', 'AO', 'AR', 'AP', 'AT', 'AV', 'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO', 'BZ',
  'BS', 'BR', 'CA', 'CL', 'CB', 'CI', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR', 'CN', 'EN',
  'FM', 'FE', 'FI', 'FG', 'FC', 'FR', 'GE', 'GO', 'GR', 'IM', 'IS', 'SP', 'AQ', 'LT', 'LE', 'LC',
  'LI', 'LO', 'LU', 'MC', 'MN', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB', 'NA', 'NO', 'NU', 'OG',
  'OT', 'OR', 'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI', 'PT', 'PN', 'PZ', 'PO', 'RG',
  'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO', 'SA', 'SS', 'SV', 'SI', 'SR', 'SO', 'SU', 'TA', 'TE',
  'TR', 'TO', 'TP', 'TN', 'TV', 'TS', 'UD', 'VA', 'VE', 'VB', 'VC', 'VR', 'VV', 'VI', 'VT'
]

// Load existing customer data if editing
onMounted(async () => {
  if (isEdit.value && customerId.value) {
    try {
      const customer = await getCustomer(customerId.value)
      if (customer) {
        formData.value = { ...customer }
      }
    } catch (error) {
      showSnackbar('Errore nel caricamento del cliente', 'error')
      router.push('/customers')
    }
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
      await updateCustomer(customerId.value, formData.value as CustomerUpdate)
      showSnackbar('Cliente aggiornato con successo', 'success')
    } else {
      const newCustomer = await createCustomer(formData.value)
      showSnackbar('Cliente creato con successo', 'success')
      router.push(`/customers/${newCustomer.id}`)
      return
    }
    router.push('/customers')
  } catch (error: any) {
    showSnackbar(error.message || 'Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}
</script>
