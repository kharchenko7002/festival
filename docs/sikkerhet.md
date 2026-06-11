# Sikkerhetsvurdering – 2INF Festival

Dette dokumentet beskriver sikkerhetstiltakene i prosjektet, både i nettverk,
servere og webapplikasjon, samt ærlige begrensninger og hva som burde gjøres i
en ekte produksjon.

---

## 1. Trådløst nettverk (WPA2)

Det trådløse nettverket (`2INF-Festival-KostiantynK`) er sikret med **WPA2**.
Det betyr at klienter må ha riktig passord for å koble seg til, og trafikken på
luften er kryptert. WPA2 er et godt og vanlig valg. WPA3 ville gitt enda bedre
sikkerhet, men WPA2 er bredt støttet av klientene.

## 2. Statiske IP-adresser på infrastruktur

Gateway, access point, svitsj, Proxmox-host og begge serverne har **faste
IP-adresser**. Det gjør nettverket forutsigbart og enklere å feilsøke, og
hindrer at viktige enheter bytter adresse.

## 3. DHCP skilt fra statiske adresser

DHCP-området (`10.20.30.50 – 10.20.30.240`) starter etter de statiske
adressene (alle under `.50`). Dermed kan ikke en klient få en adresse som
allerede brukes av infrastrukturen, og man unngår IP-konflikter.

## 4. SSH-sikring på Ubuntu Server

SSH er strammet inn på webserveren:

| Innstilling | Verdi | Effekt |
| --- | --- | --- |
| `PubkeyAuthentication` | `yes` | Innlogging skjer med nøkkel |
| `PasswordAuthentication` | `no` | Passordinnlogging er slått av |
| `PermitRootLogin` | `no` | Root kan ikke logge inn via SSH |

- Nøkkelbasert innlogging er mye sterkere enn passord, fordi den private
  nøkkelen aldri sendes og er svært vanskelig å gjette.
- At passordinnlogging er av, stopper «brute force»-forsøk mot passord.
- At root ikke kan logge inn direkte, gjør at en angriper først må kompromittere
  en vanlig bruker (`festivalsjef`) før eventuell `sudo`.

## 5. Docker-isolasjon

Nettsiden kjører i en **Docker-container**. Containeren er isolert fra
verts-systemet og inneholder bare det nettsiden trenger (Nginx + statiske
filer). Hvis noe skulle gå galt i containeren, påvirker det i mindre grad selve
serveren. Containeren eksponerer kun den nødvendige web-porten.

## 6. Intern DNS på Windows Server

DNS kjører internt på Windows Server (10.20.30.10) og løser
`festival.lan`, `www.festival.lan` og `festival.festival.local` til
webserveren. At domenet er **internt**, betyr at navnet ikke er eksponert på
internett, og tjenesten er kun tilgjengelig i festivalnettverket.

## 7. HTTPS med selvsignert sertifikat

Trafikken til nettsiden er kryptert med **HTTPS** via Nginx reverse proxy.
Sertifikatet er **selvsignert**.

- **Fordel:** trafikken mellom klient og server er kryptert, så innhold ikke
  kan leses i klartekst på nettverket.
- **Begrensning:** nettleseren viser en advarsel fordi sertifikatet ikke er
  utstedt av en kjent sertifikatutsteder. Brukeren må godta advarselen.

## 8. Webapplikasjon og påmelding

Påmeldingsskjemaet er en **frontend-prototype uten backend**. Det er et bevisst
sikkerhetspoeng:

- Skjemaet **lagrer ingenting** og **sender ingen data** til en server.
- Det finnes ingen database, så det oppbevares ingen personopplysninger.
- Dermed kan det heller ikke lekke sensitive data fra påmeldingen.

Andre webtiltak:

- All festivaldata ligger i `datasett.json` og inneholder ikke hemmeligheter.
- Ingen passord eller hemmelige nøkler er hardkodet i kildekoden.
- Samtykke til informasjonskapsler håndteres lokalt i nettleseren
  (`localStorage`), uten sporing.

---

## 9. Begrensninger og forbedringer i produksjon

| Tiltak i dag | Begrensning | Forbedring i produksjon |
| --- | --- | --- |
| Selvsignert HTTPS | Nettleseradvarsel | Gyldig sertifikat (f.eks. Let's Encrypt med offentlig domene) |
| WPA2 | Eldre enn WPA3 | WPA3 der klientene støtter det |
| Intern DNS (`festival.lan`) | Kun internt | Offentlig domene hvis tjenesten skal nås utenfra |
| Frontend-prototype for påmelding | Lagrer ingenting | Sikker backend med validering, database og GDPR-rutiner |
| TP-Link-svitsj | Begrenset innsyn i UniFi | UniFi-svitsj for bedre overvåking |
| Brannmur | Grunnleggende | Strammere regler, kun nødvendige porter (22, 80, 443) |

---

## 10. Oppsummering

Sikkerheten er ivaretatt på flere nivåer: kryptert Wi-Fi, ryddig IP-plan med
skille mellom statiske og dynamiske adresser, nøkkelbasert SSH uten root- og
passordinnlogging, isolert Docker-container, intern DNS og HTTPS. De viktigste
begrensningene – selvsignert sertifikat, internt domene og påmelding uten
backend – er bevisste valg for et lukket testmiljø, og er dokumentert ærlig med
forslag til forbedringer for en ekte produksjon.
