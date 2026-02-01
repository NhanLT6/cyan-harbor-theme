# Building Cyan Harbor Theme

## Setup

First time setup - install dependencies:
```bash
npm install
```

## Build JAR File

To build the theme JAR file for IntelliJ:
```bash
npm run build
```

This will:
1. ✅ Compress `META-INF/`, `cyan-harbor.xml`, and `cyan-harbor.theme.json`
2. ✅ Create a JAR file with version from `package.json`
3. ✅ Output to `releases/cyan-harbor-{version}.jar`

### Example Output
```
🔨 Building theme JAR...
  ✓ Added META-INF/
  ✓ Added cyan-harbor.xml
  ✓ Added cyan-harbor.theme.json

✅ Theme JAR created successfully!
📁 Output: releases/cyan-harbor-1.0.0.jar
📊 Size: 9.32 KB
🏷️  Version: 1.0.0
```

## Updating Version

To create a new release with a different version:

1. Update the version in `package.json`:
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. Build the JAR:
   ```bash
   npm run build
   ```

The JAR file will be created with the new version: `cyan-harbor-1.1.0.jar`

## Release Folder

All built JAR files are stored in the `releases/` folder and are ready to be distributed.

To install in IntelliJ:
1. Open IntelliJ → Settings → Editor → Color Scheme
2. Click the gear icon → Import Scheme → JAR Archive
3. Select `releases/cyan-harbor-{version}.jar`

## Automation with Git Hooks (Optional)

To automatically build before commits, add a pre-commit hook:

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run build
git add releases/
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```
