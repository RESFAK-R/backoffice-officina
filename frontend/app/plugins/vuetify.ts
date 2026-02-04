import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: '#2563eb',
                        secondary: '#475569',
                        accent: '#06b6d4',
                        error: '#ef4444',
                        warning: '#f59e0b',
                        info: '#3b82f6',
                        success: '#10b981',
                        background: '#f8fafc',
                        surface: '#ffffff'
                    }
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#64748b',
                        accent: '#06b6d4',
                        error: '#ef4444',
                        warning: '#f59e0b',
                        info: '#3b82f6',
                        success: '#10b981',
                        background: '#0f172a',
                        surface: '#1e293b'
                    }
                }
            }
        },
        defaults: {
            VCard: {
                rounded: 'lg',
                elevation: 2
            },
            VBtn: {
                rounded: 'lg',
                variant: 'flat'
            },
            VTextField: {
                variant: 'outlined',
                density: 'comfortable'
            },
            VSelect: {
                variant: 'outlined',
                density: 'comfortable'
            },
            VDataTable: {
                hover: true
            }
        }
    })

    app.vueApp.use(vuetify)
})
