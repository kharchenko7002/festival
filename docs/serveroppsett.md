# Serveroppsett – 2INF Festival

Dette dokumentet beskriver hvordan serverne i prosjektet er satt opp: Proxmox-
host, Ubuntu Server, Windows Server, IP-plan, DNS, SSH-sikring, Docker-
deployment, Nginx reverse proxy og HTTPS. Mer detaljerte dagsnotater finnes i
`docs/serveroppsett-09-06-2026.md` og `docs/arbeidslogg-09-06-2026.md`.

---

## 1. Oversikt

Infrastrukturen er virtualisert på én Proxmox-host. På Proxmox kjører to
virtuelle maskiner i nettverket `10.20.30.0/24`:

| Rolle | VM-navn | VM ID | OS | IP |
| --- | --- | --- | --- | --- |
| Webserver | `2INF-Festival-Kostiantyn-Ubuntu` | 100 | Ubuntu Server 26.04 LTS | 10.20.30.20 |
| DNS-server | `2INF-Festival-Kostiantyn-Windows` | 101 | Windows Server 2019 | 10.20.30.10 |

---

## 2. Proxmox-host

| Felt | Verdi |
| --- | --- |
| Node-navn | `kostia` |
| Webgrensesnitt | https://10.20.30.4:8006 |
| Host-IP | 10.20.30.4 |
| Hovedbro | `vmbr0` (mot fysisk nettkort `nic0`) |
| Nettverk | 10.20.30.0/24 |

Begge VM-ene er koblet til broen `vmbr0`, slik at de ligger i samme nettverk
som resten av infrastrukturen. Den gamle, ubrukte broen `vmbr1` er fjernet for
å holde oppsettet enkelt.

---

## 3. Ubuntu Server (webserver)

| Felt | Verdi |
| --- | --- |
| Hostname | `ubuntu-srv-01` |
| IP / maske | 10.20.30.20/24 |
| Gateway | 10.20.30.1 |
| Bro | `vmbr0` |

### Installerte tjenester

- **Nginx** – reverse proxy og webserver
- **Docker** – kjører nettsiden som container
- **Node.js** – brukt under bygging

### Bruker og rettigheter

Det er opprettet en driftsbruker `festivalsjef`:

- Medlem av gruppene `sudo` og `docker`
- Kan kjøre Docker uten `sudo`
- Logger inn med SSH-nøkkel

---

## 4. SSH-sikring (hardening)

SSH er strammet inn slik:

```text
PubkeyAuthentication yes
PasswordAuthentication no
PermitRootLogin no
```

Resultat:

- Innlogging med SSH-nøkkel for `festivalsjef` fungerer.
- Innlogging med passord avvises (`Permission denied (publickey)`).
- Root kan ikke logge inn direkte via SSH.

Etter endring av `sshd_config` ble tjenesten startet på nytt med
`sudo systemctl restart ssh`.

---

## 5. Docker-deployment

Nettsiden kjører som en Docker-container på Ubuntu Server:

1. Prosjektet er kopiert til serveren.
2. Imaget er bygget på serveren fra `Dockerfile` (to-trinns bygg: React bygges
   med Node, og `dist/` serveres av Nginx i imaget).
3. Containeren kjøres og lytter på port 80 internt.

```bash
docker build -t 2inf-festival .
docker run -d -p 8080:80 --name 2inf-festival --restart unless-stopped 2inf-festival
```

---

## 6. Nginx reverse proxy

På Ubuntu Server står en Nginx reverse proxy **foran** Docker-containeren.
Nginx tar imot trafikk på `festival.lan` (port 80/443) og sender den videre til
containeren. Reverse proxyen håndterer også HTTPS, slik at selve containeren kan
holde seg enkel.

Trafikkflyt:

```text
Klient  ->  https://festival.lan  ->  Nginx (Ubuntu, HTTPS)  ->  Docker-container (port 80)
```

---

## 7. HTTPS med selvsignert sertifikat

HTTPS er satt opp i Nginx med et **selvsignert sertifikat**. Dette krypterer
trafikken mellom klient og server i testmiljøet.

Siden sertifikatet er selvsignert, viser nettleseren en advarsel om at
sertifikatet ikke er utstedt av en kjent sertifikatutsteder. I et lukket
testmiljø er dette akseptabelt. I produksjon bør et gyldig sertifikat brukes.

---

## 8. festival.lan

Navnet `festival.lan` løses av den interne DNS-serveren på Windows Server
(10.20.30.10) og peker på Ubuntu Server (10.20.30.20).

| Navn | Peker på |
| --- | --- |
| `festival.lan` | 10.20.30.20 |
| `www.festival.lan` | 10.20.30.20 |
| `festival.festival.local` | 10.20.30.20 |

Nettsiden er dermed tilgjengelig på:

- `https://festival.lan` (anbefalt)
- `https://10.20.30.20` (direkte på IP)

---

## 9. Windows Server (DNS)

| Felt | Verdi |
| --- | --- |
| Hostname | `WIN-SRV-01` |
| OS | Windows Server 2019 Standard Evaluation |
| IP | 10.20.30.10 |
| Gateway | 10.20.30.1 |
| DNS | 10.20.30.10 |

Oppsett:

- DNS-rollen er installert (`Install-WindowsFeature -Name DNS -IncludeManagementTools`).
- Forwarders er satt opp (8.8.8.8 og 1.1.1.1) for oppslag mot internett.
- Sonen `festival.lan` er opprettet med A-records til webserveren.
- Sonen `festival.festival.local` er også konfigurert.
- PowerShell Remoting (WinRM) fungerer, og laptop kan koble til med
  `Enter-PSSession`.

---

## 10. Status

Hele serveroppsettet er ferdig og testet: Proxmox-host, Ubuntu Server med
Docker/Nginx/HTTPS, Windows Server med DNS, og en fungerende nettside på
`https://festival.lan`. Testresultatene står i `docs/testing.md`.
