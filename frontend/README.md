# Frontend

Vous êtes dans la **partie frontend** d'une application Dockerisée.

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

Consultez le `package.json`, qui définit les commandes de démarrage du projet selon l’environnement souhaité.

```json
{
  "scripts": {
    "dev": "vite --mode dev", // démarre l'environnement de développement
    "test": "vite --mode test", // démarre l'environnement de test
    "prod": "vite --mode prod", // démarre l'environnement de production
    "build": "tsc -b && vite build --mode prod", // build le projet avec l'environnement de production
    ...
  },
  "dependencies": {...},
  "devDependencies": {...}
}
```

## Informations

L’application React + Vite est accessible sur le port 5143.

Consultez le `.dockerignore`.

Consultez le `.gitignore`.