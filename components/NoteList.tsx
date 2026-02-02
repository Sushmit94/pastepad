import type { Note } from '@/types/note';
import NoteItem from './NoteItem';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="p-6 text-center text-neutral-500 text-sm">
        No notes yet
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isActive={note.id === activeNoteId}
          onClick={() => onSelectNote(note.id)}
        />
      ))}
    </div>
  );
}