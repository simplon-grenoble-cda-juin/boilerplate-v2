## Introduction

La notion d’environnement est essentielle dans vos projets, car ils doivent pouvoir être exécutés dans différents contextes : développement, test, préproduction, production, etc.

Chaque environnement nécessitera des variables spécifiques, car vous n’utiliserez pas les mêmes bases de données, serveurs SMTP, ports, etc.

Pour cela, il est nécessaire de déclarer un certain nombre de variables d’environnement dans un fichier dédié, en respectant une nomenclature précise.

## Exécuter le projet avec le fichier d’environnement adapté

Avant de détailler les variables d’environnement, il est important de comprendre comment ces fichiers sont exploités dans vos applications.

**L’approche peut varier selon les projets, et le boilerplate que vous consultez en est un excellent exemple.**

La **racine du projet**, qui utilise Docker Compose pour orchestrer le démarrage des conteneurs de l’application, exploite par défaut le fichier d’environnement `.env`.

Cependant, il est possible de lui indiquer explicitement quel fichier utiliser lors du démarrage des conteneurs.

```bash
docker compose --env-file .env.dev up --build # exploite le fichier .env.dev
docker compose --env-file .env.test up --build # exploite le fichier .env.test
docker compose --env-file .env.prod up --build # exploite le fichier .env.prod
```

La **partie frontend**, qui utilise Vite + React, exploite nativement un fichier d’environnement.

Pour cela, il suffit d’indiquer le `mode` (c’est-à-dire l’environnement souhaité) au moment du démarrage du projet. Consultez le fichier `package.json` pour voir comment cela est configuré.

```json
{
  "scripts": {
    "dev": "vite --mode dev", // exploite le fichier .env.dev
    "test": "vite --mode test", // exploite le fichier .env.test
    "prod": "vite --mode prod", // exploite le fichier .env.prod
    "build": "tsc -b && vite build --mode prod", // build le projet avec l'environnement de production
    ...
  },
  "dependencies": {...},
  "devDependencies": {...}
}
```

La **partie backend**, qui utilise Express, fait appel à la dépendance `dotenv`.

Pour que `dotenv` exploite le bon fichier d’environnement, il est nécessaire de définir la variable `NODE_ENV` au moment du démarrage du projet.

Avec le code suivant, la variable `NODE_ENV` sera interprétée afin de charger le fichier d’environnement correspondant.

```json
{
  "scripts": {
    "start": "NODE_ENV=prod tsx index.ts", // exploite le fichier .env.prod
    "dev": "NODE_ENV=dev tsx watch index.ts", // exploite le fichier .env.dev
    "test": "NODE_ENV=test tsx watch index.ts", // exploite le fichier .env.test
    ...
  },
  "dependencies": {...},
  "devDependencies": {...}
}
```

```ts
import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: envFile });

user: process.env.PGUSER,
password: process.env.PGPASSWORD
```

### À noter

Dans le boilerplate que vous consultez, les variables d’environnement des parties frontend et backend ont été déclarées séparément, dans chaque projet.

Il est toutefois possible de définir l’ensemble des variables dans le fichier d’environnement racine, exploité par Docker Compose.

Vous pouvez ensuite transmettre ces variables aux applications concernées via la section `environment` de chaque service dans le fichier `docker-compose.yml`.

Ce mécanisme est illustré ici avec les variables d’environnement `BACKEND_DEMO` et `FRONTEND_DEMO`.

```yml
services:
  db: ...
  adminer: ...

  backend:
    environment:
      - test=${BACKEND_DEMO}
    ...
  
  frontend:
    environment:
      - test=${FRONTEND_DEMO}
    ...
```

## Le contenu des fichiers

Vous êtes libre de créer les variables d’environnement que vous souhaitez. Les variables d’environnement sont généralement utilisées pour stocker des informations sensibles telles que des mots de passe, des clés privées ou des adresses IP.

Gardez à l’esprit que certaines variables peuvent être exposées, notamment côté client, dans le navigateur de l’utilisateur.

Par exemple, lorsque vous effectuez une requête HTTP depuis votre frontend et que l’URL de cette requête contient une variable d’environnement, celle-ci devient publiquement visible. Cela peut poser problème si vous y joignez une clé privée, comme c’est le cas avec l’API de The Movie Database.

## Versionnement des fichiers

Il est impératif de :

1. Versionner un fichier template des variables d'environnements
2. Ne jamais versionner un fichier d'environnement contenant des données sensibles

Lorsque vous exploitez des variables d'environnements dans un projet, il est impératif de créer un fichier template qui pourra être copier et coller pour créer son props fichier d'environnement.

Imaginez devoir inspecter toute l’application pour retrouver chaque variable d’environnement, simplement parce qu’il n’existe pas de fichier modèle. Pénible, non ?

C’est pourquoi, une fois vos fichiers d’environnement définis, pensez à configurer un .gitignore adapté afin de ne jamais versionner de données sensibles.

Dans ce boilerplate, que ce soit à la racine pour `docker-compose`, dans le frontend ou le backend, le nommage des fichiers d’environnement est uniforme et repose sur les fichiers suivants :

- `.env.dev` pour l'environnement de développement
- `.env.test` pour l'environnement de test
- `.env.prod` pour l'environnement de pro