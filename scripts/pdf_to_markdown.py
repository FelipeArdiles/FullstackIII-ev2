#!/usr/bin/env python3
"""Convierte PDF del material curso a Markdown legible para análisis."""
import re
import sys
from pathlib import Path


def extract_text(pdf_path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        raise SystemExit("Instale pypdf: pip install pypdf") from None
    reader = PdfReader(str(pdf_path))
    parts = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        parts.append(f"\n<!-- página {i} -->\n\n{text}")
    return "\n".join(parts)


def to_markdown(raw: str, title: str, source: str) -> str:
    lines = raw.splitlines()
    out = [
        f"# {title}",
        "",
        f"> Fuente: `{source}` — convertido automáticamente para estudio y defensa EV2.",
        "",
        "---",
        "",
    ]
    buffer = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("<!-- página"):
            if buffer:
                out.extend(format_block(buffer))
                buffer = []
            out.append(stripped.replace("<!--", "").replace("-->", "").strip())
            out.append("")
            continue
        buffer.append(line)
    if buffer:
        out.extend(format_block(buffer))
    return "\n".join(out) + "\n"


def format_block(lines: list[str]) -> list[str]:
    result = []
    for line in lines:
        s = line.strip()
        if not s:
            result.append("")
            continue
        # Títulos heurísticos (mayúsculas cortas o numeración)
        if re.match(r"^\d+(\.\d+)+\s+[A-ZÁÉÍÓÚ]", s) and len(s) < 120:
            level = min(3, s.count(".") + 1)
            hashes = "#" * level
            result.append(f"{hashes} {s}")
            continue
        if s.isupper() and 4 < len(s) < 80:
            result.append(f"## {s.title()}")
            continue
        if s.endswith(":") and len(s) < 100:
            result.append(f"### {s[:-1]}")
            continue
        # Viñetas
        if re.match(r"^[•\-\*]\s+", s):
            result.append(re.sub(r"^([•\-\*])\s+", "- ", s))
            continue
        result.append(s)
    return result


def main():
    if len(sys.argv) < 3:
        print("Uso: pdf_to_markdown.py <entrada.pdf> <salida.md> [título]")
        sys.exit(1)
    pdf = Path(sys.argv[1])
    md_out = Path(sys.argv[2])
    title = sys.argv[3] if len(sys.argv) > 3 else pdf.stem
    raw = extract_text(pdf)
    md_out.parent.mkdir(parents=True, exist_ok=True)
    md_out.write_text(to_markdown(raw, title, pdf.name), encoding="utf-8")
    print(f"OK: {md_out} ({md_out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
