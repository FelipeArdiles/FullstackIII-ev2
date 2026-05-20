#!/usr/bin/env bash
# Genera PDFs de entrega EV2 desde docs/*.md
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs"
SCRIPT="$ROOT/scripts/md_to_pdf.py"

convert_one() {
  local md="$1"
  local pdf="$2"
  local base
  base="$(basename "$md" .md)"

  if command -v pandoc >/dev/null 2>&1; then
    pandoc "$md" -o "$pdf" --pdf-engine="${PDF_ENGINE:-pdflatex}" 2>/dev/null && {
      echo "PDF (pandoc): $pdf"
      return 0
    }
  fi

  if command -v wkhtmltopdf >/dev/null 2>&1; then
    python3 "$SCRIPT" "$md" "$pdf" || true
  fi

  if python3 "$SCRIPT" "$md" "$pdf"; then
    return 0
  fi

  if command -v npx >/dev/null 2>&1; then
    npx --yes md-to-pdf "$md" --dest "$DOCS" 2>/dev/null && {
      echo "PDF (md-to-pdf): $pdf"
      return 0
    }
  fi

  echo "Export HTML en docs/${base}.html — instale: pip install markdown xhtml2pdf reportlab"
  return 1
}

setup_python() {
  local venv="$ROOT/scripts/.venv-pdf"
  if [[ ! -d "$venv" ]]; then
    python3 -m venv "$venv"
    "$venv/bin/pip" install -q markdown reportlab
  fi
  export PATH="$venv/bin:$PATH"
}

main() {
  setup_python

  convert_one "$DOCS/patrones-arquetipos.md" "$DOCS/patrones-arquetipos.pdf"
  convert_one "$DOCS/plan-branching.md" "$DOCS/plan-branching.pdf"
  echo "Listo. Archivos en $DOCS/"
}

main "$@"
