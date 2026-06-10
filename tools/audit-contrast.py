#!/usr/bin/env python3
"""
audit-contrast.py — WCAG contrast audit for ocean-harbor.xml

Ported from nebula-haze (tools/audit-contrast.py). Checks three categories:
  1. Attribute blocks that declare both BACKGROUND and FOREGROUND explicitly.
  2. Implied pairs — tokens in <colors> where the IDE draws its own text on the
     background color (e.g. blame stripes, gutter, popups), plus file-status
     foregrounds drawn on the island background.
  3. Diff pairs — DIFF_* attribute backgrounds checked against editor text and
     against syntax foregrounds that commonly appear inside diff blocks
     (the "green string on green inserted-line background" case).

Exit 0 = all pairs pass.  Exit 1 = one or more fail.  Exit 2 = usage error.

Run from repo root:
    python tools/audit-contrast.py
"""

import re
import sys
from pathlib import Path

from xml.etree.ElementTree import Element  # type reference only
try:
    import defusedxml.ElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

# ── WCAG helpers ──────────────────────────────────────────────────────────────

def _linearize(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex6: str) -> float:
    """Relative luminance of a 6-char hex color (leading # and trailing alpha both ignored)."""
    h = hex6.strip("#")[:6]
    r, g, b = (int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))
    return 0.2126 * _linearize(r) + 0.7152 * _linearize(g) + 0.0722 * _linearize(b)


def contrast(hex_a: str, hex_b: str) -> float:
    la, lb = luminance(hex_a), luminance(hex_b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


_HEX_RE = re.compile(r"^[0-9a-fA-F]{6,8}$")


def is_hex(v: str) -> bool:
    return bool(_HEX_RE.match(v))


# ── Theme constants ───────────────────────────────────────────────────────────

# These must match ocean-harbor.xml so updates stay reflected.
EDITOR_BG = "263238"  # island surface — editor / gutter / file tree background
EDITOR_FG = "b8c5d0"  # plain text (TEXT foreground)

NORMAL = 4.5  # WCAG AA — body / code text
LARGE  = 3.0  # WCAG AA — large or UI-chrome text

# ── Intentional dims ──────────────────────────────────────────────────────────
#
# Tokens that are deliberately quiet — checked at a low "not invisible" threshold
# instead of full WCAG. Add a token here when you intentionally want it dim.
#
INTENTIONAL_DIMS: dict[str, float] = {
    "INLINE_PARAMETER_HINT":             1.5,  # supplementary hints — quiet by design
    "INLINE_PARAMETER_HINT_HIGHLIGHTED": 1.5,
    "INLINE_PARAMETER_HINT_CURRENT":     1.5,
    "INLAY_DEFAULT":                     1.5,  # inlay hints deliberately softened
    "BREADCRUMBS_DEFAULT":               2.0,  # navigable but secondary
    "BREADCRUMBS_INACTIVE":              1.5,  # barely-there by design
    "TAB_SELECTED_INACTIVE":             3.0,  # unfocused-window tab — UI chrome, LARGE threshold
}

# ── Implied pairs (category 2) ────────────────────────────────────────────────
#
# Format: (colors_token, other_hex_or_colors_token, threshold, human_note)
# Contrast is symmetric, so the pair order does not matter — file-status
# entries put the foreground token first and the island background second.
#
IMPLIED_PAIRS = [
    # Gutter — line numbers are intentionally dim; "not invisible" minimum
    ("GUTTER_BACKGROUND",    "LINE_NUMBERS_COLOR", 2.0,    "gutter bg / line number text (intentionally dim)"),
    # Caret row — code on the highlighted current line
    ("CARET_ROW_COLOR",      EDITOR_FG, NORMAL, "caret-row bg / editor text"),
    # Popups
    ("DOCUMENTATION_COLOR",  EDITOR_FG, NORMAL, "docs popup bg / text"),
    ("LOOKUP_COLOR",         EDITOR_FG, NORMAL, "autocomplete popup bg / text"),
    # File tree VCS statuses — colored filenames on the island background
    ("FILESTATUS_ADDED",     EDITOR_BG, NORMAL, "added file name / file tree bg"),
    ("FILESTATUS_MODIFIED",  EDITOR_BG, NORMAL, "modified file name / file tree bg"),
    ("FILESTATUS_DELETED",   EDITOR_BG, NORMAL, "deleted file name / file tree bg"),
    ("FILESTATUS_COPIED",    EDITOR_BG, NORMAL, "copied file name / file tree bg"),
    # Gutter change markers vs gutter background
    ("ADDED_LINES_COLOR",    EDITOR_BG, LARGE,  "added-lines gutter marker / gutter bg"),
    ("MODIFIED_LINES_COLOR", EDITOR_BG, LARGE,  "modified-lines gutter marker / gutter bg"),
    ("DELETED_LINES_COLOR",  EDITOR_BG, LARGE,  "deleted-lines gutter marker / gutter bg"),
]

# ── Diff pairs (category 3) ───────────────────────────────────────────────────
#
# Format: (attr_token_with_bg, fg_spec, threshold, human_note)
# fg_spec is either a literal hex or "ATTR:<token>" to use that attribute's
# explicit FOREGROUND from the theme (keeps the audit in sync with the XML).
#
DIFF_PAIRS = [
    ("DIFF_INSERTED", EDITOR_FG,             NORMAL, "inserted-line bg / editor text"),
    ("DIFF_INSERTED", "ATTR:DEFAULT_STRING", NORMAL, "inserted-line bg / string green (green-on-green)"),
    ("DIFF_MODIFIED", EDITOR_FG,             NORMAL, "modified-line bg / editor text"),
    ("DIFF_MODIFIED", "ATTR:DEFAULT_STRING", NORMAL, "modified-line bg / string green"),
    ("DIFF_DELETED",  EDITOR_FG,             NORMAL, "deleted-line bg / editor text"),
    ("DIFF_CONFLICT", EDITOR_FG,             NORMAL, "conflict bg / editor text"),
]

# ── XML parsing ───────────────────────────────────────────────────────────────

def parse_colors(root: Element) -> dict[str, str]:
    """Return {token: hex6} for every valid flat <option> in <colors>."""
    result: dict[str, str] = {}
    colors_el = root.find("colors")
    if colors_el is not None:
        for opt in colors_el.findall("option"):
            name = opt.get("name", "")
            val  = opt.get("value", "")
            if name and val and is_hex(val):
                result[name] = val[:6]
    return result


def parse_attributes(root: Element) -> dict[str, dict]:
    """Return {token: {"bg": hex6|None, "fg": hex6|None}} for <attributes>."""
    attrs: dict[str, dict] = {}
    attrs_el = root.find("attributes")
    if attrs_el is None:
        return attrs
    for attr_opt in attrs_el.findall("option"):
        name     = attr_opt.get("name", "")
        value_el = attr_opt.find("value")
        if not name or value_el is None:
            continue
        bg = fg = None
        for opt in value_el.findall("option"):
            n, v = opt.get("name", ""), opt.get("value", "")
            if n == "BACKGROUND" and is_hex(v):
                bg = v[:6]
            elif n == "FOREGROUND" and is_hex(v):
                fg = v[:6]
        attrs[name] = {"bg": bg, "fg": fg}
    return attrs


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    try:
        repo_root = Path(__file__).resolve().parents[1]
        xml_path = repo_root / "ocean-harbor.xml"
        tree = ET.parse(xml_path)
    except FileNotFoundError:
        print("ERROR: ocean-harbor.xml not found at repo root.")
        sys.exit(2)

    root   = tree.getroot()
    colors = parse_colors(root)
    attrs  = parse_attributes(root)

    issues: list[dict] = []
    passes = 0

    # Category 1: explicit BG + FG pairs in <attributes>
    for token, pair in attrs.items():
        if not (pair["bg"] and pair["fg"]):
            continue
        threshold = INTENTIONAL_DIMS.get(token, NORMAL)
        ratio = contrast(pair["bg"], pair["fg"])
        dim_note = " (intentionally dim)" if token in INTENTIONAL_DIMS else ""
        if ratio < threshold:
            issues.append({"token": token, "bg": pair["bg"], "fg": pair["fg"],
                           "ratio": ratio, "threshold": threshold,
                           "note": f"explicit attribute FG/BG pair{dim_note}"})
        else:
            passes += 1

    # Category 2: implied pairs from <colors>
    for bg_token, fg_val, threshold, note in IMPLIED_PAIRS:
        bg_hex = colors.get(bg_token)
        if bg_hex is None:
            continue
        fg_hex = colors.get(fg_val, fg_val)
        if not is_hex(fg_hex) or len(fg_hex.strip("#")) < 6:
            continue
        fg_hex = fg_hex[:6]
        ratio = contrast(bg_hex, fg_hex)
        if ratio < threshold:
            issues.append({"token": bg_token, "bg": bg_hex, "fg": fg_hex,
                           "ratio": ratio, "threshold": threshold, "note": note})
        else:
            passes += 1

    # Category 3: diff backgrounds vs editor/syntax foregrounds
    for attr_token, fg_spec, threshold, note in DIFF_PAIRS:
        bg_hex = (attrs.get(attr_token) or {}).get("bg")
        if bg_hex is None:
            continue
        if fg_spec.startswith("ATTR:"):
            fg_hex = (attrs.get(fg_spec[5:]) or {}).get("fg")
        else:
            fg_hex = fg_spec
        if fg_hex is None or not is_hex(fg_hex):
            continue
        ratio = contrast(bg_hex, fg_hex)
        if ratio < threshold:
            issues.append({"token": attr_token, "bg": bg_hex, "fg": fg_hex,
                           "ratio": ratio, "threshold": threshold, "note": note})
        else:
            passes += 1

    # ── Report ────────────────────────────────────────────────────────────────
    if issues:
        bar = "=" * 62
        print(f"\n{bar}")
        print(f"  FAIL - {len(issues)} contrast issue(s)   ({passes} pair(s) passed)")
        print(f"{bar}\n")
        for i in issues:
            need = f"need >= {i['threshold']}:1"
            print(f"  FAIL  {i['token']}")
            print(f"        bg=#{i['bg']}  fg=#{i['fg']}  ratio={i['ratio']:.2f}:1  ({need})")
            print(f"        {i['note']}")
            print()
        sys.exit(1)
    else:
        print(f"\nPASS - {passes} pair(s) checked, all above threshold.\n")
        sys.exit(0)


if __name__ == "__main__":
    main()
