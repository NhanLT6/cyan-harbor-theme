# Conventions & Guidelines

## Editing colors
- `ocean-harbor.xml` is the **only** place to edit syntax/semantic token colors.
- `ocean-harbor.theme.json` owns UI chrome keys only.
- Always grep the hex value before changing — colors are shared across tokens.
- After editing XML, run `cd shiki && npm run editor` to regenerate `theme-editor.html`.

## Palette bounds
- Sat ≤ 87%, lightness 55–83% for syntax tokens
- Follow teal hierarchy: same hue + sat, vary lightness for related token groups
- Chrome keys must stay darker than `#263238` (island surface)
- Use `#1e272c` for window chrome, `#263238` for content panels

## Commit messages
- 1–2 sentences, focus on "why" not "what"
- List changed tokens and the direction of change (e.g. "nudge toward more colorful")

## Preview / tooling
- `shiki/theme-editor.html` is **generated** — never edit it directly
- `shiki/theme-data.json` is generated from XML — never edit directly
- The preview uses hand-crafted HTML spans (not shiki) so token colors match Rider exactly
- No color picker / save-to-XML feature — edit the XML directly

## Serena usage for XML
- Use `search_for_pattern` to find token blocks by name or hex value
- Use `replace_content` for precise hex substitutions in the XML
- The XML is ~2000 lines so avoid reading the full file; search for specific tokens instead
