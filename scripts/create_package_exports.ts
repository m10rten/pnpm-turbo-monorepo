#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

// Inline configuration for ignored folders
const ignoredFolders = ["tests", "node_modules", "dist", "utils"];
const ignoredFiles = ["esbuild", ".config.ts"];

const extensions = (type: "module" | "commonjs") => ({
  import: type === "module" ? ".js" : ".mjs",
  types: type === "module" ? ".d.mts" : ".d.ts",
  require: type === "module" ? ".cjs" : ".js",
  default: type === "module" ? ".mjs" : ".js",
});

function generateExports(
  folderPath: string,
  relativePath: string = ".",
  type: "module" | "commonjs",
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
        path.join(relativePath, file),
        type,
      );
      Object.assign(exports, subExports);
    } else if (file.endsWith("js") || file.endsWith("ts")) {
      if (ignoredFiles.some((ig) => file.includes(ig))) return;
      const exportPath =
        `./${path.join(relativePath, path.parse(file).name)}`.replace(
          "/src",
          "",
        );
      const ext = extensions(type);

      const filePath = `dist/${path.join(relativePath, file)}`;
      exports[exportPath] = {
        types: `./${filePath.replace(/\.(js|ts)$/, ext.types)}`.replace(
          "/src",
          "",
        ),
        import: `./${filePath}`
          .replace(/\.(js|ts)$/, ext.import)
          .replace("/src", ""),
        default: `./${filePath}`
          .replace(/\.(js|ts)$/, ext.default)
          .replace("/src", ""),
        require:
          type === "commonjs"
            ? `./${filePath}`
                .replace(/\.(js|ts)$/, ext.require)
                .replace("/src", "")
            : undefined,
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

  const type = packageJson.type;
  const ext = extensions(type);

  // Generate exports
  const generatedExports = generateExports(folderPath, ".", type);

  // Merge existing exports with generated exports
  packageJson.exports = { ...packageJson.exports, ...generatedExports };

  // Add default export if index file exists
  if (
    fs.existsSync(path.join(folderPath, "index.ts")) ||
    fs.existsSync(path.join(folderPath, "src", "index.ts"))
  ) {
    packageJson.exports["."] = {
      types: `./dist/index${ext.types}`,
      import: `./dist/index${ext.import}`,
      default: `./dist/index${ext.default}`,
      require: type === "commonjs" ? `./dist/index${ext.require}` : undefined,
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
