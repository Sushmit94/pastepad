import { ChangeEvent } from 'react';
import type { Note } from '@/types/note';

interface EditorProps {
  note: Note | null;
  onUpdate: (id: string, content: string) => void;
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (note) {
      onUpdate(note.id, e.target.value);
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 bg-[#1e1e1e]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      <textarea
        value={note.content}
        onChange={handleChange}
        placeholder="Start typing..."
        className="flex-1 w-full resize-none bg-[#1e1e1e] text-neutral-200 font-mono text-[15px] leading-relaxed p-6 focus:outline-none placeholder:text-neutral-600"
        spellCheck={false}
        autoFocus
      />
    </div>
  );
}