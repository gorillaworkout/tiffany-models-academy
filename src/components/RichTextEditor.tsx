"use client";

import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);
  const initialValueRef = useRef(value);

  // Keep onChange ref current
  onChangeRef.current = onChange;

  useEffect(() => {
    const editorEl = editorRef.current;
    if (!editorEl || quillRef.current) return;

    let cancelled = false;

    (async () => {
      const { default: Quill } = await import('quill');

      if (cancelled || !editorEl) return;

      const quill = new Quill(editorEl, {
        theme: 'snow',
        placeholder: placeholder || 'Write your content here...',
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });

      // Set initial content
      if (initialValueRef.current) {
        quill.root.innerHTML = initialValueRef.current;
      }

      // Listen for text changes
      quill.on('text-change', () => {
        isInternalChange.current = true;
        const html = quill.root.innerHTML;
        const normalized = html === '<p><br></p>' ? '' : html;
        onChangeRef.current(normalized);
        setTimeout(() => { isInternalChange.current = false; }, 0);
      });

      quillRef.current = quill;
    })();

    return () => {
      cancelled = true;
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes into Quill
  useEffect(() => {
    if (!quillRef.current || isInternalChange.current) return;
    const currentHtml = quillRef.current.root.innerHTML;
    const normalizedCurrent = currentHtml === '<p><br></p>' ? '' : currentHtml;
    if (value !== normalizedCurrent) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className={`rich-text-editor ${className || ''}`} ref={containerRef}>
      <div ref={editorRef} />
    </div>
  );
}
