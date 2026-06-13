export default function FailureModal({open, title="Login Failure", message="", onClose}) {
  if (!open){ return null; };

  return (
    <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <section className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <header className="px-5 pt-4 pb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </header>

        <div className="px-5 pb-4 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </div>

        <footer className="px-5 pb-4 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm hover:shadow dark:border-gray-600 dark:text-gray-100">
            OK
          </button>
        </footer>
      </section>
    </div>
  );
}