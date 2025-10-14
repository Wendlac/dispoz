# 🤝 Guide de contribution

Merci de votre intérêt pour contribuer à Dispoz ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite. Soyez respectueux, inclusif et constructif dans toutes vos interactions.

## 🚀 Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/votre-username/dispoz/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Décrivez le bug de manière détaillée :
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Captures d'écran si pertinent
   - Environnement (navigateur, OS, etc.)

### Proposer une fonctionnalité

1. Vérifiez que la fonctionnalité n'a pas déjà été proposée
2. Créez une issue avec le template "Feature Request"
3. Expliquez :
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives envisagées

### Contribuer au code

1. **Fork** le projet
2. **Clone** votre fork
   ```bash
   git clone https://github.com/votre-username/dispoz.git
   ```
3. Créez une **branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
4. **Développez** votre fonctionnalité
5. **Testez** vos modifications
6. **Committez** vos changements
7. **Pushez** vers votre fork
8. Ouvrez une **Pull Request**

## 🛠️ Processus de développement

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Linting
npm run lint
```

### Structure du projet

```
src/
├── App.tsx         # Composant principal avec toute la logique
├── main.tsx        # Point d'entrée
└── index.css       # Styles globaux + animations
```

### Technologies utilisées

- **React 19** avec TypeScript
- **Tailwind CSS v4** pour le styling
- **Vite** comme build tool
- **ColorThief** pour l'extraction de couleurs
- **Lucide React** pour les icônes

## 📝 Standards de code

### TypeScript

- Utilisez TypeScript strict
- Typez toutes les fonctions et variables
- Évitez `any`, préférez `unknown` si nécessaire

```typescript
// ✅ Bon
const handleFile = (file: File): void => {
  // ...
}

// ❌ Mauvais
const handleFile = (file: any) => {
  // ...
}
```

### React

- Utilisez les hooks fonctionnels
- Mémorisez les callbacks avec `useCallback`
- Préférez les composants fonctionnels

```typescript
// ✅ Bon
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// ❌ Mauvais
const handleClick = () => {
  // ... (recréé à chaque render)
};
```

### CSS / Tailwind

- Utilisez les classes Tailwind en priorité
- Gardez les classes dans l'ordre logique
- Utilisez `className` avec template literals pour la lisibilité

```typescript
// ✅ Bon
className={`
  flex items-center gap-4
  bg-white rounded-xl shadow-lg
  hover:shadow-2xl transition-shadow
`}

// ❌ Mauvais
className="flex items-center gap-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
```

### Nommage

- **Composants** : PascalCase (`ColorCard`)
- **Fonctions** : camelCase (`extractColors`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Fichiers** : kebab-case pour CSS, PascalCase pour composants

## 💬 Commits

Utilisez des messages de commit clairs et descriptifs suivant la convention :

```
type(scope): description courte

Description détaillée si nécessaire
```

### Types de commits

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style (pas de changement de code)
- `refactor`: Refactoring du code
- `perf`: Amélioration de performance
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances

### Exemples

```bash
feat(upload): add support for WebP format
fix(colors): correct HSL conversion algorithm
docs(readme): update installation instructions
style(app): improve button border radius
```

## 🔄 Pull Requests

### Checklist avant de soumettre

- [ ] Le code compile sans erreur
- [ ] Le linting passe (`npm run lint`)
- [ ] Les fonctionnalités existantes fonctionnent toujours
- [ ] Le code est commenté si nécessaire
- [ ] La documentation est à jour
- [ ] Les commits sont clairs et atomiques

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests effectués
Décrivez les tests que vous avez effectués

## Captures d'écran
Si applicable, ajoutez des captures d'écran
```

### Processus de review

1. Un mainteneur reviewera votre PR
2. Des modifications peuvent être demandées
3. Une fois approuvée, la PR sera mergée
4. Votre contribution sera créditée ! 🎉

## 🐛 Debugging

### Problèmes courants

**L'image ne s'upload pas**
- Vérifiez le format (JPG, PNG, WebP)
- Vérifiez la taille (< 5MB)
- Vérifiez la console pour les erreurs

**Les couleurs ne s'affichent pas**
- Vérifiez que ColorThief est bien importé
- Vérifiez que l'image est bien chargée (crossOrigin)

**Le build échoue**
- Vérifiez les dépendances (`npm install`)
- Vérifiez la configuration Tailwind
- Vérifiez les erreurs TypeScript

## 📞 Contact

Des questions ? N'hésitez pas à :
- Ouvrir une [Discussion](https://github.com/votre-username/dispoz/discussions)
- Créer une [Issue](https://github.com/votre-username/dispoz/issues)

---

Merci pour votre contribution ! 🙏
