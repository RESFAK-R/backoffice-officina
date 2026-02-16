<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="text-h5 font-weight-bold">Nuovo Articolo</h1>
        <p class="text-body-2 text-medium-emphasis">Aggiungi un articolo al magazzino</p>
      </div>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">Indietro</v-btn>
    </div>

    <v-container class="pa-4">
      <v-card max-width="800">
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formData.name"
                  label="Nome Articolo *"
                  :rules="[v => !!v || 'Nome richiesto']"
                  prepend-inner-icon="mdi-package-variant"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.sku"
                  label="Codice SKU"
                  prepend-inner-icon="mdi-barcode"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Descrizione"
                  rows="2"
                  prepend-inner-icon="mdi-text"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.category"
                  :items="categories"
                  label="Categoria"
                  prepend-inner-icon="mdi-tag"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.supplier"
                  label="Fornitore"
                  prepend-inner-icon="mdi-truck"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.quantity"
                  label="Quantità *"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Quantità non valida']"
                  prepend-inner-icon="mdi-counter"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_quantity"
                  label="Scorta Minima"
                  type="number"
                  min="0"
                  prepend-inner-icon="mdi-alert"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.selling_price"
                  label="Prezzo Unitario (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  prepend-inner-icon="mdi-currency-eur"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.location"
                  label="Posizione in Magazzino"
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
            </v-row>

            <v-alert v-if="error" type="error" class="mt-4" closable @click:close="error = ''">
              {{ error }}
            </v-alert>

            <div class="d-flex justify-end gap-2 mt-6">
              <v-btn variant="text" @click="$router.back()">Annulla</v-btn>
              <v-btn type="submit" color="primary" :loading="loading" :disabled="!valid">
                Aggiungi Articolo
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
const { createItem } = useInventory()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  sku: '',
  description: '',
  category: '',
  supplier: '',
  quantity: 0,
  min_quantity: 5,
  selling_price: 0,
  location: ''
})

const categories = [
  'Olio e Lubrificanti',
  'Filtri',
  'Freni',
  'Pneumatici',
  'Batterie',
  'Illuminazione',
  'Motore',
  'Carrozzeria',
  'Accessori',
  'Altro'
]

const handleSubmit = async () => {
  if (!form.value) return
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  error.value = ''

  try {
    await createItem({
      name: formData.value.name,
      sku: formData.value.sku || null,
      description: formData.value.description || null,
      category: formData.value.category || null,
      supplier: formData.value.supplier || null,
      quantity: formData.value.quantity,
      min_quantity: formData.value.min_quantity,
      selling_price: formData.value.selling_price || 0,
      location: formData.value.location || null
    })
    router.push('/inventory')
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
