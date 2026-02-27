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
                        // Primary: BLACK (Zinc-900)
                        primary: '#18181b', // zinc-900
                        'primary-darken-1': '#09090b', // zinc-950
                        'primary-lighten-1': '#27272a', // zinc-800

                        // Secondary: Red (G&G Auto)
                        secondary: '#cc0000', // red-brand
                        'secondary-darken-1': '#990000',
                        'secondary-lighten-1': '#ff3333',

                        // Accent: Red
                        accent: '#e60000',

                        // Semantic colors
                        error: '#ef4444', // red-500
                        warning: '#f59e0b', // amber-500
                        info: '#3b82f6', // blue-500
                        success: '#10b981', // emerald-500

                        // Backgrounds - Zinc palette
                        background: '#fafafa', // zinc-50
                        surface: '#ffffff',
                        'surface-variant': '#f4f4f5', // zinc-100

                        // Text colors
                        'on-background': '#18181b', // zinc-900
                        'on-surface': '#18181b', // zinc-900
                        'on-primary': '#ffffff',
                        'on-secondary': '#ffffff'
                    }
                },
                dark: {
                    dark: true,
                    colors: {
                        // Primary: WHITE for dark mode
                        primary: '#fafafa', // zinc-50
                        'primary-darken-1': '#f4f4f5', // zinc-100
                        'primary-lighten-1': '#ffffff',

                        // Secondary: Lighter red for dark mode
                        secondary: '#ff4d4d',
                        'secondary-darken-1': '#cc0000',
                        'secondary-lighten-1': '#ff8080',

                        // Accent
                        accent: '#ff3333',

                        // Semantic colors (brighter for dark mode)
                        error: '#f87171', // red-400
                        warning: '#fbbf24', // amber-400
                        info: '#60a5fa', // blue-400
                        success: '#34d399', // emerald-400

                        // Backgrounds - Zinc dark palette
                        background: '#18181b', // zinc-900
                        surface: '#27272a', // zinc-800
                        'surface-variant': '#3f3f46', // zinc-700

                        // Text colors
                        'on-background': '#fafafa', // zinc-50
                        'on-surface': '#fafafa', // zinc-50
                        'on-primary': '#18181b',
                        'on-secondary': '#18181b'
                    }
                }
            }
        },
        defaults: {
            global: {
                density: 'compact'
            },
            VCard: {
                rounded: 'lg',
                elevation: 1
            },
            VBtn: {
                rounded: 'lg',
                variant: 'flat',
                elevation: 0
            },
            VTextField: {
                variant: 'outlined',
                density: 'compact',
                rounded: 'lg'
            },
            VSelect: {
                variant: 'outlined',
                density: 'compact',
                rounded: 'lg'
            },
            VAutocomplete: {
                variant: 'outlined',
                density: 'compact',
                rounded: 'lg'
            },
            VTextarea: {
                variant: 'outlined',
                density: 'compact',
                rounded: 'lg'
            },
            VDataTable: {
                hover: true,
                density: 'compact'
            },
            VList: {
                density: 'compact',
                rounded: 'lg'
            },
            VListItem: {
                rounded: 'lg'
            },
            VSheet: {
                rounded: 'lg'
            },
            VAvatar: {
                rounded: 'lg'
            },
            VChip: {
                rounded: 'lg',
                size: 'small'
            },
            VDialog: {
                maxWidth: '600'
            },
            VNavigationDrawer: {
                width: 260
            }
        }
    })

    app.vueApp.use(vuetify)
})
