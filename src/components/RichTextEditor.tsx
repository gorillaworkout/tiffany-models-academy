"use client";

import dynamic from 'next/dynamic';
import { useMemo, useRef, useCallback } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-zinc-900/50 border border-white/10 animate-pulse" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const lastValueRef = useRef(value);
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ], []);

  // Prevent infinite re-render: only call onChange when value actually changes
  const handleChange = useCallback((newValue: string) => {
    // React Quill emits '<p><br></p>' for empty content
    const normalized = newValue === '<p><br></p>' ? '' : newValue;
    if (normalized !== lastValueRef.current) {
      lastValueRef.current = normalized;
      onChange(normalized);
    }
  }, [onChange]);

  // Keep ref in sync when parent value changes
  lastValueRef.current = value;

  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write your content here..."}
      />
    </div>
  );
}
