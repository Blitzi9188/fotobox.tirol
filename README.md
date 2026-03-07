# Fotobox Tirol Custom CMS (Next.js)

## Setup

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Umgebungsvariablen setzen:

```bash
cp .env.example .env.local
```

3. Entwicklungsserver starten:

```bash
npm run dev
```

## Offline Portal (lokal testen)

Wenn du Änderungen ohne Railway testen willst:

```bash
npm run offline
```

Optional anderer Port:

```bash
npm run offline -- --port=4020
```

Danach zeigt dir das Skript direkt:
- `http://localhost:PORT`
- `http://DEINE-LAN-IP:PORT` (für Handy/Tablet im gleichen WLAN)
- `.../admin` für das CMS

## Seiten

- `/` Startseite mit CMS-Inhalten
- `/preise` Preisübersicht
- `/kontakt` Kontaktformular
- `/admin` CMS-Admin mit Login und visuellem Editor

## Admin Login

- Standard: `admin@fotoboxtirol.at`
- Passwort: `admin1234`
- Bitte für Produktion in `.env.local` ändern.

## Inhalte

- CMS-Daten: `data/cms-content.json`
- Kontaktanfragen: `data/contact-leads.json`
- Uploads: `public/uploads/`

## API

- `POST /api/admin/login` Login
- `GET /api/admin/content` CMS-Daten lesen
- `PUT /api/admin/content` CMS-Daten speichern (auth)
- `POST /api/admin/upload` Bild hochladen (auth)
- `POST /api/contact` Kontaktanfrage speichern

## Online gehen mit Railway (empfohlen)

### 1) Projekt auf GitHub hochladen

Im Projektordner:

```bash
git add .
git commit -m "Prepare Railway deployment"
git push
```

### 2) Railway Projekt anlegen

1. Bei Railway einloggen.
2. `New Project` klicken.
3. `Deploy from GitHub repo` wählen.
4. Dieses Repository auswählen.

### 3) Volume (Speicher) anlegen

Damit CMS-Inhalte dauerhaft bleiben:

1. Im Railway Service auf `Volumes` gehen.
2. `Add Volume` klicken.
3. Mount Path setzen auf: `/app/storage`

### 4) Umgebungsvariablen setzen (Service -> Variables)

```env
ADMIN_EMAIL=admin@fotoboxtirol.at
ADMIN_PASSWORD=<DEIN_SICHERES_PASSWORT>
SESSION_SECRET=<LANGER_ZUFAELLIGER_SECRET>
CMS_DATA_DIR=/app/storage/data
CMS_UPLOADS_DIR=/app/storage/uploads
CMS_UPLOADS_PUBLIC_BASE=/uploads
RESEND_API_KEY=re_xxx
RESEND_FROM=Fotobox Tirol <noreply@deinedomain.tld>
RESEND_TO=info@fotobox.tirol
```

Damit bleiben CMS-Daten und Uploads persistent (Volume) und Uploads sind unter `/uploads/...` erreichbar.

### 5) Deploy auslösen

1. `Deployments` öffnen.
2. `Redeploy` klicken.
3. Warten bis Status `Success`.

### 6) Testen

1. Öffentliche Railway-URL öffnen.
2. `/admin` aufrufen und einloggen.
3. Testtext ändern und speichern.
4. Service neu starten und prüfen, ob die Änderung erhalten bleibt.

## Troubleshooting Railway

- `Unauthorized` im Admin:
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET` prüfen.
- Upload funktioniert, Bild erscheint nicht:
  - `CMS_UPLOADS_DIR` und `CMS_UPLOADS_PUBLIC_BASE` prüfen.
- Nach Neustart Inhalte weg:
  - `CMS_DATA_DIR` auf Volume-Pfad setzen.
