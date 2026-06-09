# 2INF Festival

Dette prosjektet er laget som forberedelse til tverrfaglig eksamen i informasjonsteknologi.

Jeg har valgt hovedretningen **IT-utvikling**. Prosjektet består av en webapplikasjon for 2INF Festival, samt dokumentasjon av nettverk, serveroppsett, sikkerhet, testing, Docker og teknologivalg.

## Status

Webapplikasjonen er **ferdig utviklet**. React/Vite-nettsiden bruker Tailwind CSS, henter alt innhold fra `app/src/data/datasett.json` og presenterer festivalen som en moderne, responsiv landingsside.

Per 08.06.2026 var følgende gjort:

- React/Vite-applikasjon er opprettet
- Enkel startside/prototype er laget
- Dockerfile er laget og Docker build/run er testet
- datasett.json er lagt inn i prosjektet
- Git repository er opprettet med flere commits
- Nettverk er satt opp og testet

Per 09.06.2026 er følgende gjort:

- Tailwind CSS er installert og konfigurert
- Prosjektet er strukturert med gjenbrukbare komponenter (`components/`), seksjoner (`sections/`) og hjelpefunksjoner (`utils/`)
- Festivaldata vises fra `app/src/data/datasett.json` (festival, bedrifter, foredrag, workshops, rom, lærere)
- Nettsiden viser festival, program, bedrifter, workshops, rom, praktisk informasjon og kontakt
- Program har søk, kategorifilter og sortering etter tid
- Bedrifter har søk på navn og bransje
- Romoversikt er gruppert etter bygning
- Hele nettsiden er bygget om til en polert, SaaS-inspirert landingsside med ny hero-seksjon, konsistent fargesystem og lette animasjoner
- En samtykkebanner for informasjonskapsler er lagt til
- Nettsiden er responsiv for mobil og PC
- `npm run build` og `npm run lint` er testet uten feil

### Serverstatus per 09.06.2026 (ferdig)

Serverdelen er ferdig satt opp og testet. Infrastrukturen er virtualisert på en Proxmox-host i nettverket `10.20.30.0/24`:

- Proxmox-host (node kostia, 10.20.30.4) – `vmbr0` mot `nic0`, gammel `vmbr1` fjernet
- Ubuntu Server (10.20.30.20) – Nginx, Node.js v22.22.1 og Docker 29.5.3, SSH med nøkkel
- Bruker `festivalsjef` med sudo/docker, passord- og root-SSH deaktivert
- Windows Server 2019 (10.20.30.10) – PowerShell Remoting (WinRM)
- DNS-rolle på Windows med sonen `festival.local` og A-records for begge serverne
- Alle nettverks-, tjeneste-, SSH- og DNS-tester bestått

Detaljer i `docs/serveroppsett-09-06-2026.md` og `docs/testresultat-servere-09-06-2026.md`.

## Teknologi

Prosjektet bruker:

- React
- Vite
- Tailwind CSS
- JavaScript
- JSON
- Docker
- Nginx
- Git

## Prosjektstruktur

```text
2inf-festival/
├── app/
│   ├── src/
│   │   ├── components/   (Header, Footer, SectionTitle, StatCard, SearchInput, Badge, Reveal, CookieConsent)
│   │   ├── sections/     (Hero, About, Program, Companies, Workshops, Rooms, Info, Contact)
│   │   ├── utils/        (dataHelpers.js)
│   │   ├── data/
│   │   │   └── datasett.json
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── data/
│   └── datasett.json
├── docs/
├── Dockerfile
├── .dockerignore
├── README.md
└── log.txt
```

## Data

Festivaldata ligger i:

- `data/datasett.json` – originalfilen fra oppgaven
- `app/src/data/datasett.json` – kopien som brukes av React-applikasjonen

All visning på nettsiden bygger på `app/src/data/datasett.json`, og data leses gjennom hjelpefunksjonene i `app/src/utils/dataHelpers.js`.

## Kjøre prosjektet lokalt uten Docker

```bash
cd app
npm install
npm run dev
```

Åpne nettsiden: `http://localhost:5173`

## Kjøre prosjektet med Docker

Fra prosjektroten:

```bash
docker build -t 2inf-festival .
docker run -p 8080:80 2inf-festival
```

Åpne nettsiden: `http://localhost:8080`

## Bygging og testing

```bash
cd app
npm run build   # produksjonsbygg med Vite – testet uten feil
npm run lint    # ESLint – testet uten feil
```

## Deploy

Nettsiden skal deployes til **Ubuntu Server (10.20.30.20)** med **Docker**. Imaget bygges fra `Dockerfile` og kjøres som en container som serverer den ferdigbygde React-appen via Nginx.

Planlagt URL i festivalnettverket:

- `http://festival.festival.local` (via DNS-sonen `festival.local` på Windows Server)
- `http://10.20.30.20` (direkte på IP)

## Dokumentasjon

Dokumentasjon ligger i `docs/`. Viktige filer:

- `docs/dokumentasjon.md` – samlet prosjektdokumentasjon
- `docs/arbeidslogg-08-06-2026.md` og `docs/arbeidslogg-09-06-2026.md` – arbeidslogger
- `docs/testresultat-09-06-2026.md` – testresultat for webapplikasjonen
- `docs/serveroppsett-09-06-2026.md` og `docs/testresultat-servere-09-06-2026.md` – server

Dokumentasjonen dekker krav fra oppgaven, valgt hovedretning, prosjektstruktur, teknologivalg, Docker, nettverksplan, serveroppsett, sikkerhet, testing, Git og videre arbeid.

## Nettverk

```text
Nettverk: 10.20.30.0/24
Router / gateway: 10.20.30.1
AP management: 10.20.30.2
Switch management: 10.20.30.3
Windows Server: 10.20.30.10
Ubuntu Server: 10.20.30.20
DHCP range: 10.20.30.50 - 10.20.30.240
SSID: 2INF-Festival-KostiantynK
Sikkerhet: WPA2
```

## Sikkerhet

Viktige sikkerhetstiltak:

- WPA2 på trådløst nettverk
- faste IP-adresser på infrastruktur, DHCP-område skilt fra statiske adresser
- SSH med nøkkel for `festivalsjef`, passord- og root-innlogging deaktivert
- kun nødvendige porter åpnes (22, 80, evt. 443)
- HTTPS bør brukes i produksjon
- ingen passord eller hemmelige nøkler hardkodes i kildekoden

## Git

Prosjektet bruker Git lokalt. For å se commit-historikk:

```bash
git log --oneline
```

Ved innlevering lagres commit-loggen slik (gjøres helt til slutt):

```bash
git log --oneline --decorate --all > log.txt
```

## Videre arbeid

- Deploye Docker-imaget på Ubuntu Server (10.20.30.20)
- Verifisere tilgang via `http://festival.festival.local` og `http://10.20.30.20`
- Vurdere HTTPS i produksjon
- Generere `log.txt`
- Pakke prosjektet som ZIP for innlevering
