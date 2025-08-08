const rootElement = globalThis.document.getElementById("root");

const h1 = globalThis.document.createElement("h1");
h1.textContent = "💖 Hello World 你好!";
rootElement.appendChild(h1);

Promise.all(
  Object.keys(globalThis.apis).map(async (method) => [
    method,
    await globalThis.apis[method](),
  ]),
).then((result) => {
  for (const [method, value] of result) {
    const p = globalThis.document.createElement("p");
    p.textContent = `${method}: ${value}`;
    rootElement.appendChild(p);
  }
});
