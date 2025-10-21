# Cookies

## Pourquoi ?

- Stocker des informations _(token par exemple)_
- Préciser des contraintes temporelles _(date d'expération)_
- Préciser des contraintes de lieu _(domaine HTTP, chemins/pages ...)_
- Préciser des contraintes d'accès _(serveur uniquement, ou serveur + client)_
- Préciser des contraintes d'utilisation _(http ou https)_

## Paramètres

- **Name** : Nom unique du cookie pour l'identifier
- **Value** : Donnée stockée dans le cookie _(par exemple, le token)_
- **Domain** : Domaine pour lequel le cookie est valide _(utilisable ou non)_
- **Path** : Chemin sur le domaine où le cookie est actif _(en général : `/`)_
- **Expires** : Date d'expération _(date et heure)_ du cookie au fomrat GMT
- **Max-Age** : Durée de vie du cookie en secondes _(remplace `Expires` si précisé)_
- **Secure** : Le cookie est envoyé uniquement dans les requêtes HTTPS _(HTTP non admis si valeur `true`)_
- **HttpOnly** : Le cookie est inaccessible avec JavaScript _(sécurité contre XSS)_
- **SameSite** : Restriction d'envoi du cookie selon le contexte _(`Strict`, `Lax`, `None`)_
- **Partitioned** : Le cookie est isolé par site de premier niveau _(limite le suivi cross-site)_

## Mise en pratique avec Express

### Objectifs individuels

- Rechercher un outil _(dépendance NPM)_ qui permette de manipuler les cookies sur Express
- Comprendre le fonctionnement de base de cet outil
