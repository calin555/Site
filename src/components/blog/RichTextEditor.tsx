"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Scrie conținutul articolului...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initialized.current && value) {
      editorRef.current.innerHTML = value;
      initialized.current = true;
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function insertLink() {
    const url = prompt("URL link:");
    if (url) exec("createLink", url);
  }

  const tools = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Heading2, cmd: "formatBlock", val: "h2", label: "H2" },
    { icon: Heading3, cmd: "formatBlock", val: "h3", label: "H3" },
    { icon: List, cmd: "insertUnorderedList", label: "Listă" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Listă numerotată" },
    { icon: Quote, cmd: "formatBlock", val: "blockquote", label: "Citat" },
  ];

  return (
    <div className={cn("overflow-hidden rounded-xl border border-surface-200", className)}>
      <div className="flex flex-wrap gap-1 border-b border-surface-200 bg-surface-50 p-2">
        {tools.map(({ icon: Icon, cmd, val, label }) => (
          <button
            key={label}
            type="button"
            title={label}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd, val);
            }}
            className="rounded-lg p-2 text-surface-600 hover:bg-white hover:text-surface-900"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          title="Link"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          className="rounded-lg p-2 text-surface-600 hover:bg-white hover:text-surface-900"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[320px] max-h-[600px] overflow-y-auto px-4 py-3 text-sm leading-relaxed text-surface-800 focus:outline-none [&:empty]:before:pointer-events-none [&:empty]:before:text-surface-400 [&:empty]:before:content-[attr(data-placeholder)] [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-4"
      />
    </div>
  );
}
