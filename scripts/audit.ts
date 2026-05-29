import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

type Check = { name: string; ok: boolean; details: string };

function readFileIfExists(filePath: string) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function runAudit() {
  const checks: Check[] = [];

  const pkgRaw = readFileIfExists(path.resolve("package.json"));
  const pkg = pkgRaw ? (JSON.parse(pkgRaw) as { scripts?: Record<string, string> }) : {};
  const requiredScripts = ["dev", "start", "build", "test", "lint", "init:db", "check:env", "check:health", "audit"];
  const missingScripts = requiredScripts.filter((script) => !pkg.scripts?.[script]);
  checks.push({
    name: "required scripts",
    ok: missingScripts.length === 0,
    details: missingScripts.length === 0 ? "all present" : `missing: ${missingScripts.join(", ")}`
  });

  checks.push({
    name: ".env.example",
    ok: fs.existsSync(path.resolve(".env.example")),
    details: ".env.example must exist"
  });

  const dashboardRoot = path.resolve("public", "dashboard", "index.html");
  checks.push({
    name: "dashboard root exists",
    ok: fs.existsSync(dashboardRoot),
    details: dashboardRoot
  });

  const migrationFile = path.resolve("migrations", "001_init.sql");
  checks.push({
    name: "migration/init file exists",
    ok: fs.existsSync(migrationFile),
    details: migrationFile
  });

  const gitignore = readFileIfExists(path.resolve(".gitignore"));
  checks.push({
    name: ".env ignored",
    ok: gitignore.includes(".env"),
    details: "Expected .env pattern in .gitignore"
  });
  checks.push({
    name: "sqlite runtime files ignored",
    ok: gitignore.includes("data/*.db"),
    details: "Expected data/*.db in .gitignore"
  });

  const trackedFiles = execSync("git ls-files", { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
  const hasTrackedEnv = trackedFiles.some((file) => file === ".env" || file.endsWith("/.env"));
  const hasTrackedDb = trackedFiles.some((file) => /(^|\/)data\/.+\.db(-wal|-shm)?$/.test(file));
  checks.push({
    name: "no tracked .env",
    ok: !hasTrackedEnv,
    details: hasTrackedEnv ? ".env is tracked in git" : "ok"
  });
  checks.push({
    name: "no tracked runtime sqlite db",
    ok: !hasTrackedDb,
    details: hasTrackedDb ? "runtime sqlite file tracked in git" : "ok"
  });

  const appSource = readFileIfExists(path.resolve("src", "app.ts"));
  const routeMarkers = ["/health", "/api/health", "/api/status", "/scan/run", "/api/analyze", "/dashboard"];
  const missingRoutes = routeMarkers.filter((marker) => !appSource.includes(marker));
  checks.push({
    name: "core routes registered",
    ok: missingRoutes.length === 0,
    details: missingRoutes.length === 0 ? "all route markers present" : `missing: ${missingRoutes.join(", ")}`
  });

  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} - ${check.name}: ${check.details}`);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
}

runAudit();
