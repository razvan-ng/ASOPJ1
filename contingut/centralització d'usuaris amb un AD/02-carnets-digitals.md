## 7. Activitat Pràctica (2a part): Carnets digitals per a l'equip

### 🎯 Objectiu de l'activitat
1. Crear els usuaris de l'equip i el grup **Enginyers** a Active Directory.
2. Crear la plantilla **SignaturaScripts** perquè només els enginyers puguin demanar un certificat de signatura de codi.
3. Fer que la Lia signi un script de PowerShell i veure com Windows bloqueja l'script quan algú el modifica.
4. Revocar el certificat d'un treballador que marxa i publicar la **CRL**.

| Usuari | Nom complet | Grup Enginyers |
|--------|-------------|----------------|
| `lia` | Lia Ferré | Sí |
| `max` | Max Roig | Sí |
| `teo` | Teo Bosch | No |

La contrasenya dels tres usuaris és `Razvan.2026`. Abans de començar fem una instantània de les dues màquines (**Abans carnets**).

---

### Pas 9: L'equip a Active Directory (Nivell 7)

Al servidor creem la unitat organitzativa **Razvan** i, a dins, els usuaris i el grup global de seguretat **Enginyers**, amb la Lia i en Max com a membres.

```powershell
New-ADOrganizationalUnit -Name "Razvan" -Path "DC=razvan,DC=local"
$pw = ConvertTo-SecureString "Razvan.2026" -AsPlainText -Force
New-ADUser -Name "Lia Ferré" -SamAccountName lia -UserPrincipalName lia@razvan.local -Path "OU=Razvan,DC=razvan,DC=local" -AccountPassword $pw -Enabled $true
New-ADUser -Name "Max Roig" -SamAccountName max -UserPrincipalName max@razvan.local -Path "OU=Razvan,DC=razvan,DC=local" -AccountPassword $pw -Enabled $true
New-ADUser -Name "Teo Bosch" -SamAccountName teo -UserPrincipalName teo@razvan.local -Path "OU=Razvan,DC=razvan,DC=local" -AccountPassword $pw -Enabled $true
New-ADGroup -Name "Enginyers" -GroupScope Global -GroupCategory Security -Path "OU=Razvan,DC=razvan,DC=local"
Add-ADGroupMember -Identity "Enginyers" -Members lia, max
```

<img width="800" alt="captura7a_usuaris" src="img/captura7a_usuaris.png" />

A **Usuarios y equipos de Active Directory**, dins de l'OU **Razvan**, hi ha el grup **Enginyers** i els tres usuaris.

---

### Pas 10: La plantilla SignaturaScripts

A `certtmpl.msc` dupliquem la plantilla **Firma de código** i li posem el nom **SignaturaScripts**. A la pestanya **General** deixem la validesa d'**1 any**.

<img width="800" alt="captura7b_general" src="img/captura7b_general.png" />

A **Nombre del sujeto** deixem **Construido a partir de esta información de Active Directory**, amb el format **Nombre común**, sense el correu electrònic i amb el **Nombre principal de usuario (UPN)**. El nom del certificat el posa Active Directory a partir del compte, i així ningú pot demanar un carnet amb el nom d'una altra persona. Traiem el correu perquè els usuaris no en tenen i la sol·licitud fallaria.

<img width="800" alt="captura7b_subjecte" src="img/captura7b_subjecte.png" />

A **Seguridad** afegim el grup **Enginyers** amb permís de **Leer** i **Inscribirse**.

<img width="800" alt="captura7b_seguretat" src="img/captura7b_seguretat.png" />

Finalment la publiquem a RAZVAN-CA (**Plantillas de certificado › Nuevo › Plantilla de certificado para emitir**).

---

### Pas 11: La Lia demana el seu carnet

Al client entrem com `RAZVAN\lia`. Obrim `certmgr.msc` (a dalt diu **Certificados - Usuario actual**: són els certificats de la Lia, no els de l'equip) i a **Personal › Todas las tareas › Solicitar un nuevo certificado...** avancem fins a la llista de plantilles. Marquem només **SignaturaScripts**.

<img width="800" alt="captura8a_assistent" src="img/captura8a_assistent.png" />

Prem **Inscribir** i la inscripció acaba amb l'estat **Correcto**.

<img width="800" alt="captura8a_inscrit" src="img/captura8a_inscrit.png" />

A **Personal › Certificados** obrim el certificat nou.

<img width="800" alt="captura8" src="img/captura8.png" />

Està emès per a **Lia Ferré**, l'emissor és **RAZVAN-CA**, el propòsit és la firma de codi (*confirma que el software procede de un editor* i *protege el software de alteraciones*), és vàlid durant 1 any i a baix diu **Tiene una clave privada correspondiente a este certificado**. La clau privada s'ha creat a l'ordinador de la Lia i no ha viatjat mai fins a la CA.

Després entrem com `RAZVAN\max` i fem el mateix perquè en Max també tingui el seu carnet.

<img width="800" alt="captura8d_max" src="img/captura8d_max.png" />

---

### Pas 12: En Teo no pot demanar el carnet

Entrem com `RAZVAN\teo` i obrim el mateix assistent. **SignaturaScripts no surt**: només hi ha EFS básico i Usuario.

<img width="800" alt="captura8b_teo" src="img/captura8b_teo.png" />

Marquem **Mostrar todas las plantillas**. Al costat de **SignaturaScripts** diu **No disponible**: *los permisos en la plantilla de certificado no permiten al usuario actual inscribirse*. En Teo no és del grup Enginyers. Cancel·lem l'assistent.

<img width="800" alt="captura8b" src="img/captura8b.png" />

---

### Pas 13: L'script del satèl·lit (Nivell 8)

Entrem com `RAZVAN\lia`, obrim Windows PowerShell normal (sense administrador) i creem l'script.

```powershell
mkdir $HOME\missio
cd $HOME\missio
New-Item control.ps1 -ItemType File
notepad control.ps1
```

```powershell
# Control del satel.lit RAZVAN-1 - razvan.local
$altitud = 550
Write-Host "RAZVAN-1 en orbita a $altitud km" -ForegroundColor Green
Write-Host "Tots els sistemes funcionen correctament"
```

<img width="800" alt="captura8c_script" src="img/captura8c_script.png" />

> **Compte:** al Bloc de notes en castellà, desar és **Ctrl+G**, no Ctrl+S.

---

### Pas 14: Només scripts signats

Mirem la política d'execució i provem l'script.

```powershell
Get-ExecutionPolicy
.\control.ps1
```

<img width="800" alt="captura9a_restricted" src="img/captura9a_restricted.png" />

La política és **Restricted**: a Windows 10 PowerShell no executa cap script si no li diem el contrari.

Fem que, per a la Lia, només s'executin els scripts signats, i confirmem amb **S**.

```powershell
Set-ExecutionPolicy AllSigned -Scope CurrentUser
.\control.ps1
```

<img width="800" alt="captura9a_allsigned" src="img/captura9a_allsigned.png" />

Ara la Lia té **AllSigned** (només a `CurrentUser`) i l'error és un altre: l'script **no està signat digitalment**.

---

### Pas 15: La Lia signa l'script

Agafem el carnet de signatura de la Lia, signem l'script i l'executem.

```powershell
$cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert
$cert
Set-AuthenticodeSignature -FilePath .\control.ps1 -Certificate $cert
.\control.ps1
```

<img width="800" alt="captura9a_signat" src="img/captura9a_signat.png" />

La signatura queda **Valid**. PowerShell pregunta si volem executar programari de l'editor **CN=Lia Ferré**, que encara no és de confiança. Triem **[E] Ejecutar siempre**, que afegeix el certificat de la Lia a **Editores de confianza**, i l'script s'executa: **RAZVAN-1 en orbita a 550 km**, en verd.

Si obrim l'script, al final hi ha un bloc nou entre `# SIG # Begin signature block` i `# SIG # End signature block`. És la signatura.

<img width="800" alt="captura9a_bloc" src="img/captura9a_bloc.png" />

---

### Pas 16: El sabotatge

Fem de saboteador: obrim l'script, canviem **550** per **0** i desem. No toquem res més.

<img width="800" alt="captura9c_sabotatge" src="img/captura9c_sabotatge.png" />

Executem l'script sabotejat i mirem l'estat de la signatura.

```powershell
.\control.ps1
Get-AuthenticodeSignature .\control.ps1
```

<img width="800" alt="captura9" src="img/captura9.png" />

PowerShell no executa l'script perquè **el hash del fitxer no coincideix amb el hash emmagatzemat a la signatura digital**, i `Get-AuthenticodeSignature` diu **HashMismatch**. La signatura guarda un resum del contingut xifrat amb la clau privada de la Lia: en canviar una sola xifra el resum ja no coincideix. El saboteador tampoc el pot tornar a signar, perquè no té la clau privada de la Lia.

Tornem a posar l'altitud a **550**, la Lia signa l'script de nou i comprovem que torna a funcionar i que l'estat és **Valid**.

```powershell
Set-AuthenticodeSignature -FilePath .\control.ps1 -Certificate $cert
.\control.ps1
Get-AuthenticodeSignature .\control.ps1
```

<img width="800" alt="captura9b" src="img/captura9b.png" />

---

### Pas 17: L'acomiadament d'en Max (Nivell 9)

En Max marxa de l'empresa amb el portàtil, i el seu carnet és vàlid un any més. A `certsrv.msc`, a **Certificados emitidos**, busquem la fila de `RAZVAN\max` amb la plantilla **SignaturaScripts** i ens apuntem el número de sèrie (`3300000005bdd9a6…`).

<img width="800" alt="captura10a_emesos" src="img/captura10a_emesos.png" />

Botó dret › **Todas las tareas › Revocar certificado**. Com a **Código de motivo** triem **Cambio de afiliación** (la persona ja no és de l'empresa) i premem **Sí**.

<img width="800" alt="captura10a_revocar" src="img/captura10a_revocar.png" />

El certificat d'en Max passa a **Certificados revocados**, amb la data i el motiu de la revocació.

<img width="800" alt="captura10a_revocats" src="img/captura10a_revocats.png" />

---

### Pas 18: Publicar la llista negra (CRL)

Botó dret sobre **Certificados revocados › Todas las tareas › Publicar**, triem **Nueva CRL** i acceptem.

<img width="800" alt="captura10a_publicar" src="img/captura10a_publicar.png" />

A `C:\Windows\System32\CertSrv\CertEnroll` hi ha el certificat de la CA (`.crt`) i les CRL (`RAZVAN-CA.crl` i la delta `RAZVAN-CA+.crl`).

<img width="800" alt="captura10a_certenroll" src="img/captura10a_certenroll.png" />

Obrim `RAZVAN-CA.crl`. A la pestanya **General** l'emissor és RAZVAN-CA i la **Próxima actualización** és d'aquí a una setmana: la CRL també caduca i la CA en publica una de nova periòdicament.

<img width="800" alt="captura10a_crl_general" src="img/captura10a_crl_general.png" />

A la pestanya **Lista de revocaciones** hi ha el número de sèrie d'en Max, el mateix que ens havíem apuntat. En seleccionar-lo veiem la data de revocació i el motiu: **La afiliación ha cambiado (3)**.

<img width="800" alt="captura10" src="img/captura10.png" />

Un certificat no es pot «desfer». La CA publica la CRL, una llista negra signada amb els números de sèrie revocats, i els equips la consulten abans de confiar en un certificat. Un equip que ja tenia la CRL anterior no en baixa una de nova fins a la **Próxima actualización**, i per això les CA reals publiquen CRL curtes o fan servir OCSP.

---

### Pas 19: Clau compromesa

La Lia ha perdut el portàtil. Revoquem el seu certificat amb el motiu **Compromiso clave** i publiquem una CRL nova. Ho fem per PowerShell, que és l'equivalent del que hem fet amb la consola:

```powershell
certutil -revoke 3300000004a8f4302856c9349a000000000004 1
certutil -CRL
```

<img width="800" alt="captura10b_revocats" src="img/captura10b_revocats.png" />

Ara a **Certificados revocados** hi ha els dos: el de la Lia per **Compromiso clave** i el d'en Max per **Cambio de afiliación**.

Al client, la Lia demana un carnet nou amb el mateix assistent de `certmgr.msc`. Ara té dos certificats de signatura, i per signar agafem el més nou.

```powershell
$cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Sort-Object NotBefore | Select-Object -Last 1
Set-AuthenticodeSignature -FilePath .\control.ps1 -Certificate $cert
.\control.ps1
Get-AuthenticodeSignature .\control.ps1 | Format-List Status, SignerCertificate
```

<img width="800" alt="captura10b" src="img/captura10b.png" />

Com que el certificat és nou, PowerShell torna a preguntar si confiem en l'editor i triem **Ejecutar siempre**. L'script funciona amb l'altitud a **550** i la signatura és **Valid**, feta amb el carnet nou emès per RAZVAN-CA (número de sèrie acabat en `0006`).

Al final fem una instantània de les dues màquines amb el nom **Carnets**.
