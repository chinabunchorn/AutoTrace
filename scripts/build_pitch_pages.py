#!/usr/bin/env python3
"""Package only the standalone pitch and its dependencies for GitHub Pages."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit

PITCH_FILES = (
    "index.html", "pitch.css", "pitch.js", "city.js", "terrain.js",
    "factory.js", "suppliers.js", "evidence.js", "earth.svg", "satellite.svg",
)
LICENSES = ("DM-Sans-OFL.txt", "IBM-Plex-Sans-Thai-OFL.txt")
ENTRY = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AutoTrace — Interactive concept presentation</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta http-equiv="refresh" content="0;url=pitch/">
</head><body><p><a href="pitch/">Open the AutoTrace presentation</a></p>
<p>Desktop presentation. Click or press Space to advance; Left to return; R to restart; F for fullscreen.</p>
<p>Illustrated concept presentation, not a live satellite assessment.</p></body></html>
"""


def source_files(root):
    """Return explicit output-to-source mappings; never copy whole asset folders."""
    root = Path(root)
    files = {f"pitch/{name}": root / "frontend/pitch" / name for name in PITCH_FILES}
    assets = root / "frontend/assets"
    files["assets/fonts.css"] = assets / "fonts.css"
    files["assets/favicon.svg"] = assets / "favicon.svg"
    for name in set(re.findall(r"url\(([^)]+)\)", (assets / "fonts.css").read_text())):
        name = name.strip(' \"\'')
        if not re.fullmatch(r"font-[0-9a-f]+\.woff2", name):
            raise ValueError(f"Unexpected font dependency: {name}")
        files[f"assets/{name}"] = assets / name
    for name in LICENSES:
        files[f"assets/licenses/{name}"] = assets / "licenses" / name
    return files


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and name in ("src", "href"):
                self.links.append((value, tag == "a"))


def validate(output):
    """Reject missing dependencies, escaping paths and external runtime references."""
    output = Path(output).resolve()
    for path in output.rglob("*"):
        if path.suffix not in (".html", ".css", ".svg"):
            continue
        text = path.read_text()
        references = []
        if path.suffix == ".css":
            references = [(url.strip(' \"\''), False) for url in re.findall(r"url\(([^)]+)\)", text)]
        else:
            parser = References()
            parser.feed(text)
            references = parser.links
        for reference, hyperlink in references:
            url = urlsplit(reference)
            if reference.startswith("#") or url.scheme == "data":
                continue
            if url.scheme or url.netloc:
                if hyperlink and url.scheme in ("http", "https"):
                    continue
                raise ValueError(f"External runtime reference in {path.name}: {reference}")
            if url.path.startswith("/"):
                raise ValueError(f"Reference outside project subpath: {reference}")
            target = (path.parent / unquote(url.path)).resolve()
            if not target.is_relative_to(output):
                raise ValueError(f"Reference outside published folder: {reference}")
            if not target.exists():
                raise ValueError(f"Missing dependency in {path.name}: {reference}")


def build(root, output):
    root, output = Path(root).resolve(), Path(output).resolve()
    files = source_files(root)
    if output.exists() and (not output.is_dir() or any(output.iterdir())):
        raise ValueError("Output must be an empty directory; existing files are never overwritten")
    for source in files.values():
        if not source.is_file():
            raise ValueError(f"Missing source: {source.relative_to(root)}")
    output.mkdir(parents=True, exist_ok=True)
    for destination, source in files.items():
        target = output / destination
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
    (output / "index.html").write_text(ENTRY)
    (output / ".nojekyll").write_text("")
    validate(output)
    return sorted(set(files) | {"index.html", ".nojekyll"})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=Path("outputs/pages-site"))
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    files = build(root, args.out)
    print(f"Validated {len(files)} presentation files in {args.out}")
    for path in files:
        print(path)


if __name__ == "__main__":
    main()
