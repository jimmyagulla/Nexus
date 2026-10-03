"""Suivi des epics et user stories pour le skill next-task. Stdlib seulement."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

A_FAIRE = "a-faire"
EN_COURS = "en-cours"
TERMINEE = "terminee"
STATUSES = (A_FAIRE, EN_COURS, TERMINEE)

README_RELATIVE = Path("docs/produit/backlog/README.md")
BOARD_RELATIVE = Path("docs/produit/backlog/suivi.json")
VIEW_RELATIVE = Path("docs/produit/backlog/suivi.md")
STORY_ID = re.compile(r"E\d+-US\d+")
EPIC_ID = re.compile(r"E\d+")
EMPTY_DEP = {"—", "-", "–", ""}


def repo_root() -> Path:
    here = Path(__file__).resolve()
    for parent in here.parents:
        if (parent / README_RELATIVE).is_file():
            return parent
    raise SystemExit("Racine du dépôt introuvable.")


def split_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def is_separator(cells: list[str]) -> bool:
    return bool(cells) and all(cell.replace(":", "").replace("-", "") == "" and "-" in cell for cell in cells)


def section_lines(text: str, heading: str) -> list[str]:
    lines = text.splitlines()
    start = None
    for index, line in enumerate(lines):
        if line.startswith(heading):
            start = index + 1
            break
    if start is None:
        raise SystemExit(f"Section manquante dans le backlog : {heading}")
    body: list[str] = []
    for line in lines[start:]:
        if line.startswith("## "):
            break
        body.append(line)
    return body


def table_rows(lines: list[str]) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in lines:
        if not line.strip().startswith("|"):
            continue
        cells = split_cells(line)
        if is_separator(cells):
            continue
        rows.append(cells)
    return rows[1:] if rows else []


def first_id(cell: str, pattern: re.Pattern[str]) -> str:
    match = pattern.search(cell)
    if match is None:
        raise SystemExit(f"Identifiant introuvable : {cell}")
    return match.group(0)


def parse_deps(cell: str) -> list[str]:
    if cell.strip() in EMPTY_DEP:
        return []
    return [first_id(part, STORY_ID) for part in cell.split(",")]


def heading_title(path: Path, fallback: str) -> str:
    if not path.is_file():
        return fallback
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def catalog_from_readme(root: Path) -> dict[str, dict[str, object]]:
    readme = root / README_RELATIVE
    text = readme.read_text(encoding="utf-8")
    items: dict[str, dict[str, object]] = {}
    for cells in table_rows(section_lines(text, "## Epics")):
        epic_id = first_id(cells[0], EPIC_ID)
        link = re.search(r"\(([^)]+)\)", cells[0])
        title_path = readme.parent / link.group(1) if link else None
        items[epic_id] = {
            "kind": "epic",
            "title": heading_title(title_path, epic_id) if title_path else epic_id,
            "stories": [],
        }
    for cells in table_rows(section_lines(text, "## Liste des user stories")):
        story_id = first_id(cells[0], STORY_ID)
        epic_id = first_id(story_id, EPIC_ID)
        link = re.search(r"\(([^)]+)\)", cells[0])
        title_path = readme.parent / link.group(1) if link else None
        if epic_id not in items:
            raise SystemExit(f"{story_id} référence {epic_id}, absent du tableau des epics.")
        stories = items[epic_id]["stories"]
        if not isinstance(stories, list):
            raise SystemExit(f"Stories illisibles pour {epic_id}.")
        stories.append(story_id)
        items[story_id] = {
            "kind": "story",
            "title": heading_title(title_path, story_id) if title_path else story_id,
            "epic": epic_id,
            "priorite": int(cells[2]),
            "dependDe": parse_deps(cells[4]),
        }
    for epic_id, epic in items.items():
        if epic["kind"] != "epic":
            continue
        stories = epic["stories"]
        if not isinstance(stories, list) or not stories:
            raise SystemExit(f"{epic_id} n'a aucune user story.")
        epic["priorite"] = min(int(items[story_id]["priorite"]) for story_id in stories)
    return items


def blank_state() -> dict[str, object]:
    return {"status": A_FAIRE, "branch": None, "worktree": None, "claimedAt": None}


def fresh_board(root: Path) -> dict[str, object]:
    catalog = catalog_from_readme(root)
    items: dict[str, dict[str, object]] = {}
    for item_id in sorted(catalog, key=sort_key):
        items[item_id] = {**catalog[item_id], **blank_state()}
    return {"schemaVersion": 1, "items": items}


def sort_key(item_id: str) -> tuple[int, int, str]:
    epic_match = EPIC_ID.fullmatch(item_id)
    if epic_match:
        return (int(item_id[1:]), 0, "")
    story_match = re.fullmatch(r"E(\d+)-US(\d+)", item_id)
    if story_match is None:
        return (999, 999, item_id)
    return (int(story_match.group(1)), int(story_match.group(2)), item_id)


def load_board(path: Path) -> dict[str, object]:
    board = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(board, dict) or not isinstance(board.get("items"), dict):
        raise SystemExit("suivi.json illisible.")
    return board


def save_board(root: Path, board: dict[str, object]) -> None:
    items = board["items"]
    if not isinstance(items, dict):
        raise SystemExit("suivi.json illisible.")
    ordered = {item_id: items[item_id] for item_id in sorted(items, key=sort_key)}
    board["items"] = ordered
    (root / BOARD_RELATIVE).write_text(json.dumps(board, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / VIEW_RELATIVE).write_text(render_md(board), encoding="utf-8")


def items_of(board: dict[str, object], kind: str) -> list[tuple[str, dict[str, object]]]:
    raw = board["items"]
    if not isinstance(raw, dict):
        return []
    found: list[tuple[str, dict[str, object]]] = []
    for item_id, item in raw.items():
        if isinstance(item, dict) and item.get("kind") == kind:
            found.append((item_id, item))
    return sorted(found, key=lambda pair: sort_key(pair[0]))


def require_item(board: dict[str, object], item_id: str) -> dict[str, object]:
    raw = board["items"]
    if not isinstance(raw, dict) or item_id not in raw or not isinstance(raw[item_id], dict):
        raise SystemExit(f"{item_id} est absent du suivi.")
    return raw[item_id]


def deps_met(board: dict[str, object], story_id: str, also_done: set[str]) -> bool:
    story = require_item(board, story_id)
    deps = story["dependDe"]
    if not isinstance(deps, list):
        return False
    for dep in deps:
        if not isinstance(dep, str):
            return False
        if dep in also_done:
            continue
        if require_item(board, dep).get("status") != TERMINEE:
            return False
    return True


def directly_claimable(board: dict[str, object]) -> list[str]:
    claimable: list[str] = []
    for story_id, story in items_of(board, "story"):
        if story.get("status") == A_FAIRE and deps_met(board, story_id, set()):
            claimable.append(story_id)
    return claimable


def best_priority(board: dict[str, object]) -> int | None:
    priorities = [int(require_item(board, story_id)["priorite"]) for story_id in directly_claimable(board)]
    return min(priorities) if priorities else None


def epic_chain(board: dict[str, object], epic_id: str, priority: int) -> list[str]:
    epic = require_item(board, epic_id)
    story_ids = epic["stories"]
    if not isinstance(story_ids, list):
        return []
    candidates = [
        story_id
        for story_id in story_ids
        if isinstance(story_id, str)
        and require_item(board, story_id).get("status") == A_FAIRE
        and int(require_item(board, story_id)["priorite"]) == priority
    ]
    included: list[str] = []
    progressed = True
    while progressed:
        progressed = False
        for story_id in candidates:
            if story_id in included:
                continue
            if deps_met(board, story_id, set(included)):
                included.append(story_id)
                progressed = True
    return [story_id for story_id in story_ids if story_id in included]


def realizable_epics(board: dict[str, object]) -> list[tuple[str, list[str]]]:
    priority = best_priority(board)
    if priority is None:
        return []
    found: list[tuple[str, list[str]]] = []
    for epic_id, _epic in items_of(board, "epic"):
        chain = epic_chain(board, epic_id, priority)
        if chain:
            found.append((epic_id, chain))
    return found


def plan(board: dict[str, object], grain: str, item_id: str | None) -> dict[str, object]:
    if grain not in {"epic", "story"}:
        raise SystemExit("Le grain est epic ou story.")
    if item_id:
        return plan_forced(board, grain, item_id)
    if grain == "story":
        claimable = [
            story_id
            for story_id in directly_claimable(board)
            if int(require_item(board, story_id)["priorite"]) == best_priority(board)
        ]
        if not claimable:
            return unavailable(board)
        story_id = sorted(claimable, key=sort_key)[0]
        return {"ok": True, "grain": "story", "id": story_id, "stories": [story_id]}
    epics = realizable_epics(board)
    if not epics:
        return unavailable(board)
    epic_id, stories = epics[0]
    return {"ok": True, "grain": "epic", "id": epic_id, "stories": stories}


def plan_forced(board: dict[str, object], grain: str, item_id: str) -> dict[str, object]:
    item = require_item(board, item_id)
    if grain == "story":
        if item.get("kind") != "story":
            raise SystemExit(f"{item_id} est un epic. Relancer sans story, ou nommer une user story.")
        if item.get("status") == EN_COURS:
            return held(item_id, item)
        if item.get("status") == TERMINEE:
            raise SystemExit(f"{item_id} est déjà terminée.")
        if not deps_met(board, item_id, set()):
            return blocked(item_id, unmet(board, item_id))
        return {"ok": True, "grain": "story", "id": item_id, "stories": [item_id]}
    if item.get("kind") != "epic":
        raise SystemExit(f"{item_id} est une user story. Relancer avec story.")
    priority = best_priority_for_epic(board, item_id)
    chain = epic_chain(board, item_id, priority) if priority is not None else []
    if not chain:
        return unavailable(board, only=item_id)
    return {"ok": True, "grain": "epic", "id": item_id, "stories": chain}


def best_priority_for_epic(board: dict[str, object], epic_id: str) -> int | None:
    epic = require_item(board, epic_id)
    story_ids = epic["stories"]
    if not isinstance(story_ids, list):
        return None
    open_priorities = [
        int(require_item(board, story_id)["priorite"])
        for story_id in story_ids
        if isinstance(story_id, str) and require_item(board, story_id).get("status") == A_FAIRE
    ]
    return min(open_priorities) if open_priorities else None


def unmet(board: dict[str, object], story_id: str) -> list[str]:
    story = require_item(board, story_id)
    deps = story["dependDe"]
    if not isinstance(deps, list):
        return []
    return [
        dep
        for dep in deps
        if isinstance(dep, str) and require_item(board, dep).get("status") != TERMINEE
    ]


def held(item_id: str, item: dict[str, object]) -> dict[str, object]:
    return {
        "ok": False,
        "reason": "en-cours",
        "id": item_id,
        "branch": item.get("branch"),
        "worktree": item.get("worktree"),
    }


def blocked(item_id: str, waiting: list[str]) -> dict[str, object]:
    return {"ok": False, "reason": "bloquee", "id": item_id, "attend": waiting}


def unavailable(board: dict[str, object], only: str | None = None) -> dict[str, object]:
    blocked_items: list[dict[str, object]] = []
    for story_id, story in items_of(board, "story"):
        if only and story.get("epic") != only and story_id != only:
            continue
        if story.get("status") != A_FAIRE:
            continue
        waiting = unmet(board, story_id)
        if waiting:
            blocked_items.append({"id": story_id, "attend": waiting})
    in_progress = [
        {"id": item_id, "branch": item.get("branch"), "worktree": item.get("worktree")}
        for item_id, item in items_of(board, "story")
        if item.get("status") == EN_COURS
    ]
    return {"ok": False, "reason": "rien-de-realisable", "enCours": in_progress, "bloquees": blocked_items}


def apply_claim(board: dict[str, object], chosen: dict[str, object], branch: str, worktree: str, now: str) -> None:
    if not chosen.get("ok"):
        raise SystemExit("Prise refusée.")
    stories = chosen["stories"]
    if not isinstance(stories, list) or not stories:
        raise SystemExit("Prise vide.")
    for story_id in stories:
        if not isinstance(story_id, str):
            raise SystemExit("Prise illisible.")
        story = require_item(board, story_id)
        if story.get("status") != A_FAIRE:
            raise SystemExit(f"{story_id} n'est plus à faire.")
        story["status"] = EN_COURS
        story["branch"] = branch
        story["worktree"] = worktree
        story["claimedAt"] = now
    for _epic_id, epic in items_of(board, "epic"):
        refresh_epic(board, epic)


def refresh_epic(board: dict[str, object], epic: dict[str, object]) -> None:
    story_ids = epic["stories"]
    if not isinstance(story_ids, list):
        return
    statuses = [require_item(board, story_id).get("status") for story_id in story_ids if isinstance(story_id, str)]
    if statuses and all(status == TERMINEE for status in statuses):
        epic["status"] = TERMINEE
    elif any(status == EN_COURS for status in statuses):
        epic["status"] = EN_COURS
    else:
        epic["status"] = A_FAIRE
    active = [
        require_item(board, story_id)
        for story_id in story_ids
        if isinstance(story_id, str) and require_item(board, story_id).get("status") == EN_COURS
    ]
    epic["branch"] = active[0].get("branch") if len(active) == 1 else None
    epic["worktree"] = active[0].get("worktree") if len(active) == 1 else None
    epic["claimedAt"] = active[0].get("claimedAt") if len(active) == 1 else None


def apply_complete(board: dict[str, object], item_id: str, branch: str) -> list[str]:
    item = require_item(board, item_id)
    if item.get("kind") == "story":
        targets = [item_id]
    else:
        story_ids = item["stories"]
        targets = [
            story_id
            for story_id in story_ids
            if isinstance(story_id, str)
            and require_item(board, story_id).get("status") == EN_COURS
            and require_item(board, story_id).get("branch") == branch
        ] if isinstance(story_ids, list) else []
    if not targets:
        raise SystemExit(f"Aucune story en cours de {item_id} sur {branch}.")
    for story_id in targets:
        story = require_item(board, story_id)
        if story.get("branch") != branch:
            raise SystemExit(f"{story_id} est en cours sur {story.get('branch')}.")
        story["status"] = TERMINEE
    for _epic_id, epic in items_of(board, "epic"):
        refresh_epic(board, epic)
    return targets


def apply_release(board: dict[str, object], item_id: str) -> list[str]:
    item = require_item(board, item_id)
    if item.get("kind") == "story":
        targets = [item_id]
    else:
        story_ids = item["stories"]
        targets = [
            story_id
            for story_id in story_ids
            if isinstance(story_id, str) and require_item(board, story_id).get("status") == EN_COURS
        ] if isinstance(story_ids, list) else []
    released = [story_id for story_id in targets if require_item(board, story_id).get("status") == EN_COURS]
    if not released:
        raise SystemExit(f"{item_id} n'a rien en cours.")
    for story_id in released:
        story = require_item(board, story_id)
        story.update(blank_state())
    for _epic_id, epic in items_of(board, "epic"):
        refresh_epic(board, epic)
    return released


def current(board: dict[str, object], branch: str) -> dict[str, object]:
    stories = [
        story_id
        for story_id, story in items_of(board, "story")
        if story.get("status") == EN_COURS and story.get("branch") == branch
    ]
    return {"ok": bool(stories), "branch": branch, "stories": stories}


def sync_catalog(root: Path, board: dict[str, object]) -> None:
    catalog = catalog_from_readme(root)
    raw = board["items"]
    if not isinstance(raw, dict):
        raise SystemExit("suivi.json illisible.")
    for item_id, spec in catalog.items():
        current_item = raw.get(item_id)
        if not isinstance(current_item, dict):
            raw[item_id] = {**spec, **blank_state()}
            continue
        for key, value in spec.items():
            current_item[key] = value
    for _epic_id, epic in items_of(board, "epic"):
        refresh_epic(board, epic)


def align(rows: list[list[str]]) -> list[str]:
    widths = [max(len(row[column]) for row in rows) for column in range(len(rows[0]))]
    rendered: list[str] = []
    for index, row in enumerate(rows):
        cells = []
        for column, cell in enumerate(row):
            if index == 1:
                cells.append(":" + "-" * max(widths[column] - 1, 3))
            else:
                cells.append(cell.ljust(widths[column]))
        rendered.append("| " + " | ".join(cells) + " |")
    return rendered


def status_label(status: object) -> str:
    if status == EN_COURS:
        return "en cours"
    if status == TERMINEE:
        return "terminée"
    return "à faire"


def render_md(board: dict[str, object]) -> str:
    priority = best_priority(board)
    epic_ready = {epic_id for epic_id, _chain in realizable_epics(board)}
    story_ready = {
        story_id
        for story_id in directly_claimable(board)
        if priority is not None and int(require_item(board, story_id)["priorite"]) == priority
    }
    lines = [
        "# Suivi",
        "",
        "Statuts en temps réel des epics et des user stories. Seul le skill `next-task` modifie ce fichier.",
        "",
        "Réalisable = un agent peut le prendre maintenant, dépendances terminées et priorité courante.",
        "",
    ]
    sections = [
        ("En cours", EN_COURS),
        ("À faire", A_FAIRE),
        ("Terminées", TERMINEE),
    ]
    for title, status in sections:
        lines.append(f"## {title}")
        lines.append("")
        rows = [row(board, item_id, item, epic_ready, story_ready) for item_id, item in all_items(board) if item.get("status") == status]
        if not rows:
            lines.append("Aucune.")
            lines.append("")
            continue
        header = ["Id", "Type", "Priorité", "Réalisable", "Branche", "Depuis"]
        table = [header, [":---"] * len(header), *rows]
        lines.extend(align(table))
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def all_items(board: dict[str, object]) -> list[tuple[str, dict[str, object]]]:
    raw = board["items"]
    if not isinstance(raw, dict):
        return []
    return sorted(
        [(item_id, item) for item_id, item in raw.items() if isinstance(item, dict)],
        key=lambda pair: (status_order(pair[1].get("status")), sort_key(pair[0])),
    )


def status_order(status: object) -> int:
    if status == EN_COURS:
        return 0
    if status == A_FAIRE:
        return 1
    return 2


def row(
    board: dict[str, object],
    item_id: str,
    item: dict[str, object],
    epic_ready: set[str],
    story_ready: set[str],
) -> list[str]:
    ready = item_id in epic_ready or item_id in story_ready
    return [
        item_id,
        str(item.get("kind", "")),
        str(item.get("priorite", "")),
        "oui" if ready else "non",
        str(item.get("branch") or ""),
        str(item.get("claimedAt") or ""),
    ]


def git_show(root: Path, rev: str, relative: Path) -> str:
    result = subprocess.run(
        ["git", "show", f"{rev}:{relative.as_posix()}"],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise SystemExit(f"{relative.as_posix()} est absent de {rev}.")
    return result.stdout


def board_from_rev(root: Path, rev: str) -> dict[str, object]:
    return json.loads(git_show(root, rev, BOARD_RELATIVE))


def emit(payload: dict[str, object]) -> int:
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0 if payload.get("ok") else 2


def now_stamp() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Suivi next-task")
    parser.add_argument("command", choices=("sync", "plan", "claim", "complete", "release", "current"))
    parser.add_argument("--grain", choices=("epic", "story"), default="epic")
    parser.add_argument("--id", dest="item_id")
    parser.add_argument("--branch")
    parser.add_argument("--worktree")
    parser.add_argument("--rev")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    root = repo_root()
    board_path = root / BOARD_RELATIVE
    if args.command == "sync":
        board = load_board(board_path) if board_path.is_file() else fresh_board(root)
        sync_catalog(root, board)
        save_board(root, board)
        return emit({"ok": True, "command": "sync"})
    board = board_from_rev(root, args.rev) if args.rev else load_board(board_path)
    if args.command == "plan":
        return emit(plan(board, args.grain, args.item_id))
    if args.command == "current":
        if not args.branch:
            raise SystemExit("--branch est obligatoire.")
        found = current(board, args.branch)
        return emit(found)
    if args.rev:
        raise SystemExit("claim, complete et release modifient le suivi du worktree, pas une révision.")
    if args.command == "claim":
        if not args.branch or not args.worktree:
            raise SystemExit("--branch et --worktree sont obligatoires.")
        chosen = plan(board, args.grain, args.item_id)
        if not chosen.get("ok"):
            return emit(chosen)
        apply_claim(board, chosen, args.branch, args.worktree, now_stamp())
        save_board(root, board)
        chosen["branch"] = args.branch
        chosen["worktree"] = args.worktree
        return emit(chosen)
    if not args.item_id:
        raise SystemExit("--id est obligatoire.")
    if args.command == "complete":
        if not args.branch:
            raise SystemExit("--branch est obligatoire.")
        done = apply_complete(board, args.item_id, args.branch)
        save_board(root, board)
        return emit({"ok": True, "id": args.item_id, "stories": done})
    released = apply_release(board, args.item_id)
    save_board(root, board)
    return emit({"ok": True, "id": args.item_id, "stories": released})


if __name__ == "__main__":
    sys.exit(main())
