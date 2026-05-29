import { loginAction } from "@/app/login/actions";
import { getCurrentSession, isAuthConfigured } from "@/lib/auth";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid: "Ese correo o contraseña no coincide con los usuarios autorizados.",
  config:
    "La seguridad todavía no está configurada. Falta agregar las variables de acceso.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [query, session] = await Promise.all([
    searchParams,
    getCurrentSession(),
  ]);

  if (session) {
    redirect("/");
  }

  const errorMessage = query?.error ? errorMessages[query.error] : "";
  const authReady = isAuthConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-[rgba(87,127,178,0.12)] bg-[rgba(235,229,220,0.98)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
          Acceso privado
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-[0.95] text-foreground">
          EcoBridal Control
        </h1>
        <p className="mt-4 text-sm leading-7 text-foreground/74 sm:text-base">
          Solo las cuentas autorizadas pueden entrar al sistema.
        </p>

        {!authReady ? (
          <div className="mt-6 rounded-2xl border border-support-coral/25 bg-support-coral/10 px-4 py-4 text-sm leading-7 text-foreground">
            Falta configurar `AUTH_SECRET`, `AUTH_SHARED_PASSWORD` y
            `AUTH_ALLOWED_EMAILS` en el proyecto.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-support-coral/25 bg-support-coral/10 px-4 py-4 text-sm leading-7 text-foreground">
            {errorMessage}
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-foreground/75">
            Correo autorizado
            <input
              required
              type="email"
              name="email"
              placeholder="tu-correo@gmail.com"
              className="app-field"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Contraseña
            <input
              required
              type="password"
              name="password"
              placeholder="contraseña"
              className="app-field"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="app-button-primary w-full">
            Entrar al sistema
          </button>
        </form>
      </section>
    </main>
  );
}
