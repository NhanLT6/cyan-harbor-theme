#!/usr/bin/env pwsh
# Ocean Harbor prompt preview — line 1 wave variants
# Run from ocean-harbor root: pwsh prompt/preview.ps1
# Requires: PowerShell 7+, JetBrains Mono NF, Windows Terminal

$e    = [char]27
$sail = "󰻈"   # nf-md-sail_boat
$wv   = "󰼮"   # nf-md-waves
$anc  = ""   # nf-fa-anchor
$ps   = "󰨊"   # nf-md-powershell
$br   = "󰘬"   # nf-md-source_branch

function c([int]$r, [int]$g, [int]$b, [string]$s) {
    "${e}[38;2;${r};${g};${b}m${s}${e}[0m"
}

# ── Info line (shared by both variants) ──────────────────────────
$info  = (c 110 196 188 "$ps ")
$info += (c 167 219 216 "CommissionFactory")
$info += (c 101 115 126 "/")
$info += (c 84 110 122 "Commission Factory Service")
$info += (c 101 115 126 "/")
$info += (c 84 110 122 "bin")
$info += (c 101 115 126 "/")
$info += (c 84 110 122 "Debug")
$info += (c 101 115 126 " · ")
$info += (c 116 148 200 "$br ")
$info += (c 138 171 230 "feature/ds-4151-new-…")

# ── Connector (shared) ───────────────────────────────────────────
$conn = (c 88 168 159 $anc)

# ── Variant A: wave glyph at every catch-light position ──────────
# Wave color matches the underscore it replaces (w3 = #486878)
$a  = (c 53 79 92 "__")
$a += (c 110 196 188 " $sail ")
$a += (c 72 104 120 $wv)
$a += (c 63 93 108 "_")
$a += (c 61 89 104 "_")
$a += (c 72 104 120 $wv)
$a += (c 63 93 108 "_")
$a += (c 53 79 92 "_")
$a += (c 46 68 82 "_")
$a += (c 72 104 120 $wv)
$a += (c 61 89 104 "_")
$a += (c 53 79 92 "_")
$a += (c 72 104 120 $wv)
$a += (c 61 89 104 "_")
$a += (c 46 68 82 "_")
$a += (c 53 79 92 "_")
$a += (c 61 89 104 "_")
$a += (c 53 79 92 "_")
$a += (c 61 89 104 "_")
$a += (c 46 68 82 "_")
$a += (c 61 89 104 "_")
$a += (c 53 79 92 "_")

# ── Variant B: sparse waves, slightly brighter than surface ──────
# Wave color is w2 (#527585) — a step above the underscores around them
$b  = (c 53 79 92 "__")
$b += (c 110 196 188 " $sail ")
$b += (c 82 117 133 $wv)
$b += (c 63 93 108 "__")
$b += (c 61 89 104 "_")
$b += (c 63 93 108 "_")
$b += (c 53 79 92 "_")
$b += (c 46 68 82 "_")
$b += (c 82 117 133 $wv)
$b += (c 61 89 104 "_")
$b += (c 53 79 92 "__")
$b += (c 46 68 82 "_")
$b += (c 53 79 92 "_")
$b += (c 61 89 104 "_")
$b += (c 82 117 133 $wv)
$b += (c 53 79 92 "__")
$b += (c 46 68 82 "_")
$b += (c 61 89 104 "_")
$b += (c 53 79 92 "__")

# ── Print both ───────────────────────────────────────────────────
Write-Host ""
Write-Host "  ${e}[1mVariant A${e}[0m  wave at every reflection peak (color-matched to surface):"
Write-Host "  $a"
Write-Host "  $info"
Write-Host "  $conn"
Write-Host ""
Write-Host "  ${e}[1mVariant B${e}[0m  sparse waves, slightly brighter than surrounding underscores:"
Write-Host "  $b"
Write-Host "  $info"
Write-Host "  $conn"
Write-Host ""
