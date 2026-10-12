"""Static presentation packaging tests; not product acceptance tests."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PitchPagesTests(unittest.TestCase):
    def setUp(self):
        spec = importlib.util.spec_from_file_location(
            "pitch_pages", ROOT / "scripts/build_pitch_pages.py"
        )
        assert spec is not None and spec.loader is not None
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)

    def test_build_contains_only_allowlisted_presentation_files(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "site"
            self.module.build(ROOT, output)
            paths = {
                path.relative_to(output).as_posix()
                for path in output.rglob("*") if path.is_file()
            }
            expected = set(self.module.source_files(ROOT)) | {"index.html", ".nojekyll"}
            self.assertEqual(paths, expected)
            self.assertNotIn("README.md", paths)
            self.assertFalse(any("usecase2" in path or path.startswith("data/") for path in paths))
            self.assertIn('url=pitch/', (output / "index.html").read_text())
            self.assertIn("demo-a/index.html", paths)
            self.assertIn("demo-a/fonts/Sarabun-OFL.txt", paths)
            self.assertIn('href="assets/favicon.svg"', (output / "index.html").read_text())
            self.assertEqual(
                (output / "pitch/evidence.js").read_bytes(),
                (ROOT / "frontend/pitch/evidence.js").read_bytes(),
            )
            self.module.validate(output)

    def test_missing_asset_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "site"
            self.module.build(ROOT, output)
            (output / "assets/fonts.css").unlink()
            with self.assertRaisesRegex(ValueError, "Missing"):
                self.module.validate(output)

    def test_escaping_reference_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "site"
            self.module.build(ROOT, output)
            with (output / "pitch/pitch.css").open("a") as stream:
                stream.write('\n.bad{background:url(../../private.txt)}')
            with self.assertRaisesRegex(ValueError, "outside"):
                self.module.validate(output)

    def test_nonempty_output_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "site"
            output.mkdir()
            (output / "keep.txt").write_text("keep")
            with self.assertRaisesRegex(ValueError, "empty"):
                self.module.build(ROOT, output)
            self.assertEqual((output / "keep.txt").read_text(), "keep")


if __name__ == "__main__":
    unittest.main()
