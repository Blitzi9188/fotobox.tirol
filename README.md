# Fotobox Tirol (Static Build)

Dieses Projekt ist auf **reinen Static Export** umgestellt (kein Node-Server notwendig).

## Setup

```bash
npm install
```

## Lokale Entwicklung

```bash
npm run dev
```

## Static Build erzeugen

```bash
npm run build:static
```

Ergebnis liegt in:

- `out/`  -> direkt auf Webspace/CDN hochladen

## Static Build lokal testen

```bash
npm run preview:static
```

Dann im Browser:

- `http://localhost:4173`

## Wichtige Hinweise

- Kein Backend/API mehr im Static-Modus.
- Formularversand erfolgt per `mailto:` (öffnet das Mailprogramm des Nutzers).
- Admin/CMS ist im Static-Modus nicht aktiv.
- Inhalte kommen aus `data/cms-content.json` und werden beim Build in statische Seiten geschrieben.
