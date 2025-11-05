"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import { cn } from "@/app/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}

export function Editor({ value, onChange, className, readOnly = false }: EditorProps) {
  return (
    <div className={cn("border border-gray-300 rounded-lg overflow-hidden", className)}>
      <MonacoEditor
        height="300px"
        defaultLanguage="sql"
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          readOnly,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
