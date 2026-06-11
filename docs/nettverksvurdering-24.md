# Nettverksvurdering – dekker /24 behovet?

Dette dokumentet vurderer om nettverket `10.20.30.0/24` er stort nok til å
dekke behovet under 2INF Festival, og foreslår eventuelle endringer. Vurderingen
er en del av eksamen dag 2 for retningen **IT-utvikling**.

---

## 1. Dagens nettverk

Festivalnettverket bruker nettverksadressen **`10.20.30.0/24`**.

- Nettmaske: `255.255.255.0`
- Adresser totalt: 256 (`.0`–`.255`)
- Brukbare adresser: **254** (nettverksadressen `.0` og kringkastingsadressen
  `.255` kan ikke tildeles verter)

---

## 2. Faste IP-adresser (infrastruktur)

Infrastrukturen bruker statiske adresser i den nederste delen av nettet. Det gjør
nettverket forutsigbart og enkelt å feilsøke.

| Enhet | IP-adresse | Rolle |
| --- | --- | --- |
| USG gateway | 10.20.30.1 | Router / gateway mot internett |
| U6 Lite AP | 10.20.30.2 | Trådløst access point |
| TP-Link switch | 10.20.30.3 | Kablet svitsj |
| Proxmox | 10.20.30.4 | Virtualiseringsvert |
| Windows Server DNS | 10.20.30.10 | Intern DNS |
| Ubuntu Web Server | 10.20.30.20 | Webserver / Docker |

Til sammen er det reservert en liten håndfull adresser under `.50` til
infrastruktur, slik at de aldri kolliderer med klientadresser.

---

## 3. DHCP-område

Klienter (mobiler, PC-er, nettbrett) får IP-adresse automatisk via DHCP i
området:

- **`10.20.30.50` – `10.20.30.240`**

Dette gir omtrent **191 dynamiske adresser** (`240 − 50 + 1 = 191`). Området
starter på `.50`, godt over de statiske infrastrukturadressene, slik at en
klient aldri kan få en adresse som allerede er i bruk.

---

## 4. Vurdering – dekker /24 behovet?

**For en demo og en mindre festival er `/24` godt nok.** 191 dynamiske adresser
holder fint så lenge antallet samtidige enheter holder seg under dette taket.

Men `/24` kan bli **for lite** i en realistisk, fullskala festival:

- Mange besøkende kobler til med **både mobil og PC** (og av og til nettbrett),
  så hver person kan bruke 2–3 IP-adresser samtidig.
- Med rundt 300 besøkende som alle bruker flere enheter, kan behovet fort
  overstige 191 ledige adresser. Da går DHCP-poolen tom, og nye klienter får
  ikke nettverkstilgang.
- Oppgaven nevner i tillegg et ønske om opptil 300 DHCP-adresser. Det er
  **ikke mulig** i ett `/24`-nett, som maksimalt har 254 brukbare adresser
  totalt – infrastrukturen medregnet.

Konklusjon: `/24` fungerer for testmiljøet og en liten festival, men har for
liten kapasitet til en stor festival med mange enheter per person.

---

## 5. Forslag til forbedring

For å dekke et større behov anbefales følgende endringer:

### a) Større adresseområde med `/23`

Ved å utvide til **`/23`** (`10.20.30.0/23`) får man **510 brukbare adresser** –
mer enn nok til 300 besøkende med flere enheter hver. Dette er den enkleste
endringen for å løse kapasitetsproblemet.

### b) VLAN-segmentering

Del nettverket i flere **VLAN** for å øke både sikkerhet og oversikt:

| VLAN | Formål |
| --- | --- |
| Administrasjon | Gateway, svitsj, AP, Proxmox, servere |
| Servere | Web- og DNS-tjenester, atskilt fra klienter |
| Gjester | Besøkendes mobiler og PC-er |

Hvert VLAN kan ha sitt eget subnett og sin egen DHCP-pool, slik at en stor
mengde gjesteenheter ikke spiser opp adressene som infrastrukturen trenger.

### c) Eget gjestenettverk

Et separat **gjestenettverk** (gjerne et eget SSID på access pointet) holder
besøkende isolert fra servere og administrasjon. Gjestene får internett, men
ikke direkte tilgang til intern infrastruktur. Dette reduserer angrepsflaten og
gjør det enklere å sette egne grenser (båndbredde, antall adresser) for gjester.

---

## 6. Faglig begrunnelse

- **`/23` framfor `/24`:** Kapasiteten dobles uten å måtte bygge om hele
  adresseringen. Adresserommet rekker da til mange enheter per besøkende.
- **VLAN:** Segmentering følger prinsippet om *minste privilegium* – klienter
  skal ikke nå serveradministrasjon. Det begrenser hva som skjer hvis en
  gjesteenhet blir kompromittert, og gir mindre kringkastingstrafikk per segment.
- **Gjestenettverk:** Standard god praksis på arrangementer. Skiller «åpne»
  brukere fra «interne» tjenester og gjør drift og sikkerhet enklere.

For dette eksamensprosjektet beholdes `10.20.30.0/24`, fordi det er et lukket
testmiljø med få samtidige enheter. Endringene over er anbefalinger for en ekte,
fullskala festival.
