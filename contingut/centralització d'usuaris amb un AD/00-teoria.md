# ASOPJ1 — Centralització d'usuaris amb un AD: Entitat certificadora

> **Autor/a:** Razvan Nastasa Ghitau  
> **Mòdul:** ASOPJ1  
> **Data:** Novembre 2026  

---

# CONTINGUTS

## 1.- Conceptes bàsics de PKI
## 2.- La cadena de confiança
## 3.- CA empresarial o CA independent
## 4.- Com es demana un certificat
## 5.- Eines

---

## 1. Conceptes bàsics de PKI

| Concepte | Què és |
|----------|--------|
| **Certificat digital** | Fitxer que diu «aquesta clau pública és d'aquest servidor o d'aquesta persona», signat per algú de confiança. És com un DNI digital. |
| **Clau privada i clau pública** | Parella de claus que van juntes. El que se signa amb la privada només es pot comprovar amb la pública. La **privada** no surt mai de l'equip del propietari. |
| **Entitat certificadora (CA)** | Qui signa els certificats. Comprova qui ets i ho certifica amb la seva signatura. |
| **CA arrel** | La CA de dalt de tot. El seu certificat se'l signa ella mateixa. |
| **PKI** | Infraestructura de clau pública: el conjunt de CA, certificats, plantilles i llistes de revocació. |
| **AD CS** | *Servicios de certificados de Active Directory*. El rol de Windows Server que converteix el servidor en una CA. |
| **Plantilla de certificat** | El motlle d'un tipus de certificat: per a què serveix, quant dura, d'on surt el nom i qui el pot demanar. |
| **Sol·licitud (CSR)** | El fitxer que s'envia a la CA per demanar un certificat. Porta el nom i la clau pública, mai la privada. |
| **SAN** | *Subject Alternative Name*. La llista de noms per als quals és vàlid el certificat. Els navegadors **només miren aquest camp**. |
| **Revocació i CRL** | Revocar és anul·lar un certificat abans que caduqui. La CRL és la llista dels certificats revocats. |

## 2. La cadena de confiança

En aquesta pràctica creem la CA **RAZVAN-CA**, que és una CA arrel. Ella signa el certificat de la web `control.razvan.local`.

Quan el navegador rep el certificat, puja per la cadena: si arriba a una CA arrel que té a la seva llista de confiança, confia en el certificat. Un certificat **autosignat** («cadenat de pega») no té ningú a sobre i per això cap equip hi confia.

## 3. CA empresarial o CA independent

| | CA empresarial | CA independent |
|---|---|---|
| **Active Directory** | La necessita | No la necessita |
| **Plantilles** | Sí | No |
| **Confiança dels equips** | Automàtica, per AD | Cal instal·lar el certificat arrel a cada equip |
| **Emissió** | Automàtica, segons permisos | Les sol·licituds esperen que un administrador les aprovi |

Nosaltres muntem una **CA empresarial arrel** al mateix servidor que el controlador de domini (`DC01`).

## 4. Com es demana un certificat

Per al servidor web fem la sol·licitud a mà amb un fitxer `.inf` i l'ordre `certreq`:

1. `certreq -new` → crea la parella de claus i la sol·licitud (`web.req`). La clau privada es queda al servidor.
2. `certreq -submit` → envia la sol·licitud a RAZVAN-CA.
3. RAZVAN-CA la signa i retorna el certificat (`web.cer`).
4. `certreq -accept` → instal·la el certificat al magatzem de l'equip, unit a la seva clau privada.

## 5. Eines

| Eina | Per a què serveix |
|------|-------------------|
| `certsrv.msc` | Consola de la CA: certificats emesos i revocats, plantilles que emet |
| `certtmpl.msc` | Consola de plantilles: duplicar-les i canviar-les |
| `certlm.msc` | Certificats de l'equip (*local machine*) |
| `certreq` | Crea, envia i accepta sol·licituds de certificat |
| `gpupdate /force` | Torna a aplicar les directives del domini |
| `Get-ChildItem Cert:\LocalMachine\My` | Llista els certificats personals de l'equip |
| `New-SelfSignedCertificate` | Fabrica un certificat signat per ell mateix |
