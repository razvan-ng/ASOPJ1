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
