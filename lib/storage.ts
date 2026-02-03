import { getDB, STORE_NAME } from './db';
import type { Note } from '@/types/note';
import { generateUUID } from '@/utils/uuid';

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB();
  const notes = await db.getAll(STORE_NAME);
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await getDB();
  return await db.get(STORE_NAME, id);
}

export async function createNote(content: string = ''): Promise<Note> {
  const db = await getDB();
  const now = Date.now();
  const note: Note = {
    id: generateUUID(),
    content,
    images: [], // Initialize with empty images array
    createdAt: now,
    updatedAt: now,
  };
  await db.add(STORE_NAME, note);
  return note;
}

export async function updateNote(id: string, content: string, images?: string[]): Promise<Note | null> {
  const db = await getDB();
  const existing = await db.get(STORE_NAME, id);
  
  if (!existing) {
    return null;
  }

  const updated: Note = {
    ...existing,
    content,
    images: images !== undefined ? images : existing.images, // Update images if provided, otherwise keep existing
    updatedAt: Date.now(),
  };

  await db.put(STORE_NAME, updated);
  return updated;
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearAllNotes(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}