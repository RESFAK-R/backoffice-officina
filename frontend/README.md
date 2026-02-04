# Officina Pro - Sistema di Gestione Officina

Sistema completo per la gestione di un'officina meccanica, sviluppato con Nuxt 3, Vuetify e Supabase.

## 🚀 Funzionalità

### Gestione Clienti
- Anagrafica completa clienti (privati e aziende)
- Ricerca e filtri avanzati
- Storico veicoli e ordini per cliente
- Supporto dati fiscali italiani (CF, P.IVA, PEC, SDI)

### Gestione Veicoli
- Database veicoli con tutti i dati tecnici
- Monitoraggio scadenze (revisione, assicurazione)
- Storico manutenzioni per veicolo
- Supporto multi-alimentazione

### Ordini di Lavoro
- Creazione e gestione ordini
- Workflow stati (In Attesa → In Corso → Completato)
- Gestione ricambi e manodopera
- Calcolo automatico preventivi
- Priorità e assegnazione tecnici

### Fatturazione
- Generazione fatture da ordini
- Gestione stati pagamento
- Scadenze e solleciti
- Export e stampa

### Appuntamenti
- Calendario con vista giorno/settimana/lista
- Gestione prenotazioni
- Notifiche e promemoria

### Inventario/Magazzino
- Gestione articoli e ricambi
- Alert scorte minime
- Codici OEM e compatibilità
- Prezzi acquisto e vendita

### Report e Analytics
- Dashboard statistiche
- Grafici fatturato
- Analisi servizi più richiesti
- Top clienti

## 🛠 Stack Tecnologico

- **Frontend**: [Nuxt 3](https://nuxt.com) - Framework Vue.js
- **UI**: [Vuetify 3](https://vuetifyjs.com) - Material Design Components
- **Backend**: [Supabase](https://supabase.com) - PostgreSQL + Auth + Realtime
- **State**: [Pinia](https://pinia.vuejs.org) - State Management
- **Charts**: [Chart.js](https://chartjs.org) - Grafici
- **Date**: [date-fns](https://date-fns.org) - Manipolazione date

## 📋 Prerequisiti

- Node.js >= 18.x
- npm >= 9.x
- Account Supabase (gratuito su [supabase.com](https://supabase.com))

## 🚀 Installazione

### 1. Clona il repository

```bash
cd backoffice-officina
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Copia il file `.env.example` in `.env` e configura le variabili:

```bash
cp .env.example .env
```

Modifica `.env` con le tue credenziali Supabase:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key  # opzionale
```

### 4. Configura il database Supabase

1. Vai sulla dashboard di Supabase
2. Naviga in **SQL Editor**
3. Esegui lo script `database/schema.sql` per creare le tabelle
4. (Opzionale) Esegui i seed data per popolare il database con dati di esempio

### 5. Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📁 Struttura del Progetto

```
backoffice-officina/
├── app/
│   └── app.vue              # Componente root
├── assets/
│   └── css/
│       └── main.css         # Stili globali
├── composables/
│   └── useDatabase.ts       # Composables per Supabase
├── database/
│   └── schema.sql           # Schema database SQL
├── layouts/
│   └── default.vue          # Layout principale
├── pages/
│   ├── index.vue            # Dashboard
│   ├── customers/           # Gestione clienti
│   ├── vehicles/            # Gestione veicoli
│   ├── work-orders/         # Ordini di lavoro
│   ├── appointments/        # Appuntamenti
│   ├── invoices/            # Fatture
│   ├── inventory/           # Magazzino
│   └── reports/             # Report
├── plugins/
│   └── vuetify.ts           # Configurazione Vuetify
├── types/
│   └── database.types.ts    # Tipi TypeScript
├── nuxt.config.ts           # Configurazione Nuxt
└── package.json
```

## 🔧 Comandi Disponibili

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Preview build
npm run preview

# Genera tipi TypeScript
npm run postinstall
```

## 🎨 Personalizzazione Tema

Il tema può essere personalizzato in `plugins/vuetify.ts`:

```typescript
themes: {
  light: {
    colors: {
      primary: '#2563eb',    // Blu primario
      secondary: '#475569',   // Grigio secondario
      accent: '#8b5cf6',      // Viola accent
      // ...altri colori
    }
  }
}
```

## 📄 Schema Database

### Tabelle Principali

- **customers** - Anagrafica clienti
- **vehicles** - Veicoli
- **work_orders** - Ordini di lavoro
- **work_order_items** - Voci ordini
- **invoices** - Fatture
- **appointments** - Appuntamenti
- **inventory** - Magazzino
- **employees** - Dipendenti
- **service_history** - Storico interventi

### Row Level Security (RLS)

Il database implementa RLS per la sicurezza dei dati. Le policy di base permettono accesso completo agli utenti autenticati. Per ambienti di produzione, si consiglia di implementare policy più restrittive basate sui ruoli.

## 🔐 Autenticazione

L'autenticazione utilizza Supabase Auth. Per abilitarla:

1. Configura i provider desiderati nella dashboard Supabase
2. Crea le pagine `/login` e `/register`
3. Utilizza il composable `useSupabaseUser()` per gestire lo stato utente

## 📱 Responsive Design

L'applicazione è completamente responsive:
- **Desktop**: Sidebar estesa, tabelle complete
- **Tablet**: Sidebar rail, layout adattivo
- **Mobile**: Menu drawer, interfaccia touch-friendly

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit delle modifiche (`git commit -am 'Aggiunge nuova funzionalità'`)
4. Push del branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📝 Licenza

MIT License - vedi file [LICENSE](LICENSE) per i dettagli.

## 🆘 Supporto

Per domande o problemi:
- Apri una issue su GitHub
- Consulta la documentazione di [Nuxt](https://nuxt.com/docs)
- Consulta la documentazione di [Supabase](https://supabase.com/docs)
