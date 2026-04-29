const placeholderConnectionString =
  "postgresql://USER:PASSWORD@HOST:5432/ecobridal_control?schema=public";
const prismaSampleConnectionString =
  "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public";

export function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return false;
  }

  return (
    url !== placeholderConnectionString &&
    url !== prismaSampleConnectionString &&
    !url.includes("USER:PASSWORD@HOST")
  );
}
