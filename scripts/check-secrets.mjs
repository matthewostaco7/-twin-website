// Fails when something that looks like a secret ends up in code that ships to the browser.
// Run: npm run check:secrets   (after `npm run build`, it also scans the built site in out/)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "lib", "content", "public", "next.config.ts", "vercel.json", "package.json", "out"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "fonts", "images"]);
const TEXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".html", ".txt", ".md", ".svg"]);

const RULES = [
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Stripe secret key", /\b[sr]k_(live|test)_[A-Za-z0-9]{16,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["bearer token", /\bBearer\s+[A-Za-z0-9._~+/-]{24,}/],
  ["secret-looking assignment", /\b(api[_-]?key|secret|token|password|passwd)\b["']?\s*[:=]\s*["'][A-Za-z0-9._~+/-]{16,}["']/i],
  ["public env var holding a secret", /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE|API_?KEY)/],
  ["env read in browser code", /process\.env\.(?!NODE_ENV\b)[A-Z0-9_]+/],
];

const hits = [];
const walk = (p) => {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (!SKIP_DIRS.has(f)) walk(join(p, f));
  } else if (TEXT.has(extname(p)) && st.size < 5_000_000) {
    const text = readFileSync(p, "utf8");
    for (const [name, re] of RULES) {
      // process.env in next.config.ts runs at build time on the server, so it is fine there
      if (name === "env read in browser code" && p.endsWith("next.config.ts")) continue;
      const m = text.match(re);
      if (m) hits.push(`${p}: ${name} (${m[0].slice(0, 40)}${m[0].length > 40 ? "…" : ""})`);
    }
  }
};
ROOTS.forEach(walk);

if (hits.length) {
  console.error("Possible secrets in frontend code:\n" + hits.map((h) => "  " + h).join("\n"));
  console.error("\nKeep secrets on a server, never in code that ships to the browser.");
  process.exit(1);
}
console.log("check:secrets ok. Nothing secret-looking in the source or the built site.");
