import { useEffect, useState } from "react";

export function App() {
  const [num, setNum] = useState(0);
  return (
    <div className="border border-solid border-black bg-red-100 p-1 text-center text-base hover:bg-green-100">
      <div>💖 Hello World 你好：{num}</div>
      <button className="d-btn border-black" onClick={() => setNum(num + 1)}>
        Click me
      </button>
      <Info />
    </div>
  );
}

function Info() {
  const [text, setText] = useState<Map<string, string>>();
  const invoke = (globalThis as any).invoke as (
    channel: string,
    ...args: any[]
  ) => Promise<any>;
  useEffect(() => {
    const channels = [
      "processVersion",
      "processCwd",
      "processArgv",
      "importMetaFilename",
    ];
    Promise.all(
      channels.map(
        async (channel) => [channel, await invoke(channel)] as const,
      ),
    )
      .then((result) => {
        setText(new Map(result));
      })
      .catch(() => {
        globalThis.alert("Failed to get info");
      });
  });
  return (
    <div className="mx-auto my-2 max-w-200 border border-red-500">
      <ul className="text-left text-sm">
        {text &&
          [...text.entries()].map(([method, value]) => (
            <li key={method}>
              {method}: {value}
            </li>
          ))}
      </ul>
    </div>
  );
}
