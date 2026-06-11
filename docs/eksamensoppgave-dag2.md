# Eksamen dag 2 – IT-utvikling

Dette dokumentet beskriver hva som er løst på eksamen dag 2 for case **2INF
Festival**, med valgt retning **IT-utvikling**. Det forklarer hvordan hvert krav
er løst, hvilke begrensninger løsningen har, og hva som bør forbedres i en ekte
produksjon.

---

## 1. Valgt retning

Valgt hovedretning er **IT-utvikling**. Hovedfokuset er videreutvikling av
nettsiden (React + Vite + Tailwind), men siden eksamen er tverrfaglig
dokumenteres også nettverk, server og sikkerhet der det er relevant.

---

## 2. Krav fra oppgaven og hvordan de er løst

| # | Krav (dag 2) | Status | Hvor |
| --- | --- | --- | --- |
| 1 | Vurdere om `/24` dekker behovet | ✅ | `docs/nettverksvurdering-24.md` |
| 2 | Nginx standard på port 443 | ✅ | `docs/serveroppsett.md`, `docs/sikkerhet.md` |
| 3 | Veiledning for lokal utvikling | ✅ | `docs/lokal-utvikling.md` |
| 4 | Festivalsjef kobler bedrift/foredrag til rom | ✅ | `pages/AdminPage.jsx`, `admin/ProgramEditor.jsx` |
| 5 | Programmet oppdateres med endringene | ✅ | `sections/ProgramSection.jsx` |
| 6 | Program viser tidspunkt, rom og bedrift | ✅ | `sections/ProgramSection.jsx` |
| 7 | Hindre to bedrifter i samme rom/tid | ✅ | `hasConflict()` + `hasRoomTimeConflict()` |
| 8 | Interaktiv finn-fram-funksjon | ✅ | `sections/FinnFramSection.jsx` |
| 9 | Eget adminpanel på `/admin` | ✅ | `pages/AdminPage.jsx` |
| 10 | Festivalsjef kan styre ledige plasser | ✅ | `admin/ProgramEditor.jsx` + `server/index.js` |
| 11 | Påmelding lagres på server | ✅ | `server/registrations.js` + `POST /api/registrations` |
| 12 | E-postkvittering ved påmelding | ✅ | `server/mailer.js` (Nodemailer + SMTP env vars) |
| 13 | Festivalsjef ser alle påmeldinger | ✅ | `admin/RegistrationsList.jsx` + `GET /api/admin/registrations` |

---

## 3. Nettverksvurdering (`/24`)

Nettet er `10.20.30.0/24` med 254 brukbare adresser. Infrastrukturen bruker
faste adresser under `.50`, og DHCP-området `10.20.30.50–10.20.30.240` gir ca.
**191 dynamiske adresser**.

Vurdering: dette er **godt nok for en demo og en liten festival**, men kan bli
**for lite** når mange besøkende bruker både mobil og PC. Foreslåtte
forbedringer er `/23` (510 adresser), **VLAN** for gjester/servere/administrasjon
og et eget **gjestenettverk**. Full begrunnelse i `docs/nettverksvurdering-24.md`.

---

## 4. Nginx og HTTPS (port 443)

- Nginx kjører som **reverse proxy** på Ubuntu Server.
- Docker-containeren eksponeres internt på **port 8080** (`-p 8080:80`).
- Nginx **lytter på port 443** (HTTPS) og er standardinngangen.
- **Port 80 videresender automatisk til HTTPS** (301-redirect).
- Sertifikatet er **selvsignert** fordi `festival.lan` er et internt domene. I
  produksjon ville man brukt offentlig domene og Let's Encrypt.
- Hovedadresse: `https://festival.lan`. Direkte på IP: `https://10.20.30.20`.

Detaljer og testkommandoer i `docs/serveroppsett.md`.

---

## 5. Lokal utvikling

`docs/lokal-utvikling.md` forklarer hvordan man fortsetter utviklingen:

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Docker-test fra prosjektroten: `docker build -t 2inf-festival .` og
`docker run -p 8080:80 2inf-festival`. Lokal utvikling skjer på
`http://localhost:5173`, produksjon på Ubuntu via Docker og Nginx.

---

## 6. Festivalsjefpanel (`/admin`) med backend

Festivalsjef-funksjonaliteten er skilt ut som en **egen side**:
`https://festival.lan/admin`. Siden er adskilt fra den offentlige forsiden og
er kun ment for festivalsjefen.

En innlogget festivalsjef kan:

1. Velge en **bedrift som har foredrag**.
2. Velge et **foredrag** fra bedriften.
3. Velge **rom**: Auditorium A eller Auditorium B.
4. Velge **tidspunkt** (tidsluke fra programmet).
5. Skrive inn **ledige plasser** (validert mot maks kapasitet fra datasettet).
6. **Lagre endringen** og se en oppdatert programoversikt med alle kolonnene:
   tidspunkt, rom, bedrift, foredrag og ledige plasser.

Endringene lagres **server-side** via Express-backend (`server/`). Endringene
legges «oppå» originaldataene fra `datasett.json` (som ikke endres).

### Backend (Express)

Backenden serverer den bygde React-appen og et lite API:

| Metode | Rute | Beskrivelse |
| --- | --- | --- |
| `GET` | `/api/health` | Helsesjekk (`{ "status": "ok" }`) |
| `POST` | `/api/admin/login` | Demo-innlogging, returnerer token |
| `GET` | `/api/program/overrides` | Henter lagrede endringer |
| `POST` | `/api/program/overrides` | Lagrer en endring (token + validering) |
| `DELETE` | `/api/program/overrides` | Nullstiller alle endringer (token) |
| `POST` | `/api/registrations` | Registrerer påmelding (offentlig) |
| `GET` | `/api/admin/registrations` | Lister alle påmeldinger (token) |
| `DELETE` | `/api/admin/registrations/:id` | Sletter én påmelding (token) |
| `DELETE` | `/api/admin/registrations` | Sletter alle påmeldinger (token) |

Programendringer lagres i `server/storage/program-overrides.json`.
Påmeldinger lagres i `server/storage/registrations.json`. Begge lages
automatisk ved første kjøring. Backenden validerer feltene, sjekker at
`bedriftId` og `workshopId` finnes i `datasett.json`, og prøver å sende
en kvitteringsepost via SMTP (Nodemailer).

### Innlogging (demo)

Innloggingen er en **demo/prototype** for eksamen. Faste demo-credentials er
`festivalsjef / 2inf2026`. Ved riktig innlogging får klienten et token som
sendes som `Authorization: Bearer <token>` på beskyttede ruter. Er man ikke
innlogget, vises login-kortet på `/admin`, og dashbordet er skjult.
Tokenet lagres i `sessionStorage` (slettes ved lukking av fanen).
Dette er **ikke** produksjonssikkerhet – se `docs/sikkerhet.md`.

---

## 7. Programmet oppdateres – inkludert ledige plasser

`ProgramSection.jsx` henter endringene fra backenden
(`GET /api/program/overrides`) og fletter dem inn i programmet. Hvert
programkort viser **tidspunkt, rom og bedrift** (i tillegg til tittel og
kategori). Endrede foredrag merkes med «Endret».

Hvis festivalsjef har satt **ledige plasser**, viser programkortet:
> «20 av 40 ledige plasser»

Hvis ledige plasser ikke er satt, vises bare:
> «Maks 30»

Søk, kategorifilter og sortering fungerer som før. Hvis backenden ikke svarer,
vises originalprogrammet med en liten advarsel:
«Programmet vises uten serverendringer fordi backend ikke svarer.»

---

## 8. Konfliktkontroll – ingen dobbeltbooking

Konfliktkontrollen hindrer at festivalsjefen plasserer to foredrag i **samme rom
på samme tidspunkt**. Den kjøres **både på backend og frontend**, men
**backenden er hovedkontrollen** fordi frontend kan manipuleres.

**Regel:** Hvis festivalsjefen allerede har tildelt et annet foredrag samme rom
og samme tidspunkt, svarer backenden med **HTTP 409** og meldingen:

> «Dette tidspunktet er allerede opptatt i valgt rom.»

- Samme tidspunkt i **forskjellig rom** er tillatt.
- Forskjellig tidspunkt i **samme rom** er tillatt.
- Gjelder både Auditorium A og Auditorium B.

Endringen lagres ikke ved konflikt.

**Merk om datasettet:** `datasett.json` plasserer allerede flere foredrag i
samme rom til samme tid (importerte data vi ikke kan endre). Kontrollen gjelder
derfor festivalsjefens egne tildelinger (overstyringene), slik at festivalsjefen
ikke selv lager nye dobbeltbookinger. Logikken ligger i `hasConflict()` i
`server/dataStore.js` (autoritativ) og speiles av `hasRoomTimeConflict()` i
`app/src/utils/dataHelpers.js`.

---

## 9. Finn fram (interaktiv veiviser)

Den nye seksjonen **«Finn fram»** (`FinnFramSection.jsx`) hjelper besøkende å
finne fram. Man kan filtrere på stedstype og klikke på et sted for å se navn,
hva stedet brukes til, hvor det ligger, en enkel veibeskrivelse og nyttig info.
Stedene som dekkes:

- Auditorium A og Auditorium B (foredrag)
- Toaletter
- Spiseområde
- Bedriftsstands
- Informasjonspunkt
- Workshoprom

Dette er en intern, interaktiv kartoversikt laget med kort/grid i Tailwind – ikke
et eksternt kart. Valgt sted fremheves visuelt.

---

## 10. Påmelding med backend og e-postkvittering

Påmeldingsskjemaet («Meld deg på») er nå koblet til backenden. Når en
besøkende sender skjemaet:

1. Frontenden sender `POST /api/registrations` med navn, klasse, e-post,
   bedrift, workshop, ønsket tidspunkt og eventuell kommentar.
2. Backenden validerer alle felter og sjekker at bedrift og workshop finnes
   i `datasett.json`.
3. Påmeldingen lagres i `server/storage/registrations.json` med et unikt id
   og timestamp.
4. Backenden prøver å sende en kvitteringsepost til brukerens e-postadresse
   via Nodemailer (SMTP).

**Hvis SMTP er konfigurert:**
> «Påmeldingen er lagret, og kvittering er sendt til e-posten din.»

**Hvis SMTP ikke er konfigurert:**
> «Påmeldingen er lagret. E-postkvittering er ikke konfigurert i testmiljøet.»

Påmeldingen lagres uansett – SMTP er valgfritt. Credentials leses fra
miljøvariabler (se `.env.example`), aldri hardkodet i koden.

### Adminoversikt for påmeldinger

Festivalsjef kan nå se alle påmeldinger i en egen fane («Påmeldinger») i
adminpanelet (`/admin`). Oversikten viser:

- Tidspunkt for påmelding
- Navn, klasse, e-post
- Valgt bedrift og workshop
- Ønsket tidspunkt
- Kommentar/behov
- Om kvitteringsepost ble sendt

Festivalsjef kan søke/filtrere og slette enkeltpåmeldinger.

---

## 11. Begrensninger

- **Innloggingen er en demo/prototype.** Faste demo-credentials, token i
  minnet og ingen passordhashing.
- **Lagringen er JSON-filer**, ikke en ekte database. Det holder for en
  prototype, men skalerer ikke og har ikke transaksjoner/backup.
- **Selvsignert SSL** gir en nettleseradvarsel i testmiljøet.
- **`festival.lan` er et internt domene** og fungerer bare i festivalnettverket.
- **TP-Link-svitsjen** er ikke en UniFi-enhet, så UniFi viser ikke full
  portbasert topologi.
- **Påmeldinger inneholder personopplysninger** (navn, klasse, e-post).
  Produksjon krever GDPR-vurdering, begrenset tilgang og slettingsrutiner.

Backenden er et **klart steg opp fra ren localStorage**: påmeldinger og
programendringer lagres på serveren, valideres server-side og deles mellom
besøkende.

---

## 12. Forbedringer i produksjon

- **Ekte database** (med backup) i stedet for JSON-filer.
- **Ekte autentisering**: passordhashing (f.eks. bcrypt), trygge
  sessions/JWT, og rollebasert tilgangskontroll.
- **Gyldig sertifikat** (Let's Encrypt) med offentlig domene, uten advarsel.
- **`/23` og VLAN** for å dekke et større antall besøkende og enheter.
- **UniFi-svitsj** for full portbasert topologi.
- **Rate limiting og CSRF-beskyttelse** på påmeldingsruten.
- **Ekte e-postleverandør** med dkim-signering for bedre leveringsrate.
- **GDPR/personvern**: databehandleravtale, tydelig slettingsrutine, kun
  nødvendige opplysninger samles inn.
