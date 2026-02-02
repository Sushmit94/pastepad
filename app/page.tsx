'use client';

import { useNotes } from '@/hooks/useNotes';
import TabBar from '@/components/TabBar';
import Editor from '@/components/Editor';
import Controls from '@/components/Controls';

export default function Home() {
  const {
    notes,
    activeNote,
    activeNoteId,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotes();

  const handleCopy = async () => {
    if (activeNote?.content) {
      try {
        await navigator.clipboard.writeText(activeNote.content);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleDelete = () => {
    if (activeNoteId && confirm('Delete this note?')) {
      deleteNote(activeNoteId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Chrome-style Tab Bar */}
      <TabBar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNote}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
      />

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Editor note={activeNote} onUpdate={updateNote} />

        <Controls
          note={activeNote}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onNew={createNote}
        />
      </main>
    </div>
  );
}