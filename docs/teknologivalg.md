# Teknologivalg – 2INF Festival

Dette dokumentet forklarer hvilke teknologier som er brukt i prosjektet og
hvorfor de er valgt. Hovedretningen er **IT-utvikling**, og teknologiene er
valgt for å lage en moderne webløsning som også kan driftes på egne servere.

---

## Oversikt

| Teknologi | Brukes til | Hvorfor |
| --- | --- | --- |
| React | Frontend-rammeverk | Komponentbasert, enkelt å dele opp og videreutvikle |
| Vite | Byggeverktøy / dev-server | Rask oppstart og enkelt oppsett med React |
| Tailwind CSS | Styling | Raskt, konsistent og responsivt design |
| JavaScript / JSX | Programmeringsspråk | Standard for React, kjent fra undervisningen |
| JSON (`datasett.json`) | Datakilde | Skiller data fra presentasjon |
| Docker | Pakking og kjøring | Likt kjøremiljø, enkel utrulling |
| Nginx | Webserver / reverse proxy | Lett, stabil, god på statiske filer og HTTPS |
| Ubuntu Server | Server-OS | Vanlig, godt dokumentert Linux-server |
| Windows Server | DNS | Krav i oppgaven, kjent DNS-rolle |
| Proxmox VE | Virtualisering | Kjøre flere VM-er på én fysisk maskin |
| UniFi | Nettverk | Sentral styring av gateway og access point |
| Git / GitHub | Versjonskontroll | Historikk, sikkerhetskopi og innlevering |

---

## React

React er valgt fordi det passer godt til å bygge en webapplikasjon av
gjenbrukbare komponenter. Nettsiden er delt opp i små deler, for eksempel
`Header`, `HeroSection`, `ProgramSection`, `WorkshopsSection` og
`PamendingSection`. Dette gjør koden ryddig og enkel å videreutvikle.

React gjør det også enkelt å vise data dynamisk. Innholdet leses fra
`datasett.json`, og komponentene viser det automatisk – for eksempel lister med
bedrifter, foredrag og workshops, og nedtrekksmenyene i påmeldingsskjemaet.

## Vite

Vite er valgt fordi det gir en rask utviklingsserver og et enkelt
produksjonsbygg. `npm run dev` starter raskt, og `npm run build` lager en
optimalisert `dist/`-mappe som kan serveres av Nginx. Vite passer godt til en
eksamensoppgave der løsningen må kunne demonstreres effektivt.

## Tailwind CSS

Tailwind CSS er valgt for å style nettsiden raskt og konsistent. I stedet for
mange egne CSS-filer brukes ferdige klasser direkte i komponentene, med god
kontroll på farger, avstand og brytningspunkter for mobil og PC.

Tailwind er satt opp som en Vite-plugin (`@tailwindcss/vite`) og importeres i
`src/index.css`. Der er det også definert egne festivalfarger (hvit, marineblå
og en gul aksent) og gjenbrukbare knappe- og kortstiler. Nettsiden bruker en
lys, hvit-blå tema.

## JavaScript / JSX

Hele frontend er skrevet i JavaScript med JSX. Dette er standard for React og
er kjent fra undervisningen. Det er ikke brukt TypeScript, for å holde
prosjektet enkelt innenfor eksamenstiden.

## JSON som datakilde

All festivalinformasjon ligger i `app/src/data/datasett.json`. Data leses
gjennom hjelpefunksjoner i `app/src/utils/dataHelpers.js`, slik at JSON-
strukturen bare refereres ett sted. Fordelen er at innhold og presentasjon er
adskilt: innholdet kan endres uten å endre koden, og løsningen blir mer
realistisk.

Hjelpefunksjonene kobler også sammen data, for eksempel `holderBedriftId` til
riktig bedrift og `romId` til riktig rom, og lager nedtrekksvalg og
oppsummeringer til påmeldingsskjemaet.

## Docker

Docker brukes for å pakke nettsiden slik at den kan kjøres likt på ulike
maskiner. `Dockerfile` bruker et to-trinns bygg: først bygges React-appen med
Node, deretter serveres den ferdige `dist/`-mappen av Nginx. Dette gir et lite
og rent image som er enkelt å rulle ut på Ubuntu Server.

## Nginx

Nginx brukes to steder:

1. **Inne i Docker-imaget** for å servere de statiske filene fra React-bygget.
2. **Som reverse proxy på Ubuntu Server**, foran containeren, for å håndtere
   HTTPS og sende trafikk videre til containeren.

Nginx er lett, stabilt og godt egnet til begge oppgavene.

## Ubuntu Server

Ubuntu Server (26.04 LTS) er valgt som driftsserver fordi det er en vanlig,
godt dokumentert Linux-distribusjon. Den kjører Docker, Nginx og Node.js, og
er sikret med nøkkelbasert SSH.

## Windows Server (DNS)

Windows Server 2019 brukes til DNS-rollen, slik oppgaven legger opp til. Den
løser navnene `festival.lan`, `www.festival.lan` og `festival.festival.local`
til webserveren, og videresender andre oppslag til eksterne DNS-tjenere.

## Proxmox VE

Proxmox er valgt for virtualisering, slik at både Ubuntu Server og Windows
Server kan kjøre som egne VM-er på én fysisk maskin. Det gjør oppsettet
fleksibelt og enkelt å administrere fra ett nettgrensesnitt.

## UniFi

Nettverket styres med UniFi (USG 3P som gateway og U6 Lite som access point).
UniFi gir oversikt over enheter og klienter fra én kontroller. Svitsjen er en
TP-Link og ikke en UniFi-enhet, så topologien blir ikke fullt port-basert.

## Git og GitHub

Git brukes til versjonskontroll lokalt, med jevnlige commits og beskrivende
commit-meldinger på norsk. Koden er lagt ut på GitHub
(https://github.com/kharchenko7002/festival, branch `main`) som sikkerhetskopi
og for innlevering.
