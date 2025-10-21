# Organisation des tests et usage de l’environnement `_setup` + `_factories`

## Objectif général

L’écosystème de tests est conçu pour permettre deux approches complémentaires :
- Des tests riches et cohérents, qui simulent un environnement complet grâce au script `seed.ts`
- Des tests ciblés et rapides, qui créent uniquement les données strictement nécessaires via les factories

Ces deux stratégies partagent les mêmes briques techniques (`ClientManager` et les factories), mais diffèrent dans la manière dont elles préparent la base avant exécution.

---

## 🧩 1. Tests basés sur `seed.ts` — “Je veux une base réaliste”

### Quand utiliser cette approche

Cette méthode est adaptée aux tests d’intégration complets ou aux tests de cohérence des repositories,  
lorsque plusieurs entités sont en jeu (utilisateurs, équipes, joueurs, relations, etc.).

Exemples dans la codebase :  
`tests/integrations/fixturesFactory.test.ts`

### Comment ça fonctionne

Le script `seed.ts` agit comme un remplissage cohérent de la base :  
il crée un utilisateur admin, des équipes, des joueurs, et leurs relations.  
C’est l’équivalent d’un mini “jeu de données de production”.

Les tests peuvent alors s’appuyer sur ces données existantes pour vérifier des comportements concrets (ex. : `findByEmail`, `findAll`, etc.)

### Schéma typique d’un test “avec seed”

```ts
import ClientManager from "../_setup/ClientManager";

beforeEach(async () => {
  const manager = new ClientManager();
  await manager.clearTables();  // Base propre
  await manager.populate();     // Exécute seed.ts
});

afterAll(async () => {
  const manager = new ClientManager();
  await manager.clearTables();
  await manager.end();          // Ferme la connexion proprement
});
```

✅ Points forts  
- Base cohérente et complète  
- Parfait pour les tests de lecture ou les scénarios globaux  
- Réplicable et stable dans le temps  

⚠️ Points à surveiller  
- Un peu plus lent, car beaucoup de données sont créées  
- Pas idéal si tu ne testes qu’un cas isolé  

---

## ⚙️ 2. Tests sans `seed.ts` — “Je veux juste une donnée cible”

### Quand utiliser cette approche

Cette approche est faite pour les tests unitaires ou d’intégration ciblés,  
par exemple les contrôleurs ou services qui ne dépendent que d’un utilisateur.  
Tu veux juste un enregistrement prêt à l’emploi, sans polluer la base.

Exemples dans la codebase :  
`tests/integrations/api.test.js`  
`tests/integrations/authController.test.ts`

### Comment ça fonctionne

On utilise directement `ClientManager` pour vider la base,  
puis une ou plusieurs factories pour insérer les données nécessaires au test.

Cela permet de maîtriser précisément le contexte :  
par exemple, un seul utilisateur connu avec un mot de passe donné.

### Schéma typique d’un test “sans seed”

```ts
import ClientManager from "../_setup/ClientManager";
import { UserFactory } from "../_factories/user.factory";
import argon2 from "argon2";

beforeEach(async () => {
  const manager = new ClientManager();
  await manager.clearTables();

  await UserFactory.populate(manager.getClient(), {
    email: "test1@test.com",
    password: await argon2.hash("123"),
  });
});

afterAll(async () => {
  const manager = new ClientManager();
  await manager.clearTables();
  await manager.end();
});
```

✅ Points forts  
- Rapide et minimaliste  
- Idéal pour les tests de contrôleur ou d’authentification  
- Contrôle total sur les données insérées  

⚠️ Points à surveiller  
- Moins de contexte global (pas d’équipes, pas de joueurs)  
- Si le test repose sur des relations, tu dois créer manuellement les entités nécessaires  

---

## 🧭 En résumé

| Cas d’usage | Données créées | Exemple de test | Outil principal |
|--------------|----------------|-----------------|-----------------|
| Tester la cohérence d’un jeu de données complet | admin, users, teams, players | `fixturesFactory.test.ts` | `ClientManager.populate()` (→ seed.ts) |
| Tester une route d’authentification | 1 user unique | `api.test.js` | `UserFactory.populate()` |
| Tester un repository isolé | entité spécifique | test personnalisé | factory dédiée |
| Nettoyer entre les tests | — | partout | `ClientManager.clearTables()` + `end()` |

---

## 🧠 À retenir

- `ClientManager` gère le *quand et comment* de la base : connexion, transaction, nettoyage.  
- Les factories gèrent le *quoi* : quelles données sont créées et avec quelles valeurs.  
- `seed.ts` orchestre un scénario complet, utile pour tester la cohérence globale de l’écosystème applicatif.

En combinant ces trois briques, tu disposes d’un environnement de test :
- stable (base contrôlée),
- expressif (tests lisibles),
- et réaliste (fixtures cohérentes avec l’application).

---

💡 **Règle simple à appliquer**  
> Si ton test parle d’un “comportement global”, utilise `seed.ts`.  
> S’il parle d’un “comportement précis”, crée juste les données nécessaires avec une factory.
