'use client';

import { X, Plus } from 'lucide-react';
import type { Note } from '@/types/note';

interface TabBarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export default function TabBar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: TabBarProps) {
  const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (notes.length > 1) {
      onDeleteNote(noteId);
    }
  };

  return (
    <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] flex items-end px-2">
      <div className="flex-1 flex items-end overflow-x-auto overflow-y-hidden scrollbar-hide">
        {/* Tab items */}
        {notes.map((note) => {
          const isActive = note.id === activeNoteId;
          const preview = note.content.trim().split('\n')[0].slice(0, 20) || 'Untitled';

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 min-w-[180px] max-w-[220px]
                border-t border-l border-r rounded-t-lg transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-[#1e1e1e] border-[#3d3d3d] text-white'
                    : 'bg-[#252525] border-transparent text-neutral-400 hover:bg-[#2a2a2a] hover:text-neutral-300'
                }
              `}
            >
              <span className="flex-1 truncate text-sm font-medium text-left">
                {preview}
              </span>

              {notes.length > 1 && (
                <button
                  onClick={(e) => handleDeleteClick(e, note.id)}
                  className={`
                    p-0.5 rounded hover:bg-neutral-600/50 transition-colors
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* New tab button - now inside the scrollable container */}
        <button
          onClick={onCreateNote}
          className="ml-1 px-3 py-2.5 hover:bg-neutral-700/50 rounded-t-lg transition-colors text-neutral-400 hover:text-white flex-shrink-0"
          title="New Note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}