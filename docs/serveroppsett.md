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
Oppsettet fungerer slik:

- **Docker-containeren** eksponeres på **port 8080** på serveren
  (`docker run -p 8080:80`, der host-port 8080 mapper til containerens port 80).
  Containeren er dermed bare tilgjengelig internt og holder seg enkel.
- **Nginx lytter på port 443** (HTTPS) og er standardinngangen til nettsiden.
- **Port 80 (HTTP) videresender automatisk til HTTPS** (HTTP → 301 → HTTPS),
  slik at all trafikk blir kryptert.
- Nginx sender forespørslene videre til containeren på `http://127.0.0.1:8080`.

Trafikkflyt:

```text
Klient  ->  https://festival.lan (443)  ->  Nginx (Ubuntu, HTTPS)  ->  Docker-container (127.0.0.1:8080 -> 80)
Klient  ->  http://festival.lan  (80)   ->  Nginx 301-redirect      ->  https://festival.lan (443)
```

Eksempel på hvordan Nginx-konfigurasjonen er bygd opp (forenklet – den
eksisterende konfigurasjonen på serveren fungerer og endres ikke):

```nginx
# Port 80: videresend alt til HTTPS
server {
    listen 80;
    server_name festival.lan www.festival.lan;
    return 301 https://$host$request_uri;
}

# Port 443: HTTPS-inngang + reverse proxy til Docker-containeren
server {
    listen 443 ssl;
    server_name festival.lan www.festival.lan;

    ssl_certificate     /etc/nginx/ssl/festival.lan.crt;   # selvsignert
    ssl_certificate_key /etc/nginx/ssl/festival.lan.key;

    location / {
        proxy_pass http://127.0.0.1:8080;                  # Docker-containeren
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Testkommandoer

Etter endringer i Nginx bør oppsettet kontrolleres. Disse kommandoene ble brukt
under testing på serveren:

```bash
sudo nginx -t                       # sjekk at konfigurasjonen er gyldig
curl -k -I https://localhost        # HTTPS lokalt på serveren (-k godtar selvsignert)
curl -k -I https://festival.lan     # HTTPS via internt domenenavn
curl -I http://festival.lan         # HTTP skal svare 301 -> https://festival.lan
```

---

## 7. HTTPS med selvsignert sertifikat

HTTPS er satt opp i Nginx med et **selvsignert sertifikat**. Dette krypterer
trafikken mellom klient og server i testmiljøet.

Sertifikatet er selvsignert fordi **`festival.lan` er et internt domene** som
bare finnes i festivalnettverket. En offentlig sertifikatutsteder kan ikke
utstede sertifikat for et navn som ikke eksisterer på internett.

Siden sertifikatet er selvsignert, viser nettleseren en advarsel om at
sertifikatet ikke er utstedt av en kjent sertifikatutsteder. I et lukket
testmiljø er dette akseptabelt. **I produksjon ville man brukt et offentlig
domene og et gyldig sertifikat fra Let's Encrypt** (automatisk fornyet), slik at
advarselen forsvinner.

Nettsiden er tilgjengelig på:

- **`https://festival.lan`** – hovedadresse (anbefalt)
- **`https://10.20.30.20`** – direkte på serverens IP

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
