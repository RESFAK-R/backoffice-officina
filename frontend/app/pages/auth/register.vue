<template>
  <v-app class="register-app">
    <v-container fluid class="fill-height pa-4">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="5" lg="4" xl="3">
          <v-card class="register-card pa-6 pa-sm-8" elevation="8">
            <!-- Logo & Title -->
            <div class="text-center mb-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-car-wrench</v-icon>
              <h1 class="text-h5 font-weight-bold">Crea Account</h1>
              <p class="text-body-2 text-medium-emphasis mt-1">Inizia a gestire la tua officina</p>
            </div>

            <!-- Register Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
              <v-text-field
                v-model="fullName"
                label="Nome e Cognome"
                prepend-inner-icon="mdi-account-outline"
                :rules="nameRules"
                autocomplete="name"
                class="mb-2"
              />

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
                autocomplete="new-password"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-text-field
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Conferma Password"
                prepend-inner-icon="mdi-lock-check-outline"
                :rules="confirmPasswordRules"
                autocomplete="new-password"
                class="mb-4"
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

              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!valid || loading || !!successMessage"
              >
                Registrati
              </v-btn>
            </v-form>

            <!-- Divider -->
            <div class="d-flex align-center my-6">
              <v-divider />
              <span class="mx-3 text-caption text-medium-emphasis">oppure</span>
              <v-divider />
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <span class="text-body-2 text-medium-emphasis">Hai già un account?</span>
              <NuxtLink to="/auth/login" class="text-body-2 font-weight-medium ml-1">
                Accedi
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

const client = useSupabaseClient()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const nameRules = [
  (v: string) => !!v || 'Nome richiesto',
  (v: string) => v.length >= 2 || 'Minimo 2 caratteri'
]

const emailRules = [
  (v: string) => !!v || 'Email richiesta',
  (v: string) => /.+@.+\..+/.test(v) || 'Email non valida'
]

const passwordRules = [
  (v: string) => !!v || 'Password richiesta',
  (v: string) => v.length >= 6 || 'Minimo 6 caratteri'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Conferma password richiesta',
  (v: string) => v === password.value || 'Le password non coincidono'
]

const handleRegister = async () => {
  if (!form.value) return
  
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        errorMessage.value = 'Questa email è già registrata'
      } else {
        errorMessage.value = error.message
      }
      return
    }

    successMessage.value = 'Account creato! Controlla la tua email per confermare.'
  } catch (err: any) {
    errorMessage.value = 'Errore di connessione. Riprova.'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-app {
  background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
  min-height: 100vh;
}

.register-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.98) !important;
}
</style>
