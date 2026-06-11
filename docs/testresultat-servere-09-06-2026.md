# Testresultat – Servere og infrastruktur

**Dato for testing:** 09.06.2026
**Prosjekt:** 2INF Festival – IT-utvikling
**Miljø:** Proxmox-host (10.20.30.4), Ubuntu Server (10.20.30.20), Windows Server (10.20.30.10), laptop som klient

Dette dokumentet oppsummerer testene som ble gjennomført på serveroppsettet og
infrastrukturen. Testene for selve webapplikasjonen er dokumentert i
`testresultat-09-06-2026.md`.

---

## Oppsummering

| Område                 | Resultat   |
| ---------------------- | ---------- |
| Proxmox og nettverksbro | ✅ Bestått |
| Ubuntu – nettverk      | ✅ Bestått |
| Ubuntu – tjenester     | ✅ Bestått |
| Ubuntu – bruker og SSH | ✅ Bestått |
| Windows – nettverk     | ✅ Bestått |
| Windows – PowerShell Remoting | ✅ Bestått |
| Windows – DNS          | ✅ Bestått |

---

## 1. Proxmox og nettverksbro

| Test                                   | Forventet                | Resultat |
| -------------------------------------- | ------------------------ | -------- |
| Node `kostia` tilgjengelig             | Innlogging på Proxmox    | ✅       |
| Proxmox URL `https://10.20.30.4:8006`  | Web-grensesnitt svarer   | ✅       |
| `vmbr0` koblet til `nic0`              | Bro mot fysisk interface | ✅       |
| `vmbr0` i nettverk 10.20.30.0/24       | Riktig nettverk          | ✅       |
| `vmbr1` fjernet                        | Ikke lenger til stede    | ✅       |
| Begge VM-er koblet til `vmbr0`         | Ubuntu og Windows på bro | ✅       |

**Resultat:** ✅ Proxmox og bro fungerer som forventet.

---

## 2. Ubuntu Server – nettverk

| Test                              | Forventet                | Resultat |
| --------------------------------- | ------------------------ | -------- |
| `hostname`                        | ubuntu-srv-01            | ✅       |
| `ip -br addr`                     | ens18 UP 10.20.30.20/24  | ✅       |
| `ip route`                        | default via 10.20.30.1   | ✅       |
| `ping 10.20.30.1`                 | Svar fra gateway         | ✅       |
| `ping 8.8.8.8`                    | Svar fra internett       | ✅       |
| `ping google.com`                 | DNS + internett fungerer | ✅       |
| Laptop åpner `http://10.20.30.20` | Nettside svarer          | ✅       |

**Resultat:** ✅ Nettverket på Ubuntu Server fungerer.

---

## 3. Ubuntu Server – tjenester

| Test                                   | Forventet                | Resultat |
| -------------------------------------- | ------------------------ | -------- |
| Nginx installert                       | Tjeneste finnes          | ✅       |
| Nginx active/running                   | Kjører                   | ✅       |
| `curl -I http://localhost`             | HTTP/1.1 200 OK          | ✅       |
| `curl -I http://10.20.30.20`           | HTTP/1.1 200 OK          | ✅       |
| `node -v`                              | v22.22.1                 | ✅       |
| `npm -v`                               | 9.2.0                    | ✅       |
| `docker --version`                     | Docker version 29.5.3    | ✅       |
| `docker run hello-world`               | "Hello from Docker!"     | ✅       |

**Resultat:** ✅ Nginx, Node.js og Docker fungerer.

---

## 4. Ubuntu Server – bruker og SSH-sikkerhet

| Test                                          | Forventet                     | Resultat |
| --------------------------------------------- | ----------------------------- | -------- |
| Bruker `festivalsjef` opprettet               | Finnes                        | ✅       |
| `groups festivalsjef`                         | festivalsjef sudo users docker| ✅       |
| SSH-nøkkelinnlogging fra laptop               | Logger inn                    | ✅       |
| `docker run hello-world` uten sudo            | Fungerer                      | ✅       |
| `sshd -T` permitrootlogin                     | no                            | ✅       |
| `sshd -T` pubkeyauthentication                | yes                           | ✅       |
| `sshd -T` passwordauthentication              | no                            | ✅       |
| `sshd -T` kbdinteractiveauthentication        | no                            | ✅       |
| SSH med kun passord                           | Permission denied (publickey) | ✅       |

**Resultat:** ✅ Bruker og SSH-sikkerhet er korrekt satt opp.

---

## 5. Windows Server – nettverk

| Test               | Forventet                  | Resultat |
| ------------------ | -------------------------- | -------- |
| `ipconfig`         | IPv4 Address 10.20.30.10   | ✅       |
| `ipconfig`         | Default Gateway 10.20.30.1 | ✅       |
| `ping 10.20.30.1`  | Svar fra gateway           | ✅       |
| `ping 8.8.8.8`     | Svar fra internett         | ✅       |
| `ping google.com`  | DNS + internett fungerer   | ✅       |
| `ping 10.20.30.20` | Når Ubuntu Server          | ✅       |
| Internett          | Fungerer fra serveren      | ✅       |

**Resultat:** ✅ Nettverket på Windows Server fungerer, og serverne når hverandre.

---

## 6. Windows Server – PowerShell Remoting

| Test                              | Forventet               | Resultat |
| --------------------------------- | ----------------------- | -------- |
| PowerShell Remoting aktivert      | Aktiv                   | ✅       |
| WinRM fungerer                    | Tjeneste svarer         | ✅       |
| `Enter-PSSession` fra laptop      | Tilkoblet med credential| ✅       |

**Resultat:** ✅ Fjernadministrasjon via PowerShell Remoting fungerer.

---

## 7. Windows Server – DNS

| Test                                              | Forventet      | Resultat |
| ------------------------------------------------- | -------------- | -------- |
| `Install-WindowsFeature DNS`                      | Success True   | ✅       |
| Restart Needed                                    | No             | ✅       |
| DNS-tjeneste                                      | Kjører         | ✅       |
| Forwarders 8.8.8.8 og 1.1.1.1                     | Konfigurert    | ✅       |
| Sone `festival.local` opprettet                   | Finnes         | ✅       |
| `nslookup win-srv-01.festival.local 10.20.30.10`  | 10.20.30.10    | ✅       |
| `nslookup ubuntu-srv-01.festival.local 10.20.30.10` | 10.20.30.20  | ✅       |
| `nslookup festival.festival.local 10.20.30.10`    | 10.20.30.20    | ✅       |

> `Server: Unknown` i nslookup-utskriften regnes ikke som en feil, fordi alle
> oppslag løses korrekt og returnerer riktige IP-adresser.

**Resultat:** ✅ DNS fungerer og løser alle A-records riktig.

---

## Konklusjon

Alle testene på serveroppsettet og infrastrukturen bestod. Proxmox-broen er
ryddet opp og fungerer, Ubuntu Server kjører Nginx, Node.js og Docker med
sikker SSH-tilgang, og Windows Server leverer DNS for den lokale sonen
`festival.local`. Serverne når hverandre og internett, og laptop kan
administrere begge. Serverdelen av prosjektet regnes derfor som ferdig og
verifisert.
