# 2INF Festival

Webapplikasjon og infrastruktur for **2INF Festival**, laget som
eksamensprosjekt i faget ITK2004 (tverrfaglig eksamen i informasjonsteknologi).

Valgt hovedretning: **IT-utvikling**.

- **Live (internt nett):** https://festival.lan
- **Direkte på IP:** https://10.20.30.20
- **GitHub:** https://github.com/kharchenko7002/festival
- **Branch:** `main`

---

## Kort beskrivelse

2INF Festival er en karriere- og teknologifestival arrangert av VG2
Informasjonsteknologi. Nettsiden presenterer festivalen som en moderne,
responsiv landingsside: program, bedrifter, workshops, rom, praktisk
informasjon, kontakt og en **påmeldingsseksjon**. Alt innhold hentes fra
`app/src/data/datasett.json`.

Nettsiden kjører i en Docker-container på en Ubuntu Server, bak en Nginx
reverse proxy med HTTPS. Navnet `festival.lan` løses via en intern DNS-server
på Windows Server.

---

## Eksamenskontekst

Prosjektet er laget til tverrfaglig eksamen. Oppgaven (case 2INF Festival)
krever både en webløsning og et dokumentert IT-miljø med nettverk, servere,
sikkerhet, Docker og testing. Hovedretningen er **IT-utvikling**, men siden
eksamen er tverrfaglig, dokumenteres også drift, nettverk og sikkerhet.

---

## Hovedfunksjoner

- Responsiv landingsside (mobil og PC) i en lys, hvit-blå SaaS-stil
- Header med tekstlogo «2INF Festival» og CTA-knapp **«Meld meg på»**
- **Program** med søk, kategorifilter og sortering etter starttid
- **Bedrifter** med søk på navn og bransje
- **Workshops** som kobler `holderBedriftId → bedrifter.id` og `romId → rom.id`
- **Rom** gruppert etter bygning, med kapasitet og utstyr
- **Praktisk informasjon** og **kontakt** (lærere hentet etter ansvarsområde)
- **Påmelding** – frontend-prototype med skjema, nedtrekksmenyer fra datasettet
  og live oppsummering av valgt workshop og bedrift
- Bilder i flere seksjoner (About, Workshops, Praktisk info, Kontakt)
- Samtykkebanner for informasjonskapsler (valg lagres i `localStorage`)
- Lette CSS-animasjoner som respekterer `prefers-reduced-motion`

---

## Teknologier

| Område | Teknologi |
| --- | --- |
| Frontend-rammeverk | React 19 |
| Byggeverktøy | Vite |
| Styling | Tailwind CSS |
| Språk | JavaScript / JSX |
| Datakilde | JSON (`datasett.json`) |
| Container | Docker |
| Webserver / proxy | Nginx |
| Server-OS | Ubuntu Server 26.04 LTS |
| DNS | Windows Server 2019 |
| Virtualisering | Proxmox VE |
| Nettverk | UniFi (USG 3P, U6 Lite) + TP-Link-svitsj |
| Versjonskontroll | Git / GitHub |

Begrunnelse for valgene står i `docs/teknologivalg.md`.

---

## Prosjektstruktur

```text
2inf-festival/
├── app/
│   ├── public/
│   │   └── images/          (bilder brukt i seksjonene)
│   ├── src/
│   │   ├── components/       (Header, Footer, SectionTitle, StatCard,
│   │   │                      SearchInput, Badge, Reveal, CookieConsent)
│   │   ├── sections/         (Hero, About, Program, Companies, Workshops,
│   │   │                      Rooms, PracticalInfo, Pamending, Contact)
│   │   ├── utils/            (dataHelpers.js)
│   │   ├── data/
│   │   │   └── datasett.json
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── data/
│   └── datasett.json         (originalfil fra oppgaven)
├── docs/                     (all dokumentasjon)
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

---

## Lokal utvikling

```bash
cd app
npm install
npm run dev
```

Nettsiden åpnes på `http://localhost:5173`.

## Bygg og linting

```bash
cd app
npm run build   # produksjonsbygg med Vite
npm run lint    # ESLint
```

Begge kommandoene kjører uten feil (se `docs/testing.md`).

---

## Docker

Imaget bygges fra `Dockerfile` i prosjektroten. Det er et to-trinns bygg:
React-appen bygges med Node, og den ferdige `dist/`-mappen serveres av Nginx.

```bash
docker build -t 2inf-festival .
docker run -d -p 8080:80 --name 2inf-festival 2inf-festival
```

Nettsiden åpnes på `http://localhost:8080`.

---

## Deployment på Ubuntu Server (oppsummering)

Nettsiden er deployet på **Ubuntu Server (10.20.30.20)**:

1. Prosjektet er kopiert til serveren.
2. Docker-imaget er bygget på serveren.
3. Containeren kjører og eksponeres internt på **port 8080** (`-p 8080:80`).
4. **Nginx reverse proxy** står foran containeren og **lytter på port 443**.
   Port 80 videresender automatisk til HTTPS, og Nginx proxyer videre til
   containeren på `127.0.0.1:8080`.
5. HTTPS bruker et **selvsignert sertifikat** (gir nettleseradvarsel i testmiljø,
   fordi `festival.lan` er et internt domene). I produksjon ville man brukt et
   offentlig domene med Let's Encrypt.
6. Nettsiden er tilgjengelig på `https://festival.lan` og `https://10.20.30.20`.

Full fremgangsmåte står i `docs/serveroppsett.md`.

---

## DNS og domene

Intern DNS kjører på Windows Server (10.20.30.10). Følgende navn peker på
Ubuntu-webserveren:

| Navn | Peker på |
| --- | --- |
| `festival.lan` | 10.20.30.20 |
| `www.festival.lan` | 10.20.30.20 |
| `festival.festival.local` | 10.20.30.20 |

`festival.lan` er **kun internt** i festivalnettverket og er ikke et offentlig
domene på internett.

---

## Testing (oppsummering)

| Test | Resultat |
| --- | --- |
| `npm run build` | ✅ Bestått |
| `npm run lint` | ✅ Bestått |
| Visning av data fra `datasett.json` | ✅ Bestått |
| Påmelding-prototype (manuell test) | ✅ Bestått |
| Docker-container kjører på Ubuntu | ✅ Bestått |
| `curl` mot webserver | ✅ Bestått |
| Nginx reverse proxy | ✅ Bestått |
| HTTPS på `festival.lan` | ✅ Bestått (selvsignert) |
| `nslookup festival.lan` | ✅ Bestått |
| Nettverkstester (ping) | ✅ Bestått |
| SSH med nøkkel / passord avvist | ✅ Bestått |

Detaljer i `docs/testing.md`.

---

## Dokumentasjon

All dokumentasjon ligger i `docs/`:

- `docs/dokumentasjon.md` – samlet hoveddokumentasjon
- `docs/teknologivalg.md` – begrunnelse for teknologivalg
- `docs/serveroppsett.md` – servere, Docker, Nginx, HTTPS
- `docs/nettverksplan.md` – nettverk, IP-plan og UniFi
- `docs/sikkerhet.md` – sikkerhetsvurdering
- `docs/testing.md` – testresultater
- `docs/arbeidslogg-08-06-2026.md`, `docs/arbeidslogg-09-06-2026.md` – arbeidslogger
- `docs/serveroppsett-09-06-2026.md`, `docs/testresultat-servere-09-06-2026.md`,
  `docs/testresultat-09-06-2026.md` – detaljerte dagsnotater

---

## Kjente begrensninger

- **Påmelding** er en frontend-prototype. Skjemaet lagrer ingenting og sender
  ingen data til en server – det finnes ingen backend.
- **HTTPS** bruker et selvsignert sertifikat, så nettleseren viser en advarsel.
- **`festival.lan`** er kun internt og fungerer ikke utenfor festivalnettverket.
- **TP-Link-svitsjen** er ikke en UniFi-enhet, så UniFi viser ikke full
  port-basert topologi.
- VPN hjemmefra med kun WireGuard-konfig på laptopen var ikke nok til å nå
  `10.20.30.0/24`; ruting på VPN-serversiden måtte også vært på plass.

---

## Videre arbeid

- Legge til en ekte backend for påmelding (lagring og bekreftelse på e-post)
- Bytte selvsignert sertifikat med et gyldig sertifikat
- Vurdere en UniFi-svitsj for full port-basert topologi
- Sette opp automatisk bygging/utrulling (CI/CD)
