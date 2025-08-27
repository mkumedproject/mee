import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";

const Delta = Quill.import("delta");

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
          // Handle markdown-style headers
          [
            "P",
            (node: any, delta: any) => {
              const text = node.textContent || "";
              if (text.startsWith("### ")) {
                return new Delta().insert(text.substring(4), { header: 3 });
              } else if (text.startsWith("## ")) {
                return new Delta().insert(text.substring(3), { header: 2 });
              } else if (text.startsWith("# ")) {
                return new Delta().insert(text.substring(2), { header: 1 });
              }
              return delta;
            },
          ],
          // Handle bold text
          [
            "STRONG",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { bold: true });
            },
          ],
          [
            "B",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { bold: true });
            },
          ],
          // Handle italic text
          [
            "EM",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { italic: true });
            },
          ],
          [
            "I",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { italic: true });
            },
          ],
          // Handle lists
          [
            "UL",
            (node: any, delta: any) => {
              const items = Array.from(node.children);
              let newDelta = new Delta();
              items.forEach((item: any) => {
                newDelta = newDelta.insert(item.textContent + '\n', { list: 'bullet' });
              });
              return newDelta;
            },
          ],
          [
            "OL",
            (node: any, delta: any) => {
              const items = Array.from(node.children);
              let newDelta = new Delta();
              items.forEach((item: any) => {
                newDelta = newDelta.insert(item.textContent + '\n', { list: 'ordered' });
              });
              return newDelta;
            },
          ],
          // Handle blockquotes
          [
            "BLOCKQUOTE",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { blockquote: true });
            },
          ],
          // Handle code blocks
          [
            "PRE",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { 'code-block': true });
            },
          ],
          // Handle inline code
          [
            "CODE",
            (node: any, delta: any) => {
              return new Delta().insert(node.textContent, { code: true });
            },
          ],
          // Handle line breaks
          [
            "BR",
            (node: any, delta: any) => {
              return new Delta().insert('\n');
            },
          ],
          // Handle divs as paragraphs
          [
            "DIV",
            (node: any, delta: any) => {
              return delta.insert('\n');
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

  // Custom paste handler to preserve formatting
  const handlePaste = (e: any) => {
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    
    if (pastedData) {
      // Let Quill handle the paste with our custom matchers
      return true;
    }
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        onPaste={handlePaste}
        style={{
          height: height,
          marginBottom: "42px",
          backgroundColor: "white",
          color: "#111827",
        }}
      />
    </div>
  );
};

export default RichTextEditor;