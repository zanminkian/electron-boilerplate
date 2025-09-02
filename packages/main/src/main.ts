import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { isNativeError } from "node:util/types";
import { app, BrowserWindow, dialog, ipcMain } from "electron";

ipcMain.handle("processVersion", () => process.version);
ipcMain.handle("processCwd", () => process.cwd());
ipcMain.handle("processArgv", () => process.argv.join(" "));
ipcMain.handle("importMetaFilename", () => import.meta.filename);

app.on("ready", () => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload"),
    },
  });

  (process.env["NODE_ENV"] === "development"
    ? mainWindow.loadURL("http://localhost:5173")
    : mainWindow.loadFile(fileURLToPath(import.meta.resolve("renderer")))
  ).catch((err: unknown) => {
    dialog.showErrorBox(
      "Application Error",
      isNativeError(err) ? err.message : "Unknown error occurred.",
    );
  });
}
