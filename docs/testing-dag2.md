# Testing dag 2 – IT-utvikling

Testresultater for endringene som ble gjort på eksamen dag 2. Tester merket
«Manuell test» er utført ved å bruke nettsiden eller kjøre kommandoer på
serveren / klienten.

---

## 1. Bygg og kodekvalitet

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `npm run build` | Bygger uten feil, lager `dist/` | ✅ Bestått | Kjørt i `app/` |
| `npm run lint` | Ingen ESLint-feil | ✅ Bestått | Kjørt i `app/` |
| `docker build -t 2inf-festival .` | Imaget bygges (fullstack) | ⚠️ Ikke testet | Docker Desktop var ikke startet i utviklingsmiljøet. Må testes på server |

---

## 1b. Backend-API (testet med curl)

API-et ble kjørt lokalt med `node server/index.js` og testet med `curl`.

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `GET /api/health` | `{"status":"ok"}` | ✅ Bestått | curl |
| Innlogging riktige credentials | `200` + token | ✅ Bestått | curl (`festivalsjef / 2inf2026`) |
| Innlogging feil passord | `401` | ✅ Bestått | curl |
| Lagre override uten token | `401` | ✅ Bestått | curl |
| Lagre override med token | `200` + oppdaterte endringer | ✅ Bestått | curl |
| Lagre i opptatt rom/tid | `409` + feilmelding | ✅ Bestått | curl |
| Ugyldig rom (ikke A/B) | `400` | ✅ Bestått | curl |
| `DELETE /api/program/overrides` | `200`, endringer nullstilt | ✅ Bestått | curl |
| Endringer lagres i JSON-fil | `program-overrides.json` oppdateres | ✅ Bestått | Verifisert på disk |
| Express serverer React-bygget | `GET /` svarer 200 (HTML) | ✅ Bestått | curl |

---

## 2. Program (foredrag)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Program viser tidspunkt | Hvert kort viser start–slutt | ✅ Bestått | Manuell test |
| Program viser rom | Hvert kort viser rom | ✅ Bestått | Manuell test |
| Program viser bedrift | Hvert kort viser bedriftsnavn | ✅ Bestått | Manuell test |
| Søk, filter og sortering | Fungerer som før | ✅ Bestått | Manuell test |

---

## 3. Festivalsjef-funksjon

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Velge bedrift | Bedrifter med foredrag vises i nedtrekksliste | ✅ Bestått | Manuell test |
| Velge foredrag | Foredrag for valgt bedrift vises | ✅ Bestått | Manuell test |
| Innlogging kreves | Skjema skjult til man logger inn («Kun for festivalsjef») | ✅ Bestått | Manuell test |
| Logg inn / logg ut | Innlogging viser skjema, utlogging skjuler det | ✅ Bestått | Manuell test |
| Velge Auditorium A | Kan velges som rom | ✅ Bestått | Manuell test |
| Velge Auditorium B | Kan velges som rom | ✅ Bestått | Manuell test |
| Lagre endring | Endring lagres server-side via API | ✅ Bestått | Manuell test |
| Program oppdateres etter lagring | Program viser ny rom/tid + «Endret» | ✅ Bestått | Manuell test |
| Tilbakestill endringer | Programmet går tilbake til original | ✅ Bestått | Manuell test |

---

## 4. Konfliktkontroll (dobbeltbooking)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Samme rom + samme tidspunkt | Backend svarer `409` + «Dette tidspunktet er allerede opptatt i valgt rom.» | ✅ Bestått | curl + manuell test |
| Samme tidspunkt, forskjellig rom (A vs B) | Begge tillates | ✅ Bestått | curl + manuell test |
| Forskjellig tidspunkt, samme rom | Begge tillates | ✅ Bestått | curl + manuell test |

---

## 5. Finn fram

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Finn fram viser Auditorium A | Navn, bruk, beliggenhet og veibeskrivelse vises | ✅ Bestått | Manuell test |
| Finn fram viser toaletter | Info om toaletter vises | ✅ Bestått | Manuell test |
| Finn fram viser spiseområde | Info om spiseområde vises | ✅ Bestått | Manuell test |
| Filtrering på stedstype | Viser kun valgt type | ✅ Bestått | Manuell test |
| Valgt sted fremheves | Kort og detaljpanel oppdateres | ✅ Bestått | Manuell test |

---

## 6. Server, HTTPS og Nginx

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `https://festival.lan` | Nettsiden vises over HTTPS | ✅ Bestått | Manuell test (selvsignert advarsel) |
| Nginx på port 443 | `curl -k -I https://festival.lan` svarer 200 | ✅ Bestått | Manuell test |
| `sudo nginx -t` | Konfigurasjon er gyldig | ✅ Bestått | Manuell test |
| `curl -I http://festival.lan` | Svarer 301 → HTTPS | ✅ Bestått | Manuell test |

---

## 7. DNS og nettverk

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `nslookup festival.lan 10.20.30.10` | Returnerer 10.20.30.20 | ✅ Bestått | Manuell test |
| `ping 10.20.30.1` | Svar fra gateway | ✅ Bestått | Manuell test |
| `ping 10.20.30.10` | Svar fra Windows DNS | ✅ Bestått | Manuell test |
| `ping 10.20.30.20` | Svar fra Ubuntu webserver | ✅ Bestått | Manuell test |

---

## 8. Oppsummering

Alle automatiske tester (`npm run build`, `npm run lint`) er kjørt og bestått.
Backend-API-et er testet med `curl` (helsesjekk, innlogging, lagring,
dobbeltbooking, validering og nullstilling). De funksjonelle testene av
festivalsjef-funksjonen, konfliktkontrollen og finn-fram-funksjonen er bekreftet
manuelt i nettleseren. Server-, HTTPS- og nettverkstestene er utført manuelt mot
infrastrukturen. `docker build` er **ikke** testet i utviklingsmiljøet fordi
Docker Desktop ikke var startet, og bør verifiseres på serveren før innlevering.
