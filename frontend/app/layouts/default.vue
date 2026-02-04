<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      class="sidebar-drawer"
    >
      <!-- Logo -->
      <div class="sidebar-header pa-4">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-car-wrench</v-icon>
          <span v-if="!rail" class="text-h6 font-weight-bold text-white">Officina Pro</span>
        </div>
      </div>

      <v-divider class="border-opacity-25" />

      <!-- Navigation -->
      <v-list nav density="compact" class="mt-2">
        <!-- Dashboard -->
        <v-list-item
          to="/"
          :active="$route.path === '/'"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          class="nav-item"
        />

        <v-list-subheader v-if="!rail" class="nav-section-title">GESTIONE</v-list-subheader>

        <v-list-item
          to="/customers"
          :active="$route.path.startsWith('/customers')"
          prepend-icon="mdi-account-group"
          title="Clienti"
          class="nav-item"
        />

        <v-list-item
          to="/vehicles"
          :active="$route.path.startsWith('/vehicles')"
          prepend-icon="mdi-car"
          title="Veicoli"
          class="nav-item"
        />

        <v-list-item
          to="/work-orders"
          :active="$route.path.startsWith('/work-orders')"
          prepend-icon="mdi-clipboard-text"
          title="Ordini di Lavoro"
          class="nav-item"
        >
          <template #append>
            <v-badge
              v-if="activeOrdersCount > 0"
              :content="activeOrdersCount"
              color="warning"
              inline
            />
          </template>
        </v-list-item>

        <v-list-subheader v-if="!rail" class="nav-section-title">PIANIFICAZIONE</v-list-subheader>

        <v-list-item
          to="/appointments"
          :active="$route.path.startsWith('/appointments')"
          prepend-icon="mdi-calendar-clock"
          title="Appuntamenti"
          class="nav-item"
        />

        <v-list-subheader v-if="!rail" class="nav-section-title">AMMINISTRAZIONE</v-list-subheader>

        <v-list-item
          to="/invoices"
          :active="$route.path.startsWith('/invoices')"
          prepend-icon="mdi-file-document"
          title="Fatture"
          class="nav-item"
        />

        <v-list-item
          to="/inventory"
          :active="$route.path.startsWith('/inventory')"
          prepend-icon="mdi-package-variant"
          title="Magazzino"
          class="nav-item"
        >
          <template #append>
            <v-badge
              v-if="lowStockCount > 0"
              :content="lowStockCount"
              color="error"
              inline
            />
          </template>
        </v-list-item>

        <v-list-subheader v-if="!rail" class="nav-section-title">REPORT</v-list-subheader>

        <v-list-item
          to="/reports"
          :active="$route.path.startsWith('/reports')"
          prepend-icon="mdi-chart-bar"
          title="Report & Analytics"
          class="nav-item"
        />
      </v-list>

      <template #append>
        <v-divider class="border-opacity-25" />
        <div class="pa-2">
          <v-btn
            block
            variant="text"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            @click="rail = !rail"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar flat class="app-bar">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />
      </template>

      <v-text-field
        v-model="searchQuery"
        class="search-field ml-4"
        density="compact"
        variant="solo-filled"
        flat
        hide-details
        placeholder="Cerca clienti, veicoli, ordini..."
        prepend-inner-icon="mdi-magnify"
        single-line
        max-width="400"
        @keyup.enter="performSearch"
      />

      <v-spacer />

      <!-- Quick Actions -->
      <v-btn icon variant="text" class="mr-2">
        <v-icon>mdi-plus-circle-outline</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              prepend-icon="mdi-account-plus"
              title="Nuovo Cliente"
              @click="navigateTo('/customers/new')"
            />
            <v-list-item
              prepend-icon="mdi-car-plus"
              title="Nuovo Veicolo"
              @click="navigateTo('/vehicles/new')"
            />
            <v-list-item
              prepend-icon="mdi-clipboard-plus"
              title="Nuovo Ordine"
              @click="navigateTo('/work-orders/new')"
            />
            <v-list-item
              prepend-icon="mdi-calendar-plus"
              title="Nuovo Appuntamento"
              @click="navigateTo('/appointments/new')"
            />
          </v-list>
        </v-menu>
      </v-btn>

      <!-- Notifications -->
      <v-btn icon variant="text" class="mr-2">
        <v-badge 
          :content="notifications.length" 
          color="error"
          :model-value="notifications.length > 0"
        >
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
        <v-menu activator="parent" width="350">
          <v-card>
            <v-card-title class="d-flex align-center">
              <span>Notifiche</span>
              <v-spacer />
              <v-btn size="small" variant="text" color="primary">Segna tutte come lette</v-btn>
            </v-card-title>
            <v-divider />
            <v-list v-if="notifications.length > 0">
              <v-list-item
                v-for="(notification, i) in notifications"
                :key="i"
                :prepend-icon="notification.icon"
                :title="notification.title"
                :subtitle="notification.message"
              />
            </v-list>
            <v-card-text v-else class="text-center text-grey">
              Nessuna nuova notifica
            </v-card-text>
          </v-card>
        </v-menu>
      </v-btn>

      <!-- User Menu -->
      <v-btn class="user-menu-btn mr-4" variant="tonal" rounded>
        <v-avatar size="32" color="primary" class="mr-2">
          <span class="text-white font-weight-bold">{{ userInitials }}</span>
        </v-avatar>
        <span class="d-none d-sm-inline">{{ userName }}</span>
        <v-icon end>mdi-chevron-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              prepend-icon="mdi-account"
              title="Profilo"
            />
            <v-list-item
              prepend-icon="mdi-cog"
              title="Impostazioni"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Esci"
              @click="logout"
            />
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <slot />
    </v-main>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Chiudi
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
const router = useRouter()
const drawer = ref(true)
const rail = ref(false)
const searchQuery = ref('')

// User info (mock - da sostituire con auth reale)
const userName = ref('Admin User')
const userInitials = computed(() => {
  const parts = userName.value.split(' ')
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

// Counters for badges
const activeOrdersCount = ref(5)
const lowStockCount = ref(3)

// Notifications
const notifications = ref([
  { icon: 'mdi-alert', title: 'Scorta bassa', message: 'Olio motore sotto il minimo' },
  { icon: 'mdi-calendar-alert', title: 'Appuntamento', message: 'Mario Rossi - 15:00' }
])

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

// Provide snackbar function to children
provide('showSnackbar', (message: string, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
})

const navigateTo = (path: string) => {
  router.push(path)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const logout = async () => {
  const client = useSupabaseClient()
  await client.auth.signOut()
  router.push('/auth/login')
}
</script>

<style scoped>
.sidebar-drawer {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%) !important;
}

.sidebar-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
}

.nav-section-title {
  color: #64748b !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.1em;
  margin-top: 16px !important;
}

.nav-item {
  margin: 4px 8px;
  border-radius: 12px !important;
  color: #94a3b8 !important;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1) !important;
  color: white !important;
}

.nav-item.v-list-item--active {
  background: linear-gradient(90deg, #3b82f6, #2563eb) !important;
  color: white !important;
}

.app-bar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}

.search-field {
  max-width: 400px;
}

.search-field :deep(.v-field) {
  background: #f1f5f9 !important;
  border-radius: 12px;
}

.main-content {
  background: #f8fafc;
  min-height: 100vh;
}

.user-menu-btn {
  text-transform: none;
}
</style>
