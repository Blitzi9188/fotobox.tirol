import os from "os";
import { spawn } from "child_process";

const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith("--port="));
const port = (portArg ? Number(portArg.split("=")[1]) : Number(process.env.PORT || "4010")) || 4010;
const host = process.env.HOST || "0.0.0.0";

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return null;
}

const lanIp = getLanIp();

const env = {
  ...process.env,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@fotoboxtirol.at",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin1234",
  SESSION_SECRET: process.env.SESSION_SECRET || "offline-dev-secret",
  CMS_DATA_DIR: process.env.CMS_DATA_DIR || "./data",
  CMS_UPLOADS_DIR: process.env.CMS_UPLOADS_DIR || "./public/uploads",
  CMS_UPLOADS_PUBLIC_BASE: process.env.CMS_UPLOADS_PUBLIC_BASE || "/uploads",
  HOST: host,
  PORT: String(port)
};

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const commandArgs = ["run", "dev", "--", "-H", host, "-p", String(port)];

console.log("");
console.log("Offline Portal wird gestartet...");
console.log(`Local:   http://localhost:${port}`);
if (lanIp) {
  console.log(`Im WLAN: http://${lanIp}:${port}`);
}
console.log(`Admin:   http://localhost:${port}/admin`);
if (lanIp) {
  console.log(`Admin WLAN: http://${lanIp}:${port}/admin`);
}
console.log("");
console.log("Beenden: Ctrl + C");
console.log("");

const child = spawn(command, commandArgs, {
  env,
  stdio: "inherit",
  shell: false
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
