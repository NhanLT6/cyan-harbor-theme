# Suggested Commands

All tooling lives in `shiki/`. Run from that directory unless noted.

## Primary workflow — preview theme
```
cd shiki/
npm run editor     # extract colors from XML → generate theme-editor.html
```
Then open `shiki/theme-editor.html` directly in a browser to see the preview.
No `npm install` needed — there are no dependencies.

## Build JAR for release
```
# From repo root:
npm run build      # outputs releases/ocean-harbor-{version}.jar
```
Bump version: edit `"version"` in root `package.json` before building.

## Direct XML editing
Edit `ocean-harbor.xml` directly, then re-run `npm run editor` to regenerate the preview.

## No linting, formatting, or test commands — this project has none.

## Git (Windows/bash)
```
git log --oneline
git diff
git add ocean-harbor.xml ocean-harbor.theme.json
git commit -m "message"
```
