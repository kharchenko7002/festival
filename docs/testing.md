# Testing – 2INF Festival

Dette dokumentet samler de endelige testene av løsningen: webapplikasjon, bygg,
linting, Docker, deployment, Nginx, HTTPS, DNS og nettverk. Eldre dagsnotater
ligger i `docs/testresultat-09-06-2026.md` og
`docs/testresultat-servere-09-06-2026.md`.

**Dato:** 09.06.2026
**Miljø:** utviklingsmaskin (Windows 11) + Ubuntu Server (10.20.30.20)

---

## 1. Oppsummering

| Område | Test | Resultat |
| --- | --- | --- |
| Bygg | `npm run build` | ✅ Bestått |
| Kvalitet | `npm run lint` | ✅ Bestått |
| Web (lokalt) | Nettsiden vises og fungerer lokalt | ✅ Bestått |
| Påmelding | Prototype testet manuelt | ✅ Bestått |
| Deployment | Nettsiden deployet på Ubuntu | ✅ Bestått |
| Docker | Container kjører | ✅ Bestått |
| Web (server) | `curl` mot webserver | ✅ Bestått |
| Proxy | Nginx reverse proxy | ✅ Bestått |
| HTTPS | `https://festival.lan` | ✅ Bestått (selvsignert) |
| DNS | `nslookup festival.lan` | ✅ Bestått |
| Nettleser | `https://festival.lan` | ✅ Bestått |
| Mobil | `https://10.20.30.20` | ✅ Bestått |
| Nettverk | Ping-tester | ✅ Bestått |
| SSH | Nøkkel inn / passord avvist | ✅ Bestått |
| UniFi | Enheter «Up to date» | ✅ Bestått |

---

## 2. Bygg og linting

```bash
cd app
npm run build   # Vite – produksjonsbygg
npm run lint    # ESLint
```

- `npm run build`: Vite bygde prosjektet uten feil. Utdata i `dist/`
  (`index.html`, `assets/index-*.css`, `assets/index-*.js`).
- `npm run lint`: ESLint kjørte gjennom hele kodebasen uten advarsler eller
  feil (avsluttet med kode 0).

**Resultat:** ✅ Begge bestått.

---

## 3. Webapplikasjon (lokalt)

Manuell gjennomgang i nettleser:

| Seksjon / funksjon | Resultat |
| --- | --- |
| Festivaldata fra `datasett.json` vises | ✅ |
| Program: søk, kategorifilter og sortering | ✅ |
| Bedrifter: søk på navn og bransje | ✅ |
| Workshops: bedrift via `holderBedriftId`, rom via `romId` | ✅ |
| Rom: gruppert etter bygning | ✅ |
| Praktisk informasjon og kontakt (lærere etter ansvarsområde) | ✅ |
| Responsivt design (mobil/nettbrett/desktop) | ✅ |
| Samtykkebanner lagrer valg i `localStorage` | ✅ |

---

## 4. Påmelding (prototype)

Påmeldingsskjemaet ble testet manuelt:

| Test | Resultat |
| --- | --- |
| Nedtrekksmeny «Velg bedrift» fylt fra `datasett.json` | ✅ |
| Nedtrekksmeny «Velg workshop» fylt fra `datasett.json` | ✅ |
| Nedtrekksmeny «Ønsket tidspunkt» fra workshop-tidene | ✅ |
| Oppsummering av valgt workshop (tittel, bedrift, rom, tid, maks, forkunnskaper) | ✅ |
| Oppsummering av valgt bedrift (navn, bransje, standnummer, nettside) | ✅ |
| Innsending viser bekreftelse, sender ingen data | ✅ |

Merk: dette er en frontend-prototype uten backend – ingenting lagres.

---

## 5. Deployment, Docker, Nginx og HTTPS (Ubuntu Server)

| Test | Kommando / handling | Resultat |
| --- | --- | --- |
| Docker-container kjører | `docker ps` | ✅ Container oppe |
| Webserver svarer lokalt | `curl -I http://localhost` | ✅ 200 OK |
| Webserver svarer på IP | `curl -I http://10.20.30.20` | ✅ 200 OK |
| Nginx reverse proxy | Trafikk rutes til containeren | ✅ |
| HTTPS fungerer | `curl -kI https://festival.lan` | ✅ 200 OK (selvsignert, `-k`) |

Nettleseren viser en sertifikatadvarsel fordi sertifikatet er selvsignert.
Etter å ha godtatt advarselen vises nettsiden normalt.

---

## 6. DNS

| Test | Kommando | Resultat |
| --- | --- | --- |
| Oppslag av `festival.lan` | `nslookup festival.lan` | ✅ -> 10.20.30.20 |
| Oppslag av `www.festival.lan` | `nslookup www.festival.lan` | ✅ -> 10.20.30.20 |
| Oppslag av `festival.festival.local` | `nslookup festival.festival.local` | ✅ -> 10.20.30.20 |

---

## 7. Nettleser- og mobiltest

| Test | Resultat |
| --- | --- |
| `https://festival.lan` i nettleser på PC | ✅ Nettsiden vises |
| `https://10.20.30.20` på mobil | ✅ Nettsiden vises og er responsiv |

---

## 8. Nettverkstester (ping)

| Mål | Adresse | Resultat |
| --- | --- | --- |
| Gateway | 10.20.30.1 | ✅ |
| U6 Lite AP | 10.20.30.2 | ✅ |
| Proxmox Host | 10.20.30.4 | ✅ |
| Windows Server | 10.20.30.10 | ✅ |
| Ubuntu Server | 10.20.30.20 | ✅ |
| Internett (IP) | 8.8.8.8 | ✅ |
| Internett (navn) | google.com | ✅ |

---

## 9. SSH

| Test | Resultat |
| --- | --- |
| Innlogging med SSH-nøkkel (`festivalsjef`) | ✅ Fungerer |
| Innlogging med passord | ✅ Avvist (`Permission denied (publickey)`) |
| Root-innlogging via SSH | ✅ Ikke tillatt |

---

## 10. UniFi

| Test | Resultat |
| --- | --- |
| USG 3P adoptert | ✅ |
| U6 Lite adoptert | ✅ |
| Begge viser «Up to date» | ✅ |
| Enheter navngitt i topologien | ✅ |

Begrensning: TP-Link-svitsjen er ikke en UniFi-enhet, så topologien er ikke
fullt port-basert.

---

## 11. Konklusjon

Alle gjennomførte tester bestod. Bygg og linting er feilfrie, nettsiden viser
data korrekt og er responsiv, påmeldingsprototypen fungerer, og løsningen er
deployet på Ubuntu Server med Docker, Nginx reverse proxy og HTTPS på
`https://festival.lan`. DNS, nettverk, SSH-sikring og UniFi er verifisert. De
kjente begrensningene (selvsignert sertifikat, internt domene, påmelding uten
backend og TP-Link-svitsj) er dokumentert i `docs/sikkerhet.md` og README.
