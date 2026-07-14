# API Testing Tool

A desktop API testing application built with [Electron](https://www.electronjs.org/).

---

## Prerequisites

Make sure you have the following installed before building:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Installation

Clone the repository and install dependencies:

git clone <your-repo-url>
cd api-tester
npm install

## Building the Application
This project uses electron-builder to package the application.

Install electron-builder (if not already added)

npm install --save-dev electron-builder

# Build for Windows
Run on a Windows machine:

npm run build:win

Or directly:

npx electron-builder --win

Generates a .exe installer inside the dist/ folder.

# Build for macOS
Run on a macOS machine:

npm run build:mac

Or directly:

npx electron-builder --mac

Generates a .dmg file inside the dist/ folder.

## Recommended package.json Scripts

"scripts": {
  "start": "electron .",
  "build:win": "electron-builder --win",
  "build:mac": "electron-builder --mac",
  "build:linux": "electron-builder --linux"
}

Add a build config section:

"build": {
  "appId": "com.yourcompany.api-testing-tool",
  "productName": "API Testing Tool",
  "win": {
    "target": "nsis"
  },
  "mac": {
    "target": "dmg"
  }
}
