# Eksamen dag 2 – IT-utvikling

Dette dokumentet beskriver hva som er løst på eksamen dag 2 for case **2INF
Festival**, med valgt retning **IT-utvikling**. Det forklarer hvordan hvert krav
er løst, hvilke begrensninger løsningen har, og hva som bør forbedres i en ekte
produksjon.

---

## 1. Valgt retning

Valgt hovedretning er **IT-utvikling**. Hovedfokuset er videreutvikling av
nettsiden (React + Vite + Tailwind), men siden eksamen er tverrfaglig
dokumenteres også nettverk, server og sikkerhet der det er relevant.

---

## 2. Krav fra oppgaven og hvordan de er løst

| # | Krav (dag 2) | Status | Hvor |
| --- | --- | --- | --- |
| 1 | Vurdere om `/24` dekker behovet | ✅ | `docs/nettverksvurdering-24.md` |
| 2 | Nginx standard på port 443 | ✅ | `docs/serveroppsett.md`, `docs/sikkerhet.md` |
| 3 | Veiledning for lokal utvikling | ✅ | `docs/lokal-utvikling.md` |
| 4 | Festivalsjef kobler bedrift/foredrag til rom | ✅ | `FestivalManagerSection.jsx` |
| 5 | Programmet oppdateres med endringene | ✅ | `ProgramSection.jsx` |
| 6 | Program viser tidspunkt, rom og bedrift | ✅ | `ProgramSection.jsx` |
| 7 | Hindre to bedrifter i samme rom/tid | ✅ | `hasRoomTimeConflict()` |
| 8 | Interaktiv finn-fram-funksjon | ✅ | `FinnFramSection.jsx` |

---

## 3. Nettverksvurdering (`/24`)

Nettet er `10.20.30.0/24` med 254 brukbare adresser. Infrastrukturen bruker
faste adresser under `.50`, og DHCP-området `10.20.30.50–10.20.30.240` gir ca.
**191 dynamiske adresser**.

Vurdering: dette er **godt nok for en demo og en liten festival**, men kan bli
**for lite** når mange besøkende bruker både mobil og PC. Foreslåtte
forbedringer er `/23` (510 adresser), **VLAN** for gjester/servere/administrasjon
og et eget **gjestenettverk**. Full begrunnelse i `docs/nettverksvurdering-24.md`.

---

## 4. Nginx og HTTPS (port 443)

- Nginx kjører som **reverse proxy** på Ubuntu Server.
- Docker-containeren eksponeres internt på **port 8080** (`-p 8080:80`).
- Nginx **lytter på port 443** (HTTPS) og er standardinngangen.
- **Port 80 videresender automatisk til HTTPS** (301-redirect).
- Sertifikatet er **selvsignert** fordi `festival.lan` er et internt domene. I
  produksjon ville man brukt offentlig domene og Let's Encrypt.
- Hovedadresse: `https://festival.lan`. Direkte på IP: `https://10.20.30.20`.

Detaljer og testkommandoer i `docs/serveroppsett.md`.

---

## 5. Lokal utvikling

`docs/lokal-utvikling.md` forklarer hvordan man fortsetter utviklingen:

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Docker-test fra prosjektroten: `docker build -t 2inf-festival .` og
`docker run -p 8080:80 2inf-festival`. Lokal utvikling skjer på
`http://localhost:5173`, produksjon på Ubuntu via Docker og Nginx.

---

## 6. Festivalsjef-funksjon (romfordeling)

Det er lagt til en ny seksjon **«Festivalsjef»** (`FestivalManagerSection.jsx`).
Festivalsjefen kan:

1. Velge en **bedrift som har foredrag**.
2. Velge et **foredrag** fra bedriften.
3. Velge **rom**: Auditorium A eller Auditorium B.
4. Velge **tidspunkt** (tidsluke fra programmet).
5. **Lagre endringen** og se en oppdatert programoversikt.

Endringene lagres i `localStorage` under nøkkelen `festivalProgramOverrides` og
legges «oppå» originaldataene fra `datasett.json` (som ikke endres). Logikken
ligger i hjelpefunksjonene `loadProgramOverrides()`, `saveProgramOverride()` og
`mergeProgramWithOverrides()` i `dataHelpers.js`.

---

## 7. Programmet oppdateres

`ProgramSection.jsx` viser nå programmet med festivalsjefens endringer flettet
inn. Hvert programkort viser minst **tidspunkt, rom og bedrift** (i tillegg til
tittel, kategori og maks plasser). Endrede foredrag merkes med «Endret».

Når festivalsjefen lagrer, sendes en hendelse (`festival:program-overrides`)
som program-seksjonen lytter på, slik at **programmet oppdateres umiddelbart**
uten at man må redigere JSON. Søk, kategorifilter og sortering fungerer som før.

---

## 8. Konfliktkontroll – ingen dobbeltbooking

Funksjonen `hasRoomTimeConflict()` hindrer at to bedrifter får foredrag i
**samme rom på samme tidspunkt**.

**Regel:** Hvis et annet foredrag allerede har samme rom og samme tidspunkt,
blokkeres lagringen, og feilmeldingen vises:

> «Dette tidspunktet er allerede opptatt i valgt rom.»

- Samme tidspunkt i **forskjellig rom** er tillatt.
- Forskjellig tidspunkt i **samme rom** er tillatt.
- Gjelder både Auditorium A og Auditorium B.

Kontrollen kjøres **før lagring**, og endringen lagres ikke ved konflikt.

---

## 9. Finn fram (interaktiv veiviser)

Den nye seksjonen **«Finn fram»** (`FinnFramSection.jsx`) hjelper besøkende å
finne fram. Man kan filtrere på stedstype og klikke på et sted for å se navn,
hva stedet brukes til, hvor det ligger, en enkel veibeskrivelse og nyttig info.
Stedene som dekkes:

- Auditorium A og Auditorium B (foredrag)
- Toaletter
- Spiseområde
- Bedriftsstands
- Informasjonspunkt
- Workshoprom

Dette er en intern, interaktiv kartoversikt laget med kort/grid i Tailwind – ikke
et eksternt kart. Valgt sted fremheves visuelt.

---

## 10. Begrensninger

- **Festivalsjef-funksjonen er en frontend-only prototype.** Det finnes ingen
  backend.
- **Endringene lagres kun i `localStorage`** i nettleseren. De er knyttet til
  den enkelte nettleseren og deles ikke mellom enheter.
- **Selvsignert SSL** gir en nettleseradvarsel i testmiljøet.
- **`festival.lan` er et internt domene** og fungerer bare i festivalnettverket.
- **TP-Link-svitsjen** er ikke en UniFi-enhet, så UniFi viser ikke full
  portbasert topologi.

---

## 11. Forbedringer i produksjon

- **Backend + database** for festivalsjef-endringene, slik at programmet er
  felles for alle og lagres trygt.
- **Autentisering** slik at bare festivalsjefen kan endre programmet.
- **Gyldig sertifikat** (Let's Encrypt) med offentlig domene, uten advarsel.
- **`/23` og VLAN** for å dekke et større antall besøkende og enheter.
- **UniFi-svitsj** for full portbasert topologi.
