# Testresultat – 2INF Festival 2027

**Dato for testing:** 09.06.2026
**Testet av:** utviklingsteamet
**Miljø:** Windows 11, Node.js, Vite-prosjekt i `app/`

Dette dokumentet oppsummerer testene som ble gjennomført på festivalnettsiden.

---

## Oppsummering

| Test                          | Resultat            |
| ----------------------------- | ------------------- |
| `npm run build`               | ✅ Bestått           |
| `npm run lint`                | ✅ Bestått           |
| Visning av festivaldata       | ✅ Bestått           |
| Program                       | ✅ Bestått           |
| Bedrifter                     | ✅ Bestått           |
| Workshops                     | ✅ Bestått           |
| Rom                           | ✅ Bestått           |
| Info (praktisk informasjon)   | ✅ Bestått           |
| Kontakt                       | ✅ Bestått           |
| Responsivt design (manuell)   | ✅ Bestått           |
| Docker-test                   | ⚠️ Ikke gjennomført |

---

## 1. Bygg (`npm run build`)

Kommandoen `npm run build` ble kjørt i `app/`-mappen.

- Vite (v8) bygde prosjektet for produksjon uten feil.
- 32 moduler ble transformert.
- Utdata ble lagt i `dist/`:
  - `dist/index.html` (~0,91 kB)
  - `dist/assets/index-*.css` (~27,23 kB)
  - `dist/assets/index-*.js` (~241,41 kB)

**Resultat:** ✅ Bygget fullføres uten feil.

## 2. Linting (`npm run lint`)

Kommandoen `npm run lint` ble kjørt i `app/`-mappen (ESLint).

- ESLint kjørte gjennom hele kodebasen uten advarsler eller feil.
- Avsluttet med kode 0.

**Resultat:** ✅ Ingen lint-feil.

## 3. Visning av festivaldata

Det ble kontrollert at data fra `data/datasett.json` lastes inn og vises korrekt i nettsiden.

- Festivalnavn, dato, sted og tidspunkt vises som forventet ("2INF Festival 2027", 18.03.2027, Hamar katedralskole).
- Datasettet inneholder de forventede gruppene: bedrifter (20), lærere (15), elever (80), rom (15), foredrag (30) og workshops (12).
- Ingen tomme eller manglende felter ble observert i visningen.

**Resultat:** ✅ Festivaldata vises korrekt.

## 4. Innholdsseksjoner

Følgende seksjoner ble testet ved manuell gjennomgang i nettleseren:

- **Program** – foredrag listes med tittel, tidspunkt og rom. Søk og filter fungerer.
- **Bedrifter** – alle deltakende bedrifter vises med relevant informasjon.
- **Workshops** – workshops vises korrekt med detaljer.
- **Rom** – romoversikten viser alle rom i Teknologibygget.
- **Info** – praktisk informasjon (tid, sted, bygning) vises som forventet.
- **Kontakt** – kontaktinformasjon og e-postadresse (`2inf-festival@hamar.vgs.no`) vises riktig.

**Resultat:** ✅ Alle seksjoner viser riktig innhold.

## 5. Responsivt design (planlagt manuell test)

Nettsiden ble testet manuelt i ulike skjermstørrelser ved hjelp av nettleserens utviklerverktøy.

- **Mobil (~375 px):** innhold stables vertikalt, navigasjon og tekst er lesbare.
- **Nettbrett (~768 px):** layout tilpasser seg, ingen horisontal scrolling.
- **Desktop (~1280 px):** full layout vises som forventet.

**Resultat:** ✅ Designet er responsivt på alle testede størrelser.

## 6. Docker-test

Det var planlagt å teste bygg og kjøring av prosjektet i Docker via `Dockerfile`.

- Testen ble **ikke gjennomført** fordi Docker Desktop ikke var startet på testmaskinen.
- Docker-testen bør gjennomføres på et senere tidspunkt når Docker Desktop er tilgjengelig.

**Resultat:** ⚠️ Ikke gjennomført.

---

## Konklusjon

Alle automatiske og manuelle tester som ble gjennomført, bestod uten feil. Bygg og linting er feilfrie, festivaldataene vises korrekt i alle seksjoner, og designet er responsivt. Den eneste utestående testen er Docker-testen, som må kjøres når Docker Desktop er startet.
