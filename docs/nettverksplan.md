# Nettverksplan – 2INF Festival

Dette dokumentet beskriver nettverket for festivalmiljøet: nettverkskart,
IP-plan, DHCP, statiske adresser, utstyr, intern DNS og begrensninger i
UniFi-topologien.

---

## 1. Nettverkskart (tekst)

```text
                          Internett (WAN)
                                |
                    [ USG 3P Gateway 10.20.30.1 ]
                                |
                    [ TP-Link Switch 10.20.30.3 ]
            ____________________|____________________
           |              |              |           |
   [ U6 Lite AP      [ Proxmox Host  [ (klienter   (andre
     10.20.30.2 ]      10.20.30.4 ]   via Wi-Fi/   enheter)
           |             /      \      kabel) ]
        Wi-Fi           /        \
     (WPA2-klienter)   /          \
              [ Ubuntu Web    [ Windows Server
                10.20.30.20 ]   DNS 10.20.30.10 ]
                (VM på Proxmox)  (VM på Proxmox)
```

Nettverksadresse: **10.20.30.0/24** (256 adresser, 254 brukbare).

---

## 2. IP-plan

| Enhet | IP-adresse | Type | Merknad |
| --- | --- | --- | --- |
| USG 3P Gateway | 10.20.30.1 | Statisk | Router / gateway mot internett |
| U6 Lite AP | 10.20.30.2 | Statisk | Trådløst access point |
| TP-Link Switch | 10.20.30.3 | Statisk | Svitsj (ikke UniFi) |
| Proxmox Host (`kostia`) | 10.20.30.4 | Statisk | Virtualiseringsvert |
| Windows Server (`WIN-SRV-01`) | 10.20.30.10 | Statisk | DNS-server |
| Ubuntu Web Server (`ubuntu-srv-01`) | 10.20.30.20 | Statisk | Webserver / Docker |
| Laptop / klient | 10.20.30.52 | DHCP | Testklient |
| DHCP-område | 10.20.30.50 – 10.20.30.240 | Dynamisk | Klienter |

### Skille mellom statiske adresser og DHCP

Infrastruktur (gateway, AP, svitsj, Proxmox og servere) har **statiske**
adresser under `.50`. DHCP-området starter på `.50`, slik at klienter ikke får
adresser som krasjer med infrastrukturen.

---

## 3. DHCP

Klienter får IP automatisk i området `10.20.30.50 – 10.20.30.240`. Under test
fikk laptopen `10.20.30.52`.

### Vurdering av kravet om 300 adresser

Oppgaven nevner 300 DHCP-adresser. Et `/24`-nett gir bare 254 brukbare
adresser, så 300 er ikke mulig i `10.20.30.0/24`. For å støtte 300 klienter
måtte man brukt et større subnett (f.eks. `/23`) eller delt opp i flere
VLAN/subnett. Jeg har fulgt nettverksadressen fra oppgaven og dokumenterer
begrensningen her.

---

## 4. Utstyr

| Utstyr | Modell / type | Rolle |
| --- | --- | --- |
| Gateway | UniFi USG 3P | Router, WAN, DHCP |
| Access point | UniFi U6 Lite | Trådløst nett (Wi-Fi) |
| Svitsj | TP-Link | Kablet nett (ikke UniFi) |
| Virtualiseringsvert | Proxmox VE (`kostia`) | Kjører VM-ene |

---

## 5. Trådløst nettverk

```text
SSID: 2INF-Festival-KostiantynK
Sikkerhet: WPA2
```

---

## 6. Intern DNS

DNS kjører på Windows Server (10.20.30.10). Følgende navn peker på
webserveren (10.20.30.20):

| Navn | Peker på |
| --- | --- |
| `festival.lan` | 10.20.30.20 |
| `www.festival.lan` | 10.20.30.20 |
| `festival.festival.local` | 10.20.30.20 |

`festival.lan` er kun internt i festivalnettverket og er ikke et offentlig
domene på internett.

---

## 7. UniFi-topologi og begrensninger

USG 3P og U6 Lite er adoptert i UniFi-kontrolleren og vises som «Up to date».
Enhetene er navngitt manuelt for å gjøre oversikten tydelig:

| Navn i UniFi | IP |
| --- | --- |
| USG 3P Gateway | 10.20.30.1 |
| U6 Lite AP | 10.20.30.2 |
| TP-Link Switch | 10.20.30.3 |
| Proxmox Host | 10.20.30.4 |
| Windows Server DNS | 10.20.30.10 |
| Ubuntu Web Server | 10.20.30.20 |
| Laptop | 10.20.30.52 |

**Begrensning:** Svitsjen er en TP-Link og ikke en UniFi-enhet. Derfor kan ikke
UniFi vise en full port-basert topologi – UniFi «ser» ikke hvilke porter på
svitsjen enhetene er koblet til. Klienter vises i topologien, men koblingene
gjennom svitsjen blir ikke detaljerte. Med en UniFi-svitsj ville topologien
vært komplett.

---

## 8. Tilgang hjemmefra (VPN)

Et forsøk på å nå `10.20.30.0/24` hjemmefra med bare en WireGuard-konfig på
laptopen var ikke nok. For at trafikken skal rutes inn i festivalnettverket må
også VPN-serversiden støtte ruting til subnettet. Dette er notert som en
begrensning og ikke løst i dette prosjektet.
