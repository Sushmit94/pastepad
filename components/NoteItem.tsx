import type { Note } from '@/types/note';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export default function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  const preview = note.content.slice(0, 80) || 'Empty note';
  const date = new Date(note.updatedAt).toLocaleDateString();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors ${
        isActive ? 'bg-neutral-800 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="text-sm text-neutral-300 font-medium line-clamp-2 mb-1">
        {preview}
      </div>
      <div className="text-xs text-neutral-500">{date}</div>
    </button>
  );
}