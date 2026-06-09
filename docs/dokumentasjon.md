# Dokumentasjon – 2INF Festival

Samlet hoveddokumentasjon for eksamensprosjektet i ITK2004 (tverrfaglig eksamen
i informasjonsteknologi). Mer detaljer finnes i de øvrige filene i `docs/`:
`teknologivalg.md`, `serveroppsett.md`, `nettverksplan.md`, `sikkerhet.md` og
`testing.md`.

- **Live (internt):** https://festival.lan
- **GitHub:** https://github.com/kharchenko7002/festival (branch `main`)

---

## 1. Innledning

Prosjektet handler om 2INF Festival, en karriere- og teknologifestival
arrangert av VG2 Informasjonsteknologi. Oppgaven er å lage en digital løsning
for festivalen og dokumentere et komplett IT-miljø rundt den.

Jeg har valgt hovedretningen **IT-utvikling**. Løsningen er en webapplikasjon
som presenterer festivalen, og som driftes på egne servere med Docker, Nginx,
HTTPS og intern DNS.

## 2. Oppgave og mål

Oppgaven krever blant annet:

- En webapplikasjon for festivalen (program, deltakere, kart/oversikt, praktisk
  informasjon), som fungerer på mobil og PC
- Bruk av et egnet rammeverk
- Docker image og Dockerfile
- Dokumentasjon av oppstart, testing, sikkerhet og HTTPS
- Bruk av Git med jevnlige commits
- Et nettverk med router, switch og access point
- Windows Server og Ubuntu Server i samme nettverk

**Mål:** en løsning som er enkel å kjøre, godt dokumentert, sikret på et
fornuftig nivå og mulig å demonstrere på eksamensdagen.

## 3. Valg av retning: IT-utvikling

Jeg valgte **IT-utvikling** fordi en webapplikasjon passer best til å presentere
festivalen og vise data fra datasettet. Løsningen kan demonstreres tydelig i
nettleser og kjøres med Docker. Siden eksamen er tverrfaglig, dokumenterer jeg
også nettverk, servere, drift og sikkerhet.

## 4. Løsningsoversikt

```text
Klient (PC/mobil)
   │  https://festival.lan
   ▼
Windows Server DNS (10.20.30.10)  → løser navnet til 10.20.30.20
   ▼
Ubuntu Server (10.20.30.20)
   ├─ Nginx reverse proxy (HTTPS, selvsignert sertifikat)
   └─ Docker-container (Nginx + bygd React-app)
```

Alle serverne kjører som virtuelle maskiner på en Proxmox-host. Nettverket
styres med UniFi (gateway og access point) og en TP-Link-svitsj.

## 5. Webapplikasjon

Webapplikasjonen er laget med React og Vite, og stylet med Tailwind CSS. Den er
en responsiv, lys hvit-blå landingsside i SaaS-stil. Seksjoner:

| Seksjon | Innhold | Funksjonalitet |
| --- | --- | --- |
| Hero | Navn, dato, tid, sted, beskrivelse | CTA «Meld meg på» og «Se program» |
| Nøkkeltall | Antall bedrifter, foredrag, workshops, rom | Tall fra datasettet |
| Om festivalen | Forklaring + bilder | – |
| Program | Foredrag med tid, kategori, rom, plasser, bedrift | Søk, kategorifilter, sortering |
| Bedrifter | Navn, bransje, standnummer, beskrivelse, nettside | Søk på navn/bransje |
| Workshops | Tid, bedrift, rom, maks, forkunnskaper + bilde | `holderBedriftId`, `romId` |
| Rom | Romnummer, kapasitet, utstyr | Gruppert etter bygning |
| Praktisk info | Registrering, Wi-Fi, oppmøte, utstyr + bilde | – |
| Påmelding | Skjema + oppsummering | Prototype, se kap. 9 |
| Kontakt | Festival-e-post, ansvarlige lærere + bilde | Lærere etter ansvarsområde |

All synlig tekst er på norsk bokmål.

## 6. Bruk av datasett.json

Alt innhold hentes fra `app/src/data/datasett.json`. Filen inneholder festival,
bedrifter, lærere, elever, rom, foredrag og workshops.

```text
Navn: 2INF Festival 2027
Dato: 2027-03-18
Sted: Hamar katedralskole
Tid: 09:00–15:00
```

Data leses gjennom hjelpefunksjonene i `app/src/utils/dataHelpers.js`, slik at
JSON-strukturen bare refereres ett sted. Funksjonene kobler også sammen data,
f.eks. `holderBedriftId → bedrifter.id` og `romId → rom.id`, og lager
nedtrekksvalg og oppsummeringer til påmeldingsskjemaet.

## 7. Komponentstruktur

```text
app/src/
├── components/   Header, Footer, SectionTitle, StatCard, SearchInput,
│                 Badge, Reveal, CookieConsent
├── sections/     Hero, About, Program, Companies, Workshops, Rooms,
│                 PracticalInfo, Pamending, Contact
├── utils/        dataHelpers.js
├── data/         datasett.json
├── App.jsx       setter sammen seksjonene
├── main.jsx      starter React
└── index.css     Tailwind + festivalfarger og stiler
```

- `components/` er små gjenbrukbare deler.
- `sections/` er de enkelte delene av siden.
- `utils/dataHelpers.js` leser og kobler sammen data.

## 8. Designvalg

- Lys hvit-blå tema med en varm gul aksent, definert i `index.css`.
- Konsistente knappe- og kortstiler.
- Lette CSS-animasjoner (hover-løft, svev, scroll-inn via `Reveal`), uten tunge
  bibliotek. Animasjonene respekterer `prefers-reduced-motion`.
- Sticky header med tekstlogo «2INF Festival» (det gamle «2i»-ikonet er fjernet)
  og mobilmeny.
- En samtykkebanner for informasjonskapsler vises ved første besøk; valget
  lagres i `localStorage`.

> Merknad: En fargevelger for tema ble laget, men deretter fjernet etter ønske.
> Nettsiden beholder den lyse hvit-blå temaen.

## 9. Påmelding (prototype)

Seksjonen **Påmelding** (`id="pamelding"`) er en **frontend-prototype uten
backend**. Den lagrer ingenting og sender ingen data; ved innsending vises
bekreftelsen «Takk! Din påmelding er registrert i prototypen.»

Felter: Navn, Klasse, E-post, Velg bedrift, Velg workshop, Ønsket tidspunkt,
Kommentar / behov.

- **Velg bedrift** – nedtrekk med alle bedrifter fra datasettet.
- **Velg workshop** – nedtrekk med alle workshops fra datasettet.
- **Ønsket tidspunkt** – nedtrekk basert på tidspunktene til workshopene.
- Velger man en **workshop**, vises tittel, bedrift, rom, tid, maks deltakere og
  forkunnskaper.
- Velger man en **bedrift**, vises navn, bransje, standnummer og nettside.

## 10. Bilder / visuelt innhold

Bilder ligger i `app/public/images/` og brukes i seksjonene About, Workshops,
Praktisk info og Kontakt. Bildene vises med `object-cover`, avrundede hjørner,
myk skygge og er responsive, slik at de ikke strekkes eller blir for tunge.

## 11. Teknologivalg

Kort oppsummert (full begrunnelse i `docs/teknologivalg.md`):

| Teknologi | Rolle |
| --- | --- |
| React + Vite | Webapplikasjon og bygg |
| Tailwind CSS | Styling |
| JSON | Datakilde |
| Docker | Pakking og kjøring |
| Nginx | Webserver og reverse proxy |
| Ubuntu Server | Drift |
| Windows Server | DNS |
| Proxmox | Virtualisering |
| UniFi | Nettverk |
| Git / GitHub | Versjonskontroll |

## 12. Proxmox

Proxmox-host (node `kostia`, 10.20.30.4, https://10.20.30.4:8006) kjører begge
serverne som VM-er på broen `vmbr0`. Den gamle broen `vmbr1` er fjernet.

| VM | ID | OS | IP |
| --- | --- | --- | --- |
| `2INF-Festival-Kostiantyn-Ubuntu` | 100 | Ubuntu Server 26.04 LTS | 10.20.30.20 |
| `2INF-Festival-Kostiantyn-Windows` | 101 | Windows Server 2019 | 10.20.30.10 |

## 13. Ubuntu Server

Hostname `ubuntu-srv-01`, IP 10.20.30.20/24, gateway 10.20.30.1. Kjører Nginx,
Docker og Node.js. Bruker `festivalsjef` er i gruppene `sudo` og `docker` og
logger inn med SSH-nøkkel. Detaljer i `docs/serveroppsett.md`.

## 14. Windows Server

Hostname `WIN-SRV-01`, IP 10.20.30.10, Windows Server 2019. Har DNS-rollen og
PowerShell Remoting (WinRM). Detaljer i `docs/serveroppsett.md`.

## 15. DNS og domene

Intern DNS på Windows Server løser:

| Navn | Peker på |
| --- | --- |
| `festival.lan` | 10.20.30.20 |
| `www.festival.lan` | 10.20.30.20 |
| `festival.festival.local` | 10.20.30.20 |

Forwarders (8.8.8.8 og 1.1.1.1) brukes for oppslag mot internett. `festival.lan`
er kun internt og ikke et offentlig domene.

## 16. Docker og deployment

Imaget bygges fra `Dockerfile` (to-trinns bygg: React bygges med Node, `dist/`
serveres av Nginx). På Ubuntu Server er prosjektet kopiert inn, imaget bygget og
containeren startet.

```bash
docker build -t 2inf-festival .
docker run -d -p 8080:80 --name 2inf-festival --restart unless-stopped 2inf-festival
```

## 17. Nginx og HTTPS

På Ubuntu Server står Nginx som **reverse proxy** foran containeren og håndterer
HTTPS med et **selvsignert sertifikat**:

```text
Klient → https://festival.lan → Nginx (HTTPS) → Docker-container (port 80)
```

Det selvsignerte sertifikatet gir en nettleseradvarsel i testmiljøet.

## 18. Nettverksoppsett

Nettverk `10.20.30.0/24`. Full plan i `docs/nettverksplan.md`.

| Enhet | IP | Type |
| --- | --- | --- |
| USG 3P Gateway | 10.20.30.1 | Statisk |
| U6 Lite AP | 10.20.30.2 | Statisk |
| TP-Link Switch | 10.20.30.3 | Statisk |
| Proxmox Host | 10.20.30.4 | Statisk |
| Windows Server | 10.20.30.10 | Statisk |
| Ubuntu Server | 10.20.30.20 | Statisk |
| Laptop / klient | 10.20.30.52 | DHCP |
| DHCP-område | 10.20.30.50–10.20.30.240 | Dynamisk |

SSID `2INF-Festival-KostiantynK`, sikkerhet WPA2.

## 19. UniFi-oppsett

USG 3P og U6 Lite er adoptert og «Up to date». Enhetene er navngitt manuelt for
en tydelig oversikt. Begrensning: TP-Link-svitsjen er ikke en UniFi-enhet, så
UniFi viser ikke full port-basert topologi.

## 20. Sikkerhetsvurdering

Kort oppsummert (full vurdering i `docs/sikkerhet.md`): WPA2 på Wi-Fi, statiske
IP-er på infrastruktur med DHCP-område atskilt, nøkkelbasert SSH med
`PasswordAuthentication no` og `PermitRootLogin no`, isolert Docker-container,
intern DNS og HTTPS. Påmelding uten backend gjør at ingen personopplysninger
lagres.

## 21. Testing

Alle gjennomførte tester bestod: `npm run build`, `npm run lint`, visning av
data, påmelding-prototype, Docker-container, `curl`, Nginx reverse proxy, HTTPS
på `festival.lan`, `nslookup`, nettleser-/mobiltest, ping-tester, SSH (nøkkel
inn / passord avvist) og UniFi-status. Full tabell i `docs/testing.md`.

## 22. Feilsøking

| Problem | Årsak | Løsning |
| --- | --- | --- |
| Windows fikk ikke nettverk | Manglet VirtIO-driver | Installerte driver fra `virtio-win.iso` |
| `nslookup` viste «Server: Unknown» | Manglende reverse-sone (PTR) | Uproblematisk – navn løses riktig |
| Nettleseradvarsel på HTTPS | Selvsignert sertifikat | Godta advarselen i testmiljø |
| VPN hjemmefra nådde ikke nettet | Manglende ruting på VPN-server | Ikke løst – dokumentert som begrensning |
| Ekstra Proxmox-bro `vmbr1` | Gammelt oppsett | Fjernet, kun `vmbr0` brukes |

## 23. Hva jeg lærte

- Å bygge en komponentbasert React-app og hente data fra JSON via hjelpefunksjoner.
- Å style raskt og responsivt med Tailwind CSS.
- Å pakke og kjøre en app med Docker, og servere den med Nginx.
- Å sette opp Nginx som reverse proxy og legge på HTTPS.
- Å sikre SSH med nøkler og slå av passord-/root-innlogging.
- Å sette opp DNS på Windows Server og virtualisere med Proxmox.
- Å bruke Git og GitHub jevnlig gjennom prosjektet.

## 24. Begrensninger

- Påmelding er en frontend-prototype uten lagring/backend.
- HTTPS bruker et selvsignert sertifikat (nettleseradvarsel).
- `festival.lan` er kun internt, ikke et offentlig domene.
- TP-Link-svitsjen hindrer full port-basert UniFi-topologi.
- VPN hjemmefra med kun WireGuard på laptopen var ikke nok; VPN-serversiden
  måtte også støtte ruting til `10.20.30.0/24`.
- Et `/24`-nett gir 254 brukbare adresser, så kravet om 300 DHCP-adresser er
  ikke teknisk mulig uten et større subnett.

## 25. Konklusjon

Webapplikasjonen er ferdig utviklet med React, Vite og Tailwind CSS, viser all
data fra `datasett.json` og har en fungerende påmeldingsprototype. Løsningen er
deployet på Ubuntu Server med Docker, Nginx reverse proxy og HTTPS, og er
tilgjengelig på `https://festival.lan`. Nettverk, servere, DNS, sikkerhet og
testing er dokumentert, og koden er lagt ut på GitHub. Løsningen følger
hovedretningen IT-utvikling og dekker samtidig den tverrfaglige delen med drift,
nettverk og sikkerhet. Begrensningene er bevisste valg for et lukket testmiljø
og er dokumentert ærlig.
