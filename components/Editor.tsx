'use client';

import { useRef, useEffect, ClipboardEvent } from 'react';
import type { Note } from '@/types/note';

interface EditorProps {
  note: Note | null;
  onUpdate: (id: string, content: string, images?: string[]) => void;
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const editableRef = useRef<HTMLDivElement>(null);

  // Helper to turn URLs in text into HTML strings
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(urlRegex, (url) => {
        return `<span class="text-blue-400 underline pointer-events-none">${url}</span>`;
      });
  };

  const handleInput = () => {
    if (note && editableRef.current) {
      const content = editableRef.current.innerText;
      onUpdate(note.id, content);
    }
  };

  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
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

  // This effect ensures the visual HTML matches the note content 
  // without losing the cursor position
  useEffect(() => {
    if (editableRef.current && note && editableRef.current.innerText !== note.content) {
      editableRef.current.innerHTML = linkify(note.content);
    }
  }, [note?.content]);

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
        <div
          ref={editableRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="w-full min-h-[200px] outline-none text-neutral-200 font-mono text-[15px] leading-relaxed whitespace-pre-wrap break-all"
          spellCheck={false}
          suppressContentEditableWarning={true}
          data-placeholder="Start typing or paste images..."
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
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #525252;
          cursor: text;
        }
      `}</style>
    </div>
  );
}