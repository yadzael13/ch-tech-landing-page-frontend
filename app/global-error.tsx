"use client";

// Only fires when the root layout itself throws — Next unmounts the whole
// tree in that case, so this has to supply its own <html>/<body> instead of
// relying on app/layout.tsx (RootLayout is gone by the time this renders).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#05080a] px-6 text-center text-[#f2f5f4]">
          <p>Algo salió mal. Intenta de nuevo.</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#2ee6b8] px-6 py-3 text-sm font-medium text-[#05080a]"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
