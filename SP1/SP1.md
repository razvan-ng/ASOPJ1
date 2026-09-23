---
layout: default
title: SP1
---

# ASOPJ1 — SP1: SISTEMES D'INICI

> **Autor/a:** Razvan Nastasa Ghitau  
> **Mòdul:** ASOPJ1  
> **Data:** Setembre 2026  

---

# CONTINGUTS

## 1.- SystemV vs Upstart vs Systemd
* **1.1-** Runlevels o Targets?
* **1.2-** Quin és el nostre SO?

## 2.- SystemV
* **2.1-** Directoris
* **2.2-** Procés d'arrencada

## 3.- Systemd
* **3.1-** Directoris
* **3.2-** `systemctl`
* **3.3-** Dependències
* **3.4-** Modificar target provisional
* **3.5-** Modificar target definitiu
* **3.6-** Afegir/treure serveis de target
* **3.7-** Creació d'un nou target

---

# CONCEPTES

| Concepte | Descripció |
| :--- | :--- |
| **Kernel** | Gestió de processos i recursos del sistema. |
| **Aplicació** | Programa que interactua amb l'usuari i s'executa en **1r pla** (*foreground*). |
| **Servei** | Programa associat al SO que s'executa en **2n pla** (*background*). |
| **Procés** | Funció/instància interna de treball del SO. |

> **Nota:** Les **aplicacions** i els **serveis** generen **processos** (que el Kernel s'encarrega de sincronitzar i planificar).

---

# NIVELLS D'EXECUCIÓ (*RUNLEVELS*)

| Nivell | Mode | Descripció |
| :---: | :--- | :--- |
| **0** | `power off` | Aturada del sistema. |
| **1** | `rescue` | Mode 1 usuari (amb dimonis mínims). |
| **2 - 5** | `multi-user` | Multiusuari, xarxa, amb/sense entorn gràfic. |
| **6** | `reboot` | Reinici del sistema. |

---

# COMANDES D'ATURADA

Exemple d'aturada del servei `cron` segons l'eina o entorn:

```bash
# Execució del script d'inici directament (SystemV)
/etc/init.d/cron stop

# Ús de la comanda de serveis (SystemV / Compatibilitat)
service cron stop

# Ús del controlador de sistemes i serveis (Systemd)
systemctl stop cron
```
---

## 1. SystemV vs Upstart vs Systemd

### 1.1. Runlevels o Targets?
<img width="1024" height="182" alt="image" src="https://github.com/user-attachments/assets/edb8bd09-354c-413f-a62a-e6bd7f7abce1" />

Amb la comanda `runlevel`, podrem comprovar el nivell d'execució actual. Aquesta comanda s'ha executat en Ubuntu 24, amb Ubuntu 26 no funciona i haurem de fer servir l'alternativa següent `systemctl get-default`:

<img width="338" height="74" alt="image" src="https://github.com/user-attachments/assets/a15bd0c1-a0a7-444f-a5e4-e3af87d43a6c" />

El _graphical.target_ correspon al runlevel 5. 


### 1.2. Quin és el nostre SO?

<img width="621" height="426" alt="image" src="https://github.com/user-attachments/assets/355c2e5c-ffd2-4297-aa63-2f9983c09df3" />

A través de la comanda `man init` o bé consultant la destinació de l'enllaç simbòlic `/sbin/init`:

<img width="418" height="70" alt="image" src="https://github.com/user-attachments/assets/880b0846-a62a-4402-821a-cd1acd49cb95" />

`readlink -v /sbin/init` Serveixen per comprovar quin sistema d'inici està actiu (en aquest cas _systemd_.)

---

## 2. SystemV

### 2.1. Directoris

<img width="606" height="189" alt="image" src="https://github.com/user-attachments/assets/d5711a7b-167a-41e9-a3a7-723bbd60981a" />

Tots els elements en verd corresponen a serveis. Si un servei es troba aquí, es pot reiniciar utilitzant el mètode indicat a continuació. Tot allò gestionat mitjançant l'estàndard SystemV s'allotja dins de `init.d`.

<img width="252" height="313" alt="image" src="https://github.com/user-attachments/assets/03b66dc9-24d8-4524-a8d3-6a8070a772b3" />

Dins de `/etc/` també s'hi troben els directoris `rcX.d` (*runlevels*): una carpeta específica per a cada nivell d'execució.

<img width="604" height="251" alt="image" src="https://github.com/user-attachments/assets/1a343376-e98a-45f1-a02c-9c3d99dfe4ca" />

Cada "rc" és per un nivell en concret.

### 2.2. Procés d'arrencada

<img width="282" height="29" alt="image" src="https://github.com/user-attachments/assets/2ba79580-8824-4d94-a0be-a829f2b9cef5" />

Amb `init 6` reiniciem.

<img width="287" height="38" alt="image" src="https://github.com/user-attachments/assets/2b867f57-b67d-4171-a1f8-ef79c6d3547a" />

Amb `init 0` apaguem.

---

## 3. Systemd

### 3.1. Directoris

<img width="611" height="646" alt="image" src="https://github.com/user-attachments/assets/1788191f-0448-4a64-a445-905e3a6fae08" />

`/lib/systemd/system` és el directori per defecte on s'instal·len les unitats de systemd. Aquest directori s'utilitza quan volem aplicar o modificar qualsevol configuració. En cas de duplicitat, les opcions editades a `/etc/` sempre tenen prioritat sobre les de `/lib/`.

### 3.2. systemctl

<img width="623" height="678" alt="image" src="https://github.com/user-attachments/assets/f5065b48-c89e-4137-88ef-e1afdb8eeca5" />

Per filtrar per tipus d'unitat: Per exemple, si llistem i filtrem els *targets* gestionats per systemd.

### 3.3. Dependències

<img width="449" height="65" alt="image" src="https://github.com/user-attachments/assets/ddd82b52-6592-4fed-8a0d-e9beaa81a37c" />

Amb aquesta comanda sabrem quin target per defecte tenim en tot moment.

<img width="1024" height="209" alt="image" src="https://github.com/user-attachments/assets/1d969a00-18c7-45ad-a5ec-4d56ca826ee0" />

<img width="870" height="860" alt="image" src="https://github.com/user-attachments/assets/4e115679-82ca-4c72-9d68-6bee9ab44d11" />

La comanda `systemctl list-dependencies` detalla, específicament, quines dependències han d'estar actives perquè el `graphical.target` s'iniciï correctament:


### 3.4. Modificar target provisional

<img width="477" height="45" alt="image" src="https://github.com/user-attachments/assets/e3cc2aa7-91db-48d1-bcf5-2d57d1412b9f" />

<img width="585" height="103" alt="image" src="https://github.com/user-attachments/assets/81328b0d-0394-4500-923f-c70f56b8df1f" />

Amb systemctl isolate i el target que volem executar al moment.

### 3.5. Modificar target definitiu




### 3.6. Afegir / treure serveis target




### 3.7. Creem nou target




---

## 4. Activitat Pràctica: Target Personalitzat i Servei Root

### 🎯 Objectiu de l'activitat
1. Crear un **target personalitzat de systemd** amb el teu nom (`razvan.target`) que depengui d'un target existent (ex: `multi-user.target` o `graphical.target`).
2. Configurar el nou target com el **target per defecte** de l'arrencada del sistema.
3. Crear un **servei customitzat (`.service`)** associat a aquest target.
4. Definir un **script executat amb permisos de `root`** a l'inici del sistema (per exemple: registre de tasques, persistència, monitoratge, captura de pantalla, connexió SSH o registre d'activitat).

---

### 📝 Pas 1: Creació de l'script executat per Root

Creem l'script que s'executarà automàticament durant l'arrencada del sistema amb privilegis elevats:

```bash
sudo nano /usr/local/bin/root_boot_script.sh
