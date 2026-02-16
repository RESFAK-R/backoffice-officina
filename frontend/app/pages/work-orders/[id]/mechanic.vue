<template>
  <div class="mechanic-print-page pa-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6 pb-4 border-bottom">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">SCHEDA DI LAVORO</h1>
        <div class="text-h6 text-grey-darken-1">{{ workOrder?.order_number }}</div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold">Officina Pro</div>
        <div class="text-caption">Gestione Riparazioni Veicoli</div>
        <div class="text-body-2 mt-1">Data: {{ formatDate(new Date().toISOString()) }}</div>
      </div>
    </div>

    <v-row v-if="workOrder">
      <!-- Vehicle Information -->
      <v-col cols="6">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="bg-grey-lighten-4 py-2 text-subtitle-1 font-weight-bold">
            VEICOLO
          </v-card-title>
          <v-divider />
          <v-card-text class="py-2">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-grey">Targa:</span>
              <span class="font-weight-bold">{{ workOrder.vehicles?.plate }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-grey">Modello:</span>
              <span>{{ workOrder.vehicles?.brand }} {{ workOrder.vehicles?.model }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-grey">Telaio / VIN:</span>
              <span class="text-caption font-family-mono">{{ workOrder.vehicles?.vin || '-' }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-grey">Chilometri:</span>
              <span class="font-weight-bold">{{ workOrder.vehicles?.kilometers || '-' }} KM</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-grey">Anno:</span>
              <span>{{ workOrder.vehicles?.year || '-' }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Customer Information -->
      <v-col cols="6">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="bg-grey-lighten-4 py-2 text-subtitle-1 font-weight-bold">
            CLIENTE
          </v-card-title>
          <v-divider />
          <v-card-text class="py-2">
            <div class="text-h6 mb-1">{{ workOrder.vehicles?.customers?.name }}</div>
            <div v-if="workOrder.vehicles?.customers?.phone" class="text-body-2">
              Tel: {{ workOrder.vehicles.customers.phone }}
            </div>
            <div v-if="workOrder.vehicles?.customers?.email" class="text-body-2">
              Email: {{ workOrder.vehicles.customers.email }}
            </div>
            <div class="text-caption text-grey mt-2">
              Priorità: <span :class="getPriorityClass(workOrder.priority)">{{ getPriorityLabel(workOrder.priority) }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Problem Description -->
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="bg-grey-lighten-4 py-2 text-subtitle-1 font-weight-bold">
            LAMENTATA / DESCRIZIONE PROBLEMA
          </v-card-title>
          <v-divider />
          <v-card-text class="py-4 text-body-1" style="min-height: 100px; white-space: pre-wrap;">
            {{ workOrder.problem_description || 'Nessuna descrizione fornita.' }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Work Items -->
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="bg-grey-lighten-4 py-2 text-subtitle-1 font-weight-bold">
            INTERVENTI RICHIESTI / LAVORI DA ESEGUIRE
          </v-card-title>
          <v-divider />
          <v-table density="compact">
            <thead>
              <tr>
                <th style="width: 40px">CHECK</th>
                <th>DESCRIZIONE INTERVENTO</th>
                <th style="width: 100px">QUANTITÀ</th>
                <th>NOTE / RICAMBI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in workOrder.work_order_items" :key="item.id">
                <td class="text-center">
                  <div style="width: 20px; height: 20px; border: 1px solid #000; margin: 0 auto;"></div>
                </td>
                <td class="py-2 font-weight-medium">{{ item.description }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td><div class="border-bottom-dotted" style="height: 20px; width: 100%;"></div></td>
              </tr>
              <!-- Empty rows for extra notes -->
              <tr v-for="i in 3" :key="'empty-'+i">
                <td><div style="width: 20px; height: 20px; border: 1px solid #000; margin: 0 auto;"></div></td>
                <td><div class="border-bottom-dotted" style="height: 20px; width: 100%;"></div></td>
                <td></td>
                <td><div class="border-bottom-dotted" style="height: 20px; width: 100%;"></div></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Mechanic Notes Area -->
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="bg-grey-lighten-4 py-2 text-subtitle-1 font-weight-bold">
            NOTE DEL MECCANICO (RICAMBI USATI, OSSERVAZIONI, TEMPI)
          </v-card-title>
          <v-divider />
          <v-card-text style="min-height: 200px;">
            <div v-for="i in 8" :key="'line-'+i" class="border-bottom-dotted mb-6" style="height: 1px; width: 100%;"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Signatures -->
      <v-col cols="12" class="mt-8">
        <v-row>
          <v-col cols="6">
            <div class="text-center">
              <div class="mb-12">__________________________</div>
              <div class="text-subtitle-2">Firma Meccanico</div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-center">
              <div class="mb-12">__________________________</div>
              <div class="text-subtitle-2">Firma Responsabile Officina</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Floating Actions for Screen (Hidden in Print) -->
    <div class="no-print floating-actions">
      <v-btn color="primary" size="large" prepend-icon="mdi-printer" @click="handlePrint">
        Stampa Scheda
      </v-btn>
      <v-btn variant="text" size="large" class="ml-2" @click="$router.back()">
        Annulla
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const { getWorkOrder } = useWorkOrders()

const workOrder = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  try {
    workOrder.value = await getWorkOrder(id)
    // Small delay to ensure everything is rendered before print dialog if auto-print
    if (route.query.auto === '1') {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const handlePrint = () => {
  window.print()
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateStr))
}

const getPriorityLabel = (p: string) => {
  return { urgent: 'URGENTE', high: 'ALTA', normal: 'NORMALE', low: 'BASSA' }[p] || p.toUpperCase()
}

const getPriorityClass = (p: string) => {
  return { urgent: 'text-error font-weight-bold', high: 'text-orange font-weight-bold', normal: 'text-grey', low: 'text-grey' }[p] || ''
}
</script>

<style scoped>
.mechanic-print-page {
  background: white;
  min-height: 100vh;
  color: black;
}

.border-bottom {
  border-bottom: 2px solid #333;
}

.border-bottom-dotted {
  border-bottom: 1px dotted #999;
}

.floating-actions {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: white;
  padding: 12px 24px;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid #eee;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .mechanic-print-page {
    padding: 0 !important;
  }
  
  .v-card {
    border-color: #333 !important;
  }
  
  .bg-grey-lighten-4 {
    background-color: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
