# 🎨 Dispoz

<div align="center">

![Dispoz Logo](https://img.shields.io/badge/Dispoz-Palette%20Generator-purple?style=for-the-badge)

**Générateur de palettes de couleurs à partir d'images**

Extrayez instantanément une palette de couleurs harmonieuse depuis n'importe quelle image avec une interface moderne et intuitive.

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[Demo](#) • [Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [Utilisation](#-utilisation)

</div>

---

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales

- **📤 Upload d'image intuitif**
  - Glisser-déposer (drag & drop)
  - Sélection de fichier classique
  - Validation automatique (format et taille)
  - Support JPG, PNG, WebP (max 5MB)

- **🎨 Extraction automatique de couleurs**
  - Extraction de 6 couleurs dominantes
  - Algorithme ColorThief optimisé
  - Traitement instantané

- **📋 Codes couleurs complets**
  - Format HEX (`#3B82F6`)
  - Format RGB (`rgb(59, 130, 246)`)
  - Format HSL (`hsl(217, 91%, 60%)`)
  - Copie en un clic avec feedback visuel

- **👁️ Aperçu en direct**
  - Boutons stylés avec les couleurs extraites
  - Cards avec contraste automatique
  - Exemples typographiques
  - Visualisation immédiate du rendu

### 🎭 Design & UX

- **Interface moderne** avec police Urbanist
- **Animations fluides** et transitions douces
- **Effet de brillance** sur le bouton principal
- **Design responsive** (mobile-first)
- **Contraste automatique** pour la lisibilité
- **Cartes compactes** avec coins arrondis

---

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-username/dispoz.git
cd dispoz
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

---

## 💻 Utilisation

### Démarrage rapide

1. **Uploadez une image**
   - Glissez-déposez une image dans la zone prévue
   - Ou cliquez sur "Parcourir les fichiers"

2. **Explorez la palette**
   - Les 6 couleurs dominantes sont extraites automatiquement
   - Chaque couleur affiche ses codes HEX, RGB et HSL

3. **Copiez les codes**
   - Cliquez sur l'icône de copie à côté de chaque code
   - Un feedback visuel confirme la copie

4. **Visualisez l'aperçu**
   - Découvrez comment les couleurs s'appliquent sur des composants UI
   - Boutons, cards et typographie

5. **Recommencez**
   - Cliquez sur le X pour uploader une nouvelle image

### Commandes disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint
```

---

## 🛠️ Technologies utilisées

### Frontend
- **[React 19](https://react.dev/)** - Bibliothèque UI moderne
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rapide

### Bibliothèques
- **[ColorThief](https://lokeshdhakar.com/projects/color-thief/)** - Extraction de couleurs dominantes
- **[Lucide React](https://lucide.dev/)** - Icônes modernes et élégantes

### Typographie
- **[Urbanist](https://fonts.google.com/specimen/Urbanist)** - Police Google Fonts moderne

---

## 📁 Structure du projet

```
dispoz/
├── public/                 # Assets statiques
├── src/
│   ├── App.tsx            # Composant principal
│   ├── main.tsx           # Point d'entrée
│   └── index.css          # Styles globaux + Tailwind
├── index.html             # Template HTML
├── package.json           # Dépendances
├── tailwind.config.js     # Configuration Tailwind
├── tsconfig.json          # Configuration TypeScript
└── vite.config.ts         # Configuration Vite
```

---

## 🎨 Fonctionnement technique

### Extraction de couleurs

L'application utilise **ColorThief** pour analyser l'image et extraire les couleurs dominantes :

```typescript
const colorThief = new ColorThief();
const palette = colorThief.getPalette(img, 6);
```

### Conversions de couleurs

Les couleurs RGB sont converties en HEX et HSL :

```typescript
// RGB vers HEX
const rgbToHex = (r, g, b) => 
  '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

// RGB vers HSL
const rgbToHsl = (r, g, b) => {
  // Algorithme de conversion HSL
  // ...
};
```

### Contraste automatique

Le texte s'adapte automatiquement au fond pour garantir la lisibilité :

```typescript
const getTextColor = (r, g, b) => 
  (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000' : '#fff';
```

---

## 🎯 Cas d'usage

- **🎨 Design de sites web** - Trouvez la palette parfaite pour votre projet
- **🖼️ Branding** - Extrayez les couleurs de votre logo
- **📱 UI/UX Design** - Créez des thèmes cohérents
- **🎭 Inspiration créative** - Découvrez des harmonies de couleurs
- **📊 Data visualization** - Générez des palettes pour vos graphiques

---

## 🔧 Personnalisation

### Modifier le nombre de couleurs

Dans `src/App.tsx`, ligne 54 :
```typescript
const palette = colorThief.getPalette(img, 6); // Changez 6 par le nombre souhaité
```

### Ajuster la taille maximale

Dans `src/App.tsx`, ligne 68 :
```typescript
if (file.size > 5 * 1024 * 1024) // 5MB
```

### Personnaliser les animations

Dans `src/index.css`, modifiez l'animation `shine` :
```css
@keyframes shine {
  /* Votre animation personnalisée */
}
```

---

## 📝 Limitations

- **Taille de fichier** : Maximum 5MB
- **Formats supportés** : JPG, PNG, WebP
- **Nombre de couleurs** : 6 couleurs extraites
- **Navigateurs** : Modernes uniquement (ES6+)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

Créé avec ❤️ par [Orion design](https://github.com/orion-design)

---

## 🙏 Remerciements

- [ColorThief](https://github.com/lokesh/color-thief) pour l'algorithme d'extraction
- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [Vite](https://vitejs.dev/) pour le build tool

---

<div align="center">

**⭐ N'oubliez pas de mettre une étoile si vous aimez ce projet ! ⭐**

Made with React • TypeScript • Tailwind CSS

</div>
