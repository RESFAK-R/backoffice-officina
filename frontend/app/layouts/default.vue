<template>
  <v-app>
    <!-- Sidebar Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !isMobile"
      :permanent="!isMobile"
      :temporary="isMobile"
      width="220"
      rail-width="64"
      class="sidebar"
    >
      <!-- Logo Section -->
      <div class="sidebar-logo">
        <img src="/LOGOGGFINALE_NOSFONDO.png" alt="G&G Auto" class="sidebar-logo-img" :style="{ width: rail && !isMobile ? '32px' : '36px', height: 'auto' }" />
        <span v-show="!rail || isMobile" class="logo-text">G&G Auto</span>
      </div>

      <v-divider class="my-1 mx-2" style="border-color: #e4e4e7" />

      <!-- Navigation Menu -->
      <v-list nav density="compact" class="px-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="rail && !isMobile ? '' : item.title"
          :active="isActive(item.to)"
          class="nav-item mb-1"
          rounded="lg"
        >
          <template v-if="item.badge && (!rail || isMobile)" #append>
            <v-chip :color="item.badgeColor" size="x-small" label>{{ item.badge }}</v-chip>
          </template>
        </v-list-item>
      </v-list>

      <!-- Collapse Button -->
      <template #append>
        <div class="pa-2" v-if="!isMobile">
          <v-btn
            block
            variant="text"
            size="small"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            class="collapse-btn"
            @click="rail = !rail"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar -->
    <v-app-bar flat density="compact" class="topbar">
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon
        v-if="isMobile"
        @click="drawer = !drawer"
        size="small"
      />

      <!-- Search -->
      <v-text-field
        v-model="searchQuery"
        placeholder="Cerca..."
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        density="compact"
        class="search-field mx-2"
        style="max-width: 260px;"
        @keyup.enter="performSearch"
      />

      <v-spacer />

      <!-- Quick Add -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" v-bind="props">
            <v-icon size="20">mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" width="160">
          <v-list-item
            v-for="action in quickActions"
            :key="action.to"
            :prepend-icon="action.icon"
            :title="action.title"
            @click="$router.push(action.to)"
          />
        </v-list>
      </v-menu>

      <!-- Notifications -->
      <v-menu width="320" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" v-bind="props" class="mx-1">
            <v-badge :content="notifications.length" color="error" :model-value="notifications.length > 0">
              <v-icon size="20">mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between py-2 px-4">
            <span class="text-body-2 font-weight-bold">Notifiche</span>
            <v-btn
              v-if="notifications.length"
              variant="text"
              size="x-small"
              color="primary"
              @click="clearAllNotifications"
            >
              Segna tutte lette
            </v-btn>
          </v-card-title>
          <v-divider />
          <div v-if="notificationsLoading" class="text-center py-4">
            <v-progress-circular indeterminate size="24" color="primary" />
          </div>
          <v-list v-else-if="notifications.length" density="compact" max-height="360" class="overflow-y-auto">
            <v-list-item
              v-for="(n, i) in notifications"
              :key="i"
              :prepend-icon="n.icon"
              class="notification-item"
              @click="n.action ? n.action() : null"
            >
              <v-list-item-title class="text-body-2 font-weight-medium">
                {{ n.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ n.message }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon variant="text" size="x-small" @click.stop="dismissNotification(i)">
                  <v-icon size="14">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center text-grey py-6">
            <v-icon size="32" color="grey-lighten-1" class="mb-2">mdi-bell-check-outline</v-icon>
            <div class="text-body-2">Nessuna notifica</div>
          </v-card-text>
        </v-card>
      </v-menu>

      <!-- User Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="user-btn ml-1 mr-2" rounded="lg">
            <v-avatar size="28" color="primary" class="mr-2">
              <span class="text-caption font-weight-bold text-white">{{ userInitials }}</span>
            </v-avatar>
            <span v-if="!isMobile" class="text-body-2">{{ userName }}</span>
            <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" width="150">
          <v-list-item prepend-icon="mdi-account" title="Profilo" />
          <v-list-item prepend-icon="mdi-cog" title="Impostazioni" />
          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-logout" title="Esci" @click="logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="main-area">
      <slot />
    </v-main>

    <!-- Global Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right" :timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" size="small" @click="snackbar.show = false">Chiudi</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()
const display = useDisplay()

const isMobile = computed(() => display.smAndDown.value)

const drawer = ref(true)
const rail = ref(false)
const searchQuery = ref('')

// User
const userName = ref('Admin User')
const userInitials = computed(() => {
  return userName.value.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

// Badge counts (real data)
const pendingOrdersCount = ref(0)
const lowStockCount = ref(0)

const loadBadgeCounts = async () => {
  const client = useSupabaseClient()
  try {
    const { count: pending } = await client
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'in_progress', 'waiting_parts'])

    pendingOrdersCount.value = pending || 0

    const { data: inventoryData } = await client
      .from('inventory')
      .select('quantity, min_quantity')

    lowStockCount.value = (inventoryData || []).filter(
      (item: any) => item.quantity <= item.min_quantity
    ).length
  } catch (e) {
    console.error('Error loading badge counts:', e)
  }
}

// Menu Items
const menuItems = computed(() => [
  { to: '/', icon: 'mdi-view-dashboard', title: 'Dashboard' },
  { to: '/customers', icon: 'mdi-account-group', title: 'Clienti' },
  { to: '/vehicles', icon: 'mdi-car', title: 'Veicoli' },
  { to: '/work-orders', icon: 'mdi-clipboard-text', title: 'Ordini', badge: pendingOrdersCount.value || undefined, badgeColor: 'warning' },
  { to: '/appointments', icon: 'mdi-calendar-clock', title: 'Appuntamenti' },
  { to: '/invoices', icon: 'mdi-file-document', title: 'Fatture' },
  { to: '/inventory', icon: 'mdi-package-variant', title: 'Magazzino', badge: lowStockCount.value || undefined, badgeColor: 'error' },
  { to: '/car-sales', icon: 'mdi-tag', title: 'Auto in Vendita' },
  { to: '/reports', icon: 'mdi-chart-bar', title: 'Report' }
])

const quickActions = [
  { to: '/customers/new', icon: 'mdi-account-plus', title: 'Nuovo Cliente' },
  { to: '/vehicles/new', icon: 'mdi-car', title: 'Nuovo Veicolo' },
  { to: '/work-orders/new', icon: 'mdi-clipboard-plus', title: 'Nuovo Ordine' },
  { to: '/appointments/new', icon: 'mdi-calendar-plus', title: 'Appuntamento' }
]

// Dynamic notifications
const notifications = ref<Array<{icon: string, title: string, message: string, action?: () => void}>>([])
const notificationsLoading = ref(false)

const loadNotifications = async () => {
  notificationsLoading.value = true
  const client = useSupabaseClient()
  const items: typeof notifications.value = []

  try {
    // 1. Low stock inventory items
    const { data: inventoryData } = await client
      .from('inventory')
      .select('id, name, quantity, min_quantity')

    if (inventoryData) {
      for (const raw of inventoryData) {
        const item = raw as any
        if (item.quantity < item.min_quantity) {
          items.push({
            icon: 'mdi-package-variant-closed-remove',
            title: 'Scorta bassa',
            message: `${item.name}: ${item.quantity}/${item.min_quantity} pz`,
            action: () => router.push('/inventory')
          })
        }
      }
    }

    // 2. Today's appointments
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0]

    const { data: appointments } = await client
      .from('appointments')
      .select('id, scheduled_at, service_type, customers(name)')
      .gte('scheduled_at', todayStr)
      .lt('scheduled_at', tomorrowStr)
      .eq('status', 'scheduled')
      .order('scheduled_at', { ascending: true })
      .limit(5)

    if (appointments) {
      for (const raw of appointments) {
        const apt = raw as any
        const time = new Date(apt.scheduled_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
        const customerName = apt.customers?.name || 'Cliente'
        items.push({
          icon: 'mdi-calendar-clock',
          title: 'Appuntamento oggi',
          message: `${customerName} - ${time}`,
          action: () => router.push('/appointments')
        })
      }
    }

    // 3. Pending work orders (not started)
    const pendingResult = await client
      .from('work_orders')
      .select('id, order_number, vehicles(plate)', { count: 'exact' })
      .eq('status', 'pending')
      .limit(3)

    const pendingOrders = pendingResult.data as any[] | null
    const pendingCount = pendingResult.count

    if (pendingCount && pendingCount > 0) {
      items.push({
        icon: 'mdi-clipboard-alert',
        title: `${pendingCount} ordini in attesa`,
        message: pendingOrders?.map((o: any) => o.order_number).join(', ') || '',
        action: () => router.push('/work-orders')
      })
    }

    // 4. Vehicles with expiring MOT/insurance (next 30 days)
    const in30days = new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0]
    const { data: expiringVehicles } = await client
      .from('vehicles')
      .select('id, plate, brand, model, mot_expiry, insurance_expiry')
      .or(`mot_expiry.lte.${in30days},insurance_expiry.lte.${in30days}`)
      .limit(5)

    if (expiringVehicles) {
      for (const raw of expiringVehicles) {
        const v = raw as any
        if (v.mot_expiry && new Date(v.mot_expiry) <= new Date(in30days)) {
          const expired = new Date(v.mot_expiry) < today
          items.push({
            icon: expired ? 'mdi-alert-circle' : 'mdi-alert',
            title: expired ? 'Revisione scaduta' : 'Revisione in scadenza',
            message: `${v.plate} - ${v.brand} ${v.model}`,
            action: () => router.push(`/vehicles/${v.id}`)
          })
        }
        if (v.insurance_expiry && new Date(v.insurance_expiry) <= new Date(in30days)) {
          const expired = new Date(v.insurance_expiry) < today
          items.push({
            icon: expired ? 'mdi-shield-alert' : 'mdi-shield-car',
            title: expired ? 'Assicurazione scaduta' : 'Assicurazione in scadenza',
            message: `${v.plate} - ${v.brand} ${v.model}`,
            action: () => router.push(`/vehicles/${v.id}`)
          })
        }
      }
    }
  } catch (e) {
    console.error('Error loading notifications:', e)
  } finally {
    notifications.value = items
    notificationsLoading.value = false
  }
}

const dismissNotification = (index: number) => {
  notifications.value.splice(index, 1)
}

const clearAllNotifications = () => {
  notifications.value = []
}

// Load notifications and badge counts on mount and refresh every 5 min
onMounted(() => {
  loadNotifications()
  loadBadgeCounts()
  setInterval(() => {
    loadNotifications()
    loadBadgeCounts()
  }, 5 * 60 * 1000)
})

// Snackbar
const snackbar = reactive({ show: false, message: '', color: 'success' })
provide('showSnackbar', (msg: string, color = 'success') => {
  snackbar.message = msg
  snackbar.color = color
  snackbar.show = true
})

// Helpers
const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
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

<style lang="scss" scoped>
// Sidebar
.sidebar {
  background: #ffffff !important;
  border-right: 1px solid #e4e4e7 !important;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  min-height: 48px;
}

.sidebar-logo-img {
  border-radius: 6px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1rem;
  font-weight: 700;
  color: #18181b;
  white-space: nowrap;
}

.nav-item {
  color: #71717a !important;
  
  :deep(.v-list-item__prepend) {
    color: #71717a;
  }
  
  &:hover {
    background: #f4f4f5 !important;
    color: #18181b !important;
    
    :deep(.v-list-item__prepend) {
      color: #18181b;
    }
  }
  
  &.v-list-item--active {
    background: rgba(204, 0, 0, 0.08) !important;
    color: #cc0000 !important;
    
    :deep(.v-list-item__prepend) {
      color: #cc0000;
    }
  }
}

.collapse-btn {
  color: #a1a1aa !important;
  
  &:hover {
    color: #18181b !important;
  }
}

// Top Bar
.topbar {
  background: #ffffff !important;
  border-bottom: 1px solid #e4e4e7 !important;
}

.search-field {
  :deep(.v-field) {
    background: #f4f4f5 !important;
    border-radius: 8px !important;
    font-size: 0.8125rem;
  }
}

.user-btn {
  text-transform: none;
  font-weight: 500;
}

// Main Content
.main-area {
  background: #f4f4f5;
  min-height: 100vh;
}
</style>
