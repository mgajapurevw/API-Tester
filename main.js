const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Allow self-signed / internal SSL certificates (essential for enterprise/internal APIs)
app.commandLine.appendSwitch('ignore-certificate-errors');

// ─── HTTP request handler (called from renderer via IPC) ──────────────────────
// By handling requests in the main process, we completely bypass browser CORS.
ipcMain.handle('send-request', async (event, config) => {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(config.url);
      const isHttps = parsedUrl.protocol === 'https:';
      const mod = isHttps ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: config.method,
        headers: config.headers || {},
        timeout: 30000,
        rejectUnauthorized: false  // Accept self-signed certs for internal APIs
      };

      const startTime = Date.now();
      const req = mod.request(options, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const elapsed = Date.now() - startTime;
          const resHeaders = {};
          // Flatten headers (Node returns arrays for some)
          Object.entries(res.headers).forEach(([k, v]) => {
            resHeaders[k] = Array.isArray(v) ? v.join(', ') : v;
          });
          resolve({
            ok: true,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: resHeaders,
            body: buffer.toString('utf8'),
            elapsed
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Request timed out (30s)' });
      });

      req.on('error', (err) => {
        resolve({ ok: false, error: err.message });
      });

      if (config.body) {
        req.write(typeof config.body === 'string' ? config.body : JSON.stringify(config.body));
      }

      req.end();
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
});

// ─── Window ───────────────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: 'API Tester',
    backgroundColor: '#0f1117',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // webSecurity: false is NOT needed — requests go through main process via IPC
    }
  });

  win.loadFile('index.html');

  // Open anchor links that target _blank in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

// ─── App menu ─────────────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox({
              type: 'info',
              title: 'API Tester',
              message: 'API Tester v1.0.0',
              detail: 'A Postman-like API testing tool.\nBuilt with Electron + HTML/CSS/JS.'
            });
          }
        }
      ]
    }
  ];

  // macOS: add app menu
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
