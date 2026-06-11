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
| Velge Auditorium A | Kan velges som rom | ✅ Bestått | Manuell test |
| Velge Auditorium B | Kan velges som rom | ✅ Bestått | Manuell test |
| Lagre endring | Endring lagres i localStorage | ✅ Bestått | Manuell test |
| Program oppdateres etter lagring | Program viser ny rom/tid + «Endret» | ✅ Bestått | Manuell test |
| Tilbakestill endringer | Programmet går tilbake til original | ✅ Bestått | Manuell test |

---

## 4. Konfliktkontroll (dobbeltbooking)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Samme rom + samme tidspunkt | Blokkeres med «Dette tidspunktet er allerede opptatt i valgt rom.» | ✅ Bestått | Manuell test |
| Samme tidspunkt, forskjellig rom (A vs B) | Begge tillates | ✅ Bestått | Manuell test |
| Forskjellig tidspunkt, samme rom | Begge tillates | ✅ Bestått | Manuell test |

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
De funksjonelle testene av festivalsjef-funksjonen, konfliktkontrollen og
finn-fram-funksjonen er bekreftet manuelt i nettleseren. Server-, HTTPS- og
nettverkstestene er utført manuelt mot infrastrukturen.
