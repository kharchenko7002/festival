# Testing dag 2 – IT-utvikling

Dette dokumentet bygges ut med full testtabell for dag 2. Foreløpig dekker det
testene av konfliktkontrollen i festivalsjef-funksjonen.

---

## Konfliktkontroll (dobbeltbooking)

| Test | Forventet resultat | Resultat | Kommentar |
| --- | --- | --- | --- |
| Lagre to foredrag i samme rom på samme tidspunkt | Andre lagring blokkeres med feilmelding «Dette tidspunktet er allerede opptatt i valgt rom.» | ✅ Bestått | Manuell test |
| Samme tidspunkt, forskjellig rom (A vs B) | Begge lagres uten feil | ✅ Bestått | Manuell test |
| Forskjellig tidspunkt, samme rom | Begge lagres uten feil | ✅ Bestått | Manuell test |
