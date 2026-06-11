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
Nginx **lytter på port 443**, og **port 80 videresender automatisk til HTTPS**,
slik at ingen trafikk går ukryptert. Selve Docker-containeren kjører bak proxyen
på intern port 8080 og er ikke direkte eksponert.

Sertifikatet er **selvsignert** fordi `festival.lan` er et internt domene som
ikke finnes på internett.

- **Fordel:** trafikken mellom klient og server er kryptert, så innhold ikke
  kan leses i klartekst på nettverket.
- **Begrensning:** nettleseren viser en advarsel fordi sertifikatet ikke er
  utstedt av en kjent sertifikatutsteder. Brukeren må godta advarselen.
- **I produksjon:** med et offentlig domene ville man brukt et gyldig
  sertifikat fra **Let's Encrypt**, som fornyes automatisk og fjerner advarselen.

## 8. Webapplikasjon og påmelding

Påmeldingsskjemaet sender nå data til backenden og lagrer informasjonen
server-side. Sikkerhetstiltakene:

- **Serversidevalidering**: backenden validerer alle felter (navn, klasse,
  e-post, bedrift, workshop, tidspunkt) uavhengig av frontenden. Frontend kan
  manipuleres; backenden er den autoritative kontrollen.
- **Ingen hemmeligheter i frontend**: SMTP-passord og andre credentials leses
  kun av serveren via miljøvariabler (`.env`). Frontend sender aldri e-post
  direkte.
- **`.env` er i `.gitignore`**: reelle passord og API-nøkler lagres ikke i
  versjonskontroll. `.env.example` viser hvilke variabler som trengs.
- **Personopplysninger**: påmeldinger inneholder navn, klasse og e-post.
  Disse lagres i `server/storage/registrations.json`. I produksjon krever
  dette GDPR-vurdering, begrenset tilgang og definerte slettingsrutiner.

Andre webtiltak:

- All festivaldata ligger i `datasett.json` og inneholder ikke hemmeligheter.
- Ingen passord eller hemmelige nøkler er hardkodet i kildekoden.
- Samtykke til informasjonskapsler håndteres lokalt i nettleseren
  (`localStorage`), uten sporing.
- Demo-innloggingen for festivalsjef viser ikke lenger synlige demo-credentials
  på nettsiden. Credentials forblir i backend og dokumentasjon for testing.

## 8b. Festivalsjef-backend og innlogging (demo)

Festivalsjef-funksjonen har et lite **Express-backend** som lagrer
programendringer server-side i en JSON-fil og validerer dem (gyldig foredrag,
rom Auditorium A/B, og ingen dobbeltbooking). At valideringen skjer på serveren
er et sikkerhetspoeng: **frontend kan manipuleres, så backenden er
hovedkontrollen.**

Innloggingen er bevisst en **demo/prototype**, og er ærlig dokumentert som det:

- **Faste demo-credentials** (`festivalsjef / 2inf2026`) – ikke ekte brukere.
- **Token holdes i minnet** på serveren (forsvinner ved omstart) og i
  `sessionStorage` i nettleseren.
- **Ingen passordhashing**, ingen utløpstid på token, ingen rollestyring.

Dette er **ikke** produksjonssikkerhet. I en ekte løsning må man bruke:

- ekte backend-autentisering med **passordhashing** (f.eks. bcrypt),
- trygge **sessions eller JWT** med utløp,
- **database** i stedet for en JSON-fil,
- **rollebasert tilgangskontroll**,
- **HTTPS med gyldig sertifikat**.

Backenden er likevel bedre enn bare `localStorage`, fordi programendringene
lagres på serveren og valideres server-side i stedet for å ligge ukontrollert i
hver enkelt nettleser.

---

## 9. Begrensninger og forbedringer i produksjon

| Tiltak i dag | Begrensning | Forbedring i produksjon |
| --- | --- | --- |
| Selvsignert HTTPS | Nettleseradvarsel | Gyldig sertifikat (f.eks. Let's Encrypt med offentlig domene) |
| WPA2 | Eldre enn WPA3 | WPA3 der klientene støtter det |
| Intern DNS (`festival.lan`) | Kun internt | Offentlig domene hvis tjenesten skal nås utenfra |
| Påmelding med backend (JSON-fil) | Enkel lagring, ingen database/backup | Ekte database, rate limiting, GDPR-rutiner, kryptering av persondata |
| SMTP-credentials i miljøvariabler | Ikke i koden, men .env på disk i plaintext | Hemmelighetshåndtering via vault/secrets manager |
| Demo-innlogging for festivalsjef | Faste credentials, token i minnet, ingen hashing | Ekte autentisering, passordhashing, JWT/sessions, rollestyring |
| JSON-fil-lagring for programendringer | Ingen database/backup | Ekte database med backup og transaksjoner |
| TP-Link-svitsj | Begrenset innsyn i UniFi | UniFi-svitsj for bedre overvåking |
| Brannmur | Grunnleggende | Strammere regler, kun nødvendige porter (22, 80, 443) |

---

## 10. GDPR og personvern (påmeldinger)

Påmeldingsskjemaet samler inn navn, klasse og e-post. Dette er
personopplysninger etter personopplysningsloven og GDPR.

I et prototypemiljø er dette akseptabelt med bevisst lagring og begrenset
tilgang. I produksjon må følgende vurderes:

- **Kun nødvendige opplysninger samles inn** (dataminimering).
- **Administratortilgang** er begrenset til festivalsjef via innlogging.
- **Slettingsrutiner**: påmeldinger bør slettes etter at festivalen er over.
- **Informasjon til de registrerte**: brukerne bør informeres om at
  opplysningene lagres og hvem som har tilgang.
- **Databehandleravtale** hvis data lagres hos ekstern skyleverandør.

---

## 11. Oppsummering

Sikkerheten er ivaretatt på flere nivåer: kryptert Wi-Fi, ryddig IP-plan med
skille mellom statiske og dynamiske adresser, nøkkelbasert SSH uten root- og
passordinnlogging, isolert Docker-container, intern DNS og HTTPS. Påmelding
bruker nå backend med serversidevalidering; SMTP-credentials leses kun fra
miljøvariabler og lagres aldri i git. De viktigste begrensningene – selvsignert
sertifikat, internt domene, demo-innlogging og JSON-fillagring – er bevisste
valg for et lukket testmiljø, og er dokumentert ærlig med forslag til
forbedringer for en ekte produksjon.
