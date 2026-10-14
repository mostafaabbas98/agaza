import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function run(command, cwd) {
  console.log(`\n$ ${command}`);
  return execSync(command, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

const tempDir = mkdtempSync(join(tmpdir(), "agaza-"));
console.log("Temp folder:", tempDir);

try {
  run("npm run build");

  const packOutput = run(
    "npm pack --json --ignore-scripts --pack-destination " + tempDir,
  );
  const packed = JSON.parse(packOutput);
  const { filename } = Array.isArray(packed)
    ? packed[0]
    : Object.values(packed)[0];
  console.log("Tarball:", filename);

  run("npm init -y", tempDir);
  run("npm pkg set type=module", tempDir);
  run(`npm install ${filename} typescript --no-audit --no-fund`, tempDir);

  writeFileSync(
    join(tempDir, "test.js"),
    `
      import { isAgaza } from "@mostafaabbas/agaza";
      if (!isAgaza(new Date(2026, 8, 18))) {
        throw new Error(
          "Error in JS: isAgaza(new Date(2026, 8, 18)) is false (expected true)",
        );
      }
    `,
  );
  run("node test.js", tempDir);

  writeFileSync(
    join(tempDir, "test.ts"),
    `
      import { isAgaza, timeUntilAgaza } from "@mostafaabbas/agaza";
      const result: boolean = isAgaza(new Date(2026, 8, 18)); // true
      const remaining: number = timeUntilAgaza(new Date(2026, 8, 18));
      // @ts-expect-error
      isAgaza("hello");
      // @ts-expect-error
      timeUntilAgaza("hello");
    `,
  );

  run(
    "npx tsc --noEmit --strict --module nodenext --moduleResolution nodenext test.ts",
    tempDir,
  );

  const cliJson = JSON.parse(run("npx agaza --json", tempDir));
  if (typeof cliJson.isAgaza !== "boolean") {
    throw new Error("Error in CLI: --json did not return an isAgaza boolean");
  }
  if (cliJson.timeZone !== "Africa/Cairo") {
    throw new Error("Error in CLI: --json did not report the Cairo time zone");
  }

  const installed = JSON.parse(
    readFileSync(
      join(tempDir, "node_modules/@mostafaabbas/agaza/package.json"),
      "utf8",
    ),
  ).version;
  const reported = run("npx agaza --version", tempDir).trim();
  if (reported !== installed) {
    throw new Error(
      `Error in CLI: --version printed "${reported}", expected "${installed}"`,
    );
  }

  console.log("\n✅ Package test passed");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
