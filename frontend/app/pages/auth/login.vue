<template>
  <v-app class="login-app">
    <v-container fluid class="fill-height pa-4">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="5" lg="4" xl="3">
          <v-card class="login-card pa-6 pa-sm-8" elevation="8">
            <!-- Logo & Title -->
            <div class="text-center mb-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-car-wrench</v-icon>
              <h1 class="text-h5 font-weight-bold">Officina Pro</h1>
              <p class="text-body-2 text-medium-emphasis mt-1">Accedi al tuo account</p>
            </div>

            <!-- Login Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                autocomplete="email"
                class="mb-2"
              />

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="passwordRules"
                autocomplete="current-password"
                class="mb-4"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!valid || loading"
              >
                Accedi
              </v-btn>
            </v-form>

            <!-- Divider -->
            <div class="d-flex align-center my-6">
              <v-divider />
              <span class="mx-3 text-caption text-medium-emphasis">oppure</span>
              <v-divider />
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <span class="text-body-2 text-medium-emphasis">Non hai un account?</span>
              <NuxtLink to="/auth/register" class="text-body-2 font-weight-medium ml-1">
                Registrati
              </NuxtLink>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const client = useSupabaseClient()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const email = ref('')
const password = ref('')

const emailRules = [
  (v: string) => !!v || 'Email richiesta',
  (v: string) => /.+@.+\..+/.test(v) || 'Email non valida'
]

const passwordRules = [
  (v: string) => !!v || 'Password richiesta',
  (v: string) => v.length >= 6 || 'Minimo 6 caratteri'
]

const handleLogin = async () => {
  if (!form.value) return
  
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        errorMessage.value = 'Email o password non corretti'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage.value = 'Conferma la tua email prima di accedere'
      } else {
        errorMessage.value = error.message
      }
      return
    }

    // Success - redirect to dashboard
    router.push('/')
  } catch (err: any) {
    errorMessage.value = 'Errore di connessione. Riprova.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-app {
  background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
  min-height: 100vh;
}

.login-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.98) !important;
}

// Dark mode override
:deep(.v-theme--dark) {
  .login-card {
    background: rgba(39, 39, 42, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>
