# Arbeidslogg – 08.06.2026

## Dato

08.06.2026

## Prosjekt

2INF Festival – IT-utvikling

## Mål for dagen

Målet for dagen var å starte prosjektet, sette opp grunnstruktur, begynne med webapplikasjon, legge inn Docker, starte Git-historikk og dokumentere status for videre arbeid.

---

## Arbeid utført

### 1. Prosjektstruktur

Jeg opprettet prosjektmappen `2inf-festival`.

Følgende mapper ble brukt:

```text
app/
data/
docs/
```

`app/` brukes til webapplikasjonen.  
`data/` brukes til original JSON-fil.  
`docs/` brukes til dokumentasjon.

---

### 2. Git

Jeg initialiserte Git lokalt i prosjektet.

Git brukes for å dokumentere arbeid underveis og for å kunne levere commit-logg til slutt.

Kommando:

```bash
git init
```

Jeg har laget flere commits med beskrivende commit-meldinger.

Eksisterende commits:

```text
7b35d6d Legg til festivaldata i webapplikasjonen
af9bd46 Legg til Dockerfile for webapplikasjon
5efa23b Lag enkel startside for festivalnettsted
5238590 Opprett React Vite-applikasjon
29edaf6 Initialiser prosjektstruktur for 2INF Festival
```

---

### 3. React/Vite

Jeg opprettet en React/Vite-applikasjon.

React og Vite ble valgt fordi det gir rask utvikling, enkel prosjektstruktur og passer godt til en moderne webapplikasjon.

Status:

```text
React/Vite app: ferdig opprettet
Startside/prototype: ferdig
Lokal kjøring: testet
```

---

### 4. Docker

Jeg la til Dockerfile for webapplikasjonen.

Docker brukes for å kunne kjøre løsningen lokalt på en enkel og lik måte på forskjellige maskiner.

Status:

```text
Dockerfile: ferdig
Docker build: testet
Docker run: testet
```

Applikasjonen kan kjøres med:

```bash
docker build -t 2inf-festival .
docker run -p 8080:80 2inf-festival
```

---

### 5. Festivaldata

Jeg la inn `datasett.json` i prosjektet.

Filen ligger i:

```text
data/datasett.json
app/src/data/datasett.json
```

Originalfilen ligger i `data/`.  
Kopien i `app/src/data/` brukes av React-applikasjonen.

Status:

```text
datasett.json lagt til: OK
datasett.json commitet: OK
```

Commit:

```text
Legg til festivaldata i webapplikasjonen
```

---

### 6. Nettverk

Nettverket for prosjektet er satt opp og testet.

Konfigurasjon:

```text
Nettverk: 10.20.30.0/24
Router / gateway: 10.20.30.1
AP management: 10.20.30.2
Switch management: 10.20.30.3
DHCP range: 10.20.30.50 - 10.20.30.240
SSID: 2INF-Festival-KostiantynK
Sikkerhet: WPA2
```

Klienter:

```text
Laptop fikk IP: 10.20.30.52
iPhone fikk IP: 10.20.30.53
```

Tester:

```text
ping 10.20.30.1: OK
ping 10.20.30.2: OK
ping 10.20.30.3: OK
ping 10.20.30.53: OK
ping 8.8.8.8: OK
ping google.com: OK
Internett på telefon: OK
```

---

## Problemer og vurderinger

### DHCP og 300 IP-adresser

Oppgaven ber om at DHCP skal kunne dele ut 300 IP-adresser, men nettverket `10.20.30.0/24` gir bare 254 brukbare adresser.

Dette er dokumentert som en faglig vurdering. For å støtte 300 klienter måtte nettverket vært større, for eksempel `/23`, eller delt opp i flere subnett/VLAN.

### Webapplikasjon

Per 08.06.2026 er nettsiden kun en prototype. Den skal videreutvikles slik at den viser data fra `datasett.json`.

Plan videre:

```text
Program
Bedrifter
Workshops
Rom
Praktisk informasjon
Kontakt
```

---

## Status ved slutten av dagen

### Ferdig

```text
Prosjektstruktur
Git repository
React/Vite app
Startside/prototype
Dockerfile
Docker build
Docker run
datasett.json lagt inn
Flere commits
Nettverk satt opp
Wi-Fi testet
Internett testet
```

### Ikke ferdig

```text
Full webside med JSON-visning
Windows Server
Ubuntu Server
SSH-bruker festivalsjef
Serverdokumentasjon med faktiske tester
Endelig README
log.txt
ZIP for innlevering
```

---

## Neste arbeidsøkt

Neste gang skal jeg jobbe videre med:

1. Forbedre webapplikasjonen
2. Vise data fra `datasett.json`
3. Skrive ferdig README
4. Dokumentere serveroppsett
5. Sette opp Windows Server
6. Sette opp Ubuntu Server
7. Teste SSH-nøkkel for `festivalsjef`
8. Generere `log.txt`

---

## Egen vurdering

Arbeidet 08.06.2026 har vært produktivt. Prosjektet har fått en god teknisk start med Git, React, Docker og datasett. Nettverket er også satt opp og testet.

Det viktigste videre er å gjøre webapplikasjonen mer komplett og fullføre serverdelen.
