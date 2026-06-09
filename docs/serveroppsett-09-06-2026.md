# Serveroppsett – 09.06.2026

## Prosjekt

2INF Festival – IT-utvikling

## Dato

09.06.2026

## Innledning

Dette dokumentet beskriver det ferdige serveroppsettet for 2INF Festival.
Infrastrukturen er virtualisert på en Proxmox-host og består av én Ubuntu
Server og én Windows Server, begge koblet til det fysiske nettverket
`10.20.30.0/24`. Windows Server kjører DNS-rollen, og Ubuntu Server kjører
tjenestene (Nginx, Node.js og Docker) som webapplikasjonen bygger på.

Statusen for hele serverdelen er nå **ferdig satt opp og testet**.

---

## 1. Fysisk nettverk

| Komponent           | IP-adresse                  | Merknad                  |
| ------------------- | --------------------------- | ------------------------ |
| Nettverk            | 10.20.30.0/24               | Hovednettverk            |
| Router / gateway    | 10.20.30.1                  | Standard gateway         |
| AP management       | 10.20.30.2                  | Access point             |
| Switch management   | 10.20.30.3                  | Switch                   |
| Proxmox host        | 10.20.30.4                  | Virtualiseringsvert      |
| Windows Server      | 10.20.30.10                 | DNS-server               |
| Ubuntu Server       | 10.20.30.20                 | Webtjenester / Docker    |
| DHCP range          | 10.20.30.50 – 10.20.30.240  | Dynamiske klientadresser |

**Trådløst nettverk:**

| Innstilling | Verdi                     |
| ----------- | ------------------------- |
| SSID        | 2INF-Festival-KostiantynK |
| Sikkerhet   | WPA2                      |

---

## 2. Proxmox-host

Proxmox brukes som virtualiseringsplattform og kjører begge serverne som
virtuelle maskiner. Hosten er koblet direkte til switchen.

| Innstilling   | Verdi                     |
| ------------- | ------------------------- |
| Node-navn     | kostia                    |
| Proxmox URL   | https://10.20.30.4:8006   |
| Host-IP       | 10.20.30.4                |
| Tilkobling    | Direkte til switch        |

### Nettverksbro (bridge)

| Innstilling      | Verdi                                |
| ---------------- | ------------------------------------ |
| Hovedbridge      | vmbr0                                |
| Fysisk interface | nic0                                 |
| Nettverk         | 10.20.30.0/24                        |
| Tilkoblede VM-er | Alle VM-er er koblet til vmbr0       |

Den gamle broen `vmbr1` ble fjernet fordi den ikke lenger var nødvendig.
Alle virtuelle maskiner bruker nå `vmbr0` som felles bro, slik at de ligger
i samme nettverk (`10.20.30.0/24`) som resten av infrastrukturen.

| VM             | Bridge |
| -------------- | ------ |
| Ubuntu Server  | vmbr0  |
| Windows Server | vmbr0  |

**Status:** ✅ Ferdig

---

## 3. Ubuntu Server

### Maskinvare og VM-oppsett

| Innstilling      | Verdi                                |
| ---------------- | ------------------------------------ |
| Proxmox VM-navn  | 2INF-Festival-Kostiantyn-Ubuntu      |
| VM ID            | 100                                  |
| OS               | Ubuntu Server 26.04 LTS              |
| Hostname         | ubuntu-srv-01                        |
| Statisk IP       | 10.20.30.20/24                       |
| Gateway          | 10.20.30.1                           |
| Bridge           | vmbr0                                |
| CPU              | 2 kjerner                            |
| RAM              | 4 GB                                 |
| Disk             | 32 GB                                |
| Installasjonsbruker | kostiantyn                        |

### Nettverkstester

| Test                              | Forventet                       | Resultat |
| --------------------------------- | ------------------------------- | -------- |
| `hostname`                        | ubuntu-srv-01                   | ✅       |
| `ip -br addr`                     | ens18 UP 10.20.30.20/24         | ✅       |
| `ip route`                        | default via 10.20.30.1          | ✅       |
| `ping 10.20.30.1`                 | Svar fra gateway                | ✅       |
| `ping 8.8.8.8`                    | Svar fra internett              | ✅       |
| `ping google.com`                 | DNS + internett fungerer        | ✅       |
| Laptop åpner `http://10.20.30.20` | Nettside svarer                 | ✅       |

### Installerte tjenester

| Tjeneste | Versjon / status         | Test                                       | Resultat |
| -------- | ------------------------ | ------------------------------------------ | -------- |
| Nginx    | active / running         | `curl -I http://localhost` → 200 OK        | ✅       |
| Nginx    | active / running         | `curl -I http://10.20.30.20` → 200 OK      | ✅       |
| Node.js  | v22.22.1                 | `node -v`                                  | ✅       |
| npm      | 9.2.0                    | `npm -v`                                   | ✅       |
| Docker   | 29.5.3                   | `docker --version`                         | ✅       |
| Docker   | –                        | `docker run hello-world` → "Hello from Docker!" | ✅  |

### Bruker og tilgang

En egen driftsbruker `festivalsjef` er opprettet for sikker tilgang til
serveren.

| Innstilling                          | Verdi                              |
| ------------------------------------ | ---------------------------------- |
| Bruker                               | festivalsjef                       |
| Grupper (`groups festivalsjef`)      | festivalsjef sudo users docker     |
| sudo-gruppe                          | Ja                                 |
| docker-gruppe                        | Ja                                 |
| SSH-nøkkelinnlogging fra laptop      | Fungerer                           |
| `docker run hello-world` uten sudo   | Fungerer                           |

### SSH-sikkerhet

| Innstilling (`sshd -T`)        | Verdi |
| ------------------------------ | ----- |
| permitrootlogin                | no    |
| pubkeyauthentication           | yes   |
| passwordauthentication         | no    |
| kbdinteractiveauthentication   | no    |

- SSH-passordinnlogging er deaktivert.
- Root-innlogging via SSH er deaktivert.
- Test med passord-kun-innlogging gir: `Permission denied (publickey)`.

**Status:** ✅ Ferdig og testet

---

## 4. Windows Server

### Maskinvare og VM-oppsett

| Innstilling     | Verdi                                  |
| --------------- | -------------------------------------- |
| Proxmox VM-navn | 2INF-Festival-Kostiantyn-Windows       |
| VM ID           | 101                                    |
| OS              | Windows Server 2019 Standard Evaluation|
| Utgave          | Desktop Experience                     |
| Hostname        | WIN-SRV-01                             |
| Statisk IP      | 10.20.30.10                            |
| Subnettmaske    | 255.255.255.0                          |
| Gateway         | 10.20.30.1                             |
| DNS på serveren | 10.20.30.10 (peker på seg selv)        |
| CPU             | 4 kjerner                              |
| RAM             | 8192 MB                                |
| Disk            | 60 GB SATA                             |
| Nettverk        | VirtIO, bridge vmbr0                   |

**ISO som ble brukt:**
`17763.3650.221105-1748.rs5_release_svc_refresh_SERVER_EVAL_x64FRE_en-us.iso`

VirtIO-nettverksdriveren ble installert fra `virtio-win.iso`, og
nettverkskortet fungerer.

### Nettverkstester

| Test               | Forventet                  | Resultat |
| ------------------ | -------------------------- | -------- |
| `ipconfig`         | IPv4 Address 10.20.30.10   | ✅       |
| `ipconfig`         | Default Gateway 10.20.30.1 | ✅       |
| `ping 10.20.30.1`  | Svar fra gateway           | ✅       |
| `ping 8.8.8.8`     | Svar fra internett         | ✅       |
| `ping google.com`  | DNS + internett fungerer   | ✅       |
| `ping 10.20.30.20` | Når Ubuntu Server          | ✅       |
| Internett          | Fungerer fra Windows Server| ✅       |

### PowerShell Remoting

PowerShell Remoting (WinRM) er aktivert for fjernadministrasjon fra laptop.

| Test              | Resultat |
| ----------------- | -------- |
| PowerShell Remoting aktivert | ✅ |
| WinRM fungerer    | ✅       |

Tilkobling fra laptop:

```powershell
Enter-PSSession -ComputerName 10.20.30.10 -Credential WIN-SRV-01\Administrator
```

**Status:** ✅ Ferdig og testet

---

## 5. DNS (Windows Server)

DNS-rollen er installert på Windows Server og fungerer som intern navnetjener
for nettverket.

### Installasjon

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

| Resultat        | Verdi |
| --------------- | ----- |
| Success         | True  |
| Restart Needed  | No    |

### Konfigurasjon

| Innstilling                 | Verdi              |
| --------------------------- | ------------------ |
| DNS-tjeneste                | Fungerer           |
| Forwarders                  | 8.8.8.8 og 1.1.1.1 |
| Windows Server bruker som DNS | 10.20.30.10      |

### Lokal DNS-sone: `festival.local`

| A-record                       | Peker mot   |
| ------------------------------ | ----------- |
| win-srv-01.festival.local      | 10.20.30.10 |
| ubuntu-srv-01.festival.local   | 10.20.30.20 |
| festival.festival.local        | 10.20.30.20 |

### nslookup-tester

| Kommando                                          | Forventet svar | Resultat |
| ------------------------------------------------- | -------------- | -------- |
| `nslookup win-srv-01.festival.local 10.20.30.10`  | 10.20.30.10    | ✅       |
| `nslookup ubuntu-srv-01.festival.local 10.20.30.10` | 10.20.30.20  | ✅       |
| `nslookup festival.festival.local 10.20.30.10`    | 10.20.30.20    | ✅       |

> Merknad: nslookup viser `Server: Unknown`. Dette er ikke et problem, fordi
> DNS-oppslagene løses korrekt og returnerer riktige IP-adresser. Meldingen
> kommer av at reverse-oppslag (PTR) for selve DNS-serveren ikke er satt opp,
> og påvirker ikke navneoppslagene.

**Status:** ✅ Ferdig og testet

---

## 6. Sikkerhetsvurdering

| Tiltak                                          | Status | Kommentar                                   |
| ----------------------------------------------- | ------ | ------------------------------------------- |
| Faste IP-adresser på servere                    | ✅     | Stabil drift av DNS og webtjenester         |
| SSH med nøkkel for `festivalsjef`               | ✅     | Tryggere enn passord                        |
| SSH-passordinnlogging deaktivert                | ✅     | `passwordauthentication no`                 |
| Root-innlogging via SSH deaktivert              | ✅     | `permitrootlogin no`                        |
| Egen driftsbruker i stedet for root             | ✅     | `festivalsjef` med sudo og docker           |
| Docker uten sudo via docker-gruppe              | ✅     | Mindre bruk av root-rettigheter             |
| Kun nødvendige roller/tjenester installert      | ✅     | DNS på Windows, Nginx/Node/Docker på Ubuntu |
| DNS-forwarders satt opp                         | ✅     | 8.8.8.8 og 1.1.1.1                          |
| WPA2 på trådløst nettverk                       | ✅     | Kryptert trådløs tilgang                    |
| PowerShell Remoting med credential              | ✅     | Administrasjon krever innlogging            |
| HTTPS i produksjon                              | ⚠️     | Bør settes opp med sertifikat ved produksjon|

Samlet sett er serveroppsettet satt opp etter prinsippet om minst mulig
tilgang: egne brukere, nøkkelbasert SSH, deaktivert root-innlogging og kun
nødvendige tjenester. Det viktigste gjenstående sikkerhetstiltaket er HTTPS
ved en eventuell produksjonssetting.

---

## 7. Hva jeg lærte

- Hvordan sette opp og bruke Proxmox som virtualiseringsplattform, og hvorfor
  en felles bro (`vmbr0`) gjør at alle VM-er ligger i samme nettverk.
- At man kan rydde opp i ubrukt nettverkskonfigurasjon (fjernet `vmbr1`) for å
  holde oppsettet enklere og mer oversiktlig.
- Hvordan gi en Ubuntu Server fast IP, og verifisere nettverk med `ip -br addr`,
  `ip route`, `ping` og `curl`.
- Hvordan installere og teste Nginx, Node.js og Docker, og hvordan
  `docker run hello-world` bekrefter at Docker fungerer.
- Hvordan sikre SSH med nøkkel, og hvordan `sshd -T` brukes til å verifisere at
  passord- og root-innlogging faktisk er deaktivert.
- Hvordan installere VirtIO-drivere i Windows Server for at nettverkskortet
  skal fungere i Proxmox.
- Hvordan installere DNS-rollen i Windows Server, lage en lokal sone med
  A-records og teste navneoppslag med `nslookup`.
- At `Server: Unknown` i nslookup ikke betyr feil, så lenge oppslagene løses
  riktig.
- Hvordan PowerShell Remoting (WinRM) gjør det mulig å administrere Windows
  Server fra laptop.

---

## 8. Skjermbilder som bør legges ved

Følgende skjermbilder anbefales lagt ved i innleveringen for å dokumentere at
oppsettet er gjennomført. (Skjermbilder er **ikke** inkludert i repositoriet
ennå – dette er en sjekkliste.)

- [ ] Proxmox-oversikt med node `kostia` og begge VM-ene (ID 100 og 101)
- [ ] Proxmox nettverk som viser `vmbr0` koblet til `nic0`
- [ ] Ubuntu: `hostname` og `ip -br addr` (10.20.30.20/24)
- [ ] Ubuntu: `ip route` (default via 10.20.30.1)
- [ ] Ubuntu: `ping 10.20.30.1`, `ping 8.8.8.8`, `ping google.com`
- [ ] Ubuntu: `curl -I http://localhost` og `curl -I http://10.20.30.20` (200 OK)
- [ ] Ubuntu: `node -v`, `npm -v`, `docker --version`
- [ ] Ubuntu: `docker run hello-world` ("Hello from Docker!")
- [ ] Ubuntu: `groups festivalsjef` (festivalsjef sudo users docker)
- [ ] Ubuntu: vellykket SSH-nøkkelinnlogging fra laptop
- [ ] Ubuntu: `sshd -T` med passord/root deaktivert
- [ ] Ubuntu: mislykket passord-SSH ("Permission denied (publickey)")
- [ ] Laptop åpner `http://10.20.30.20` i nettleser
- [ ] Windows: `ipconfig` (10.20.30.10, gateway 10.20.30.1)
- [ ] Windows: `ping 10.20.30.1`, `ping 8.8.8.8`, `ping google.com`, `ping 10.20.30.20`
- [ ] Windows: `Install-WindowsFeature DNS` med Success True
- [ ] Windows: DNS Manager med sonen `festival.local` og A-records
- [ ] Windows: `nslookup` for alle tre A-records
- [ ] Laptop: `Enter-PSSession` mot Windows Server

---

## 9. Hvordan serveroppsettet støtter IT-utvikling-caset

Selv om hovedretningen er **IT-utvikling**, gir serveroppsettet en realistisk
driftsplattform for festival-webapplikasjonen:

- **Ubuntu Server** kjører Nginx, Node.js og Docker. Det betyr at den ferdige
  React/Vite-applikasjonen kan bygges med Node og kjøres i en Docker-container
  bak Nginx – akkurat slik prosjektets `Dockerfile` legger opp til.
- **Windows Server med DNS** gjør at applikasjonen kan nås på et navn
  (`festival.festival.local`) i stedet for bare en IP-adresse, som er mer
  likt en ekte produksjonsoppsetting.
- **Sikker tilgang** (SSH med nøkkel, egen driftsbruker, deaktivert root)
  viser at løsningen kan driftes og videreutvikles på en trygg måte.

Serveroppsettet binder dermed sammen utviklingsdelen og infrastrukturdelen av
den tverrfaglige eksamenen: webapplikasjonen som er utviklet, har nå et konkret
sted å kjøre.
