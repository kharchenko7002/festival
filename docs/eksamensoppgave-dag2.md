# Eksamen dag 2 – IT-utvikling

Dette dokumentet bygges ut gjennom dag 2. Foreløpig dokumenterer det
konfliktkontrollen i festivalsjef-funksjonen.

---

## Konfliktkontroll – ingen dobbeltbooking

Festivalsjefen kan tildele foredrag til **Auditorium A** eller **Auditorium B**
med et tidspunkt. For å unngå at to bedrifter havner i samme rom til samme tid,
har løsningen en konfliktkontroll.

**Regel:** Hvis et annet foredrag allerede har **samme rom** og **samme
tidspunkt**, kan endringen ikke lagres. Da vises feilmeldingen:

> «Dette tidspunktet er allerede opptatt i valgt rom.»

- Samme tidspunkt i **forskjellig rom** er tillatt.
- Forskjellig tidspunkt i **samme rom** er tillatt.
- Kontrollen gjelder både Auditorium A og Auditorium B.

Kontrollen er implementert i `hasRoomTimeConflict()` i
`app/src/utils/dataHelpers.js` og kjøres i `FestivalManagerSection.jsx` før
lagring. Endringen lagres bare hvis det ikke finnes konflikt.
