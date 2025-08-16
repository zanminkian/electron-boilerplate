import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, dialog, ipcMain } from "electron";

ipcMain.handle("processVersion", () => process.version);
ipcMain.handle("processCwd", () => process.cwd());
ipcMain.handle("processArgv", () => process.argv.join(" "));
ipcMain.handle("importMetaFilename", () => import.meta.filename);

app.on("ready", () => {
  createWindow().catch(handelCreateWindowFailed);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0)
    createWindow().catch(handelCreateWindowFailed);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload"),
    },
  });

  process.env["NODE_ENV"] === "development"
    ? await mainWindow.loadURL("http://localhost:5173")
    : await mainWindow.loadFile(fileURLToPath(import.meta.resolve("renderer")));
}

function handelCreateWindowFailed() {
  dialog.showErrorBox(
    "Application Error",
    "Failed to load the application interface. Please check your installation and try again.",
  );
}
