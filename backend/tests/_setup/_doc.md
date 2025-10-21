# Dossier `_setup` — Gestion de l’environnement de test

## Pourquoi ce dossier existe

Les tests d’intégration manipulent une vraie base PostgreSQL. Pour qu’ils soient fiables, il faut contrôler précisément **l’état de la base avant, pendant et après** chaque exécution.

Le dossier `_setup` répond à ce besoin : il fournit une couche d’abstraction autour de la connexion à PostgreSQL, du nettoyage des tables et du peuplement des données. Ainsi, les tests peuvent s’exécuter dans un environnement stable et isolé, sans dépendre de manipulations manuelles.

## Comment il fonctionne

`ClientManager` agit comme un orchestrateur :  

il ouvre et ferme la connexion, vide les tables, et peut déclencher le chargement de données de référence via le script `seed.ts`.

`seed.ts` définit quant à lui un jeu de données de départ représentatif de l’application.  

C’est un “mini-monde” cohérent : un admin, quelques équipes, des joueurs, etc. Il sert de socle commun à plusieurs tests, qui peuvent ensuite manipuler ces données comme si l’application tournait réellement.

## Ce que ça apporte

1. **Isolation totale** — Chaque test démarre avec une base vide ou pré-remplie de façon prédictible.
2. **Fiabilité** — Les erreurs de dépendances ou de clés étrangères sont évitées grâce au nettoyage global.
3. **Reproductibilité** — Faker est figé, les seeds sont constants, donc deux exécutions successives donnent les mêmes données.

## En pratique

Avant chaque test, la base est nettoyée puis repeuplée. Les tests ne se soucient pas des détails techniques : ils savent qu’ils partent d’un état connu et stable. Cela réduit les effets de bord et les “faux positifs” liés à des données résiduelles.
