# Dossier `_factories` — Génération de données de test

## Pourquoi ce dossier existe

Les tests ont besoin de données cohérentes et réalistes pour être crédibles.  
Plutôt que d’écrire à la main des INSERT ou des objets JSON à chaque test, on centralise la création des entités dans des **factories**.

Ces factories jouent toutes le même role : elles simulent la création d’une entité, mais dans un contexte contrôlé et reproductible.  

Elles garantissent aussi que toutes les contraintes métier et structurelles sont respectées, même dans un environnement de test.

## Comment il fonctionne

Chaque factory encapsule la logique nécessaire pour :
- `build` : Construire une instance métier en mémoire avec des valeurs réalistes (via Faker)
- `populate` : Insérer des données déterministes
- `populateRandome` : Insérer plusieurs données aléatoirement pour remplir la base rapidement

Cela permet d’écrire des tests clairs et expressifs : on teste **la logique métier**, pas la mise en place des données.

## Ce que ça apporte

1. **Lisibilité** — Les tests ne contiennent plus de bruit lié aux INSERT ou à la génération manuelle de données.
2. **Cohérence** — Tous les objets créés respectent les mêmes formats et contraintes.
3. **Réutilisabilité** — La même logique sert dans tous les types de tests.
4. **Contrôle** — On peut forcer certaines valeurs ou tout laisser au hasard selon le besoin.

## Exemple d’usage concret

Lorsqu’un test a besoin d’un utilisateur, la factory s’occupe de tout : elle crée l'utilisateur avec des données déterministes ou aléatoires. Le test peut alors se concentrer sur le comportement du contrôleur ou du service testé.

En d’autres termes, ces factories **suppriment la friction** entre la logique applicative et la configuration du test. Elles rapprochent le test de l’intention réelle : *“vérifier que le système se comporte comme prévu, pas que la base est remplie correctement”*.
