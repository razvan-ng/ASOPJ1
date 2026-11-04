#!/usr/bin/env node
/*
 * Generador del lloc ASOPJ1.
 *
 * Descobreix automàticament cada carpeta dins de `contingut/`, en renderitza
 * els fitxers .md (sense modificar-los) i genera:
 *   - una pàgina de tasca per carpeta  ->  tasca-<slug>.html
 *   - la graella de tasques de la portada (index.html, entre els marcadors)
 *
 * Metadades: es dedueixen de la carpeta i del contingut, i es poden afinar
 * amb un fitxer opcional `tasques.json` (vegeu el README).
 *
 * Ús:  node tools/build.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'contingut');

/* ----------------------------- utilitats ------------------------------ */

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Treu una capçalera YAML inicial NOMÉS si sembla front matter real
// (la primera línia interior és una clau "clau: valor"), de manera que no
// es menja contingut que comença amb una línia "---".
function stripFrontMatter(md) {
  if (!md.startsWith('---')) return md;
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return md;
  const inner = m[1].split(/\r?\n/).find(l => l.trim() !== '') || '';
  const looksYaml = /^[A-Za-z_][\w-]*\s*:/.test(inner.trim());
  return looksYaml ? md.slice(m[0].length) : md;
}

function markdownToHtml(md) {
  return execFileSync('npx', ['-y', 'marked', '--gfm'], {
    input: md, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
}

// Primer paràgraf de text pla (per a subtítols deduïts).
function firstParagraph(md) {
  for (const block of stripFrontMatter(md).split(/\r?\n\r?\n/)) {
    const t = block.trim();
    if (!t || t.startsWith('#') || t.startsWith('<') || t.startsWith('---') ||
        t.startsWith('>') || t.startsWith('|') || t.startsWith('```')) continue;
    return t.replace(/[*_`#>]/g, '').replace(/\s+/g, ' ')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  }
  return '';
}

/* --------------------------- configuració ----------------------------- */

let overrides = {};
const cfgPath = path.join(ROOT, 'tasques.json');
if (fs.existsSync(cfgPath)) {
  try {
    const arr = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    for (const o of arr) if (o.folder) overrides[o.folder] = o;
  } catch (e) {
    console.error('tasques.json no és un JSON vàlid:', e.message);
    process.exit(1);
  }
}

/* --------------------------- descobriment ----------------------------- */

const folders = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const tasks = folders.map(folder => {
  const o = overrides[folder] || {};
  const dir = path.join(CONTENT_DIR, folder);
  const files = (o.files && o.files.length ? o.files
      : fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.md')).sort());
  const rawParts = files.map(f => fs.readFileSync(path.join(dir, f), 'utf8'));
  const combined = rawParts.map(stripFrontMatter).join('\n\n');

  const isWin = /windows/i.test(folder) ||
    /windows|powershell|nssm/i.test(rawParts.join('\n').slice(0, 4000));
  const title = o.title || (folder.charAt(0).toUpperCase() + folder.slice(1));
  const slug = o.slug || slugify(folder);
  const subtitle = o.subtitle || firstParagraph(rawParts[0] || '');

  return {
    folder, slug, title,
    os: o.os || (isWin ? 'windows' : 'linux'),
    kicker: o.kicker || (isWin ? 'Windows' : 'Linux'),
    sistema: o.sistema || (isWin ? 'Windows' : 'GNU/Linux'),
    subtitle,
    card: o.card || subtitle,
    tags: o.tags || [],
    order: o.order ?? 100,
    bodyHtml: markdownToHtml(combined),
  };
}).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'ca'));

/* ----------------------- generació de pàgines ------------------------- */

for (const t of tasks) {
  const tags = (t.tags || []).map(x => `\n  - ${JSON.stringify(x)}`).join('');
  const fm = `---
layout: tasca
permalink: /${t.slug}/
title: ${JSON.stringify(t.title)}
kicker: ${JSON.stringify(t.kicker)}
subtitle: ${JSON.stringify(t.subtitle)}
sistema: ${JSON.stringify(t.sistema)}
tags:${tags || ' []'}
description: ${JSON.stringify(t.title + ' — ASOPJ1')}
---
<!-- Pàgina generada automàticament per tools/build.mjs a partir dels .md de
     contingut/${t.folder}/ (que no es modifiquen). No editeu aquest fitxer a mà. -->
`;
  fs.writeFileSync(path.join(ROOT, `${t.slug}.html`), fm + t.bodyHtml);
}

// Esborra pàgines generades òrfenes (carpetes eliminades): només fitxers que
// porten la marca de generació, mai pàgines escrites a mà com index.html.
const MARK = 'Pàgina generada automàticament per tools/build.mjs';
const validNames = new Set(tasks.map(t => `${t.slug}.html`));
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith('.html') || validNames.has(f)) continue;
  const p = path.join(ROOT, f);
  try { if (fs.readFileSync(p, 'utf8').includes(MARK)) fs.rmSync(p); } catch {}
}

/* -------------------- graella de tasques a la portada ----------------- */

const emoji = t => t.os === 'windows' ? '🪟' : '🐧';
const cards = tasks.map(t => {
  const tagLis = (t.tags || []).slice(0, 4).map(x => `<li>${esc(x)}</li>`).join('');
  return `      <a class="task-card" href="{{ '/${t.slug}/' | relative_url }}">
        <div class="task-top">
          <span class="task-emoji" aria-hidden="true">${emoji(t)}</span>
          <span class="task-badge badge-${t.os}">${esc(t.kicker)}</span>
        </div>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.card)}</p>
        <ul class="task-tags">${tagLis}</ul>
        <span class="task-go">Obrir la tasca →</span>
      </a>`;
}).join('\n');

const indexPath = path.join(ROOT, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const START = '<!-- TASQUES:START -->', END = '<!-- TASQUES:END -->';
if (index.includes(START) && index.includes(END)) {
  index = index.replace(
    new RegExp(`${START}[\\s\\S]*?${END}`),
    `${START}\n${cards}\n      ${END}`);
  fs.writeFileSync(indexPath, index);
} else {
  console.warn('Avís: no s\'han trobat els marcadors TASQUES a index.html; la graella no s\'ha actualitzat.');
}

console.log(`Generades ${tasks.length} tasques: ${tasks.map(t => t.slug).join(', ')}`);
