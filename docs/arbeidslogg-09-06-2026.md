# Arbeidslogg – 09.06.2026 (serveroppsett)

## Dato

09.06.2026

## Prosjekt

2INF Festival – IT-utvikling

## Mål for dagen

Målet for denne økten var å fullføre serverdelen av prosjektet: sette opp
Proxmox-host, Ubuntu Server og Windows Server, installere nødvendige tjenester,
sikre tilgang med SSH-nøkkel og konfigurere DNS. Til slutt skulle hele
serveroppsettet testes og dokumenteres.

> Merknad: Webapplikasjonen ble videreutviklet tidligere samme dag. Den delen
> er dokumentert i `arbeidslogg-08-06-2026.md` (tillegg 09.06.2026). Denne
> loggen handler kun om serveroppsettet.

---

## Arbeid utført

### 1. Proxmox

Jeg satte opp Proxmox-host (node `kostia`, 10.20.30.4) koblet direkte til
switchen. Jeg ryddet opp i nettverket ved å fjerne den gamle broen `vmbr1`,
som ikke lenger var nødvendig, og brukte `vmbr0` som hovedbro mot det fysiske
nettverkskortet `nic0`. Alle VM-er ble koblet til `vmbr0` slik at de ligger i
nettverket `10.20.30.0/24`.

```text
Node: kostia
URL: https://10.20.30.4:8006
Hovedbro: vmbr0 -> nic0
Nettverk: 10.20.30.0/24
vmbr1: fjernet
```

### 2. Ubuntu Server

Jeg opprettet VM `2INF-Festival-Kostiantyn-Ubuntu` (VM ID 100) med Ubuntu
Server 26.04 LTS, fast IP `10.20.30.20/24` og gateway `10.20.30.1`.

```text
Hostname: ubuntu-srv-01
CPU: 2 kjerner
RAM: 4 GB
Disk: 32 GB
Bridge: vmbr0
```

Nettverk ble verifisert med `hostname`, `ip -br addr`, `ip route` og `ping`
mot gateway, 8.8.8.8 og google.com. Laptop kunne åpne `http://10.20.30.20`.

### 3. Tjenester på Ubuntu

Jeg installerte og testet Nginx, Node.js og Docker:

```text
Nginx: active/running, curl -I gir 200 OK (localhost og 10.20.30.20)
Node.js: v22.22.1
npm: 9.2.0
Docker: 29.5.3, docker run hello-world fungerer
```

### 4. Bruker og SSH-sikkerhet

Jeg opprettet driftsbrukeren `festivalsjef` med sudo- og docker-rettigheter, la
inn SSH-nøkkel og sikret SSH-tjenesten:

```text
groups festivalsjef: festivalsjef sudo users docker
SSH-nøkkelinnlogging: fungerer
docker run hello-world uten sudo: fungerer
permitrootlogin: no
passwordauthentication: no
Passord-SSH gir: Permission denied (publickey)
```

### 5. Windows Server

Jeg opprettet VM `2INF-Festival-Kostiantyn-Windows` (VM ID 101) med Windows
Server 2019 Standard Evaluation (Desktop Experience) fra riktig ISO, og
installerte VirtIO-nettverksdriveren fra `virtio-win.iso`.

```text
Hostname: WIN-SRV-01
IP: 10.20.30.10 / 255.255.255.0
Gateway: 10.20.30.1
DNS: 10.20.30.10
CPU: 4 kjerner, RAM: 8192 MB, Disk: 60 GB SATA
Nettverk: VirtIO, vmbr0
```

Nettverk ble verifisert med `ipconfig` og `ping` mot gateway, internett og
Ubuntu Server. PowerShell Remoting (WinRM) ble aktivert, og laptop kunne koble
til med `Enter-PSSession`.

### 6. DNS

Jeg installerte DNS-rollen på Windows Server:

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

Resultat: Success True, Restart Needed No. Jeg satte opp forwarders (8.8.8.8 og
1.1.1.1) og opprettet den lokale sonen `festival.local` med A-records:

```text
win-srv-01.festival.local    -> 10.20.30.10
ubuntu-srv-01.festival.local -> 10.20.30.20
festival.festival.local      -> 10.20.30.20
```

Alle `nslookup`-tester løste navnene riktig.

---

## Problemer og vurderinger

### vmbr1

Den gamle broen `vmbr1` var ikke lenger i bruk. Jeg fjernet den for å holde
nettverksoppsettet enkelt, slik at alle VM-er bruker samme bro (`vmbr0`).

### nslookup "Server: Unknown"

`nslookup` viser `Server: Unknown`. Dette skyldes at reverse-oppslag (PTR) for
DNS-serveren ikke er satt opp, og er ikke et problem så lenge navnene løses
korrekt – noe de gjør.

### VirtIO-driver i Windows

Windows Server fikk ikke nettverk før VirtIO-driveren ble installert fra
`virtio-win.iso`. Etter installasjon fungerte nettverkskortet.

---

## Status ved slutten av økten

```text
Proxmox-host: ferdig
vmbr0 som hovedbro: ferdig
vmbr1 fjernet: ferdig
Ubuntu Server (VM 100): ferdig
Nginx, Node.js, Docker: ferdig
Bruker festivalsjef med SSH-nøkkel: ferdig
SSH-passord og root deaktivert: ferdig
Windows Server (VM 101): ferdig
PowerShell Remoting: ferdig
DNS-rolle og sone festival.local: ferdig
Alle servertester: bestått
```

---

## Gjenstår

```text
Endelig log.txt (genereres til slutt)
ZIP for innlevering
HTTPS i produksjon (vurdering, ikke krav i testmiljø)
```

---

## Egen vurdering

Økten 09.06.2026 fullførte hele serverdelen av prosjektet. Infrastrukturen er
nå virtualisert på Proxmox med en ryddig nettverksbro, Ubuntu Server kjører
tjenestene som webapplikasjonen trenger, og Windows Server leverer DNS. Sikker
tilgang er på plass med nøkkelbasert SSH og deaktivert root-innlogging. Det
viktigste som gjenstår er å deploye webapplikasjonen på Ubuntu Server, generere
`log.txt` og pakke prosjektet for innlevering.

---

## Tillegg: ferdigstilling av webapplikasjonen (09.06.2026)

Senere samme dag ble webapplikasjonen ferdigstilt. Dette arbeidet hører til
utviklingsdelen, men noteres her siden det skjedde i samme dato.

### Arbeid utført

- Hele nettsiden ble bygget om til en polert, SaaS-inspirert landingsside med
  et konsistent fargesystem (rent hvitt, dyp marineblå og en varm gul aksent),
  definert i `app/src/index.css`.
- Ny hero-seksjon med stor overskrift, infokort for dato/tid/sted og en
  dashboard-mockup bygget i Tailwind.
- Alle seksjonene (om, program, bedrifter, workshops, rom, praktisk
  informasjon og kontakt) fikk nytt kortdesign og lette CSS-animasjoner
  (hover-løft, svevende heroelementer og scroll-baserte fade/slide-inn via
  `Reveal`-komponenten). Ingen tunge animasjonsbibliotek er brukt.
- En samtykkebanner for informasjonskapsler (`CookieConsent`) ble lagt til.
  Valget lagres i `localStorage`, slik at banneret kun vises ved første besøk.
- Funksjonaliteten ble bevart: søk/filter/sortering i programmet, søk i
  bedriftsoversikten, kobling av `holderBedriftId` og `romId`, romgruppering
  per bygning og valg av kontaktlærere.

### Tekniske detaljer

```text
React + Vite + Tailwind CSS
Datakilde: app/src/data/datasett.json (lest via utils/dataHelpers.js)
Struktur: components/, sections/, utils/
npm run build: OK
npm run lint: OK
```

### Gjenstår for webdelen

```text
Deploy til Ubuntu Server (10.20.30.20) med Docker
URL: http://festival.festival.local eller http://10.20.30.20
```

---

## Tillegg 2: påmelding, deployment og sluttføring (09.06.2026)

Sent på dagen ble de siste delene av prosjektet fullført: ny
påmeldingsfunksjon, bilder, opprydding i designet, deployment på Ubuntu Server
og endelig dokumentasjon.

### Webapplikasjon – nye endringer

- Det kvadratiske ikonet «2i» i toppmenyen ble fjernet. Headeren har nå kun
  tekstlogoen **2INF Festival**.
- En tydelig CTA-knapp **«Meld meg på»** ble lagt til i header, hero-seksjonen
  og praktisk info, og leder til en ny påmeldingsseksjon.
- Det ble laget en ny seksjon **Påmelding** (`id="pamelding"`) som en
  **frontend-prototype uten backend**. Skjemaet sender ingen data; etter
  innsending vises bekreftelsen «Takk! Din påmelding er registrert i
  prototypen.»
- Skjemaet inneholder feltene: Navn, Klasse, E-post, Velg bedrift, Velg
  workshop, Ønsket tidspunkt og Kommentar / behov.
- Nedtrekksmenyene hentes fra `datasett.json`: bedrifter, workshops og
  tidspunkt (basert på workshop-tidene). Nye hjelpefunksjoner ble lagt til i
  `utils/dataHelpers.js` (`getCompanyOptions`, `getWorkshopOptions`,
  `getAvailableTimeSlots`, `getWorkshopDetails`, `getCompanyDetails`).
- Ved valg av workshop vises en oppsummering (tittel, bedrift, rom, tid, maks
  deltakere, forkunnskaper). Ved valg av bedrift vises navn, bransje,
  standnummer og nettside.
- Det ble lagt til bilder i `app/public/images/`, brukt i seksjonene About,
  Workshops, Praktisk info og Kontakt (object-cover, avrundede hjørner, myk
  skygge, responsivt).
- En fargevelger for tema ble først lagt til, men deretter **fjernet** etter
  ønske. Nettsiden beholder den lyse, hvit-blå temaen.
- `npm run build` og `npm run lint` ble kjørt på nytt – begge uten feil.

### GitHub

- Det ble opprettet et GitHub-repo og koden ble lastet opp:
  `https://github.com/kharchenko7002/festival` (branch `main`).
- `git push` fullførte etter innlogging i nettleseren.

### Deployment på Ubuntu Server

- Prosjektet ble kopiert til Ubuntu Server (10.20.30.20).
- Docker-imaget ble bygget på serveren, og containeren kjører.
- Nginx ble satt opp som **reverse proxy** foran containeren.
- HTTPS ble satt opp med et **selvsignert sertifikat**.
- Nettsiden er tilgjengelig på `https://festival.lan` og `https://10.20.30.20`.

### DNS og UniFi

- DNS-sonen ble utvidet slik at `festival.lan` og `www.festival.lan` peker på
  10.20.30.20 (i tillegg til `festival.festival.local`).
- UniFi-enhetene (USG 3P og U6 Lite) er adoptert og «Up to date», og enhetene
  er navngitt manuelt i topologien.

### Sluttdokumentasjon

- README og dokumentasjonen i `docs/` ble oppdatert: `dokumentasjon.md`,
  `teknologivalg.md`, `serveroppsett.md`, `nettverksplan.md`, `sikkerhet.md` og
  `testing.md`.
- `.gitignore` ble oppdatert slik at deploy-arkiver (`*.tar.gz`) ikke
  versjonskontrolleres.

### Status

```text
Webapplikasjon: ferdig (inkl. påmelding og bilder)
Tema: lys hvit-blå (fargevelger fjernet)
GitHub: kode pushet til main
Deployment: Docker + Nginx + HTTPS på Ubuntu
URL: https://festival.lan
Dokumentasjon: oppdatert
```

### Ærlige begrensninger

- Påmelding er en frontend-prototype uten lagring/backend.
- HTTPS-sertifikatet er selvsignert (nettleseradvarsel).
- `festival.lan` er kun internt, ikke et offentlig domene.
- TP-Link-svitsjen gjør at UniFi ikke viser full port-basert topologi.
- VPN hjemmefra med kun WireGuard på laptopen var ikke nok til å nå
  `10.20.30.0/24`; ruting på VPN-serversiden måtte også vært satt opp.
