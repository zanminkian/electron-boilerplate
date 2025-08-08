const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("apis", {
  processVersion: () => ipcRenderer.invoke("processVersion"),
  processCwd: () => ipcRenderer.invoke("processCwd"),
  importMetaFilename: () => ipcRenderer.invoke("importMetaFilename"),
  processArgv: () => ipcRenderer.invoke("processArgv"),
});
