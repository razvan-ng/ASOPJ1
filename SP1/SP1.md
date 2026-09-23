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

Amb la comanda 

### 1.2. Quin és el nostre SO?




---

## 2. SystemV

### 2.1. Directoris




### 2.2. Procés d'arrencada




---

## 3. Systemd

### 3.1. Directoris




### 3.2. systemctl




### 3.3. Dependències




### 3.4. Modificar target provisional




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
