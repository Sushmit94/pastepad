'use client';

import { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';

interface ControlsProps {
  note: Note | null;
  onCopy: () => void;
  onDelete: () => void;
  onNew: () => void;
}

export default function Controls({
  note,
  onCopy,
  onDelete,
}: ControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const characterCount = note?.content.length || 0;
  const wordCount = note?.content.trim()
    ? note.content.trim().split(/\s+/).length
    : 0;
  const lineCount = note?.content ? note.content.split('\n').length : 0;

  return (
    <div className="border-t border-[#3d3d3d] bg-[#252525] px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span>{lineCount} lines</span>
        <span>{wordCount} words</span>
        <span>{characterCount} characters</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!note?.content}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-700/30 hover:bg-neutral-700/50 text-neutral-300 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs"
          title="Copy to clipboard"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onDelete}
          disabled={!note}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs"
          title="Delete note"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}