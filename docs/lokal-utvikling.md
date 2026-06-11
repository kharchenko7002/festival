# Lokal utvikling – 2INF Festival

Denne veiledningen forklarer hvordan du kan fortsette å utvikle nettsiden
lokalt på din egen maskin. Nettsiden er bygget med **React + Vite** og stylet
med **Tailwind CSS**. All festivaldata kommer fra én JSON-fil.

---

## 1. Forutsetninger

Du trenger **Node.js** (versjon 20 eller nyere) og **npm** installert. For å
teste Docker-bygget trenger du i tillegg **Docker**.

Sjekk at verktøyene er installert:

```bash
node -v
npm -v
docker -v
```

---

## 2. Åpne prosjektet

Selve React-appen ligger i mappen `app/`. All utvikling skjer der.

```bash
cd app
```

---

## 3. Installer dependencies

Første gang (og når `package.json` endres) må avhengighetene installeres:

```bash
npm install
```

Dette lager mappen `node_modules/` lokalt. Den er allerede i `.gitignore` og
skal **ikke** sjekkes inn i Git.

---

## 4. Start utviklingsserveren

```bash
npm run dev
```

Vite starter en utviklingsserver med «hot reload» – endringer i koden vises
umiddelbart i nettleseren.

- Lokal adresse: **`http://localhost:5173`**

Stopp serveren med `Ctrl + C` i terminalen.

---

## 5. Bygg prosjektet

For å lage et produksjonsbygg (optimalisert og minifisert):

```bash
npm run build
```

Resultatet havner i mappen `app/dist/`. Det er denne mappen som serveres av
Nginx i Docker-imaget.

Du kan forhåndsvise det ferdige bygget lokalt med:

```bash
npm run preview
```

---

## 6. Linting (kodekvalitet)

Kjør ESLint for å finne feil og uønskede mønstre i koden:

```bash
npm run lint
```

Linting bør være uten feil før du committer.

---

## 7. Test med Docker

Du kan teste hele produksjonsoppsettet lokalt med Docker. Kommandoene kjøres fra
**prosjektroten** (mappen over `app/`), fordi `Dockerfile` ligger der:

```bash
docker build -t 2inf-festival .
docker run -p 8080:80 2inf-festival
```

Nettsiden åpnes da på `http://localhost:8080`. Dette etterligner hvordan
containeren kjører på serveren (bak Nginx).

---

## 8. Hvor ligger ting?

| Filer / mappe | Innhold |
| --- | --- |
| `app/src/data/datasett.json` | **All festivaldata** (bedrifter, foredrag, rom, workshops, lærere, elever). Endre innhold her. |
| `app/src/sections/` | Seksjonene på siden (Hero, Program, Festivalsjef, Finn fram osv.) |
| `app/src/components/` | Gjenbrukbare komponenter (Header, Footer, Badge, SectionTitle …) |
| `app/src/utils/dataHelpers.js` | Hjelpefunksjoner som leser data fra `datasett.json` |
| `app/src/App.jsx` | Setter sammen seksjonene i visningsrekkefølge |
| `app/src/index.css` | Tailwind-import og felles stilklasser |
| `Dockerfile` | To-trinns Docker-bygg (Node bygger, Nginx serverer) |
| `docs/` | All dokumentasjon |

---

## 9. Gjøre endringer trygt

- **Endre data:** legg til eller rett opp i `datasett.json`. Alle seksjoner leser
  via `dataHelpers.js`, så dataene vises automatisk.
- **Endre utseende/innhold:** rediger riktig fil i `sections/` eller
  `components/`.
- **Test alltid lokalt** med `npm run dev` før du committer.
- **Kjør `npm run build` og `npm run lint`** før du anser noe som ferdig –
  commit aldri kode som ikke bygger.
- Behold eksisterende funksjonalitet; ikke fjern noe som virker uten grunn.

---

## 10. Git med små commits

Jobb med **små, tydelige commits** på norsk:

```bash
git status                       # se hva som er endret
git add <fil>                    # legg til konkrete filer
git commit -m "Kort beskrivelse av endringen"
git log --oneline -10            # se historikken
```

Tips:

- Én commit = én logisk endring.
- Skriv commit-meldinger på bokmål som forklarer *hva* endringen gjør.
- Commit ofte, men aldri kode som er ødelagt eller ikke bygger.

---

## 11. Lokal utvikling vs. produksjon

| | Lokal utvikling | Produksjon |
| --- | --- | --- |
| Adresse | `http://localhost:5173` | `https://festival.lan` |
| Verktøy | Vite dev-server | Docker + Nginx på Ubuntu |
| Hot reload | Ja | Nei (statisk bygg) |
| HTTPS | Nei | Ja (selvsignert sertifikat) |

Endringer bør alltid **testes lokalt** (dev + build) før de bygges som Docker-image
og rulles ut på Ubuntu-serveren.
