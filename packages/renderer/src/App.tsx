import { useEffect, useState } from "react";

export function App() {
  const [clipboardText, setClipboardText] = useState("");
  const invoke = (globalThis as any).invoke as (
    channel: string,
    ...args: any[]
  ) => Promise<any>;

  const loadClipboard = async () => {
    try {
      const text = await invoke("getClipboardText");
      setClipboardText(text);
      adjustWindowSize(text);
    } catch {
      setClipboardText("无法读取剪贴板内容");
    }
  };

  const adjustWindowSize = (text: string) => {
    const textLength = text.length;
    const lineCount = text.split("\n").length;

    // 根据文本长度和行数计算窗口大小
    let width = 300;
    let height = 200;

    if (textLength > 0) {
      // 根据字符数计算宽度（每行平均字符数）
      const avgCharsPerLine = textLength / lineCount;
      width = Math.min(
        800,
        Math.max(300, Math.ceil(avgCharsPerLine * 8) + 100),
      );

      // 根据行数计算高度
      height = Math.min(600, Math.max(200, lineCount * 24 + 120));
    }

    invoke("resizeWindow", width, height);
  };

  useEffect(() => {
    loadClipboard();

    const ipcRenderer = (globalThis as any).ipcRenderer;
    if (ipcRenderer) {
      ipcRenderer.on("refresh-clipboard", () => {
        loadClipboard();
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        invoke("hideWindow");
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners("refresh-clipboard");
      }
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-white p-4">
      <div
        className="mb-4 text-center"
        style={{ WebkitAppRegion: "drag" } as any}
      >
        <h1 className="text-xl font-bold text-gray-800">📋 剪贴板内容</h1>
        <p className="mt-1 text-sm text-gray-500">按 Shift+Ctrl+A 隐藏窗口</p>
      </div>
      <div
        className="flex-1 overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-4"
        style={{ WebkitAppRegion: "no-drag" } as any}
      >
        <pre className="text-sm break-words whitespace-pre-wrap text-gray-800">
          {clipboardText || "剪贴板为空"}
        </pre>
      </div>
    </div>
  );
}
