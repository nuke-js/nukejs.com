/**
 * Prebuild script: fetches the latest `nukejs` version from the npm registry
 * and writes it into app/consts.ts so it's baked in at build time.
 *
 * Runs automatically via `predev` and `prebuild` hooks in package.json.
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fetchWithHttps(packageName) {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/${packageName}/latest`,
        { headers: { Accept: "application/json" } },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            if (res.statusCode !== 200) {
              reject(new Error(`npm registry responded with ${res.statusCode}`));
            } else {
              try { resolve(JSON.parse(body).version); }
              catch { reject(new Error("Failed to parse registry response")); }
            }
          });
        }
      )
      .on("error", reject);
  });
}

function fetchWithCurl(packageName) {
  const json = execSync(
    `curl -sf https://registry.npmjs.org/${packageName}/latest`,
    { encoding: "utf-8" }
  );
  return JSON.parse(json).version;
}

async function fetchLatestVersion(packageName) {
  try {
    return await fetchWithHttps(packageName);
  } catch {
    return fetchWithCurl(packageName);
  }
}

async function main() {
  console.log("Fetching latest nukejs version from npm...");

  let version;
  try {
    version = await fetchLatestVersion("nukejs");
    console.log(`Latest nukejs version: ${version}`);
  } catch (err) {
    console.error("Could not fetch version from npm:", err.message);
    console.warn("Falling back to '0.0.0'");
    version = "0.0.0";
  }

  const constsPath = join(__dirname, "../app/consts.ts");
  const content = [
    "// Auto-generated at build time by scripts/fetch-version.mjs",
    "// Do not edit manually — run `npm run build` or `npm run dev` to regenerate.",
    'export const SITE_URL = "https://nukejs.com";',
    'export const SITE_NAME = "NukeJS";',
    'export const SITE_DESCRIPTION = "The full-stack React framework with SSR, HMR, file-based routing, and API routes — out of the box. Deploy to Vercel or Node in one command.";',
    'export const GITHUB_URL = "https://github.com/nuke-js";',
    `export const VERSION = "${version}";`,
    "",
  ].join("\n");

  writeFileSync(constsPath, content, "utf-8");
  console.log("Written to app/consts.ts");
}

main();
