import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note } from '@/types/note';
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  clearAllNotes,
} from '@/lib/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load notes on mount
  useEffect(() => {
    async function loadNotes() {
      try {
        const loadedNotes = await getAllNotes();
        setNotes(loadedNotes);
        
        // Set the first note as active, or create one if none exist
        if (loadedNotes.length > 0) {
          setActiveNoteId(loadedNotes[0].id);
        } else {
          const newNote = await createNote();
          setNotes([newNote]);
          setActiveNoteId(newNote.id);
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, []);

  const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  const handleCreateNote = useCallback(async () => {
    try {
      const newNote = await createNote();
      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      return null;
    }
  }, []);

  const handleUpdateNote = useCallback(
    async (id: string, content: string, immediate: boolean = false) => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Optimistically update UI
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, content, updatedAt: Date.now() }
            : note
        )
      );

      const performUpdate = async () => {
        try {
          const updated = await updateNote(id, content);
          if (updated) {
            setNotes((prev) =>
              prev.map((note) => (note.id === id ? updated : note))
            );
          }
        } catch (error) {
          console.error('Failed to update note:', error);
        }
      };

      if (immediate) {
        await performUpdate();
      } else {
        // Debounce the actual database update
        debounceTimerRef.current = setTimeout(performUpdate, 500);
      }
    },
    []
  );

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => {
        const filtered = prev.filter((note) => note.id !== id);
        
        // If we deleted the active note, switch to another one
        if (id === activeNoteId) {
          if (filtered.length > 0) {
            setActiveNoteId(filtered[0].id);
          } else {
            // Create a new note if we deleted the last one
            createNote().then((newNote) => {
              setNotes([newNote]);
              setActiveNoteId(newNote.id);
            });
          }
        }
        
        return filtered;
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }, [activeNoteId]);

  const handleClearAll = useCallback(async () => {
    try {
      await clearAllNotes();
      const newNote = await createNote();
      setNotes([newNote]);
      setActiveNoteId(newNote.id);
    } catch (error) {
      console.error('Failed to clear notes:', error);
    }
  }, []);

  const handleSetActiveNote = useCallback((id: string) => {
    setActiveNoteId(id);
  }, []);

  return {
    notes,
    activeNote,
    activeNoteId,
    isLoading,
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
    clearAll: handleClearAll,
    setActiveNote: handleSetActiveNote,
  };
}