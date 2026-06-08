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
│   │   └── data/
│   │       └── datasett.json
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

### Tester som skal gjennomføres videre

| Test | Forventet resultat |
|---|---|
| Program vises fra JSON | Foredrag vises med tid, rom og kategori |
| Bedrifter vises fra JSON | Bedrifter vises med navn, bransje og standnummer |
| Workshops vises fra JSON | Workshops vises med tid, rom og maks plasser |
| Rom vises fra JSON | Rom vises med romnummer, kapasitet og utstyr |
| Mobilvisning | Siden tilpasser seg liten skjerm |
| PC-visning | Siden fungerer på stor skjerm |
| SSH med nøkkel | festivalsjef kan logge inn |
| SSH med passord | Innlogging avvises |
| Windows DNS | DNS-oppslag fungerer |
| Ubuntu Docker | Container kan kjøres på Ubuntu Server |

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

- Full visning av program fra JSON
- Full visning av bedrifter fra JSON
- Full visning av workshops fra JSON
- Full visning av rom/kart
- Windows Server-oppsett
- Ubuntu Server-oppsett
- festivalsjef-bruker med SSH-nøkkel
- Deaktivering av SSH-passordinnlogging
- Endelig README
- Endelig `log.txt`
- ZIP for innlevering

---

## 15. Videre arbeid

Neste steg i prosjektet:

1. Videreutvikle React-nettsiden
2. Vise program, bedrifter, workshops og rom fra JSON
3. Forbedre responsivt design
4. Skrive ferdig README
5. Sette opp Windows Server med DNS
6. Sette opp Ubuntu Server med Docker, Nginx og Node.js
7. Opprette bruker `festivalsjef`
8. Legge inn SSH-nøkkel
9. Deaktivere passordinnlogging via SSH
10. Teste hele løsningen
11. Generere `log.txt`
12. Pakke prosjektet som ZIP

---

## 16. Konklusjon

Prosjektet har kommet godt i gang. Grunnstrukturen er laget, Git brukes aktivt, Docker fungerer, og datasettet er lagt inn. Nettverket er også satt opp og testet.

Det viktigste videre er å forbedre webapplikasjonen slik at den bruker data fra `datasett.json`, samt å fullføre serveroppsett og sluttføre dokumentasjonen.

Løsningen følger hovedretningen IT-utvikling, men inneholder også dokumentasjon av nettverk, drift, sikkerhet og servere for å dekke den tverrfaglige delen av eksamen.
