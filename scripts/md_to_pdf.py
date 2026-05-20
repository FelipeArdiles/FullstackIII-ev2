#!/usr/bin/env python3
"""Convierte Markdown a PDF (HTML intermedio + xhtml2pdf o reportlab)."""
import re
import sys
from pathlib import Path

def md_to_plain_lines(md_text: str) -> list[str]:
    lines = []
    for raw in md_text.splitlines():
        line = raw.strip()
        if not line:
            lines.append("")
            continue
        if line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            text = line.lstrip("#").strip()
            lines.append(text.upper() if level == 1 else text)
            continue
        line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
        line = re.sub(r"`([^`]+)`", r"\1", line)
        line = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
        line = re.sub(r"\|", " ", line)
        if line.startswith("|") or line.startswith("-"):
            continue
        lines.append(line)
    return lines

def write_pdf_reportlab(out_path: Path, title: str, lines: list[str]) -> bool:
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
    except ImportError:
        return False

    c = canvas.Canvas(str(out_path), pagesize=A4)
    width, height = A4
    y = height - 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, title)
    y -= 30
    c.setFont("Helvetica", 10)
    for line in lines:
        if y < 50:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 10)
        if not line:
            y -= 10
            continue
        chunk = line[:95]
        c.drawString(50, y, chunk)
        y -= 14
    c.save()
    return True

def write_html(out_path: Path, title: str, md_text: str) -> None:
    try:
        import markdown
        body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])
    except ImportError:
        body = "<pre>" + md_text.replace("&", "&amp;").replace("<", "&lt;") + "</pre>"
    html = f"""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>{title}</title>
<style>
body {{ font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; line-height: 1.5; }}
table {{ border-collapse: collapse; width: 100%; }}
th, td {{ border: 1px solid #ccc; padding: 0.4rem; }}
h1 {{ color: #0f3460; }}
</style></head><body>{body}</body></html>"""
    out_path.write_text(html, encoding="utf-8")

def try_xhtml2pdf(html_path: Path, pdf_path: Path) -> bool:
    try:
        from xhtml2pdf import pisa
    except ImportError:
        return False
    html = html_path.read_text(encoding="utf-8")
    with open(pdf_path, "wb") as pdf:
        if not pisa.CreatePDF(html, dest=pdf):
            return False
    return pdf_path.exists() and pdf_path.stat().st_size > 0

def convert(md_path: Path, pdf_path: Path) -> bool:
    md_text = md_path.read_text(encoding="utf-8")
    title = md_path.stem.replace("-", " ").title()
    html_path = pdf_path.with_suffix(".html")
    write_html(html_path, title, md_text)

    if try_xhtml2pdf(html_path, pdf_path):
        print(f"PDF (xhtml2pdf): {pdf_path}")
        return True

    lines = md_to_plain_lines(md_text)
    if write_pdf_reportlab(pdf_path, title, lines):
        print(f"PDF (reportlab): {pdf_path}")
        return True

    print(f"HTML exportado: {html_path} (instale: pip install markdown xhtml2pdf reportlab)")
    return False

def main() -> int:
    if len(sys.argv) < 3:
        print("Uso: md_to_pdf.py entrada.md salida.pdf")
        return 1
    md_path = Path(sys.argv[1])
    pdf_path = Path(sys.argv[2])
    if not md_path.exists():
        print(f"No existe: {md_path}")
        return 1
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    ok = convert(md_path, pdf_path)
    return 0 if ok else 2

if __name__ == "__main__":
    sys.exit(main())
