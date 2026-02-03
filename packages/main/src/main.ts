import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { isNativeError } from "node:util/types";
import {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  globalShortcut,
  ipcMain,
} from "electron";

let mainWindow: BrowserWindow | null = null;

ipcMain.handle("processVersion", () => process.version);
ipcMain.handle("processCwd", () => process.cwd());
ipcMain.handle("processArgv", () => process.argv.join(" "));
ipcMain.handle("importMetaFilename", () => import.meta.filename);
ipcMain.handle("getClipboardText", () => clipboard.readText());
ipcMain.handle("hideWindow", () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});
ipcMain.handle("resizeWindow", (_event, width: number, height: number) => {
  if (mainWindow) {
    mainWindow.setSize(width, height);
    mainWindow.center();
  }
});

app.whenReady().then(() => {
  createWindow();
  registerGlobalShortcut();

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    minWidth: 300,
    minHeight: 200,
    maxWidth: 800,
    maxHeight: 600,
    show: false,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    type: "toolbar",
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
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- wait for electron upgrade the `@types/node`
      isNativeError(err) ? err.message : "Unknown error occurred.",
    );
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerGlobalShortcut() {
  const ret = globalShortcut.register("Shift+Control+A", () => {
    if (mainWindow) {
      mainWindow.webContents.send("refresh-clipboard");
      mainWindow.show();
      mainWindow.focus();
    }
  });

  if (!ret) {
    dialog.showErrorBox("快捷键注册失败", "无法注册全局快捷键 Shift+Control+A");
  }
}
