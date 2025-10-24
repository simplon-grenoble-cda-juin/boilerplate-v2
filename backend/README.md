# Backend

Vous êtes dans la **partie backend** d'une application Dockerisée.

[📚 Documentation racine](https://github.com/simplon-grenoble-cda-juin/docker-compose?tab=readme-ov-file)

## Checklist

Consultez les rubriques ci-dessous pour connaître le détail de chaque étape.

1. Installer les dépendances
2. Créer le fichier d’environnement

## Les dépendances

D’après le Dockerfile, les dépendances seront installées à l’intérieur du conteneur Docker.

C’est indispensable au bon fonctionnement de l’application, puisqu’elle s’exécute dans ce conteneur.

Néanmoins, il est également nécessaire d’installer les dépendances localement (sur votre machine).

Même si elles ne seront pas utilisées par l’application, cela permet à votre IDE de fonctionner correctement.

```bash
npm install
```

## L'environnement

Il est nécessaire de fournir les variables d’environnement via un fichier `.env`.

Consultez le `package.json`, qui définit les commandes de démarrage du projet selon l’environnement souhaité.

```json
{
  "scripts": {
    "start": "NODE_ENV=production tsx index.ts", // démarre l'environnement de production
    "dev": "NODE_ENV=dev tsx watch index.ts", // démarre l'environnement de développement
    "test": "NODE_ENV=test tsx watch index.ts", // démarre l'environnement de test
    ...
  },
  "dependencies": {...},
  "devDependencies": {...}
}
```

Créez le fichier d’environnement correspondant :

```bash
cp .env.example .env.dev  # pour un environnement de développement
cp .env.example .env.test # pour un environnement de test
cp .env.example .env.production # pour un environnement de production
```

## La base de données

Les schémas de base de données se trouvent dans le dossier scripts.

1. `backend/scripts/database_schema.sql` : à exécuter pour créer la structure de la bdd.
2. `backend/scripts/database_seeds.sql` : à exécuter pour peupler la bdd.

## Informations

L’application Express est accessible sur le port 3002.

Un environnement de test complet est disponible (voir package.json et /tests).

Consultez le `.dockerignore`.

Consultez le `.gitignore`.
