const placeholderConnectionString =
  "postgresql://USER:PASSWORD@HOST:5432/ecobridal_control?schema=public";

export function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return false;
  }

  return url !== placeholderConnectionString && !url.includes("USER:PASSWORD@HOST");
}
