# 2INF Festival

Dette prosjektet er laget som forberedelse til tverrfaglig eksamen i informasjonsteknologi.

Jeg har valgt hovedretningen **IT-utvikling**. Prosjektet består av en webapplikasjon for 2INF Festival, samt dokumentasjon av nettverk, serveroppsett, sikkerhet, testing, Docker og teknologivalg.

## Status

Per 08.06.2026 er følgende gjort:

- React/Vite-applikasjon er opprettet
- Enkel startside/prototype er laget
- Dockerfile er laget
- Docker build er testet
- Docker run er testet
- datasett.json er lagt inn i prosjektet
- Git repository er opprettet
- Flere commits er laget
- Dokumentasjon og arbeidslogg er skrevet
- Nettverk er satt opp og testet

Per 09.06.2026 er følgende gjort:

- Tailwind CSS er installert og konfigurert
- Prosjektet er strukturert med gjenbrukbare komponenter og seksjoner
- Festivaldata vises fra datasett.json (festival, bedrifter, foredrag, workshops, rom, lærere)
- Program har søk, kategorifilter og sortering etter tid
- Bedrifter har søk på navn og bransje
- Romoversikt er gruppert etter bygning
- Praktisk informasjon og kontaktseksjon er laget
- Nettsiden er gjort responsiv for mobil og desktop

### Serverstatus per 09.06.2026 (ferdig)

Serverdelen er ferdig satt opp og testet. Infrastrukturen er virtualisert på
en Proxmox-host i nettverket 10.20.30.0/24:

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
│   │   ├── components/   (Header, Footer, SectionTitle, StatCard, SearchInput, Badge)
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
│   ├── dokumentasjon.md
│   └── arbeidslogg-08-06-2026.md
├── Dockerfile
├── .dockerignore
├── README.md
└── log.txt
Data

Festivaldata ligger i:

data/datasett.json
app/src/data/datasett.json

Originalfilen ligger i data/.

Kopien i app/src/data/ brukes av React-applikasjonen.

Kjør prosjektet lokalt uten Docker
cd app
npm install
npm run dev

Åpne nettsiden:

http://localhost:5173
Kjør prosjektet med Docker

Fra prosjektroten:

docker build -t 2inf-festival .
docker run -p 8080:80 2inf-festival

Åpne nettsiden:

http://localhost:8080
Dokumentasjon

Dokumentasjon ligger i docs/.

Viktige filer:

docs/dokumentasjon.md
docs/arbeidslogg-08-06-2026.md

Dokumentasjonen inneholder informasjon om:

krav fra oppgaven
valgt hovedretning
prosjektstruktur
teknologivalg
Docker
nettverksplan
serveroppsett
sikkerhet
testing
Git
videre arbeid
Nettverk

Nettverket er satt opp med:

Nettverk: 10.20.30.0/24
Router / gateway: 10.20.30.1
AP management: 10.20.30.2
Switch management: 10.20.30.3
DHCP range: 10.20.30.50 - 10.20.30.240
SSID: 2INF-Festival-KostiantynK
Sikkerhet: WPA2
Serveroppsett

Planlagt serveroppsett:

Windows Server
OS: Windows Server 2019
IP: 10.20.30.10
Gateway: 10.20.30.1
Rolle: DNS
Ubuntu Server
OS: Ubuntu Server 26.04 LTS
IP: 10.20.30.20
Gateway: 10.20.30.1
Docker
Nginx
Node.js
Bruker: festivalsjef
SSH med nøkkel
Passordinnlogging deaktivert
Sikkerhet

Viktige sikkerhetstiltak:

WPA2 på trådløst nettverk
faste IP-adresser på infrastruktur
DHCP-område skilt fra statiske adresser
SSH med nøkkel for festivalsjef
passordinnlogging via SSH skal deaktiveres
root-login skal deaktiveres
kun nødvendige porter skal åpnes
HTTPS bør brukes i produksjon
ingen passord eller hemmelige nøkler skal hardkodes i kildekoden
Testing

Gjennomførte tester:

Test	Resultat
React/Vite app starter lokalt	OK
Startside vises	OK
Docker build	OK
Docker run	OK
datasett.json lagt til	OK
Git commits laget	OK
Ping router	OK
Ping AP	OK
Ping switch	OK
Ping 8.8.8.8	OK
Ping google.com	OK
Internett på mobil	OK
Git

Prosjektet bruker Git lokalt.

For å se commit-historikk:

git log --oneline

Ved innlevering skal commit-logg lagres slik:

git log --oneline --decorate --all > log.txt
Videre arbeid

Neste steg:

Sette opp Windows Server
Sette opp Ubuntu Server
Opprette bruker festivalsjef
Teste SSH-nøkkel
Generere log.txt
Pakke prosjektet som ZIP