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
                        primary: '#0f172a', // Navy/Dark Slate for a premium look
                        secondary: '#64748b',
                        accent: '#334155',
                        error: '#be123c',
                        warning: '#d97706',
                        info: '#0ea5e9',
                        success: '#059669',
                        background: '#f1f5f9',
                        surface: '#ffffff'
                    }
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#f8fafc',
                        secondary: '#94a3b8',
                        accent: '#e2e8f0',
                        error: '#fb7185',
                        warning: '#fbbf24',
                        info: '#38bdf8',
                        success: '#34d399',
                        background: '#020617',
                        surface: '#0f172a'
                    }
                }
            }
        },
        defaults: {
            VCard: {
                rounded: '0',
                elevation: 0,
                border: true
            },
            VBtn: {
                rounded: '0',
                variant: 'flat',
                elevation: 0
            },
            VTextField: {
                variant: 'outlined',
                density: 'comfortable',
                rounded: '0'
            },
            VSelect: {
                variant: 'outlined',
                density: 'comfortable',
                rounded: '0'
            },
            VDataTable: {
                hover: true
            },
            VList: {
                rounded: '0'
            },
            VSheet: {
                rounded: '0'
            },
            VAvatar: {
                rounded: '0'
            }
        }
    })

    app.vueApp.use(vuetify)
})
