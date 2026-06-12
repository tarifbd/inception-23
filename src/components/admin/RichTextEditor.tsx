'use client';

import { useEffect, useRef } from 'react';
import {
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Undo2,
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    onChange(editorRef.current?.innerHTML || '');
  };

  const addLink = () => {
    const url = window.prompt('Paste the link URL');
    if (url) run('createLink', url);
  };

  const addImage = () => {
    const url = window.prompt('Paste an uploaded image URL');
    if (url) run('insertImage', url);
  };

  const tools = [
    { label: 'Paragraph', icon: Pilcrow, action: () => run('formatBlock', 'p') },
    { label: 'Heading', icon: Heading2, action: () => run('formatBlock', 'h2') },
    { label: 'Bold', icon: Bold, action: () => run('bold') },
    { label: 'Italic', icon: Italic, action: () => run('italic') },
    { label: 'Bulleted list', icon: List, action: () => run('insertUnorderedList') },
    { label: 'Numbered list', icon: ListOrdered, action: () => run('insertOrderedList') },
    { label: 'Quote', icon: Quote, action: () => run('formatBlock', 'blockquote') },
    { label: 'Link', icon: Link2, action: addLink },
    { label: 'Image', icon: ImagePlus, action: addImage },
    { label: 'Undo', icon: Undo2, action: () => run('undo') },
    { label: 'Redo', icon: Redo2, action: () => run('redo') },
    { label: 'Clear formatting', icon: RemoveFormatting, action: () => run('removeFormat') },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        {tools.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={action}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-brand-700 hover:shadow-sm"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        data-placeholder="Write the full page content here..."
        className="cms-rich-editor min-h-[360px] px-5 py-4 text-base leading-8 text-gray-700 outline-none"
      />
    </div>
  );
}
