import json
import subprocess
import sys
import unittest
from pathlib import Path

import board

ROOT = Path(__file__).resolve().parents[4]


class BoardTest(unittest.TestCase):
    def setUp(self) -> None:
        self.board = board.fresh_board(ROOT)

    def test_initial_epic_is_e01(self) -> None:
        chosen = board.plan(self.board, "epic", None)
        self.assertEqual(chosen["id"], "E01")
        self.assertEqual(chosen["stories"], ["E01-US01"])

    def test_initial_story_is_e01(self) -> None:
        chosen = board.plan(self.board, "story", None)
        self.assertEqual(chosen["stories"], ["E01-US01"])

    def test_e02_claim_stops_before_lower_priority_story(self) -> None:
        self.finish(["E01-US01"])
        chosen = board.plan(self.board, "epic", None)
        self.assertEqual(chosen["id"], "E02")
        self.assertEqual(chosen["stories"], ["E02-US01", "E02-US02"])

    def test_parallel_epic_while_e03_is_claimed(self) -> None:
        self.finish(["E01-US01", "E02-US01", "E02-US02"])
        chosen = board.plan(self.board, "epic", None)
        self.assertEqual(chosen["id"], "E03")
        board.apply_claim(self.board, chosen, "next/e03-us01-us02", "C:/wt/e03", "2026-10-03T00:00:00+00:00")
        nxt = board.plan(self.board, "epic", None)
        self.assertEqual(nxt["stories"], ["E02-US03"])
        board.apply_claim(self.board, nxt, "next/e02-us03", "C:/wt/e02b", "2026-10-03T00:00:00+00:00")
        parallel = board.plan(self.board, "epic", None)
        self.assertEqual(parallel["id"], "E14")
        self.assertNotIn("E06", [parallel["id"], *parallel["stories"]])

    def test_story_mode_can_split_an_epic(self) -> None:
        self.finish(
            [
                "E01-US01",
                "E02-US01",
                "E02-US02",
                "E02-US03",
                "E03-US01",
                "E03-US02",
                "E04-US01",
                "E04-US02",
                "E05-US01",
                "E14-US01",
            ]
        )
        first = board.plan(self.board, "story", None)
        self.assertEqual(first["id"], "E16-US01")
        board.apply_claim(self.board, first, "next/e16-us01", "C:/wt/e16a", "2026-10-03T00:00:00+00:00")
        second = board.plan(self.board, "story", None)
        self.assertEqual(second["id"], "E16-US02")

    def test_complete_refuses_another_branch(self) -> None:
        chosen = board.plan(self.board, "epic", None)
        board.apply_claim(self.board, chosen, "next/e01-us01", "C:/wt/e01", "2026-10-03T00:00:00+00:00")
        with self.assertRaises(SystemExit):
            board.apply_complete(self.board, "E01", "next/autre")

    def test_release_returns_story_to_backlog(self) -> None:
        chosen = board.plan(self.board, "story", None)
        board.apply_claim(self.board, chosen, "next/e01-us01", "C:/wt/e01", "2026-10-03T00:00:00+00:00")
        board.apply_release(self.board, "E01-US01")
        self.assertEqual(board.require_item(self.board, "E01-US01")["status"], board.A_FAIRE)
        again = board.plan(self.board, "epic", None)
        self.assertEqual(again["id"], "E01")

    def test_forced_epic_refuses_when_dependency_is_open(self) -> None:
        refused = board.plan(self.board, "epic", "E04")
        self.assertFalse(refused["ok"])

    def test_render_lists_three_states(self) -> None:
        text = board.render_md(self.board)
        self.assertIn("## En cours", text)
        self.assertIn("## À faire", text)
        self.assertIn("## Terminées", text)
        self.assertIn("E01", text)

    def finish(self, story_ids: list[str]) -> None:
        for story_id in story_ids:
            story = board.require_item(self.board, story_id)
            story["status"] = board.TERMINEE
        for _epic_id, epic in board.items_of(self.board, "epic"):
            board.refresh_epic(self.board, epic)


class ScriptTest(unittest.TestCase):
    def test_plan_command_on_repo_board(self) -> None:
        result = subprocess.run(
            [sys.executable, str(Path(__file__).with_name("board.py")), "plan", "--grain", "epic"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        payload = json.loads(result.stdout)
        self.assertEqual(payload["id"], "E01")


if __name__ == "__main__":
    unittest.main()
