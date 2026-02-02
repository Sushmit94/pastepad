'use client';

import { useState } from 'react';
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
  onNew,
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

  return (
    <div className="border-t border-neutral-700 bg-neutral-900 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-neutral-400">
        <span>{characterCount} characters</span>
        <span>{wordCount} words</span>
        {note && (
          <span className="text-neutral-500">
            Updated {new Date(note.updatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors text-sm font-medium"
        >
          New Note
        </button>

        <button
          onClick={handleCopy}
          disabled={!note?.content}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onDelete}
          disabled={!note}
          className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}