# electron-boilerplate

## Install

```sh
pnpm install
```

## Prepare (Optional)

If you are using (WEB IDE)[https://github.com/zanminkian/web-ide], you need to run `start-desktop` before developing.

## Dev

```sh
pnpm dev
```

## Build

```sh
pnpm build
```

## How to use this boilerplate

Clone this repository and then replace `<your-project-name>` in the following steps:

1. Rename the main package directory:
   ```sh
   mv packages/main packages/<your-project-name>
   ```
2. Update the `name` field in `packages/<your-project-name>/package.json` to `<your-project-name>`.
3. Update the `dev` script in root `package.json` to use `<your-project-name>` as the pnpm filter:
   ```diff
   - "dev": "run-pty % pnpm --filter renderer dev % pnpm --filter main dev",
   + "dev": "run-pty % pnpm --filter renderer dev % pnpm --filter <your-project-name> dev",
   ```
