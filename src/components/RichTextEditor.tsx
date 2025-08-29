import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = "300px",
}) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
        matchers: [
          // Enhanced markdown-style headers with better detection
          [
            "H1, H2, H3, H4, H5, H6",
            (node: any, delta: any) => {
              const level = parseInt(node.tagName.charAt(1));
              return delta.compose(new (window as any).Quill.import('delta')().insert(node.textContent, { header: level }));
            },
          ],
          [
            "P",
            (node: any, delta: any) => {
              const text = node.textContent || "";
              const Delta = (window as any).Quill.import('delta');
              
              // Handle markdown headers in paragraphs
              if (text.startsWith("### ")) {
                return new Delta().insert(text.substring(4), { header: 3 });
              } else if (text.startsWith("## ")) {
                return new Delta().insert(text.substring(3), { header: 2 });
              } else if (text.startsWith("# ")) {
                return new Delta().insert(text.substring(2), { header: 1 });
              }
              
              // Handle bold markdown **text**
              if (text.includes("**")) {
                const parts = text.split(/(\*\*.*?\*\*)/g);
                let newDelta = new Delta();
                parts.forEach(part => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    newDelta = newDelta.insert(part.slice(2, -2), { bold: true });
                  } else {
                    newDelta = newDelta.insert(part);
                  }
                });
                return newDelta;
              }
              
              return delta;
            },
          ],
          // Handle bold text from various sources
          [
            "STRONG, B",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert(node.textContent, { bold: true });
            },
          ],
          // Handle italic text
          [
            "EM, I",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert(node.textContent, { italic: true });
            },
          ],
          // Handle lists with better structure preservation
          [
            "UL",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              const items = Array.from(node.children);
              let newDelta = new Delta();
              items.forEach((item: any, index) => {
                if (index > 0) newDelta = newDelta.insert('\n');
                newDelta = newDelta.insert(item.textContent, { list: 'bullet' });
              });
              return newDelta;
            },
          ],
          [
            "OL",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              const items = Array.from(node.children);
              let newDelta = new Delta();
              items.forEach((item: any, index) => {
                if (index > 0) newDelta = newDelta.insert('\n');
                newDelta = newDelta.insert(item.textContent, { list: 'ordered' });
              });
              return newDelta;
            },
          ],
          // Handle blockquotes
          [
            "BLOCKQUOTE",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert(node.textContent, { blockquote: true });
            },
          ],
          // Handle code blocks and inline code
          [
            "PRE",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert(node.textContent, { 'code-block': true });
            },
          ],
          [
            "CODE",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert(node.textContent, { code: true });
            },
          ],
          // Handle line breaks properly
          [
            "BR",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              return new Delta().insert('\n');
            },
          ],
          // Handle divs as line breaks
          [
            "DIV",
            (node: any, delta: any) => {
              const Delta = (window as any).Quill.import('delta');
              if (node.textContent.trim()) {
                return delta.insert('\n');
              }
              return delta;
            },
          ],
        ],
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "code",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="rich-text-editor">
      <style>{`
        .ql-toolbar {
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-radius: 0.75rem 0.75rem 0 0 !important;
          background-color: #f9fafb !important;
        }
        
        .ql-container {
          border: 1px solid #d1d5db !important;
          border-radius: 0 0 0.75rem 0.75rem !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          background-color: white !important;
        }
        
        .ql-editor {
          min-height: ${height} !important;
          padding: 1rem !important;
          color: #111827 !important;
          background-color: white !important;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
        }
        
        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6,
        .ql-editor ul,
        .ql-editor ol,
        .ql-editor li,
        .ql-editor blockquote,
        .ql-editor pre,
        .ql-editor code,
        .ql-editor strong,
        .ql-editor em,
        .ql-editor span,
        .ql-editor div {
          color: #111827 !important;
          background-color: transparent !important;
        }
        
        .ql-toolbar .ql-formats button {
          color: #374151 !important;
          background-color: transparent !important;
        }
        
        .ql-toolbar .ql-formats button:hover {
          color: #111827 !important;
          background-color: #f3f4f6 !important;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: "white",
          color: "#111827",
        }}
      />
    </div>
  );
};

export default RichTextEditor;