import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Note } from '@/types/note';

const DB_NAME = 'paste-vault-db';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

interface PasteVaultDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
  };
}

let dbInstance: IDBPDatabase<PasteVaultDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PasteVaultDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<PasteVaultDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

export { STORE_NAME };