export default function Header() {
    return (
      <header className="border-b border-neutral-700 bg-neutral-900">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-neutral-100">Paste Vault</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Private scratchpad. All data stored locally.
          </p>
        </div>
      </header>
    );
  }