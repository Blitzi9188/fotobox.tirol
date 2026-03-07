import path from "path";

function isRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID ||
      process.env.RAILWAY_ENVIRONMENT_NAME
  );
}

export function getCmsDataDir() {
  if (process.env.CMS_DATA_DIR) {
    return path.resolve(process.env.CMS_DATA_DIR);
  }

  if (isRailwayRuntime()) {
    return "/tmp/fotobox-cms/data";
  }

  return path.join(process.cwd(), "data");
}

export function getCmsUploadsDir() {
  if (process.env.CMS_UPLOADS_DIR) {
    return path.resolve(process.env.CMS_UPLOADS_DIR);
  }

  return path.join(process.cwd(), "public", "uploads");
}

export function getCmsUploadsPublicBase() {
  return (process.env.CMS_UPLOADS_PUBLIC_BASE || "/uploads").replace(/\/$/, "");
}
