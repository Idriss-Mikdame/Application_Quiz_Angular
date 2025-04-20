# Quiz Trivia - Application Angular

Une application de quiz interactive utilisant l'API Open Trivia Database (OpenTDB).

## Fonctionnalités

- **Page d'accueil** avec sélection de catégories, niveau de difficulté et type de questions
- **Quiz interactif** avec validation instantanée des réponses
- **Système de score** avec possibilité d'enregistrer les résultats
- **Historique des scores** avec tri et filtrage
- **Mode chronométré** (temps limité par question)
- **Design responsive** adapté à tous les appareils

## Technologies utilisées

- **Angular 16+** - Framework frontend
- **TypeScript** - Langage de programmation
- **Bootstrap** - Framework CSS pour le design responsive
- **RxJS** - Bibliothèque pour la programmation réactive
- **OpenTDB API** - API externe pour les questions de quiz

## Installation

1. Cloner le dépôt
```bash
git clone <url-du-repo>
cd quiz-app
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application en mode développement
```bash
ng serve
```

4. Accéder à l'application dans le navigateur
```
http://localhost:4200
```

## Déploiement

Pour déployer l'application en production :

```bash
ng build --prod
```

Les fichiers générés dans le dossier `dist/` peuvent être déployés sur n'importe quel serveur web statique.

## Structure du projet

- **components/** - Composants Angular de l'application
  - **navbar/** - Barre de navigation
  - **home/** - Page d'accueil avec sélection des options de quiz
  - **quiz/** - Composant principal du quiz
  - **result/** - Affichage des résultats
  - **history/** - Historique des scores

- **services/** - Services Angular
  - **quiz.service.ts** - Gestion des questions et du quiz
  - **storage.service.ts** - Gestion du stockage local

## Guide d'utilisation

1. **Page d'accueil**
   - Sélectionnez une catégorie de questions
   - Choisissez un niveau de difficulté
   - Définissez le type de questions (choix multiples ou vrai/faux)
   - Ajustez le nombre de questions
   - Activez ou désactivez le mode chronométré
   - Cliquez sur "Démarrer le Quiz"

2. **Quiz**
   - Lisez la question et sélectionnez une réponse
   - Cliquez sur "Valider" pour vérifier votre réponse
   - La bonne réponse sera affichée en vert, une mauvaise réponse en rouge
   - Cliquez sur "Question suivante" pour continuer
   - Un compteur de score et une barre de progression sont affichés

3. **Résultats**
   - Consultez votre score final
   - Entrez votre nom pour sauvegarder votre score
   - Choisissez de rejouer ou de consulter l'historique

4. **Historique**
   - Consultez tous vos scores précédents
   - Triez par date ou par score
   - Filtrez les résultats avec la barre de recherche
   - Effacez l'historique si nécessaire

## API OpenTDB

L'application utilise l'API OpenTDB pour récupérer les questions de quiz. Documentation disponible sur [https://opentdb.com/api_config.php](https://opentdb.com/api_config.php).

## Licence

Ce projet est sous licence MIT.
