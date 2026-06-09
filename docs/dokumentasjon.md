# Dokumentasjon – 2INF Festival

## 1. Innledning

Dette prosjektet er laget som forberedelse til tverrfaglig eksamen i informasjonsteknologi. Caset handler om 2INF Festival, en festival for bedriftssamarbeid og møtearena på tvers av 2INF-klassene i Innlandet fylkeskommune.

Jeg har valgt hovedretningen **IT-utvikling**. Løsningen består av en webapplikasjon som skal presentere festivalen, program, bedrifter, workshops, rom/kart og praktisk informasjon. I tillegg dokumenteres nettverk, serveroppsett, sikkerhet, testing, Docker og teknologivalg.

Målet med prosjektet er å lage en løsning som er enkel å kjøre lokalt, enkel å videreutvikle, godt dokumentert og egnet for videre arbeid på eksamensdagen.

---

## 2. Krav fra oppgaven

Oppgaven stiller krav om at løsningen skal inneholde:

- Webapplikasjon for festivalen
- Presentasjon av festivalen
- Visning av program og besøkende
- Kart eller oversikt over området
- Praktisk informasjon
- Støtte for mobil og PC
- Bruk av egnet rammeverk
- Docker image og Dockerfile
- Dokumentasjon av oppstart
- Bruk av Git med jevnlige commits
- Vurderinger rundt sikkerhet
- Vurdering av HTTPS
- Dokumentasjon av testing
- Begrunnelse av teknologivalg

Det skal også settes opp og dokumenteres et nettverk med router, switch og AP, samt Windows Server og Ubuntu Server i samme nettverk.

---

## 3. Valgt hovedretning

Jeg har valgt **IT-utvikling** som hovedretning.

Grunnen til dette er at denne retningen passer best med en digital plattform for festivalen. Webapplikasjonen kan vise informasjon fra datasettet, og løsningen kan demonstreres tydelig gjennom nettleser og Docker.

Selv om hovedretningen er utvikling, dokumenterer jeg også infrastruktur, servere, nettverk og sikkerhet, fordi eksamen er tverrfaglig.

---

## 4. Prosjektstruktur

Prosjektet er organisert slik:

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
│   ├── public/
│   ├── package.json
│   └── ...
├── data/
│   └── datasett.json
├── docs/
│   ├── dokumentasjon.md
│   └── arbeidslogg-08-06-2026.md
├── Dockerfile
├── .dockerignore
├── README.md
└── log.txt
```

Forklaring:

- `app/` inneholder React/Vite-applikasjonen.
- `app/src/components/` inneholder gjenbrukbare UI-komponenter (Header, Footer, SectionTitle, StatCard, SearchInput, Badge, Reveal for scroll-animasjoner og CookieConsent for samtykkebanner).
- `app/src/sections/` inneholder de enkelte seksjonene på nettsiden (Hero, About, Program, Companies, Workshops, Rooms, Info, Contact).
- `app/src/utils/dataHelpers.js` inneholder hjelpefunksjoner som leser og kobler sammen data fra `datasett.json`.
- `data/` inneholder original JSON-fil fra oppgaven.
- `app/src/data/` inneholder en kopi av JSON-filen som brukes av webapplikasjonen.
- `docs/` inneholder dokumentasjon.
- `Dockerfile` brukes for å bygge og kjøre webapplikasjonen i Docker.
- `README.md` forklarer hvordan prosjektet startes.
- `log.txt` skal genereres til slutt fra Git-loggen.

---

## 5. Data og datasett

Prosjektet bruker filen `datasett.json`.

Datasettet inneholder blant annet:

- Festivalinformasjon
- Bedrifter
- Lærere
- Elever
- Rom
- Foredrag
- Workshops

Festivalinformasjon fra datasettet:

```text
Navn: 2INF Festival 2027
Dato: 2027-03-18
Sted: Hamar katedralskole
Bygning: Teknologibygget
Starttid: 09:00
Sluttid: 15:00
Kontakt: 2inf-festival@hamar.vgs.no
```

Datasettet brukes som grunnlag for innholdet i webapplikasjonen. Målet er at nettsiden skal vise informasjon dynamisk fra JSON-filen, for eksempel program, bedrifter, workshops og rom.

---

## 6. Teknologivalg

### React

Jeg har valgt React fordi det passer godt til å bygge en moderne webapplikasjon med komponenter. React gjør det enklere å dele opp nettsiden i mindre deler, for eksempel:

- Header
- Forside
- Program
- Bedrifter
- Workshops
- Rom
- Praktisk informasjon
- Kontakt

Dette gjør løsningen enklere å videreutvikle.

### Vite

Jeg har valgt Vite fordi det gir rask utvikling lokalt og er enkelt å sette opp sammen med React. Vite starter raskt, har enkel prosjektstruktur og passer godt for en eksamensoppgave der løsningen må kunne demonstreres effektivt.

### Tailwind CSS

Jeg har installert og konfigurert Tailwind CSS for å style nettsiden. Tailwind gjør det raskt å lage et moderne og responsivt design direkte i komponentene, med god kontroll på avstand, farger og brytningspunkter for mobil og PC. Tailwind er satt opp som Vite-plugin (`@tailwindcss/vite`) og importeres i `src/index.css`, der det også er definert egne brandfarger for festivalen.

### JSON

Jeg bruker `datasett.json` som datakilde. Dette gjør at innholdet kan endres uten at man må skrive alt direkte inn i HTML/JSX. Det gjør også løsningen mer realistisk, fordi data og presentasjon holdes mer adskilt.

### Docker

Docker brukes fordi løsningen skal kunne kjøres lokalt hos andre utviklere. Med Docker blir det enklere å kjøre applikasjonen på forskjellige maskiner uten å være avhengig av nøyaktig samme lokalt utviklingsmiljø.

### Nginx

Docker-imaget bruker Nginx til å servere den ferdigbygde webapplikasjonen. Nginx er lett, stabilt og egner seg godt til å servere statiske filer fra React build.

---

## 7. Webapplikasjon

Webapplikasjonen er laget med React og Vite.

Planlagt innhold i nettsiden:

- Forside med festivalnavn, dato, sted og kort beskrivelse
- Program med foredrag
- Bedriftsoversikt
- Workshopoversikt
- Romoversikt eller kart/områdeoversikt
- Praktisk informasjon
- Kontaktinformasjon

Nettsiden skal fungere på både mobil og PC. Derfor skal designet være responsivt.

Per 08.06.2026 er en første prototype/startside laget. Datasettet er lagt inn i prosjektet og klart for videre bruk i webapplikasjonen.

### Videreutvikling per 09.06.2026

Nettsiden er videreutviklet fra prototype til en mer komplett og profesjonell festivalplattform:

- Tailwind CSS er installert og konfigurert for et moderne, responsivt design.
- Prosjektet er strukturert med `components/`, `sections/` og `utils/`.
- Innholdet hentes dynamisk fra `datasett.json` via hjelpefunksjoner i `utils/dataHelpers.js`.
- **Program** viser foredrag med tid, kategori, rom, maks plasser og bedrift, og har **søk, kategorifilter og sortering etter starttid**.
- **Bedrifter** vises fra JSON med navn, bransje, standnummer, beskrivelse og nettside, og har søk på navn og bransje.
- **Workshops** vises fra JSON og kobler `holderBedriftId` til bedrift og `romId` til rom, med tid, maks plasser og forkunnskaper.
- **Romoversikt** vises fra JSON og er gruppert etter bygning, med romnummer, kapasitet og utstyr.
- **Praktisk informasjon** og **kontaktseksjon** er laget, der kontakt bruker festivalens e-post og relevante lærere fra datasettet.
- Nettsiden er responsiv med en sticky header og mobilmeny.

Bygging og kvalitet er verifisert med `npm run build` og `npm run lint` – begge kjører uten feil.

### Ferdig utviklet nettside

Webapplikasjonen regnes nå som **ferdig utviklet**. I tillegg til funksjonaliteten over er hele nettsiden bygget om til en polert, SaaS-inspirert landingsside:

- Et konsistent visuelt system med rent hvitt, dyp marineblå og en varm gul aksentfarge, definert i `src/index.css`.
- Ny hero-seksjon med stor overskrift, infokort for dato/tid/sted og en dashboard-mockup bygget i Tailwind.
- Gjenbrukbare knappe- og kortstiler og lette CSS-animasjoner (hover-løft, svevende heroelementer og scroll-baserte fade/slide-inn via `Reveal`-komponenten). Det brukes ingen tunge animasjonsbibliotek.
- Animasjoner respekterer `prefers-reduced-motion` for brukere som ønsker mindre bevegelse.
- En **samtykkebanner for informasjonskapsler** (`CookieConsent`) vises ved første besøk. Valget («Godta»/«Avslå») lagres i nettleserens `localStorage`, slik at banneret ikke dukker opp igjen.

All synlig tekst på nettsiden er på norsk bokmål, og alt innhold hentes fra `app/src/data/datasett.json`.

#### Seksjoner på nettsiden

| Seksjon | Innhold | Funksjonalitet |
|---|---|---|
| Festival (hero) | Navn, dato, tid, sted, bygning, beskrivelse, kontakt-e-post | Lenker til program og bedrifter |
| Nøkkeltall | Antall bedrifter, foredrag, workshops og rom | Tall hentes fra datasettet |
| Om festivalen | Forklaring av festivalen | – |
| Program | Foredrag med tid, kategori, rom, maks plasser og bedrift | Søk, kategorifilter og sortering etter starttid |
| Bedrifter | Navn, bransje, standnummer, beskrivelse og nettside | Søk på navn og bransje |
| Workshops | Tid, bedrift, rom, maks plasser og forkunnskaper | Bedrift via `holderBedriftId`, rom via `romId` |
| Rom | Romnummer, kapasitet og utstyr | Gruppert etter bygning |
| Praktisk informasjon | Registrering, Wi-Fi, oppmøte, utstyr, åpningstider, stab | – |
| Kontakt | Festivalens e-post og ansvarlige lærere | Lærere hentes etter ansvarsområde |

---

## 8. Docker

Prosjektet har en Dockerfile i prosjektroten.

Docker brukes til å bygge og kjøre webapplikasjonen.

Eksempel på kommandoer:

```bash
docker build -t 2inf-festival .
docker run -p 8080:80 2inf-festival
```

Når containeren kjører, kan applikasjonen åpnes i nettleseren:

```text
http://localhost:8080
```

Docker-test er gjennomført og fungerer.

Fordeler med Docker i dette prosjektet:

- Andre utviklere kan kjøre løsningen enklere
- Miljøet blir mer likt på forskjellige maskiner
- Applikasjonen kan demonstreres uten manuell oppsett av webserver
- Docker passer godt med kravet om lokal kjøring og videreutvikling

### Deploy til Ubuntu Server

Nettsiden skal deployes til **Ubuntu Server (10.20.30.20)** med **Docker**. Docker er allerede installert og testet på serveren (Docker 29.5.3, `docker run hello-world` fungerer). Imaget bygges fra `Dockerfile` og kjøres som en container som serverer den ferdigbygde React-appen via Nginx.

Planlagt URL i festivalnettverket:

```text
http://festival.festival.local   (via DNS-sonen festival.local på Windows Server)
http://10.20.30.20                (direkte på IP)
```

A-recordet `festival.festival.local -> 10.20.30.20` er allerede opprettet i DNS-sonen på Windows Server, slik at navnet peker mot Ubuntu Server der containeren skal kjøre.

---

## 9. Nettverksplan

Nettverket er satt opp med følgende nettverksadresse:

```text
10.20.30.0/24
```

### IP-plan

```text
Router / gateway: 10.20.30.1
Access point management: 10.20.30.2
Switch management: 10.20.30.3
Windows Server: 10.20.30.10
Ubuntu Server: 10.20.30.20
DHCP range: 10.20.30.50 - 10.20.30.240
```

### Utstyr

Nettverket består av:

- Router
- Switch
- Access point
- Klienter
- Planlagt Windows Server
- Planlagt Ubuntu Server

### Trådløst nettverk

```text
SSID: 2INF-Festival-KostiantynK
Sikkerhet: WPA2
```

### DHCP

Klienter får IP-adresser automatisk via DHCP.

Eksempler fra test:

```text
Laptop fikk IP: 10.20.30.52
iPhone fikk IP: 10.20.30.53
```

### Vurdering av DHCP-krav

Oppgaven sier at DHCP skal dele ut 300 IP-adresser. Nettverket `10.20.30.0/24` gir totalt 256 adresser, hvor 254 er brukbare for enheter.

Det betyr at 300 DHCP-adresser ikke er teknisk mulig innenfor et `/24`-nettverk.

Jeg har derfor valgt å følge nettverksadressen fra oppgaven og dokumentere begrensningen. For å støtte 300 klienter måtte man brukt et større subnett, for eksempel `/23`, eller delt nettverket opp i flere VLAN/subnett.

### Nettverkstester

Følgende tester er gjennomført:

```text
Ping 10.20.30.1: OK
Ping 10.20.30.2: OK
Ping 10.20.30.3: OK
Ping 10.20.30.53: OK
Ping 8.8.8.8: OK
Ping google.com: OK
Internett på mobil: OK
WAN/internett fungerer: OK
```

---

## 10. Serveroppsett

### Status per 09.06.2026: ferdig

Serverdelen er nå **ferdig satt opp og testet**. Infrastrukturen er
virtualisert på en Proxmox-host og består av én Ubuntu Server og én Windows
Server i nettverket `10.20.30.0/24`.

| Komponent      | Status   | Kort beskrivelse                                              |
| -------------- | -------- | ------------------------------------------------------------ |
| Proxmox host   | ✅ Ferdig | Node `kostia` (10.20.30.4), `vmbr0` mot `nic0`, `vmbr1` fjernet |
| Ubuntu Server  | ✅ Ferdig | 10.20.30.20 med Nginx, Node.js (v22.22.1), Docker (29.5.3), SSH-nøkkel |
| Windows Server | ✅ Ferdig | 10.20.30.10, Server 2019, PowerShell Remoting (WinRM)        |
| DNS            | ✅ Ferdig | DNS-rolle på Windows, sone `festival.local` med A-records    |

Detaljert dokumentasjon og tester finnes i:

- `docs/serveroppsett-09-06-2026.md`
- `docs/testresultat-servere-09-06-2026.md`
- `docs/arbeidslogg-09-06-2026.md`

Avsnittene under viser den opprinnelige planen, som nå er gjennomført.

### Windows Server

Planlagt Windows Server-oppsett:

```text
OS: Windows Server 2019
Hostname: WIN-SRV-01
IP-adresse: 10.20.30.10
Gateway: 10.20.30.1
DNS: 10.20.30.10
Rolle: DNS
```

Windows Server skal brukes til DNS-rolle i nettverket. Serveren skal ha fast IP-adresse for at klienter og andre servere skal kunne bruke den stabilt.

Sikkerhetsvurderinger for Windows Server:

- Fast IP-adresse
- Kun nødvendige roller installeres
- Sterkt administratorpassord
- Oppdateringer installeres
- Brannmur aktiveres
- DNS-drift dokumenteres

### Ubuntu Server

Planlagt Ubuntu Server-oppsett:

```text
OS: Ubuntu Server 26.04 LTS
Hostname: UBUNTU-SRV-01
IP-adresse: 10.20.30.20
Gateway: 10.20.30.1
Docker: installeres
Nginx: installeres
Node.js: installeres
Bruker: festivalsjef
SSH: nøkkelbasert innlogging
Passordinnlogging: deaktivert
```

Ubuntu Server skal brukes til tjenester, webapplikasjon og Docker.

### Bruker festivalsjef

Det skal opprettes en bruker:

```text
festivalsjef
```

Brukeren skal få nødvendige rettigheter og SSH-tilgang med nøkkel. Public key fra vedlegget skal legges inn i:

```text
/home/festivalsjef/.ssh/authorized_keys
```

Planlagte kommandoer:

```bash
sudo adduser festivalsjef
sudo usermod -aG sudo festivalsjef

sudo mkdir -p /home/festivalsjef/.ssh
sudo nano /home/festivalsjef/.ssh/authorized_keys

sudo chown -R festivalsjef:festivalsjef /home/festivalsjef/.ssh
sudo chmod 700 /home/festivalsjef/.ssh
sudo chmod 600 /home/festivalsjef/.ssh/authorized_keys
```

SSH-konfigurasjon:

```text
PubkeyAuthentication yes
PasswordAuthentication no
PermitRootLogin no
```

Deretter restartes SSH:

```bash
sudo systemctl restart ssh
```

---

## 11. Sikkerhet

Sikkerhet er vurdert i både nettverk, servere og webapplikasjon.

### Nettverkssikkerhet

Tiltak:

- Router, AP og switch har faste IP-adresser
- DHCP-området starter etter statiske adresser
- WPA2 brukes på trådløst nettverk
- Switch-passord er endret
- AP er adoptert og administrert
- WAN er koblet riktig til router, ikke direkte til switch
- Gjestenettverk bør holdes adskilt fra servere og interne tjenester

### Serversikkerhet

Tiltak:

- Servere får faste IP-adresser
- Kun nødvendige tjenester installeres
- Brannmur bør kun åpne nødvendige porter
- Ubuntu skal bruke SSH-nøkkel i stedet for passord
- Root-login deaktiveres
- Passordinnlogging via SSH deaktiveres
- Brukeren `festivalsjef` får tilgang via nøkkel

Aktuelle porter:

```text
22: SSH
80: HTTP
443: HTTPS ved produksjon
```

### Websikkerhet

Tiltak:

- Data lagres i JSON og ikke som sensitiv informasjon i frontend
- Ingen passord eller hemmelige nøkler skal hardkodes i kildekoden
- Docker brukes for mer kontrollert kjøremiljø
- Applikasjonen bør testes før levering
- Feil og begrensninger dokumenteres

### HTTPS-vurdering

I lokal test brukes HTTP.

I produksjon bør løsningen bruke HTTPS. Dette kan løses med Nginx reverse proxy og Let's Encrypt dersom man har et domenenavn. I et lukket testmiljø kan man bruke self-signed sertifikat.

HTTPS er viktig fordi det beskytter trafikk mellom klient og server, hindrer enkel avlytting og gir en mer profesjonell og sikker løsning.

---

## 12. Testing

Testing er viktig for å vise at løsningen fungerer og for å dokumentere eventuelle feil.

### Gjennomførte tester

| Test | Resultat |
|---|---|
| React/Vite app starter lokalt | OK |
| Startside vises i nettleser | OK |
| Docker build | OK |
| Docker run på port 8080 | OK |
| datasett.json lagt i `data/` | OK |
| datasett.json kopiert til `app/src/data/` | OK |
| Git repository opprettet | OK |
| Flere commits laget | OK |
| Ping router `10.20.30.1` | OK |
| Ping AP `10.20.30.2` | OK |
| Ping switch `10.20.30.3` | OK |
| Ping iPhone `10.20.30.53` | OK |
| Ping `8.8.8.8` | OK |
| Ping `google.com` | OK |
| Wi-Fi klient får IP automatisk | OK |
| Internett fungerer på mobil | OK |
| Tailwind CSS installert og konfigurert | OK |
| Program vises fra JSON med søk og filter | OK |
| Bedrifter vises fra JSON | OK |
| Workshops vises fra JSON | OK |
| Romoversikt vises fra JSON | OK |
| Praktisk informasjon og kontakt vises | OK |
| SaaS-redesign vises (hero, farger, animasjoner) | OK |
| Samtykkebanner for informasjonskapsler vises og lagrer valg | OK |
| `npm run build` | OK |
| `npm run lint` | OK |

### Tester som skal gjennomføres videre

| Test | Forventet resultat |
|---|---|
| SSH med nøkkel | festivalsjef kan logge inn |
| SSH med passord | Innlogging avvises |
| Windows DNS | DNS-oppslag fungerer |
| Ubuntu Docker | Container kan kjøres på Ubuntu Server |
| Deploy på Ubuntu Server | Nettsiden er tilgjengelig på `http://festival.festival.local` og `http://10.20.30.20` |

---

## 13. Git og versjonskontroll

Prosjektet bruker Git lokalt.

Git brukes for å dokumentere utviklingsprosessen og vise hva som er gjort underveis. Commit-meldingene skal være beskrivende.

Eksisterende commits per 08.06.2026:

```text
7b35d6d Legg til festivaldata i webapplikasjonen
af9bd46 Legg til Dockerfile for webapplikasjon
5efa23b Lag enkel startside for festivalnettsted
5238590 Opprett React Vite-applikasjon
29edaf6 Initialiser prosjektstruktur for 2INF Festival
```

Til slutt skal Git-logg lagres i `log.txt` med kommandoen:

```bash
git log --oneline --decorate --all > log.txt
```

---

## 14. Status per 08.06.2026

### Ferdig

- Prosjektmappe opprettet
- Git repository opprettet
- React/Vite app opprettet
- Enkel startside/prototype laget
- Dockerfile lagt til
- Docker build testet
- Docker run testet
- `datasett.json` lagt til i prosjektet
- `datasett.json` kopiert til webapplikasjonen
- Flere Git commits laget
- Nettverk fysisk satt opp
- Router, switch og AP konfigurert
- DHCP fungerer
- Wi-Fi fungerer
- Internett fungerer

### Delvis ferdig

- Webapplikasjonen har prototype, men skal videreutvikles
- Dokumentasjon er startet
- Serveroppsett er planlagt, men ikke ferdig gjennomført

### Ikke ferdig ennå

- Windows Server-oppsett
- Ubuntu Server-oppsett
- festivalsjef-bruker med SSH-nøkkel
- Deaktivering av SSH-passordinnlogging
- Endelig README
- Endelig `log.txt`
- ZIP for innlevering

### Oppdatering per 09.06.2026

Webapplikasjonen er **ferdig utviklet**:

- Tailwind CSS installert og konfigurert
- Prosjektet strukturert med `components/`, `sections/` og `utils/`
- Nettsiden viser festival, program, bedrifter, workshops, rom, praktisk informasjon og kontakt fra `app/src/data/datasett.json`
- Program viser foredrag med søk, kategorifilter og sortering
- Bedrifter vises fra JSON med søk på navn og bransje
- Workshops vises fra JSON med bedrift og rom koblet via id
- Romoversikt vises fra JSON, gruppert etter bygning
- Praktisk informasjon og kontaktseksjon er laget
- Hele nettsiden er bygget om til en polert, SaaS-inspirert landingsside med ny hero, konsistent fargesystem og lette animasjoner
- Samtykkebanner for informasjonskapsler er lagt til
- Responsivt design for mobil og PC
- `npm run build` og `npm run lint` er testet uten feil

Serveroppsettet (Proxmox, Ubuntu Server, Windows Server med DNS) er også ferdig og testet, se egne dokumenter. Gjenstår fortsatt: deploy av Docker-imaget på Ubuntu Server (10.20.30.20) med tilgang via `http://festival.festival.local` / `http://10.20.30.20`, endelig `log.txt` og ZIP for innlevering.

---

## 15. Videre arbeid

Webapplikasjonen og serveroppsettet er ferdige. Gjenstående steg i prosjektet:

1. Deploye Docker-imaget på Ubuntu Server (10.20.30.20)
2. Verifisere tilgang via `http://festival.festival.local` og `http://10.20.30.20`
3. Vurdere HTTPS i produksjon
4. Generere `log.txt`
5. Pakke prosjektet som ZIP for innlevering

---

## 16. Konklusjon

Prosjektet er kommet langt. Grunnstrukturen er laget, Git brukes aktivt, Docker fungerer, og datasettet er lagt inn. Nettverket og serverne er satt opp og testet.

Webapplikasjonen er **ferdig utviklet** med React, Vite og Tailwind CSS i en komponentbasert struktur (`components/`, `sections/`, `utils/`). Nettsiden viser festival, program, bedrifter, workshops, rom, praktisk informasjon og kontakt dynamisk fra `app/src/data/datasett.json`, med søk/filter/sortering i programmet og søk i bedriftsoversikten. Den er bygget om til en polert, SaaS-inspirert landingsside med samtykkebanner for informasjonskapsler, og `npm run build` og `npm run lint` er testet uten feil.

Det viktigste videre er å deploye Docker-imaget på Ubuntu Server (10.20.30.20) med tilgang via `http://festival.festival.local` / `http://10.20.30.20`, og deretter sluttføre `log.txt` og ZIP for innlevering.

Løsningen følger hovedretningen IT-utvikling, men inneholder også dokumentasjon av nettverk, drift, sikkerhet og servere for å dekke den tverrfaglige delen av eksamen.
