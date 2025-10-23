## Introduction

L'authentification d'un utilisateur passe d'abord par son inscription. Lorsqu'il est enregistré en base de données il est alors possible de l'authentifier pour lui donner accès à certaines parties du site ou certaines données.

Il existe différentes approches pour authentifier un utilisateur : les cookies, les tokens, les sessions, etc.

Dans le cadre de ce boilerplate nous exploitons un système d'authentification s'appuyant sur des **tokens persistés en base de données**.

---

## Principe du système

Lorsqu’un utilisateur s’inscrit ou se connecte, un **token unique** est généré côté serveur.  

Ce token est composé de deux parties :
  - une **valeur brute**, aléatoire, qui sera envoyée au navigateur sous forme de cookie `httpOnly`.
  - un **(hash)** de cette valeur, stockée en base de données.  

À chaque requête protégée, le serveur vérifie la validité du cookie en **recalculant le hash** de la valeur reçue puis en le comparant à la version stockée.

Ainsi, même si la base de données fuit, les tokens ne sont pas exploitables tels quels.

---

## Processus d’inscription (`/signup`)

1. Le client envoie un email et un mot de passe au serveur.
2. Le mot de passe est **haché** avec `argon2` avant d’être enregistré.
3. Un nouvel utilisateur est créé en base.
4. Un **token** est généré :
   - une valeur brute aléatoire (`raw`)
   - son empreinte (`hash`) enregistrée en base avec une date d’expiration
5. Le serveur renvoie une réponse de succès et attache la **valeur brute** dans un cookie `httpOnly` sécurisé.

Ce cookie sera automatiquement envoyé par le navigateur lors des prochaines requêtes.

---

## Processus de connexion (`/signin`)

1. Le client envoie son email et son mot de passe.
2. Le serveur vérifie la correspondance avec le hash stocké.
3. Si la connexion est valide :
   - le serveur **supprime le token existant** associé à l’utilisateur (rotation)
   - un nouveau token est créé et sauvegardé
   - le cookie est mis à jour avec la **nouvelle valeur brute**
4. La réponse indique que la connexion a réussi, sans jamais exposer le token.

---

## Vérification du profil (`/me`)

1. Le serveur lit la valeur brute du token depuis le cookie.
2. Il en calcule le **hash** via `Token.hashJwt()`.
3. Il recherche ce hash en base :
   - si le token est introuvable → `403 Token non reconnu`
   - si le token est expiré → `403 Token expiré`
4. Si tout est valide, l’utilisateur associé est récupéré et renvoyé au client.

---

## Sécurité et bonnes pratiques

- Le cookie est défini avec les options suivantes :
  - `httpOnly` → inaccessible depuis JavaScript.
  - `secure` → transmis uniquement en HTTPS.
  - `sameSite: "lax"` → limite les risques de CSRF.
  - `expires` → aligné sur la durée de validité du token.

- Un seul token est actif par utilisateur (grâce à la rotation).