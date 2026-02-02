'use client';

import { useNotes } from '@/hooks/useNotes';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Controls from '@/components/Controls';
import NoteList from '@/components/NoteList';

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
      <div className="h-full flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-700 bg-neutral-900 flex flex-col">
          <div className="p-4 border-b border-neutral-700">
            <button
              onClick={createNote}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
            >
              + New Note
            </button>
          </div>

          <NoteList
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={setActiveNote}
          />
        </aside>

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
    </div>
  );
}