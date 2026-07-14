# API Testing Tool

A desktop API testing application built with [Electron](https://www.electronjs.org/).

---

## Prerequisites

Before building or running the app, make sure you have:

- [Node.js](https://nodejs.org/) **v18 or later**
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mgajapurevw/API-Tester.git
cd API-Tester
npm install
```

---

## Run the App (Development)

```bash
npm start
```

---

## Build the Application

This project uses [`electron-builder`](https://www.electron.build/) to package the application.

> If `electron-builder` is not already in your project dependencies, install it:

```bash
npm install --save-dev electron-builder
```

### Build for Windows

Run on a **Windows** machine:

```bash
npm run build:win
```

Or directly:

```bash
npx electron-builder --win
```

This generates a `.exe` installer in the `dist/` folder.

### Build for macOS

Run on a **macOS** machine:

```bash
npm run build:mac
```

Or directly:

```bash
npx electron-builder --mac
```

This generates a `.dmg` file in the `dist/` folder.

### Build for Linux

```bash
npm run build:linux
```

Or directly:

```bash
npx electron-builder --linux
```

---

## Recommended `package.json` Configuration

Use the following scripts:

```json
{
  "scripts": {
    "start": "electron .",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  }
}
```

Add a `build` configuration section:

```json
{
  "build": {
    "appId": "com.yourcompany.api-testing-tool",
    "productName": "API Testing Tool",
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

---

## Output

Packaged installers are generated in the `dist/` directory.

---

## Notes

- Cross-platform builds are best created on their respective OS (Windows on Windows, macOS on macOS, etc.).
- Keep `electron-builder` and Electron versions compatible to avoid packaging issues.
