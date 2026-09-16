# Rando GPX

Une petite application web (PWA) pour charger un tracé GPX, l'afficher sur une
carte et télécharger le fond de carte correspondant pour une utilisation
hors-ligne en randonnée — sans backend, sans build, un seul fichier HTML.

> 🇫🇷 Version française ci-dessous / 🇬🇧 English version further down.

---

## 🇫🇷 Français

### Aperçu

Rando GPX permet de :
- charger un fichier `.gpx` et afficher le tracé (distance, dénivelé +/-, durée) ;
- choisir entre plusieurs fonds de carte (OpenStreetMap, IGN Plan IGN,
  OpenTopoMap) ;
- télécharger automatiquement les tuiles de carte le long du tracé (à
  plusieurs niveaux de zoom) pour les consulter ensuite **sans connexion** ;
- suivre sa position GPS en direct sur la carte ;
- retrouver, renommer ou supprimer ses cartes téléchargées ;
- fonctionner comme une application installable sur l'écran d'accueil (iOS/Android),
  y compris après fermeture complète et sans réseau.

Tout se passe côté client : aucun fichier GPX ni aucune donnée de
localisation n'est envoyé à un serveur.

Développé avec Claude IA.

### Fonctionnalités principales

- **Chargement GPX** : lecture de fichiers `.gpx` (points `trkpt`, ou `rtept`
  en secours), calcul de la distance, du dénivelé positif/négatif et de la
  durée.
- **Fonds de carte multiples** : OpenStreetMap, IGN (Géoplateforme, sans clé),
  OpenTopoMap, sélectionnables via le contrôle de calques en haut à droite de
  la carte.
- **Mode hors-ligne** :
  - un seul fond de carte (au choix dans *Paramètres*) est mis en cache
    hors-ligne, dans IndexedDB ;
  - le bouton ⬇️ démarre un enregistrement automatique : la carte se déplace
    seule le long du tracé chargé, à plusieurs niveaux de zoom, pour
    télécharger toutes les tuiles nécessaires (« balade automatique ») ;
  - chaque zone téléchargée devient une « carte » nommée, consultable,
    renommable et supprimable depuis 🗂️ *Mes cartes hors-ligne* ;
  - un Service Worker met en cache la coquille de l'application (HTML, JS,
    police, Leaflet) pour un fonctionnement hors-ligne même après fermeture
    complète.
- **Suivi GPS** : bouton 📍 pour afficher sa position en direct (avec cercle
  de précision) et recentrer la carte au premier signal.
- **Gestes tactiles** : double-tap pour zoomer d'un niveau ; double-tap puis
  glisser sans relâcher (vers le haut/bas) pour un zoom continu, comme sur
  Google Maps.
- **Échelle** affichée en bas à gauche de la carte.
- **Paramètres** (⚙️) : choix du fond hors-ligne, activation du stockage
  persistant du navigateur, vidage du cache technique (mise à jour de
  l'appli), suppression complète des données hors-ligne.
- **Aide intégrée** : bouton *i / Aide* dans les Paramètres, qui explique
  chaque bouton et le fonctionnement du mode hors-ligne — pratique pour
  montrer l'appli à quelqu'un d'autre.

### Architecture technique

- **Aucun build, aucune dépendance npm** : un seul fichier `index.html`
  (HTML + CSS + JavaScript vanilla), un `manifest.json` et un `sw.js`.
- **[Leaflet](https://leafletjs.com/) 1.9.4** chargé depuis un CDN
  (cdnjs), pour l'affichage cartographique.
- **IndexedDB** pour stocker les tuiles de carte téléchargées et les
  métadonnées des « cartes » (régions) hors-ligne.
- **Service Worker** (`sw.js`) pour la mise en cache de la coquille
  applicative uniquement — les tuiles de carte restent gérées séparément par
  la page elle-même, pour ne jamais les mélanger avec le cache technique.
- **PWA** : `manifest.json` avec icônes, couleur de thème et mode
  `standalone`, installable sur l'écran d'accueil.

### Fichiers du dépôt

| Fichier            | Rôle                                                            |
|---------------------|------------------------------------------------------------------|
| `index.html`        | L'application complète (interface + logique)                    |
| `manifest.json`      | Manifeste PWA (nom, icônes, couleurs, mode d'affichage)          |
| `sw.js`              | Service Worker : cache de la coquille de l'app pour le hors-ligne |
| `icon-192.png`, `icon-512.png` | Icônes de l'application (à fournir, non incluses ici)  |

### Déploiement (GitHub Pages)

1. Placer `index.html`, `manifest.json`, `sw.js` et les icônes
   (`icon-192.png`, `icon-512.png`) à la racine du dépôt (ou dans un dossier,
   ex. `/docs`).
2. Dans les paramètres du dépôt GitHub : **Settings → Pages**, choisir la
   branche et le dossier à publier.
3. Ouvrir l'URL GitHub Pages fournie : l'application est utilisable
   directement, sans autre configuration.
4. (Optionnel) Sur mobile, utiliser « Ajouter à l'écran d'accueil » pour
   bénéficier du mode application (barre d'état masquée, icône, ouverture
   hors-ligne).

> Le Service Worker exige HTTPS (ou `localhost`) pour fonctionner —
> GitHub Pages sert automatiquement en HTTPS.

### Développement local

Aucun outil de build n'est nécessaire. Il suffit de servir les fichiers
statiques, par exemple :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Le Service Worker et IndexedDB fonctionnent sur `localhost` sans certificat.

### Mise à jour de version

Le numéro affiché à côté du titre (`APP_VERSION` dans `index.html`) est à
incrémenter à chaque changement publié, pour vérifier facilement — surtout
après un vidage de cache — que la dernière version est bien chargée.

### Limites connues

- Le téléchargement hors-ligne ne fonctionne que sur le fond de carte choisi
  comme référence dans les Paramètres ; les autres fonds nécessitent une
  connexion.
- La conservation des données hors-ligne dépend du navigateur : activer le
  « stockage persistant » (dans Paramètres) réduit le risque que le
  navigateur les efface automatiquement en cas de manque de place.

---

## 🇬🇧 English

### Overview

Rando GPX lets you:
- load a `.gpx` file and display the track (distance, elevation gain/loss,
  duration);
- choose between several basemaps (OpenStreetMap, IGN Plan IGN,
  OpenTopoMap);
- automatically download the map tiles along the track (at several zoom
  levels) to view them later **without an internet connection**;
- follow your live GPS position on the map;
- browse, rename, or delete previously downloaded offline maps;
- run as an installable app on the home screen (iOS/Android), including
  after a full app close and with no network.

Everything runs client-side: no GPX file or location data is ever sent to a
server.

Built with Claude AI.

### Key features

- **GPX loading**: reads `.gpx` files (`trkpt` points, falling back to
  `rtept`), computing distance, elevation gain/loss, and duration.
- **Multiple basemaps**: OpenStreetMap, IGN (French Géoplateforme, no API
  key needed), OpenTopoMap — selectable via the layer control in the top
  right of the map.
- **Offline mode**:
  - one basemap at a time (chosen in *Settings*) is cached for offline use,
    stored in IndexedDB;
  - the ⬇️ button starts an automatic recording: the map moves on its own
    along the loaded track, at several zoom levels, to download every tile
    it needs (an "auto tour");
  - each downloaded area becomes a named "map", viewable, renameable, and
    deletable from 🗂️ *Offline maps*;
  - a Service Worker caches the app shell (HTML, JS, fonts, Leaflet) so the
    app keeps working offline even after being fully closed.
- **Live GPS tracking**: 📍 button to show your live position (with an
  accuracy circle) and recenter the map on the first fix.
- **Touch gestures**: double-tap to zoom in one level; double-tap then drag
  up/down without lifting your finger for continuous zoom, like on Google
  Maps.
- **Scale bar** shown in the bottom-left corner of the map.
- **Settings** (⚙️): choose the offline basemap, request persistent browser
  storage, clear the technical cache (to pick up app updates), or wipe all
  offline data.
- **Built-in help**: an *i / Help* button in Settings explains every button
  and how offline mode works — handy when showing the app to someone else.

### Technical architecture

- **No build step, no npm dependencies**: a single `index.html` file
  (HTML + CSS + vanilla JavaScript), a `manifest.json`, and a `sw.js`.
- **[Leaflet](https://leafletjs.com/) 1.9.4** loaded from a CDN (cdnjs) for
  the map rendering.
- **IndexedDB** to store downloaded map tiles and the metadata of offline
  "maps" (regions).
- **Service Worker** (`sw.js`) that only caches the app shell — map tiles
  are handled separately by the page itself, so they're never mixed with
  the technical cache.
- **PWA**: `manifest.json` with icons, theme color, and `standalone` display
  mode, installable on the home screen.

### Repository files

| File                 | Role                                                          |
|----------------------|----------------------------------------------------------------|
| `index.html`         | The whole app (UI + logic)                                     |
| `manifest.json`      | PWA manifest (name, icons, colors, display mode)                |
| `sw.js`              | Service Worker: caches the app shell for offline use            |
| `icon-192.png`, `icon-512.png` | App icons (to be provided, not included here)         |

### Deployment (GitHub Pages)

1. Put `index.html`, `manifest.json`, `sw.js`, and the icons
   (`icon-192.png`, `icon-512.png`) at the root of the repository (or in a
   folder, e.g. `/docs`).
2. In the repository settings: **Settings → Pages**, pick the branch and
   folder to publish.
3. Open the provided GitHub Pages URL: the app works right away, no further
   setup needed.
4. (Optional) On mobile, use "Add to Home Screen" to get the full app
   experience (hidden status bar, icon, offline launch).

> The Service Worker requires HTTPS (or `localhost`) — GitHub Pages serves
> over HTTPS automatically.

### Local development

No build tooling is required. Just serve the static files, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The Service Worker and IndexedDB both work on `localhost` without a
certificate.

### Versioning

The version number shown next to the title (`APP_VERSION` in `index.html`)
should be bumped with every release, to make it easy to confirm — especially
after clearing the cache — that the latest version has actually loaded.

### Known limitations

- Offline downloading only works on the basemap set as the reference one in
  Settings; other basemaps require a connection.
- Offline data persistence depends on the browser: enabling "persistent
  storage" (in Settings) reduces the risk of the browser clearing it
  automatically when storage space is low.
