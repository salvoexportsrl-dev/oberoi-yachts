# OBEROI YACHTS — Migrazione da Shopify a GitHub

Nuovo sito indipendente da Shopify, **separato dal progetto WORBEX**.

## Flotta confermata
- Morrigan — Galeone 70 feet
- San Lorenzo SX88 — San Lorenzo 88 feet
- EMIR — 82,5 metri
- Bella Vita — Majesty 66 feet

Non reintrodurre Senorita, Isabella, Marbella, Valentina, CALADAN, pesca o moto d'acqua.

## Nuovo sito
- `index.html`: homepage, quattro yacht, prenotazioni preliminari e contatti.
- `style.css`: design responsive blu notte e oro.
- `app.js`: schede yacht, fotografie e richiesta informazioni tramite email.

## Stato della migrazione
Questa è una **prima versione indipendente**, non il trasferimento integrale del checkout Shopify.
- Le immagini usano temporaneamente URL del CDN Shopify: copiare immagini e video sui propri asset prima di chiudere Shopify.
- Le richieste di prenotazione aprono il programma email del visitatore: nessun invio automatico, calendario o blocco delle disponibilità.
- Checkout Stripe, gestione prenotazioni, documenti legali, test funzionali, SEO/redirect e migrazione completa dei media vanno completati prima di passare il dominio.
- Non inserire chiavi API, dati dei clienti o credenziali nel repository pubblico.

## Hosting gratuito suggerito: Cloudflare Pages
GitHub conserva il codice; per il sito commerciale usare un hosting separato.
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Scegli `salvoexportsrl-dev/oberoi-yachts`, branch `main`, framework `None`, nessun comando di build e directory di output nella radice.
3. Prova l'URL `*.pages.dev` prima di sostituire il dominio.
4. Trasferisci immagini/video, crea un backend sicuro per prenotazioni, integra Stripe e verifica tutti e quattro i flussi di richiesta e pagamento.
5. Verifica DNS ed email di `booking@oberoi.yachts`, poi punta `oberoi.yachts` al nuovo hosting.
6. **Solo dopo il collaudo completo, disattivare Shopify e il suo abbonamento.** Evitare interruzioni al sito e alla posta.

Contatti: booking@oberoi.yachts · WhatsApp +971 55 697 5706.
