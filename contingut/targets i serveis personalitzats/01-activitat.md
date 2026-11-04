---

## 4. Activitat Pràctica: Target Personalitzat i Serveis d'Accés Remot

### 🎯 Objectiu de l'activitat
1. Crear un **target personalitzat de systemd** amb el teu nom (`razvan.target`) que depengui d'un target existent (ex: `graphical.target`).
2. Configurar el nou target com el **target per defecte** de l'arrencada del sistema.
3. Associar i configurar un servei que iniciï una **sessió de TigerVNC**, de manera que altres usuaris puguin tenir accés complet a la interfície gràfica de l'ordinador.
4. Definir un **script executat amb permisos de `root`** associat al target per establir una **reverse shell** amb privilegis totals a l'inici del sistema.

---

### Pas 1: Instal·lem els paquets adients per TigerVNC

<img width="648" height="437" alt="image" src="https://github.com/user-attachments/assets/5d041bfa-ed71-4943-90ea-284654fc3db0" />

```bash
sudo apt install -y tigervnc-standalone-server tigervnc-common xfce4 xfce4-goodies
```

### Pas 2: Configurem la contrasenya del VNC

<img width="451" height="112" alt="image" src="https://github.com/user-attachments/assets/66337f38-e1fc-4427-93a6-118078e0b664" />

```bash
vncpasswd
```
Configurem una contrasenya amb control total ja que és el que ens interessa.

### Pas 3: Configurar el xstartup

<img width="355" height="70" alt="image" src="https://github.com/user-attachments/assets/fd5d2ec1-26d6-44c4-8f7b-24572d615be8" />

<img width="466" height="199" alt="image" src="https://github.com/user-attachments/assets/d9ffa2dd-2fac-48f0-8805-7243ccfea8c8" />


```bash
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export XDG_SESSION_TYPE=x11
export XDG_CURRENT_DESKTOP=XFCE
export XDG_SESSION_DESKTOP=xfce
exec dbus-run-session -- startxfce4
```

<img width="829" height="345" alt="image" src="https://github.com/user-attachments/assets/1f77193a-b2d2-4662-ab40-1243aab5b5fc" />

Instal·lem el paquet dbus-x11.

### Pas 4: Creem el target personalitzat

<img width="550" height="177" alt="image" src="https://github.com/user-attachments/assets/a9518992-2f1d-478b-876d-b301ed9ecd7b" />

```bash
sudo nano /etc/systemd/system/razvan.target

[Unit]
Description=Razvan custom target
Requires=graphical.target
After=graphical.target
AllowIsolate=yes
```

### Pas 5: Definim el target com default.

<img width="643" height="139" alt="image" src="https://github.com/user-attachments/assets/788ea199-c483-43d5-bb06-27241368ce65" />

```bash
sudo systemctl set-default razvan.target
```

### Pas 6: Crear el servei de TigerVNC.

<img width="590" height="335" alt="image" src="https://github.com/user-attachments/assets/3643614b-daed-4e5e-ac54-49dcf2c3be67" />

```bash
sudo nano /etc/systemd/system/vncserver@.service
```

<img width="648" height="102" alt="image" src="https://github.com/user-attachments/assets/9685d08b-56d2-4004-9047-192f99f17fb8" />

L'habilitem al nostre usuari.

### Pas 7: Crear la reverse shell root.

<img width="610" height="282" alt="image" src="https://github.com/user-attachments/assets/a73125f0-0342-4bd9-9794-5e0987525fca" />

Primer creem el servei i després passarem a la creació del script.

<img width="610" height="298" alt="image" src="https://github.com/user-attachments/assets/928b35df-da56-47ce-b26f-7d8194047125" />

Creem una reverse shell bàsica, on el host serà la màquina atacant.

<img width="642" height="117" alt="image" src="https://github.com/user-attachments/assets/d92e1009-7952-4e25-917c-ebb955043980" />

Configurem els permissos d'execució del script i reiniciem el dimoni i activem el servei a l'arrancada del sistema. 

### Pas 8. Comprovació de reverse shell.

<img width="298" height="58" alt="image" src="https://github.com/user-attachments/assets/7fa338dd-55d5-4d83-a56d-2edc6186d2ec" />

Reiniciem la màquina

<img width="344" height="74" alt="image" src="https://github.com/user-attachments/assets/0356e1ef-097b-4ef4-b18c-966a9a5a532f" />

Un cop reiniciada la màquina comprovem el target per default que tenim. Podem veure que s'ha aplicat el nostre target correctament.

<img width="654" height="449" alt="image" src="https://github.com/user-attachments/assets/a44ceebe-cfbd-43f8-9ce2-b883e28a74f6" />

Comprovem que el servei per al server TigerVNC està viu.

<img width="755" height="311" alt="image" src="https://github.com/user-attachments/assets/b429e416-9821-47a7-b488-74fa4bc2e24c" />

Comproves també que el servei d'SSH s'ha iniciat. Podem veure que hi ha hagut un error (ens ha retornat error 1). Això és degut a que no hi havia ningú escoltant a la IP que hem assignat al número de port. Si abans de reiniciar la màquina encenem una escolta amb _netcat_ ja no tindrem aquesta fallada.

<img width="270" height="67" alt="image" src="https://github.com/user-attachments/assets/643d8ff4-4c32-46c7-a61c-ec50cccac7da" />

Encenem l'escolta al host (màquina atacant) i reiniciem la VM posteriorment.

<img width="795" height="311" alt="image" src="https://github.com/user-attachments/assets/76a8f5ac-4c3f-4b34-8692-fb19d4919080" />

Ara veiem que el servei s'ha iniciat correctament.

<img width="629" height="207" alt="image" src="https://github.com/user-attachments/assets/0c0562fd-62c2-4d0c-8954-b417ceea29c6" />

I al host veiem que tenim accés al terminal de la màquina virtual.

### Pas 9. Comprovació de server TigerVNC

<img width="450" height="183" alt="image" src="https://github.com/user-attachments/assets/270a5365-54ab-42b7-abda-d5a6a0d98b38" />

Obrim el programa de TigerVNC (l'haurem de tenir instal·lat al host prèviament) i introduïm la IP de la víctima i el nº de port adient.

<img width="408" height="207" alt="image" src="https://github.com/user-attachments/assets/23831ec5-9c0d-42ed-93f3-e2f741de9a56" />

Introduïm la contrasenya del VNC.

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3695d1c1-ec00-4d1b-9a40-c486127b919f" />

I ja tindrem imatge.

## 5. Activitat Pràctica: Servei personalitzat a Windows amb NSSM



<img width="1875" height="953" alt="imatge" src="https://github.com/user-attachments/assets/e097a59c-0fdd-4856-bb8d-3d3f25db1f9a" />

Ara al nostre host, si executem _python server.py_ rebrem la captura de pantalla d'aquell moment.
