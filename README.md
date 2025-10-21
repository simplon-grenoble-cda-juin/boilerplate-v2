# App Dockerisée

Vous êtes à la **racine** d'une application Dockerisée comprenant :

**📦 Une image personnalisée pour le backend Express**

[README du backend](https://github.com/simplon-grenoble-cda-juin/docker-compose/blob/master/backend/README.md)

**💻 Une image personnalisée pour le frontend React + Vite**

[README du frontend](https://github.com/simplon-grenoble-cda-juin/docker-compose/blob/master/frontend/README.md)

**🧰 Deux images en lecture seule**

- Une image pour la base de données PostgreSQL
- Une image pour l’administration de la base de données Adminer

## Prérequis au démarrage

Consultez les README des parties frontend et backend.

⚠️ Bien que vous exploitiez un écosystème complet, chaque partie est autonome et nécessite sa propre configuration.

## L'environnement

Il est nécessaire de fournir les variables d’environnement à Docker via un fichier `.env`.

Créez le fichier d’environnement correspondant :

```bash
cp .env.example .env.dev  # pour un environnement de développement
cp .env.example .env.test # pour un environnement de test
cp .env.example .env.prod # pour un environnement de production
```

## Démarrage

Si vos environnements frontend et backend sont correctement configurés, vous pouvez lancer l’ensemble des conteneurs :

```bash
docker compose --env-file .env.dev up --build # démarre l'environnement de développement
docker compose --env-file .env.test up --build # démarre l'environnement de test
docker compose --env-file .env.prod up --build # démarre l'environnement de production
```

### 📚 Documentations disponibles

- [Les environnements](https://github.com/simplon-grenoble-cda-juin/docker-compose/blob/master/_docs/environnements.md)  
  → Explication de la gestion des environnements

- [Les cookies](https://github.com/simplon-grenoble-cda-juin/docker-compose/blob/master/_docs/cookies.md)  
  → Explication de la gestion des cookies dans les tests et l’authentification

- [Tests - fausses données DB — introduction](https://github.com/simplon-grenoble-cda-juin/docker-compose/blob/master/_docs/tests.md)  
  → Introduction au système de peuplement de fausses données
