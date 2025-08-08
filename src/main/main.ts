import path from "node:path";
import process from "node:process";
import { app, BrowserWindow, ipcMain } from "electron";

ipcMain.handle("processVersion", () => process.version);
ipcMain.handle("processCwd", () => process.cwd());
ipcMain.handle("importMetaFilename", () => import.meta.filename);
ipcMain.handle("processArgv", () => process.argv.join(" "));

app.on("ready", async () => {
  await createWindow();
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, "..", "preload.cjs"),
    },
  });

  await mainWindow.loadFile(
    path.join(import.meta.dirname, "..", "renderer", "index.html"),
  );
}
