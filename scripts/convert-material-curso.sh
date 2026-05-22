#!/usr/bin/env bash
# Convierte PDFs del material Duoc (raíz del repo) a Markdown en docs/material-curso/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/material-curso"
SCRIPT="$ROOT/scripts/pdf_to_markdown.py"
VENV="$ROOT/scripts/.venv-pdf"

setup() {
  if [[ ! -d "$VENV" ]]; then
    python3 -m venv "$VENV"
  fi
  "$VENV/bin/pip" install -q pypdf markdown reportlab 2>/dev/null || true
}

convert() {
  local pdf="$1"
  local slug="$2"
  local title="$3"
  if [[ ! -f "$pdf" ]]; then
    echo "SKIP (no existe): $pdf"
    return 1
  fi
  "$VENV/bin/python" "$SCRIPT" "$pdf" "$OUT/$slug.md" "$title"
}

setup
mkdir -p "$OUT"

convert "$ROOT/2.1.1. Aplicación de Patrones de Diseño.pdf" \
  "2.1.1-aplicacion-patrones-diseno" \
  "2.1.1 Aplicación de Patrones de Diseño"

convert "$ROOT/2.3.1. Estrategias de Branching y Gestión de Componentes.pdf" \
  "2.3.1-estrategias-branching-componentes" \
  "2.3.1 Estrategias de Branching y Gestión de Componentes"

convert "$ROOT/2.4.1 Resolución de problemas comunes en Frontend y Backend.pdf" \
  "2.4.1-resolucion-problemas-fe-be" \
  "2.4.1 Resolución de problemas comunes en Frontend y Backend"

# Índice
cat > "$OUT/README.md" <<'EOF'
# Material del curso (Markdown)

PDFs convertidos desde la raíz del repositorio para análisis con IA y estudio.

| Unidad | Archivo MD |
|--------|------------|
| 2.1.1 Patrones de diseño | [2.1.1-aplicacion-patrones-diseno.md](./2.1.1-aplicacion-patrones-diseno.md) |
| 2.3.1 Branching y componentes | [2.3.1-estrategias-branching-componentes.md](./2.3.1-estrategias-branching-componentes.md) |
| 2.4.1 Problemas FE/BE | [2.4.1-resolucion-problemas-fe-be.md](./2.4.1-resolucion-problemas-fe-be.md) |

Regenerar: `./scripts/convert-material-curso.sh`
EOF

echo "Listo: $OUT/"
