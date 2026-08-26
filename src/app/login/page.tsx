import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-6 rounded-lg bg-brand-white p-8 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Chrisven Romagos — Mitsubishi Motors Sales
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-brand-red">
            {Array.isArray(error) ? error[0] : error}
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-brand-black">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-brand-black">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-brand-red py-2 text-sm font-semibold text-brand-white transition hover:bg-brand-red-dark"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
