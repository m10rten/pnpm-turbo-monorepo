# pnpm-turbo-monorepo

This project has been setup with [`pnpm`](https://pnpm.io/) and [`turbo`](https://turbo.build/).

The main concept behind this repository is to showcase the usage of `pnpm` with `turbo`.

## Getting Started

To set up the project, it is required to have the following tools installed:

- [Node.js](https://nodejs.org/) >= v22.0 or higher
- [Pnpm](https://pnpm.io/) >= v9.0 or higher

To run with [Docker](https://docker.com/), it is required to have it installed and running.

---

To initialize the project, make sure to install the dependencies:

```bash
pnpm i
```

This is short for `pnpm install` and uses the pnpm store to cache dependencies and make them available for the entire project.

---

Run the project with the following command:

```bash
pnpm dev
```

This is short for `pnpm run dev` that runs: `turbo run dev`. Turbo then searches in the `pnpm-workspace.yaml` for packages that contain the `'dev'` script in the package.json.

The `dev` command will run the build command and watch for changes in packages, and for apps will run the app with a `--watch` for changes.

---

To build the project, you can use the build command:

```bash
pnpm build
```

This is short for `pnpm run build` that runs `turbo run build`, in most cases this outputs a `/dist` folder with `.js`,`.d.ts` and `.mjs` files based on the `.ts` files in the package or app.

---

Turbo uses a `.turbo` folder to keep track of command-results and ran-scripts, the package manager uses the `node_modules` folder and tsup(the build tool) uses `dist` as output folder.

To clean these folders and start 'fresh', you can run the following `clean` command:

```bash
pnpm clean
```

This will run the `./scripts/clean.sh` script that cleans out all `node_modules`, `dist` and `.turbo` folders in the entire project.

---

To run with docker, use the next command:

```bash
pnpm docker
```

This will execute the docker command:

```bash
docker compose up -d --build --force-recreate --remove-orphans
```

## Development

To develop on a package (not app) in the monorepo structure, is very straightforward:

Pick or create a new app in the `packages` folder, and then start working on the TypeScript code.

Once you are done with developing, you can run `pnpm exports:all` to generate exports for the package.json files, this way the package can be used in other packages or apps once it is build.

## Improvements

This project is a good example of how a monorepo could be set up and be used for docker use and development use. There are however a few points for improvement that were found during the creation of this codebase.

### ESM + CommonJS

As always with JavaScript projects, the problems of ESM & CommonJS is present.

In advance was chosen to only make use of ESM as that is mainly import based and not require, many tools and packages are moving of CommonJS, so that's why ESM should be standard for all new projects.

However not all packages use the ESM standard and thus make it very hard to go all-in with 1 solution.

To resolve this issue in this project, the 100% ESM way has not been used properly. That is so packages that don't use ESM can still be used.

###
