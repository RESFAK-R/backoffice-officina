import { Shield, Award, Users, TrendingUp, Heart, Target } from "lucide-react";
import { Card } from "../components/ui/card";

export function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Chi Siamo</h1>
          <p className="text-lg opacity-90">
            La tua scelta sicura per l'acquisto di auto usate
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Story */}
        <div className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">La Nostra Storia</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-4">
                AutoSelect è nata dalla passione per l'automotive e dal desiderio di offrire ai clienti un'esperienza di acquisto trasparente e professionale. Con oltre 15 anni di esperienza nel settore, abbiamo costruito la nostra reputazione sulla qualità, l'affidabilità e il servizio clienti eccezionale.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Ogni auto che vendiamo viene accuratamente selezionata e sottoposta a rigorosi controlli tecnici nella nostra officina certificata. Non vendiamo semplicemente auto usate: offriamo veicoli certificati, garantiti e pronti per accompagnarti in ogni viaggio.
              </p>
              <p className="text-lg text-muted-foreground">
                La nostra missione è semplice: aiutarti a trovare l'auto perfetta per le tue esigenze, offrendoti la massima tranquillità e il miglior rapporto qualità-prezzo del mercato.
              </p>
            </div>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">I Nostri Valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Affidabilità</h3>
              <p className="text-muted-foreground">
                Ogni auto viene controllata in oltre 120 punti dalla nostra officina certificata. Trasparenza totale su storico e condizioni del veicolo.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualità</h3>
              <p className="text-muted-foreground">
                Selezioniamo solo veicoli in condizioni eccellenti, con documentazione completa e manutenzione regolare certificata.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Servizio Clienti</h3>
              <p className="text-muted-foreground">
                Il nostro team è sempre a tua disposizione per consigliarti e supportarti, dall'acquisto alla manutenzione post-vendita.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovazione</h3>
              <p className="text-muted-foreground">
                Utilizziamo le tecnologie più avanzate per la diagnostica e la certificazione dei veicoli, garantendo standard elevati.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passione</h3>
              <p className="text-muted-foreground">
                Amiamo le auto e questa passione si riflette in ogni veicolo che prepariamo e in ogni cliente che serviamo.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Precisione</h3>
              <p className="text-muted-foreground">
                Attenzione maniacale ai dettagli in ogni fase: dalla selezione, al controllo tecnico, alla preparazione estetica.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">AutoSelect in Numeri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">15+</div>
                <p className="text-muted-foreground">Anni di Esperienza</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">2500+</div>
                <p className="text-muted-foreground">Auto Vendute</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">98%</div>
                <p className="text-muted-foreground">Clienti Soddisfatti</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">120+</div>
                <p className="text-muted-foreground">Controlli per Auto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Our Process */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Il Nostro Processo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Selezione</h3>
              <p className="text-sm text-muted-foreground">
                Scegliamo solo auto con storico completo e manutenzione regolare
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Controllo</h3>
              <p className="text-sm text-muted-foreground">
                120+ punti di controllo in officina certificata
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Preparazione</h3>
              <p className="text-sm text-muted-foreground">
                Tagliando completo e preparazione estetica professionale
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Garanzia</h3>
              <p className="text-sm text-muted-foreground">
                12 mesi di garanzia e assistenza post-vendita
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
