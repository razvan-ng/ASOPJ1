# ASOPJ1 — Documentació del mòdul

Lloc web amb la documentació de les activitats del mòdul **ASOPJ1 — Administració
de Sistemes Operatius** (2n ASIX), publicat amb GitHub Pages:

👉 https://razvan-ng.github.io/ASOPJ1/

## Estructura

- **`contingut/`** — una carpeta per activitat, amb els fitxers `.md` (teoria,
  pràctica…). És l'únic que has de tocar per afegir o editar contingut.
- **`index.html`** — portada (la graella de tasques es genera sola).
- **`tasca-*.html`** — una pàgina per activitat (generades automàticament).
- **`_layouts/`, `css/`** — plantilles i estils del lloc.
- **`tools/build.mjs`** — generador que crea les pàgines a partir de `contingut/`.
- **`tasques.json`** — ajustos opcionals de cada activitat (títol, etiquetes…).

## Com afegir una activitat nova

1. Crea una carpeta dins de `contingut/` amb un nom descriptiu de l'activitat.
2. Posa-hi els fitxers `.md` (per exemple `00-teoria.md`, `01-activitat.md`).
   Les imatges es poden enganxar directament a l'editor de GitHub.
3. Fes **commit i push**.

En fer push, l'acció **«Generar el lloc»** regenera la pàgina de l'activitat i la
portada i torna a publicar el web. El títol surt del nom de la carpeta i es pot
afinar afegint una entrada a `tasques.json`.

> També pots generar-ho a l'ordinador amb `node tools/build.mjs` abans de fer push.

## Ajustar una activitat (opcional)

A `tasques.json` pots definir, per carpeta: `title`, `slug` (URL), `kicker`,
`sistema`, `os` (`linux`/`windows`), `subtitle`, `card`, `tags`, `order` i l'ordre
dels fitxers (`files`). Si no hi ha entrada, els valors es dedueixen del contingut.
