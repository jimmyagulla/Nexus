---
name: next-task
description: >-
  Prend la prochaine epic RH réalisable (ou une user story), la réalise en TDD
  sur un worktree git, et ne merge sur main qu'après validation. Use when the
  user invokes /next-task, asks for the next epic or the next story, or says
  valider or libérer.
disable-model-invocation: true
---

# next-task

Un appel suffit. Ne pas demander quelle epic choisir.

Le script `.cursor/skills/next-task/scripts/board.py` est le seul décideur. Une tâche du backlog est une user story. Les sous-tâches restent dans la story. Le suivi visible est `docs/produit/backlog/suivi.md`.

## Décider

1. `valider` ou `valider <id>` → [Valider](#valider).
2. `libérer <id>` ou `liberer <id>` → [Libérer](#libérer).
3. Branche courante `next/...` et `board.py current --branch <branche>` renvoie des stories :
   - `git log origin/main..HEAD` contient déjà du code de feature → ne pas recommencer. Demander de valider.
   - sinon reprendre ces stories.
4. Sinon prendre la prochaine unité.

Grain : `epic` par défaut. `story` ou `tâche` : une user story. Un id `E01` ou `E01-US01` force cette unité si le script l'accepte.

## Prendre

Depuis le clone principal. Ne jamais y faire `git checkout`.

```powershell
git fetch origin main
python .cursor/skills/next-task/scripts/board.py plan --rev origin/main --grain epic
```

Si `ok` est faux, expliquer `enCours` ou `attend`, puis s'arrêter. Ne pas coder.

Branche : `next/` + les stories en minuscules jointes par `-`. Exemple : `next/e02-us01-us02`.
Worktree : `../Nexus-next-<slug>`, à côté du clone principal.

```powershell
git worktree add --no-track -b next/<slug> ../Nexus-next-<slug> origin/main
```

Dossier déjà présent et déjà sur cette branche : le réutiliser. Pas une seconde branche.

Dans le worktree :

```powershell
python .cursor/skills/next-task/scripts/board.py claim --grain epic --branch next/<slug> --worktree <chemin-absolu>
git add docs/produit/backlog/suivi.json docs/produit/backlog/suivi.md
git commit -m "chore(backlog): claim E01"
git push origin HEAD:main
git push -u origin HEAD:next/<slug>
```

Le push de la branche est requis : `move_agent_to_root` fetch `origin/<branche>`.

Push de `main` rejeté, et le seul commit local ne touche que les deux fichiers de suivi :

```powershell
git fetch origin main
git reset --hard origin/main
```

Puis relancer `plan` et `claim`. Ne pas reset dès qu'un commit de feature existe.

Appeler `move_agent_to_root` sur le chemin absolu du worktree avant tout fichier de feature. Ne plus écrire dans le clone principal.

## Réaliser

Lire et suivre le skill `tdd` avant le premier test. Un comportement par cycle. Chaque cas limite a son propre cycle. Pas de test e2e sans demande explicite déjà validée.

Lire l'epic, chaque story prise, et les référentiels cités. Réaliser toutes les sous-tâches. Ne pas élargir le périmètre.

Avant d'éditer un fichier, remonter les `SKILL.md` du dossier jusqu'à la racine. Nouvelle tranche hexagonale : skill `hexagonal-slice`.

Ne pas éditer `suivi.json` pendant le code. Ne pas créer un second objet métier. Pas de `as any`.

Quand les tests du périmètre sont verts, commit sur `next/<slug>` et pousser cette branche seulement :

```powershell
git push origin HEAD:next/<slug>
```

## Compte-rendu

S'arrêter. Ne pas merger. Répondre avec ces trois titres, dans cet ordre :

```markdown
## Features métiers ajoutées

- ...

## Cycles TDD red/green/refactor (1 ligne métier)

- Red → Green → Refactor — phrase métier en une ligne.

## Comment tester

- Commande et scénario métier observable.
```

Pour chaque cycle : la commande, le rouge, puis le vert. Le test écrit est dans un `<details>` sous sa ligne. Demander : « Valider pour merger sur main ? »

## Valider

Seulement après un oui explicite de l'utilisateur.

```powershell
git fetch origin main
git rebase origin/main
```

Conflit : s'arrêter, sans force push. Relancer les tests du périmètre. Rouge : s'arrêter.

```powershell
python .cursor/skills/next-task/scripts/board.py complete --id <id> --branch <branche>
git add docs/produit/backlog/suivi.json docs/produit/backlog/suivi.md
git commit -m "chore(backlog): complete E01"
git push origin HEAD:main
git push origin HEAD:next/<slug>
```

Ne pas supprimer le worktree.

## Libérer

Seulement si l'utilisateur le demande.

```powershell
python .cursor/skills/next-task/scripts/board.py release --id <id>
git add docs/produit/backlog/suivi.json docs/produit/backlog/suivi.md
git commit -m "chore(backlog): release E01"
git push origin HEAD:main
```

La prise redevient visible pour un autre agent. Ne pas supprimer le worktree sauf demande.

## Interdit

- Prendre une unité déjà `en-cours`.
- Merger sans validation.
- `git add .` ou `git add -A`.
- Deux unités dans un même appel.
- Éditer le suivi à la main.
