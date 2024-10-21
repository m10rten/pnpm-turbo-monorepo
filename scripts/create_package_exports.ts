#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

// Inline configuration for ignored folders
const ignoredFolders = ["tests", "node_modules", "dist", "utils"];

function generateExports(
  folderPath: string,
  relativePath: string = "."
): Record<string, any> {
  const exports: Record<string, any> = {};
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Skip ignored folders
      if (ignoredFolders.includes(file)) {
        return;
      }
      const subExports = generateExports(
        filePath,
        path.join(relativePath, file)
      );
      Object.assign(exports, subExports);
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      if (file.includes("config")) return;
      const exportPath =
        `./${path.join(relativePath, path.parse(file).name)}`.replace(
          "/src",
          ""
        );
      exports[exportPath] = {
        types:
          `./dist/${path.join(relativePath, file.replace(/\.(js|ts)$/, ".d.ts"))}`.replace(
            "/src",
            ""
          ),
        import: `./dist/${path.join(relativePath, file)}`
          .replace(".js", ".mjs")
          .replace("/src", ""),
        require: `./dist/${path.join(relativePath, file)}`.replace("/src", ""),
      };
    }
  });

  return exports;
}

function updatePackageJson(folderPath: string): void {
  const packageJsonPath = path.join(folderPath, "package.json");

  // Read existing package.json
  let packageJson: any = {};
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    packageJson = JSON.parse(packageJsonContent);
  }

  // Generate exports
  const generatedExports = generateExports(folderPath);

  // Merge existing exports with generated exports
  packageJson.exports = { ...packageJson.exports, ...generatedExports };

  // Add default export if index file exists
  if (
    fs.existsSync(path.join(folderPath, "index.js")) ||
    fs.existsSync(path.join(folderPath, "index.ts"))
  ) {
    packageJson.exports["."] = {
      types: "./dist/index.d.ts",
      import: "./dist/index.mjs",
      require: "./dist/index.js",
    };
  }

  if (Object.keys(packageJson.exports).length === 0) return;

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("package.json exports updated successfully.");
}

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error("Usage: generate-exports <folder-path>");
    process.exit(1);
  }

  const folderPath = path.resolve(args[0]!);

  if (!fs.existsSync(folderPath)) {
    console.error(`Folder not found: ${folderPath}`);
    process.exit(1);
  }

  updatePackageJson(folderPath);
}

main();
