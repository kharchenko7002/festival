# Testing dag 2 – IT-utvikling

Testresultater for endringene som ble gjort på eksamen dag 2. Tester merket
«Manuell test» er utført ved å bruke nettsiden eller kjøre kommandoer på
serveren / klienten.

---

## 1. Bygg og kodekvalitet

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `npm run build` | Bygger uten feil, lager `dist/` | ✅ Bestått | Kjørt fra prosjektrot |
| `npm run lint` | Ingen ESLint-feil | ✅ Bestått | Kjørt fra prosjektrot |
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
| Lagre override med `ledigePlasser` | `200` + ledigePlasser lagret | ✅ Bestått | curl |
| Lagre med negativ `ledigePlasser` | `400` + feilmelding | ✅ Bestått | curl |
| Lagre med `ledigePlasser` over maks | `400` + feilmelding | ✅ Bestått | curl |
| Lagre i opptatt rom/tid | `409` + feilmelding | ✅ Bestått | curl |
| Ugyldig rom (ikke A/B) | `400` | ✅ Bestått | curl |
| `DELETE /api/program/overrides` | `200`, endringer nullstilt | ✅ Bestått | curl |
| Endringer lagres i JSON-fil | `program-overrides.json` oppdateres | ✅ Bestått | Verifisert på disk |
| Express serverer React-bygget | `GET /` svarer 200 (HTML) | ✅ Bestått | curl |
| `GET /admin` (SPA fallback) | Svarer 200 (HTML, React Router håndterer) | ✅ Bestått | curl |

---

## 1c. Påmeldings-API (testet med curl)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `POST /api/registrations` uten felter | `400` + «Navn er påkrevd.» | ✅ Bestått | curl |
| `POST /api/registrations` ugyldig e-post | `400` + «E-postadressen ser ikke riktig ut.» | ✅ Bestått | curl |
| `POST /api/registrations` ugyldig bedriftId | `400` + «Ukjent bedrift.» | ✅ Bestått | curl |
| `POST /api/registrations` med `wantsEmailReceipt: false` | `201` + `emailSent: false` + melding om ikke valgt kvittering | ✅ Bestått | curl |
| `POST /api/registrations` med `wantsEmailReceipt: true`, SMTP av | `201` + `emailSent: false` + «ikke konfigurert»-melding | ✅ Bestått | curl |
| `message` uten SMTP, receipt=true | `«Påmeldingen er lagret. E-postkvittering er ikke konfigurert i testmiljøet.»` | ✅ Bestått | curl |
| `message` receipt=false | `«Påmeldingen er lagret. Du valgte å ikke motta kvittering på e-post.»` | ✅ Bestått | curl |
| Påmelding lagres i JSON-fil | `registrations.json` oppdateres | ✅ Bestått | Verifisert på disk |
| `GET /api/admin/registrations` uten token | `401` | ✅ Bestått | curl |
| `GET /api/admin/registrations` med token | `200` + liste med påmeldinger (nyeste først) | ✅ Bestått | curl |
| `DELETE /api/admin/registrations/:id` | `200` + «Påmelding slettet.» | ✅ Bestått | curl |
| `DELETE /api/admin/registrations/:id` ukjent id | `404` | ✅ Bestått | curl |
| Liste etter sletting | Tom liste | ✅ Bestått | curl |

---

## 2. Adminpanel (`/admin`)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `/admin` åpnes direkte i nettleser | Innloggingsskjema vises | ✅ Bestått | Manuell test |
| Demo-tekst «Demo: festivalsjef / 2inf2026» | Skal IKKE vises på siden | ✅ Bestått | Fjernet fra FestivalManagerSection og AdminLogin |
| Innlogging med riktig passord | Dashboard vises med faner | ✅ Bestått | Manuell test |
| Innlogging med feil passord | «Feil brukernavn eller passord.» vises | ✅ Bestått | Manuell test |
| «Tilbake til forsiden» | Navigerer til `/` | ✅ Bestått | Manuell test |
| «Logg ut»-knappen | Logger ut, viser innloggingsskjema igjen | ✅ Bestått | Manuell test |
| Fane «Programredigering» | ProgramEditor vises | ✅ Bestått | Manuell test |
| Fane «Påmeldinger» | RegistrationsList vises | ✅ Bestått | Manuell test |
| Søk i påmeldingsliste | Filtrerer på navn, e-post, klasse, bedrift | ✅ Bestått | Manuell test |
| «Oppdater liste»-knappen | Henter ny liste fra backend | ✅ Bestått | Manuell test |
| «Slett»-knapp på én påmelding | Påmelding fjernes fra listen | ✅ Bestått | Manuell test |
| «Slett alle» + bekreft | Alle påmeldinger fjernes | ✅ Bestått | Manuell test |

---

## 3. Program (foredrag) og ledige plasser

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Program viser tidspunkt | Hvert kort viser start–slutt | ✅ Bestått | Manuell test |
| Program viser rom | Hvert kort viser rom | ✅ Bestått | Manuell test |
| Program viser bedrift | Hvert kort viser bedriftsnavn | ✅ Bestått | Manuell test |
| Uten ledige plasser | Viser «Maks X» | ✅ Bestått | Manuell test |
| Med ledige plasser lagret | Viser «20 av 40 ledige plasser» | ✅ Bestått | Manuell test |
| Oppdateres etter admin lagrer | ProgramSection refresher | ✅ Bestått | Manuell test |
| Refresh bevarer endringer | Backend-lagring, ikke localStorage | ✅ Bestått | Manuell test |
| Backend ikke tilgjengelig | Advarsel vises, originalprogram vises | ✅ Bestått | Manuell test |
| Søk, filter og sortering | Fungerer som før | ✅ Bestått | Manuell test |

---

## 4. Festivalsjef – ProgramEditor

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Velge bedrift | Bedrifter med foredrag vises | ✅ Bestått | Manuell test |
| Velge foredrag | Foredrag for valgt bedrift vises | ✅ Bestått | Manuell test |
| Velge rom | Auditorium A / B tilgjengelig | ✅ Bestått | Manuell test |
| Velge tidspunkt | Tidslister fra programmet vises | ✅ Bestått | Manuell test |
| Lagre endring | Endring lagres server-side, tabell oppdateres | ✅ Bestått | Manuell test |
| Ledige plasser – gyldig tall | Lagres og vises | ✅ Bestått | Manuell test |
| Ledige plasser – negativt tall | «Ledige plasser kan ikke være lavere enn 0 eller høyere enn maks kapasitet.» | ✅ Bestått | Manuell test |
| Ledige plasser – over maks | Samme feilmelding | ✅ Bestått | Manuell test |
| Tilbakestill endringer | Programmet tilbakestilles, backend nullstilles | ✅ Bestått | Manuell test |

---

## 5. Konfliktkontroll (dobbeltbooking)

Konfliktkontrollen sjekker nå det **fullt sammenslåtte programmet** (original
`datasett.json` + lagrede overrides), ikke bare overrides mot overrides.
Det betyr at admin ikke kan flytte et foredrag til et rom+tidspunkt som allerede
er opptatt av et annet foredrag – verken et originalt eller et overstyrt.

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Override A: 09:00 Auditorium A → OK. Override B: 09:00 Auditorium A (annet foredrag) | Backend svarer `409` + «Dette tidspunktet er allerede opptatt i valgt rom.» | ✅ Bestått | curl: POST /api/program/overrides med token |
| Override til 09:00 Auditorium A når originalt foredrag allerede er der | `409` – originaldata tas med i sjekken | ✅ Bestått | curl + manuell test |
| Samme tidspunkt, forskjellig rom (A vs B) | Begge tillates – `200` | ✅ Bestått | curl + manuell test |
| Forskjellig tidspunkt, samme rom | Begge tillates – `200` | ✅ Bestått | curl + manuell test |
| Frontend viser feil før lagring | «Dette tidspunktet er allerede opptatt i valgt rom.» | ✅ Bestått | Manuell test i ProgramEditor |
| Program viser ikke to foredrag i samme rom på samme tidspunkt | Deduplisert visning i ProgramSection | ✅ Bestått | Manuell test |
| ProgramSection viser advarsel ved uløste konflikter i grunndata | Advarsel: «Noen foredrag har overlappende rom og tidspunkt…» | ✅ Bestått | Manuell test (originale data har konflikter) |

---

## 6. Header og navigasjon

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Desktop nav (xl+) | Festival, Program, Bedrifter, Workshops, Finn fram | ✅ Bestått | Manuell test |
| «Festivalsjef»-lenke i header | Navigerer til `/admin` | ✅ Bestått | Manuell test |
| «Meld meg på»-knapp | Navigerer til `#pamelding`, ikke linjeskift | ✅ Bestått | Manuell test |
| Mobilmeny | Alle lenker inkl. Festivalsjef og Meld meg på | ✅ Bestått | Manuell test |

---

## 7. Finn fram

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Finn fram viser Auditorium A | Navn, bruk, beliggenhet og veibeskrivelse vises | ✅ Bestått | Manuell test |
| Finn fram viser toaletter | Info om toaletter vises | ✅ Bestått | Manuell test |
| Finn fram viser spiseområde | Info om spiseområde vises | ✅ Bestått | Manuell test |
| Filtrering på stedstype | Viser kun valgt type | ✅ Bestått | Manuell test |
| Valgt sted fremheves | Kort og detaljpanel oppdateres | ✅ Bestått | Manuell test |

---

## 8. Server, HTTPS og Nginx

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `https://festival.lan` | Nettsiden vises over HTTPS | ✅ Bestått | Manuell test (selvsignert advarsel) |
| `https://festival.lan/admin` | Adminpanel vises | ✅ Bestått | Manuell test |
| Nginx på port 443 | `curl -k -I https://festival.lan` svarer 200 | ✅ Bestått | Manuell test |
| `sudo nginx -t` | Konfigurasjon er gyldig | ✅ Bestått | Manuell test |
| `curl -I http://festival.lan` | Svarer 301 → HTTPS | ✅ Bestått | Manuell test |

---

## 9. DNS og nettverk

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| `nslookup festival.lan 10.20.30.10` | Returnerer 10.20.30.20 | ✅ Bestått | Manuell test |
| `ping 10.20.30.1` | Svar fra gateway | ✅ Bestått | Manuell test |
| `ping 10.20.30.10` | Svar fra Windows DNS | ✅ Bestått | Manuell test |
| `ping 10.20.30.20` | Svar fra Ubuntu webserver | ✅ Bestått | Manuell test |

---

## 10. Påmeldingsskjema (frontend)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Sende tomt skjema | Submit-knappen er aktiv, backend gir 400 | ✅ Bestått | Manuell test |
| Ugyldig e-post | Backend svarer «E-postadressen ser ikke riktig ut.» | ✅ Bestått | Manuell test |
| Checkbox «Jeg ønsker kvittering på e-post» vises i skjemaet | Checkbox finnes, avhuket = false som standard | ✅ Bestått | Manuell test |
| Innsending uten checkbox (SMTP av) | «Påmeldingen er lagret. Du valgte å ikke motta kvittering på e-post.» | ✅ Bestått | curl + manuell test |
| Innsending med checkbox, SMTP ikke konfigurert | «Påmeldingen er lagret. E-postkvittering er ikke konfigurert i testmiljøet.» | ✅ Bestått | curl |
| wantsEmailReceipt=false → ingen e-postforsøk | Backend logger ikke SMTP-feil, emailSent=false | ✅ Bestått | curl (verifisert i response) |
| wantsEmailReceipt=true, SMTP konfigurert | «Påmeldingen er lagret, og kvittering er sendt til e-posten din.» | ⚠️ Ikke testet | Krever ekte SMTP-konfigurasjon |
| «Meld på en til»-knappen | Skjema nullstilles inkl. checkbox | ✅ Bestått | Manuell test |
| Valg av bedrift viser info-kort | Bransje og standnummer vises | ✅ Bestått | Manuell test |
| Valg av workshop viser info-kort | Tittel, rom, tid, maks, forkunnskaper vises | ✅ Bestått | Manuell test |
| Loading state mens sending pågår | Knapp viser «Sender …» og er deaktivert | ✅ Bestått | Manuell test |

---

## 11. Oppsummering

Alle automatiske tester (`npm run build`, `npm run lint`) er kjørt og bestått
etter alle endringer. Backend-API-et er testet med `curl`, inkludert
påmeldingsruter med `wantsEmailReceipt`-felt, validering, listing, sletting og
autentisering. Konfliktkontrollen sjekker nå fullt merged program.

Manuelt verifisert: adminpanel, programseksjon med deduplisering, dobbeltbooking-
blokkering, checkbox for e-postkvittering, korrekte statusmeldinger, demo-tekst
fjernet, finn-fram og søk/filtrering i program.

`docker build` bør verifiseres på server (Docker Desktop ikke tilgjengelig i
utviklingsmiljøet). E-postkvittering med SMTP er ikke testet uten ekte
SMTP-konfigurasjon.
