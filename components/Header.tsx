export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-[#111111]">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Paste Vault</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Private scratchpad. All data stored locally.
          </p>
        </div>
      </div>
    </header>
  );
}