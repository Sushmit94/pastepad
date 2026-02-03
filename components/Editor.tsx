'use client';

import { ChangeEvent, ClipboardEvent } from 'react';
import type { Note } from '@/types/note';

interface EditorProps {
  note: Note | null;
  onUpdate: (id: string, content: string, images?: string[]) => void;
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (note) {
      onUpdate(note.id, e.target.value);
    }
  };

  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items || !note) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const currentImages = note.images || [];
            onUpdate(note.id, note.content, [...currentImages, base64]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!note) return;
    const updatedImages = (note.images || []).filter((_, i) => i !== index);
    onUpdate(note.id, note.content, updatedImages);
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 bg-[#1e1e1e]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <textarea
          value={note.content}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Start typing or paste images..."
          className="w-full min-h-[200px] resize-none bg-transparent text-neutral-200 font-mono text-[15px] leading-relaxed focus:outline-none placeholder:text-neutral-600 border-none"
          spellCheck={false}
          autoFocus
        />

        {note.images && note.images.length > 0 && (
          <div className="mt-6 space-y-4">
            {note.images.map((imageSrc, index) => (
              <div key={index} className="relative group inline-block max-w-full">
                <img
                  src={imageSrc}
                  alt={`Pasted image ${index + 1}`}
                  className="max-w-full h-auto rounded-lg border border-neutral-700"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}