# Redesignplan – 2INF Festival

Målet er en gjennomgående visuell omarbeiding av festivalnettsiden slik at den
føles som en polert, profesjonell SaaS-landingsside (inspirert av referansen
`bilde.png`). Innholdet er fortsatt 2INF Festival, og all synlig tekst er på
norsk bokmål. Data hentes uendret fra `app/src/data/datasett.json` via
`utils/dataHelpers.js`.

## Visuelt system

- **Farger:** rent hvitt som basis, dyp marineblå (navy) til hero og CTA-bånd,
  klar himmelblå som primæraksent og en varm gul detaljfarge til knapper og
  fremheving – samme stemning som referansen.
- **Typografi:** store, tydelige overskrifter, god linjeavstand og luftig
  seksjonsmellomrom.
- **Komponenter:** myke skygger, avrundede kort, konsistente knappestiler
  (`.btn-primary`, `.btn-ghost`, `.btn-light`) og felles kortverktøy.
- **Animasjoner:** lette CSS-effekter – løft ved hover, knappebevegelse,
  svevende heroelementer og fade/slide-inn ved scroll. Ingen tunge bibliotek.

## Seksjoner som bygges om

1. **Header** – hvit, sticky, logo til venstre, meny og CTA «Se program».
2. **Hero** – marineblått blokkparti, stor overskrift, infokort for
   dato/tid/sted, CTA-knapper og en dashboard-mockup bygget i Tailwind.
3. **Nøkkeltall** – rene metrikker (bedrifter, foredrag, workshops, rom).
4. **Om festivalen** – hvit seksjon med tekst og illustrerende kortområde.
5. **Program** – moderne filterpanel og timeplankort med tidsmerker.
6. **Bedrifter** – sponsor-/utstillerrutenett med standnummer og bransje.
7. **Workshops** – egne blå/hvite feature-kort med forkunnskaps-chips.
8. **Rom** – områdeoversikt gruppert per bygning.
9. **Praktisk info** – kraftig marineblått CTA-/infobånd.
10. **Kontakt** – avsluttende CTA med e-post og ansvarslærere.

## Teknisk

- React + Vite og Tailwind beholdes. Ingen nye UI-bibliotek.
- Funksjonalitet (søk, filter, sortering, gruppering, kontaktvalg) bevares.
- `npm run build` og `npm run lint` skal være grønne før hver commit.
